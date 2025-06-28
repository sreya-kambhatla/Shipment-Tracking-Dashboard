# ServiceNow_Fedex_Tracker
This repository contains code to track shipments from Depot to Nike Clients


{
  "manifest_version": 3,
  "name": "ServiceNow to SendPro Mapper",
  "version": "1.0",
  "description": "Copy fields from ServiceNow and paste into SendPro",
  "permissions": ["scripting", "activeTab", "tabs"],
  "action": {
    "default_popup": "popup.html",
    "default_title": "Map Fields"
  },
  "content_scripts": [
    {
      "matches": ["*://*.servicenow.com/*"],
      "js": ["content.js"]
    }
  ],
  "host_permissions": [
    "*://*.servicenow.com/*",
    "*://*.sendpro.pitneybowes.com/*"
  ]
}

