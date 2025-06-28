# ServiceNow_Fedex_Tracker
This repository contains code to track shipments from Depot to Nike Clients

Here's the complete HTML code for the ServiceNow to SendPro transfer tool:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ServiceNow to SendPro Transfer Tool</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: rgba(0, 0, 0, 0.5);
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .extension-overlay {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        .field-item {
            transition: all 0.2s ease;
        }
        .field-item:hover {
            background-color: #f0f7ff;
        }
        .field-item.selected {
            background-color: #e0f2fe;
            border-color: #60a5fa;
        }
        .minimize-button {
            position: absolute;
            top: 10px;
            right: 10px;
            height: 24px;
            width: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background-color: #f3f4f6;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .minimize-button:hover {
            background-color: #e5e7eb;
        }
        .drag-handle {
            cursor: move;
        }
        .extension-minimized {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #3b82f6;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            transition: all 0.2s ease;
        }
        .extension-minimized:hover {
            transform: scale(1.05);
        }
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 16px;
            background-color: #1f2937;
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            z-index: 1001;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        }
        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }
        .mapping-arrow {
            position: relative;
            height: 24px;
        }
        .mapping-arrow::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 16px;
            height: 16px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17 8l4 4m0 0l-4 4m4-4H3' /%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
        }
        .sendpro-preview {
            background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20 20H80V80H20V20ZM18 18V82H82V18H18Z' fill='%23e5e7eb'/%3E%3C/svg%3E");
            background-size: 20px 20px;
            background-repeat: repeat;
            background-position: center;
        }
        .tab-active {
            border-bottom: 2px solid #3b82f6;
            color: #1e40af;
        }
        .tab-inactive {
            border-bottom: 2px solid transparent;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <!-- Main Extension Interface -->
    <div id="extensionOverlay" class="extension-overlay bg-white rounded-lg w-full max-w-md relative">
        <!-- Header with drag handle -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 rounded-t-lg drag-handle">
            <div class="flex items-center">
                <div class="bg-white rounded-lg p-1.5 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                </div>
                <h1 class="text-lg font-semibold text-white">ServiceNow to SendPro</h1>
            </div>
        </div>
        
        <!-- Minimize button -->
        <div class="minimize-button" id="minimizeBtn">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </div>
        
        <!-- Content -->
        <div class="p-4">
            <!-- Tabs -->
            <div class="flex border-b border-gray-200 mb-4">
                <button id="extractTab" class="tab-active flex-1 py-2 text-sm font-medium text-center focus:outline-none">
                    Extract Data
                </button>
                <button id="mappingTab" class="tab-inactive flex-1 py-2 text-sm font-medium text-center focus:outline-none">
                    Field Mapping
                </button>
            </div>
            
            <!-- Extract Tab Content -->
            <div id="extractContent">
                <!-- Source info -->
                <div class="mb-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-600">Current Page:</span>
                        <span class="text-xs text-blue-600 truncate max-w-[200px]">service-now.com/incident.do?id=RITM0010234</span>
                    </div>
                    <button id="scanBtn" class="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                        </svg>
                        Scan Page for Data
                    </button>
                </div>
                
                <!-- Detected Fields -->
                <div id="fieldsContainer" class="mb-4 hidden">
                    <div class="flex items-center justify-between mb-2">
                        <h2 class="text-sm font-medium text-gray-800">Detected Fields</h2>
                        <div class="flex space-x-2">
                            <button id="selectAllBtn" class="text-xs text-blue-600 hover:text-blue-800">Select All</button>
                            <button id="clearAllBtn" class="text-xs text-gray-500 hover:text-gray-700">Clear</button>
                        </div>
                    </div>
                    
                    <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
                        <!-- Field items will be added here dynamically -->
                        <div class="field-item border border-gray-200 rounded-md p-2.5 cursor-pointer" data-field="ritmNumber" data-value="RITM0010234" data-target="orderNumber">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-xs font-medium text-gray-500">RITM Number</div>
                                    <div class="text-sm text-gray-800">RITM0010234</div>
                                </div>
                                <div class="h-4 w-4 border border-gray-300 rounded-sm flex items-center justify-center bg-white field-checkbox">
                                    <!-- Checkmark will be added here when selected -->
                                </div>
                            </div>
                        </div>
                        
                        <div class="field-item border border-gray-200 rounded-md p-2.5 cursor-pointer" data-field="recipientName" data-value="Sarah Johnson" data-target="recipientName">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-xs font-medium text-gray-500">Recipient Name</div>
                                    <div class="text-sm text-gray-800">Sarah Johnson</div>
                                </div>
                                <div class="h-4 w-4 border border-gray-300 rounded-sm flex items-center justify-center bg-white field-checkbox">
                                    <!-- Checkmark will be added here when selected -->
                                </div>
                            </div>
                        </div>
                        
                        <div class="field-item border border-gray-200 rounded-md p-2.5 cursor-pointer" data-field="shippingAddress" data-value="456 Tech Park, Floor 3, San Francisco, CA 94107" data-target="shippingAddress">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-xs font-medium text-gray-500">Shipping Address</div>
                                    <div class="text-sm text-gray-800">456 Tech Park, Floor 3, San Francisco, CA 94107</div>
                                </div>
                                <div class="h-4 w-4 border border-gray-300 rounded-sm flex items-center justify-center bg-white field-checkbox">
                                    <!-- Checkmark will be added here when selected -->
                                </div>
                            </div>
                        </div>
                        
                        <div class="field-item border border-gray-200 rounded-md p-2.5 cursor-pointer" data-field="phoneNumber" data-value="(415) 555-9876" data-target="phoneNumber">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-xs font-medium text-gray-500">Phone Number</div>
                                    <div class="text-sm text-gray-800">(415) 555-9876</div>
                                </div>
                                <div class="h-4 w-4 border border-gray-300 rounded-sm flex items-center justify-center bg-white field-checkbox">
                                    <!-- Checkmark will be added here when selected -->
                                </div>
                            </div>
                        </div>
                        
                        <div class="field-item border border-gray-200 rounded-md p-2.5 cursor-pointer" data-field="packageWeight" data-value="3.2 lbs" data-target="packageWeight">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-xs font-medium text-gray-500">Package Weight</div>
                                    <div class="text-sm text-gray-800">3.2 lbs</div>
                                </div>
                                <div class="h-4 w-4 border border-gray-300 rounded-sm flex items-center justify-center bg-white field-checkbox">
                                    <!-- Checkmark will be added here when selected -->
                                </div>
                            </div>
                        </div>
                        
                        <div class="field-item border border-gray-200 rounded-md p-2.5 cursor-pointer" data-field="trackingNumber" data-value="INC0010234-SHP" data-target="trackingNumber">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-xs font-medium text-gray-500">Tracking Number</div>
                                    <div class="text-sm text-gray-800">INC0010234-SHP</div>
                                </div>
                                <div class="h-4 w-4 border border-gray-300 rounded-sm flex items-center justify-center bg-white field-checkbox">
                                    <!-- Checkmark will be added here when selected -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div id="actionButtons" class="hidden">
                    <div class="grid grid-cols-2 gap-3">
                        <button id="copySelectedBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            Copy Selected
                        </button>
                        <button id="autoFillBtn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Auto-Fill SendPro
                        </button>
                    </div>
                </div>
                
                <!-- Initial Message -->
                <div id="initialMessage" class="py-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p class="text-gray-600 text-sm">Click "Scan Page for Data" to extract information from ServiceNow</p>
                </div>
            </div>
            
            <!-- Mapping Tab Content -->
            <div id="mappingContent" class="hidden">
                <div class="mb-4">
                    <h2 class="text-sm font-medium text-gray-800 mb-2">Field Mapping Configuration</h2>
                    <p class="text-xs text-gray-600 mb-3">Define how ServiceNow fields map to SendPro fields</p>
                    
                    <div class="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        <!-- Mapping items -->
                        <div class="bg-gray-50 rounded-md p-3">
                            <div class="grid grid-cols-5 items-center">
                                <div class="col-span-2">
                                    <div class="text-xs font-medium text-gray-500">ServiceNow Field</div>
                                    <div class="text-sm text-gray-800">RITM Number</div>
                                </div>
                                <div class="mapping-arrow"></div>
                                <div class="col-span-2">
                                    <div class="text-xs font-medium text-gray-500">SendPro Field</div>
                                    <select class="text-sm text-gray-800 w-full bg-white border border-gray-200 rounded px-2 py-1">
                                        <option selected>Order Number</option>
                                        <option>Reference Number</option>
                                        <option>Custom Field</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-gray-50 rounded-md p-3">
                            <div class="grid grid-cols-5 items-center">
                                <div class="col-span-2">
                                    <div class="text-xs font-medium text-gray-500">ServiceNow Field</div>
                                    <div class="text-sm text-gray-800">Recipient Name</div>
                                </div>
                                <div class="mapping-arrow"></div>
                                <div class="col-span-2">
                                    <div class="text-xs font-medium text-gray-500">SendPro Field</div>
                                    <select class="text-sm text-gray-800 w-full bg-white border border-gray-200 rounded px-2 py-1">
                                        <option selected>Recipient Name</option>
                                        <option>Contact Name</option>
                                        <option>Attention To</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-gray-50 rounded-md p-3">
                            <div class="grid grid-cols-5 items-center">
                                <div class="col-span-2">
                                    <div class="text-xs font-medium text-gray-500">ServiceNow Field</div>
                                    <div class="text-sm text-gray-800">Shipping Address</div>
                                </div>
                                <div class="mapping-arrow"></div>
                                <div class="col-span-2">
                                    <div class="text-xs font-medium text-gray-500">SendPro Field</div>
                                    <select class="text-sm text-gray-800 w-full bg-white border border-gray-200 rounded px-2 py-1">
                                        <option selected>Shipping Address</option>
                                        <option>Delivery Address</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-gray-50 rounded-md p-3">
                            <div class="grid grid-cols-5 items-center">
                                <div class="col-span-2">
                                    <div class="text-xs font-medium text-gray-500">ServiceNow Field</div>
                                    <div class="text-sm text-gray-800">Phone Number</div>
                                </div>
                                <div class="mapping-arrow"></div>
                                <div class="col-span-2">
                                    <div class="text-xs font-medium text-gray-500">SendPro Field</div>
                                    <select class="text-sm text-gray-800 w-full bg-white border border-gray-200 rounded px-2 py-1">
                                        <option selected>Phone Number</option>
                                        <option>Contact Phone</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-gray-50 rounded-md p-3">
                            <div class="grid grid-cols-5 items-center">
                                <div class="col-span-2">
                                    <div class="text-xs font-medium text-gray-500">ServiceNow Field</div>
                                    <div class="text-sm text-gray-800">Package Weight</div>
                                </div>
                                <div class="mapping-arrow"></div>
                                <div class="col-span-2">
                                    <div class="text-xs font-medium text-gray-500">SendPro Field</div>
                                    <select class="text-sm text-gray-800 w-full bg-white border border-gray-200 rounded px-2 py-1">
                                        <option selected>Package Weight</option>
                                        <option>Weight</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-end">
                    <button id="saveMappingBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Save Mapping
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- SendPro Preview Modal -->
    <div id="sendProPreview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div class="bg-gradient-to-r from-indigo-600 to-purple-700 p-4 flex justify-between items-center">
                <div class="flex items-center">
                    <div class="bg-white rounded-lg p-1.5 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                    </div>
                    <h1 class="text-lg font-semibold text-white">SendPro Shipping Template</h1>
                </div>
                <button id="closePreviewBtn" class="text-white hover:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto flex-grow sendpro-preview">
                <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div class="mb-6">
                        <h2 class="text-lg font-semibold text-gray-800 mb-4">Shipping Information</h2>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Order/RITM Number</label>
                                <div id="preview-orderNumber" class="border border-gray-300 rounded-md p-2 bg-gray-50 text-sm min-h-[36px]"></div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                                <div id="preview-trackingNumber" class="border border-gray-300 rounded-md p-2 bg-gray-50 text-sm min-h-[36px]"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-6">
                        <h2 class="text-lg font-semibold text-gray-800 mb-4">Recipient Details</h2>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                                <div id="preview-recipientName" class="border border-gray-300 rounded-md p-2 bg-gray-50 text-sm min-h-[36px]"></div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <div id="preview-phoneNumber" class="border border-gray-300 rounded-md p-2 bg-gray-50 text-sm min-h-[36px]"></div>
                            </div>
                            
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                                <div id="preview-shippingAddress" class="border border-gray-300 rounded-md p-2 bg-gray-50 text-sm min-h-[60px]"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h2 class="text-lg font-semibold text-gray-800 mb-4">Package Details</h2>
                        
                        <div class="grid grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Package Weight</label>
                                <div id="preview-packageWeight" class="border border-gray-300 rounded-md p-2 bg-gray-50 text-sm min-h-[36px]"></div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Shipping Method</label>
                                <select class="border border-gray-300 rounded-md p-2 bg-white text-sm w-full">
                                    <option>Priority Mail</option>
                                    <option>First-Class Package</option>
                                    <option>Priority Mail Express</option>
                                    <option>USPS Ground Advantage</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Package Type</label>
                                <select class="border border-gray-300 rounded-md p-2 bg-white text-sm w-full">
                                    <option>Small Box</option>
                                    <option>Medium Box</option>
                                    <option>Large Box</option>
                                    <option>Envelope</option>
                                    <option>Custom</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-50 p-4 border-t border-gray-200 flex justify-between">
                <button id="resetPreviewBtn" class="text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200">
                    Reset Fields
                </button>
                <button id="confirmPreviewBtn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200">
                    Confirm & Process Shipment
                </button>
            </div>
        </div>
    </div>
    
    <!-- Minimized Extension Button -->
    <div id="minimizedExtension" class="extension-minimized hidden">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
    </div>
    
    <!-- Notification Toast -->
    <div id="notification" class="notification">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span id="notificationText">Copied to clipboard!</span>
    </div>

    <script>
        // DOM Elements
        const extractTab = document.getElementById('extractTab');
        const mappingTab = document.getElementById('mappingTab');
        const extractContent = document.getElementById('extractContent');
        const mappingContent = document.getElementById('mappingContent');
        const scanBtn = document.getElementById('scanBtn');
        const fieldsContainer = document.getElementById('fieldsContainer');
        const actionButtons = document.getElementById('actionButtons');
        const initialMessage = document.getElementById('initialMessage');
        const selectAllBtn = document.getElementById('selectAllBtn');
        const clearAllBtn = document.getElementById('clearAllBtn');
        const copySelectedBtn = document.getElementById('copySelectedBtn');
        const autoFillBtn = document.getElementById('autoFillBtn');
        const minimizeBtn = document.getElementById('minimizeBtn');
        const extensionOverlay = document.getElementById('extensionOverlay');
        const minimizedExtension = document.getElementById('minimizedExtension');
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');
        const sendProPreview = document.getElementById('sendProPreview');
        const closePreviewBtn = document.getElementById('closePreviewBtn');
        const resetPreviewBtn = document.getElementById('resetPreviewBtn');
        const confirmPreviewBtn = document.getElementById('confirmPreviewBtn');
        const saveMappingBtn = document.getElementById('saveMappingBtn');
        
        // Tab switching
        extractTab.addEventListener('click', function() {
            extractTab.classList.add('tab-active');
            extractTab.classList.remove('tab-inactive');
            mappingTab.classList.add('tab-inactive');
            mappingTab.classList.remove('tab-active');
            
            extractContent.classList.remove('hidden');
            mappingContent.classList.add('hidden');
        });
        
        mappingTab.addEventListener('click', function() {
            mappingTab.classList.add('tab-active');
            mappingTab.classList.remove('tab-inactive');
            extractTab.classList.add('tab-inactive');
            extractTab.classList.remove('tab-active');
            
            mappingContent.classList.remove('hidden');
            extractContent.classList.add('hidden');
        });
        
        // Scan button functionality
        scanBtn.addEventListener('click', function() {
            this.innerHTML = `
                <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scanning...
            `;
            
            // Simulate scanning delay
            setTimeout(() => {
                // Reset scan button
                this.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                    </svg>
                    Scan Page for Data
                `;
                
                // Show fields and action buttons, hide initial message
                fieldsContainer.classList.remove('hidden');
                actionButtons.classList.remove('hidden');
                initialMessage.classList.add('hidden');
                
                // Show notification
                showNotification("6 fields detected from ServiceNow");
            }, 1200);
        });
        
        // Field item selection
        document.querySelectorAll('.field-item').forEach(item => {
            item.addEventListener('click', function() {
                this.classList.toggle('selected');
                const checkbox = this.querySelector('.field-checkbox');
                
                if (this.classList.contains('selected')) {
                    checkbox.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    `;
                    checkbox.classList.add('bg-blue-50');
                    checkbox.classList.remove('bg-white');
                } else {
                    checkbox.innerHTML = '';
                    checkbox.classList.remove('bg-blue-50');
                    checkbox.classList.add('bg-white');
                }
            });
        });
        
        // Select All button
        selectAllBtn.addEventListener('click', function() {
            document.querySelectorAll('.field-item').forEach(item => {
                item.classList.add('selected');
                const checkbox = item.querySelector('.field-checkbox');
                checkbox.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                `;
                checkbox.classList.add('bg-blue-50');
                checkbox.classList.remove('bg-white');
            });
        });
        
        // Clear All button
        clearAllBtn.addEventListener('click', function() {
            document.querySelectorAll('.field-item').forEach(item => {
                item.classList.remove('selected');
                const checkbox = item.querySelector('.field-checkbox');
                checkbox.innerHTML = '';
                checkbox.classList.remove('bg-blue-50');
                checkbox.classList.add('bg-white');
            });
        });
        
        // Copy Selected button
        copySelectedBtn.addEventListener('click', function() {
            const selectedFields = document.querySelectorAll('.field-item.selected');
            
            if (selectedFields.length === 0) {
                showNotification("No fields selected");
                return;
            }
            
            let copiedText = "";
            selectedFields.forEach(field => {
                const fieldName = field.querySelector('.text-xs').innerText;
                const fieldValue = field.querySelector('.text-sm').innerText;
                copiedText += `${fieldName}: ${fieldValue}\n`;
            });
            
            navigator.clipboard.writeText(copiedText.trim()).then(() => {
                showNotification(`${selectedFields.length} field(s) copied to clipboard`);
            });
        });
        
        // Auto-Fill SendPro button
        autoFillBtn.addEventListener('click', function() {
            // Show SendPro preview modal
            sendProPreview.classList.remove('hidden');
            
            // Fill in the preview fields with the data
            document.querySelectorAll('.field-item').forEach(item => {
                const fieldType = item.dataset.target;
                const fieldValue = item.dataset.value;
                const previewField = document.getElementById(`preview-${fieldType}`);
                
                if (previewField) {
                    // Add a highlight animation effect
                    previewField.classList.add('bg-blue-50');
                    previewField.classList.add('border-blue-300');
                    previewField.textContent = fieldValue;
                    
                    setTimeout(() => {
                        previewField.classList.remove('bg-blue-50');
                        previewField.classList.remove('border-blue-300');
                    }, 1500);
                }
            });
            
            showNotification("Data transferred to SendPro");
        });
        
        // Close preview button
        closePreviewBtn.addEventListener('click', function() {
            sendProPreview.classList.add('hidden');
        });
        
        // Reset preview button
        resetPreviewBtn.addEventListener('click', function() {
            document.querySelectorAll('[id^="preview-"]').forEach(field => {
                field.textContent = '';
            });
            showNotification("SendPro fields reset");
        });
        
        // Confirm preview button
        confirmPreviewBtn.addEventListener('click', function() {
            showNotification("Shipment would be processed in SendPro");
            setTimeout(() => {
                sendProPreview.classList.add('hidden');
            }, 1000);
        });
        
        // Save mapping button
        saveMappingBtn.addEventListener('click', function() {
            showNotification("Field mapping configuration saved");
        });
        
        // Minimize button
        minimizeBtn.addEventListener('click', function() {
            extensionOverlay.classList.add('hidden');
            minimizedExtension.classList.remove('hidden');
        });
        
        // Expand from minimized state
        minimizedExtension.addEventListener('click', function() {
            minimizedExtension.classList.add('hidden');
            extensionOverlay.classList.remove('hidden');
        });
        
        // Show notification function
        function showNotification(message) {
            notificationText.innerText = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 2500);
        }
        
        // Make the extension draggable
        let isDragging = false;
        let offsetX, offsetY;
        
        const dragHandle = document.querySelector('.drag-handle');
        
        dragHandle.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - extensionOverlay.getBoundingClientRect().left;
            offsetY = e.clientY - extensionOverlay.getBoundingClientRect().top;
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            extensionOverlay.style.position = 'absolute';
            extensionOverlay.style.left = `${x}px`;
            extensionOverlay.style.top = `${y}px`;
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    </script>
</body>
</html>
