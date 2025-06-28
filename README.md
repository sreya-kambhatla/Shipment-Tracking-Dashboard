# ServiceNow_Fedex_Tracker
This repository contains code to track shipments from Depot to Nike Clients


function getFieldsFromServiceNow() {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.postMessage("GET_SERVICENOW_FIELDS", "*")
    });

    window.addEventListener("message", (event) => {
      if (event.data.type === "SERVICENOW_FIELDS") {
        displayFields(event.data.data);
      }
    });
  });
}

function displayFields(fields) {
  const container = document.getElementById("fieldList");
  container.innerHTML = "";

  fields.forEach(({ label, value }, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <label>
        <input type="checkbox" data-value="${value}" />
        ${label}: ${value}
      </label>
    `;
    container.appendChild(div);
  });
}

document.getElementById("copyAndGo").addEventListener("click", async () => {
  const selectedFields = [];
  document.querySelectorAll("input[type='checkbox']:checked").forEach(input => {
    selectedFields.push(input.dataset.value);
  });

  // Open SendPro and inject values
  const sendProTab = await chrome.tabs.create({ url: "https://sendpro.pitneybowes.com" });

  chrome.scripting.executeScript({
    target: { tabId: sendProTab.id },
    func: (values) => {
      const sendProFields = document.querySelectorAll("input, textarea, select");
      for (let i = 0; i < values.length && i < sendProFields.length; i++) {
        sendProFields[i].value = values[i];
      }
    },
    args: [selectedFields]
  });
});

getFieldsFromServiceNow();



