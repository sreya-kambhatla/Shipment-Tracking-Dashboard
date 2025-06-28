# ServiceNow_Fedex_Tracker
This repository contains code to track shipments from Depot to Nike Clients


// Grab all form fields on the page
const fields = document.querySelectorAll("input, textarea, select");
const fieldData = [];

fields.forEach(field => {
  const label = field.getAttribute("aria-label") || field.name || field.id;
  if (label && field.value) {
    fieldData.push({ label, value: field.value });
  }
});

// Make it available globally so popup can access it
window.addEventListener("message", (event) => {
  if (event.data === "GET_SERVICENOW_FIELDS") {
    window.postMessage({ type: "SERVICENOW_FIELDS", data: fieldData }, "*");
  }
});


