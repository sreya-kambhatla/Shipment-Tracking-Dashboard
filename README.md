# ServiceNow_Fedex_Tracker
This repository contains code to track shipments from Nike to End Clients

https://niketech.service-now.com/now/nav/ui/classic/params/target/ui_page.do%3Fsys_id%3De4c11d8387efc5505bbda8e73cbb35d6



import pandas as pd
import requests
from datetime import datetime

# ============ 1. CONFIGURATION (CHANGE THESE) ============

# Replace these with your actual FedEx API credentials
FEDEX_API_KEY = "your_api_key_here"
FEDEX_API_SECRET = "your_api_secret_here"

# Path to your Excel file
EXCEL_FILE_PATH = "path/to/your/fedex_tracking.xlsx"  # e.g., "C:/Users/YourName/Downloads/tracking.xlsx"

# FedEx API Endpoints (DO NOT CHANGE)
FEDEX_AUTH_URL = "https://apis.fedex.com/oauth/token"
FEDEX_TRACK_URL = "https://apis.fedex.com/track/v1/trackingnumbers"

# ============ 2. FUNCTION TO GET AUTH TOKEN ============

def get_fedex_token():
    """Authenticate with FedEx and get OAuth token."""
    response = requests.post(FEDEX_AUTH_URL, data={
        "grant_type": "client_credentials",
        "client_id": FEDEX_API_KEY,
        "client_secret": FEDEX_API_SECRET
    })
    response.raise_for_status()
    return response.json()["access_token"]

# ============ 3. FUNCTION TO GET TRACKING STATUS ============

def get_tracking_status(tracking_number, token):
    """Query FedEx API for tracking number status."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    payload = {
        "trackingInfo": [{
            "trackingNumberInfo": {
                "trackingNumber": tracking_number
            }
        }],
        "includeDetailedScans": False
    }
    response = requests.post(FEDEX_TRACK_URL, headers=headers, json=payload)
    response.raise_for_status()
    result = response.json()
    try:
        return result['output']['completeTrackResults'][0]['trackResults'][0]['latestStatusDetail']['description']
    except Exception:
        return "Invalid or No Info"

# ============ 4. FUNCTION TO UPDATE EXCEL FILE ============

def update_excel_with_tracking_status():
    """Load Excel, get status updates, and write back."""
    token = get_fedex_token()
    df = pd.read_excel(EXCEL_FILE_PATH)

    for idx, row in df.iterrows():
        sender = row.get('Sender Tracking #')
        receiver = row.get('Receiver Tracking #')

        statuses = []
        for tracking in [sender, receiver]:
            if pd.notna(tracking):
                status = get_tracking_status(tracking, token)
                statuses.append(status)

        combined_status = " / ".join(statuses)
        df.at[idx, 'Status'] = combined_status
        df.at[idx, 'Last Updated'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    df.to_excel(EXCEL_FILE_PATH, index=False)
    print(f"Excel file updated successfully at {datetime.now()}.")

# ============ 5. RUN THE SCRIPT ============

if __name__ == "__main__":
    update_excel_with_tracking_status()
