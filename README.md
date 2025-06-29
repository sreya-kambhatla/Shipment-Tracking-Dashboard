# ServiceNow_Fedex_Tracker
This repository contains code to track shipments from Depot to Nike Clients

    
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FedEx Tracking Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8fafc;
        }
        .fedex-purple {
            background-color: #4d148c;
        }
        .fedex-orange {
            background-color: #ff6600;
        }
        .status-delivered {
            background-color: #dcfce7;
            color: #166534;
        }
        .status-transit {
            background-color: #e0f2fe;
            color: #0369a1;
        }
        .status-pending {
            background-color: #fef9c3;
            color: #854d0e;
        }
        .status-exception {
            background-color: #fee2e2;
            color: #b91c1c;
        }
        .tooltip {
            position: relative;
            display: inline-block;
        }
        .tooltip .tooltiptext {
            visibility: hidden;
            width: 140px;
            background-color: #555;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px;
            position: absolute;
            z-index: 1;
            bottom: 150%;
            left: 50%;
            margin-left: -75px;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .tooltip .tooltiptext::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #555 transparent transparent transparent;
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 50;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
        }
        .modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 500px;
            border-radius: 8px;
        }
        .highlight-row {
            animation: highlight 2s ease-in-out;
        }
        @keyframes highlight {
            0% { background-color: #fef3c7; }
            100% { background-color: transparent; }
        }
        .dropdown-menu {
            display: none;
            position: absolute;
            background-color: white;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            z-index: 1;
            border-radius: 4px;
            right: 0;
        }
        .dropdown-menu.show {
            display: block;
        }
        .dropdown-item {
            padding: 8px 12px;
            text-decoration: none;
            display: block;
            color: #333;
            font-size: 14px;
        }
        .dropdown-item:hover {
            background-color: #f1f5f9;
        }
        .dropdown-divider {
            height: 1px;
            margin: 4px 0;
            background-color: #e2e8f0;
        }
        .sort-icon {
            display: inline-block;
            width: 0;
            height: 0;
            margin-left: 4px;
            vertical-align: middle;
        }
        .sort-asc {
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-bottom: 4px solid currentColor;
        }
        .sort-desc {
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 4px solid currentColor;
        }
        .filter-badge {
            display: inline-flex;
            align-items: center;
            padding: 2px 8px;
            background-color: #e0f2fe;
            color: #0369a1;
            border-radius: 9999px;
            font-size: 12px;
            margin-right: 4px;
            margin-bottom: 4px;
        }
        .filter-badge button {
            margin-left: 4px;
            color: #0369a1;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="min-h-screen flex flex-col">
        <!-- Header -->
        <header class="fedex-purple text-white p-4 shadow-md">
            <div class="container mx-auto flex justify-between items-center">
                <div class="flex items-center space-x-2">
                    <svg class="w-8 h-8" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 25H12.5V37.5H25V25H37.5V12.5H25V0H12.5V12.5H0V25Z" fill="#FF6600"/>
                        <path d="M25 25H37.5V37.5H50V25H37.5V12.5H50V0H37.5V12.5H25V25Z" fill="#FF6600"/>
                    </svg>
                    <h1 class="text-xl font-bold">FedEx Tracking Dashboard</h1>
                </div>
                <div class="text-sm">
                    <span id="lastUpdated" class="opacity-75">Last updated: Never</span>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container mx-auto flex-grow p-4 md:p-6">
            <!-- Import Section -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-lg font-semibold mb-4">Import Tracking Data</h2>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-grow">
                        <label for="fileInput" class="block text-sm font-medium text-gray-700 mb-1">Excel File (.xlsx)</label>
                        <input type="file" id="fileInput" accept=".xlsx, .xls" class="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-purple-50 file:text-purple-700
                            hover:file:bg-purple-100
                            cursor-pointer border rounded-md p-1">
                    </div>
                    <div class="flex items-end gap-2">
                        <button id="importBtn" class="fedex-purple hover:bg-purple-800 text-white font-medium py-2 px-4 rounded-md transition-colors">
                            Import Data
                        </button>
                        <button id="appendBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                            Append Data
                        </button>
                    </div>
                </div>
                <div class="mt-4 text-sm text-gray-500">
                    <p>Expected Excel format: columns for Ticket Number, Outbound Tracking, and Inbound Tracking</p>
                </div>
            </div>

            <!-- Sample Data Section -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-semibold">No Data? Try Sample Data</h2>
                    <button id="loadSampleBtn" class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors text-sm">
                        Load Sample Data
                    </button>
                </div>
            </div>

            <!-- Status Explanation Section -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-lg font-semibold mb-4">Tracking Status Explanations</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="border rounded-md p-3">
                        <div class="flex items-center mb-2">
                            <span class="px-2 py-1 text-xs rounded-full inline-block status-delivered mr-2">Delivered</span>
                            <span class="font-medium">Package Delivered</span>
                        </div>
                        <p class="text-sm text-gray-600">The package has been delivered to its destination and signed for by the recipient.</p>
                    </div>
                    <div class="border rounded-md p-3">
                        <div class="flex items-center mb-2">
                            <span class="px-2 py-1 text-xs rounded-full inline-block status-transit mr-2">In Transit</span>
                            <span class="font-medium">In Transit</span>
                        </div>
                        <p class="text-sm text-gray-600">The package is on its way, moving through the FedEx network between facilities.</p>
                    </div>
                    <div class="border rounded-md p-3">
                        <div class="flex items-center mb-2">
                            <span class="px-2 py-1 text-xs rounded-full inline-block status-transit mr-2">Out for Delivery</span>
                            <span class="font-medium">Out for Delivery</span>
                        </div>
                        <p class="text-sm text-gray-600">The package is on the delivery vehicle and will be delivered today.</p>
                    </div>
                    <div class="border rounded-md p-3">
                        <div class="flex items-center mb-2">
                            <span class="px-2 py-1 text-xs rounded-full inline-block status-pending mr-2">Pending</span>
                            <span class="font-medium">Pending</span>
                        </div>
                        <p class="text-sm text-gray-600">The shipping label has been created, but the package has not yet been picked up or received by FedEx.</p>
                    </div>
                    <div class="border rounded-md p-3">
                        <div class="flex items-center mb-2">
                            <span class="px-2 py-1 text-xs rounded-full inline-block status-exception mr-2">Exception</span>
                            <span class="font-medium">Exception</span>
                        </div>
                        <p class="text-sm text-gray-600">There's a delivery issue such as weather delay, address problem, or customs hold that's preventing normal delivery.</p>
                    </div>
                </div>
            </div>

            <!-- Results Section -->
            <div id="resultsSection" class="bg-white rounded-lg shadow-md p-6 mb-6 hidden">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-semibold">Tracking Results</h2>
                    <div class="flex gap-2">
                        <button id="refreshBtn" class="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-md transition-colors text-sm flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh Status
                        </button>
                        <div class="relative">
                            <button id="exportDropdownBtn" class="bg-green-50 hover:bg-green-100 text-green-700 font-medium py-2 px-4 rounded-md transition-colors text-sm flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div id="exportDropdown" class="dropdown-menu">
                                <a href="#" id="exportCsvBtn" class="dropdown-item">Export as CSV</a>
                                <a href="#" id="exportXlsxBtn" class="dropdown-item">Export as Excel (.xlsx)</a>
                            </div>
                        </div>
                        <button id="clearBtn" class="bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-4 rounded-md transition-colors text-sm flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clear All
                        </button>
                    </div>
                </div>

                <!-- Filter Section -->
                <div class="mb-6 border rounded-lg p-4 bg-gray-50">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                        <h3 class="text-md font-medium mb-2 md:mb-0">Filter & Sort Options</h3>
                        <div class="relative">
                            <button id="filterDropdownBtn" class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors text-sm flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Add Filter
                            </button>
                            <div id="filterDropdown" class="dropdown-menu">
                                <div class="dropdown-item" data-filter="status-delivered">Show Only Delivered</div>
                                <div class="dropdown-item" data-filter="status-not-delivered">Hide Delivered</div>
                                <div class="dropdown-item" data-filter="status-exception">Show Only Exceptions</div>
                                <div class="dropdown-item" data-filter="status-transit">Show Only In Transit</div>
                                <div class="dropdown-divider"></div>
                                <div class="dropdown-item" data-filter="sort-ticket-asc">Sort by Ticket # (A-Z)</div>
                                <div class="dropdown-item" data-filter="sort-ticket-desc">Sort by Ticket # (Z-A)</div>
                                <div class="dropdown-item" data-filter="sort-date-asc">Sort by Last Update (Oldest)</div>
                                <div class="dropdown-item" data-filter="sort-date-desc">Sort by Last Update (Newest)</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Active Filters -->
                    <div id="activeFilters" class="flex flex-wrap"></div>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button class="sort-header flex items-center" data-sort="ticket">
                                        Ticket #
                                        <span class="sort-icon ml-1"></span>
                                    </button>
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outbound Tracking</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inbound Tracking</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button class="sort-header flex items-center" data-sort="status">
                                        Status
                                        <span class="sort-icon ml-1"></span>
                                    </button>
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button class="sort-header flex items-center" data-sort="date">
                                        Last Update
                                        <span class="sort-icon ml-1"></span>
                                    </button>
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="trackingResults" class="bg-white divide-y divide-gray-200">
                            <!-- Results will be populated here -->
                        </tbody>
                    </table>
                </div>
                <div id="noResults" class="py-8 text-center text-gray-500 hidden">
                    No tracking data available
                </div>
                <div class="mt-4 text-sm text-gray-500">
                    <span id="trackingCount">0</span> shipments displayed
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="bg-gray-100 text-gray-600 py-4 text-center text-sm">
            <p>This is a demo application. Not affiliated with FedEx.</p>
        </footer>
    </div>

    <!-- Toast Notification -->
    <div id="toast" class="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg transform transition-transform duration-300 translate-y-20 opacity-0 flex items-center z-50">
        <span id="toastMessage">Message copied to clipboard</span>
    </div>

    <!-- Copy Text Modal -->
    <div id="copyModal" class="modal">
        <div class="modal-content">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Tracking Information</h3>
                <button id="closeModal" class="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="mb-4">
                <p class="text-sm text-gray-500 mb-2">Copy the text below:</p>
                <textarea id="copyText" class="w-full h-32 p-2 border border-gray-300 rounded-md text-sm" readonly></textarea>
            </div>
            <div class="flex justify-end">
                <button id="modalCopyBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm">
                    Copy to Clipboard
                </button>
            </div>
        </div>
    </div>

    <!-- Confirm Clear Modal -->
    <div id="clearModal" class="modal">
        <div class="modal-content">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Clear All Data</h3>
                <button id="closeClearModal" class="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="mb-6">
                <p class="text-gray-700">Are you sure you want to clear all tracking data? This cannot be undone.</p>
            </div>
            <div class="flex justify-end space-x-3">
                <button id="cancelClearBtn" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors text-sm">
                    Cancel
                </button>
                <button id="confirmClearBtn" class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm">
                    Clear All Data
                </button>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const fileInput = document.getElementById('fileInput');
            const importBtn = document.getElementById('importBtn');
            const appendBtn = document.getElementById('appendBtn');
            const loadSampleBtn = document.getElementById('loadSampleBtn');
            const refreshBtn = document.getElementById('refreshBtn');
            const exportDropdownBtn = document.getElementById('exportDropdownBtn');
            const exportDropdown = document.getElementById('exportDropdown');
            const exportCsvBtn = document.getElementById('exportCsvBtn');
            const exportXlsxBtn = document.getElementById('exportXlsxBtn');
            const clearBtn = document.getElementById('clearBtn');
            const filterDropdownBtn = document.getElementById('filterDropdownBtn');
            const filterDropdown = document.getElementById('filterDropdown');
            const activeFilters = document.getElementById('activeFilters');
            const resultsSection = document.getElementById('resultsSection');
            const trackingResults = document.getElementById('trackingResults');
            const noResults = document.getElementById('noResults');
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            const lastUpdatedEl = document.getElementById('lastUpdated');
            const trackingCountEl = document.getElementById('trackingCount');
            const sortHeaders = document.querySelectorAll('.sort-header');
            
            // Copy modal elements
            const copyModal = document.getElementById('copyModal');
            const copyText = document.getElementById('copyText');
            const modalCopyBtn = document.getElementById('modalCopyBtn');
            const closeModal = document.getElementById('closeModal');
            
            // Clear modal elements
            const clearModal = document.getElementById('clearModal');
            const closeClearModal = document.getElementById('closeClearModal');
            const cancelClearBtn = document.getElementById('cancelClearBtn');
            const confirmClearBtn = document.getElementById('confirmClearBtn');
            
            // State variables
            let trackingData = [];
            let newlyAddedIds = [];
            let activeFiltersList = [];
            let currentSortField = null;
            let currentSortDirection = null;
            
            // Load data from localStorage on startup
            loadFromLocalStorage();
            
            // Import Excel file
            importBtn.addEventListener('click', function() {
                if (!fileInput.files.length) {
                    showToast('Please select an Excel file first');
                    return;
                }

                processExcelFile(false);
            });

            // Append Excel file data
            appendBtn.addEventListener('click', function() {
                if (!fileInput.files.length) {
                    showToast('Please select an Excel file first');
                    return;
                }

                processExcelFile(true);
            });

            // Toggle export dropdown
            exportDropdownBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                exportDropdown.classList.toggle('show');
                // Hide other dropdowns
                filterDropdown.classList.remove('show');
            });

            // Export to CSV
            exportCsvBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (trackingData.length === 0) {
                    showToast('No data to export');
                    return;
                }
                
                try {
                    const csvContent = convertToCSV(trackingData);
                    downloadFile(csvContent, 'fedex_tracking_data.csv', 'text/csv');
                    showToast('Data exported to CSV');
                } catch (error) {
                    console.error('Error exporting to CSV:', error);
                    showToast('Error exporting data: ' + error.message);
                }
                
                exportDropdown.classList.remove('show');
            });

            // Export to XLSX
            exportXlsxBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (trackingData.length === 0) {
                    showToast('No data to export');
                    return;
                }
                
                try {
                    exportToExcel(trackingData, 'fedex_tracking_data.xlsx');
                    showToast('Data exported to Excel');
                } catch (error) {
                    console.error('Error exporting to Excel:', error);
                    showToast('Error exporting data: ' + error.message);
                }
                
                exportDropdown.classList.remove('show');
            });

            // Toggle filter dropdown
            filterDropdownBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                filterDropdown.classList.toggle('show');
                // Hide other dropdowns
                exportDropdown.classList.remove('show');
            });

            // Apply filter when clicked
            filterDropdown.addEventListener('click', function(e) {
                if (e.target.classList.contains('dropdown-item')) {
                    const filterType = e.target.getAttribute('data-filter');
                    applyFilter(filterType);
                    filterDropdown.classList.remove('show');
                }
            });

            // Sort headers click event
            sortHeaders.forEach(header => {
                header.addEventListener('click', function() {
                    const sortField = this.getAttribute('data-sort');
                    
                    // Toggle sort direction or set to ascending if it's a new field
                    if (currentSortField === sortField) {
                        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
                    } else {
                        currentSortField = sortField;
                        currentSortDirection = 'asc';
                    }
                    
                    // Update sort icons
                    updateSortIcons();
                    
                    // Apply the sort
                    sortData(sortField, currentSortDirection);
                    
                    // Update display
                    updateTrackingDisplay();
                });
            });

            // Close dropdowns when clicking elsewhere
            document.addEventListener('click', function() {
                exportDropdown.classList.remove('show');
                filterDropdown.classList.remove('show');
            });

            // Process Excel file
            function processExcelFile(append) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    try {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                        
                        // More robust column handling
                        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
                        
                        if (jsonData.length === 0) {
                            showToast('No data found in the Excel file');
                            return;
                        }

                        // Process the data
                        processTrackingData(jsonData, append);
                        
                        // Clear the file input for next use
                        fileInput.value = '';
                        
                    } catch (error) {
                        console.error('Error processing Excel file:', error);
                        showToast('Error processing Excel file: ' + error.message);
                    }
                };
                
                reader.onerror = function() {
                    showToast('Error reading the file');
                };
                
                reader.readAsArrayBuffer(file);
            }

            // Load sample data
            loadSampleBtn.addEventListener('click', function() {
                const sampleData = [
                    { 
                        "Ticket Number": "TK-1001", 
                        "Outbound Tracking": "794583957284", 
                        "Inbound Tracking": "794583957285" 
                    },
                    { 
                        "Ticket Number": "TK-1002", 
                        "Outbound Tracking": "794583957286", 
                        "Inbound Tracking": "794583957287" 
                    },
                    { 
                        "Ticket Number": "TK-1003", 
                        "Outbound Tracking": "794583957288", 
                        "Inbound Tracking": "" 
                    },
                    { 
                        "Ticket Number": "TK-1004", 
                        "Outbound Tracking": "794583957290", 
                        "Inbound Tracking": "794583957291" 
                    },
                    { 
                        "Ticket Number": "TK-1005", 
                        "Outbound Tracking": "794583957292", 
                        "Inbound Tracking": "794583957293" 
                    }
                ];
                
                processTrackingData(sampleData, false);
                showToast('Sample data loaded');
            });

            // Refresh tracking status
            refreshBtn.addEventListener('click', function() {
                if (trackingData.length === 0) {
                    showToast('No tracking data to refresh');
                    return;
                }
                
                updateTrackingStatuses();
                saveToLocalStorage();
                showToast('Tracking statuses refreshed');
            });
            
            // Show clear confirmation modal
            clearBtn.addEventListener('click', function() {
                clearModal.style.display = 'block';
            });
            
            // Close clear modal
            closeClearModal.addEventListener('click', function() {
                clearModal.style.display = 'none';
            });
            
            // Cancel clear
            cancelClearBtn.addEventListener('click', function() {
                clearModal.style.display = 'none';
            });
            
            // Confirm clear all data
            confirmClearBtn.addEventListener('click', function() {
                trackingData = [];
                activeFiltersList = [];
                currentSortField = null;
                currentSortDirection = null;
                updateActiveFiltersDisplay();
                updateSortIcons();
                localStorage.removeItem('fedexTrackingData');
                localStorage.removeItem('fedexLastUpdated');
                localStorage.removeItem('fedexFilters');
                localStorage.removeItem('fedexSort');
                lastUpdatedEl.textContent = 'Last updated: Never';
                updateTrackingDisplay();
                resultsSection.classList.add('hidden');
                clearModal.style.display = 'none';
                showToast('All tracking data cleared');
            });
            
            // Close copy modal
            closeModal.addEventListener('click', function() {
                copyModal.style.display = 'none';
            });
            
            // Modal copy button
            modalCopyBtn.addEventListener('click', function() {
                copyText.select();
                document.execCommand('copy');
                copyModal.style.display = 'none';
                showToast('Text copied to clipboard');
            });
            
            // Close modals when clicking outside
            window.addEventListener('click', function(event) {
                if (event.target === copyModal) {
                    copyModal.style.display = 'none';
                }
                if (event.target === clearModal) {
                    clearModal.style.display = 'none';
                }
            });

            // Process tracking data
            function processTrackingData(data, append) {
                // Reset newly added IDs
                newlyAddedIds = [];
                
                // Map the data to our format
                const newData = data.map(item => {
                    // Find the appropriate column names (case insensitive)
                    const ticketKey = findKeyByPattern(item, ['ticket', 'id', 'number']);
                    const outboundKey = findKeyByPattern(item, ['outbound', 'sending', 'out']);
                    const inboundKey = findKeyByPattern(item, ['inbound', 'receiving', 'in', 'return']);
                    
                    const ticketNumber = String(item[ticketKey] || '').trim();
                    
                    return {
                        id: Date.now() + Math.random().toString(36).substr(2, 9), // Generate unique ID
                        ticketNumber: ticketNumber,
                        outboundTracking: String(item[outboundKey] || '').trim(),
                        inboundTracking: String(item[inboundKey] || '').trim(),
                        outboundStatus: null,
                        inboundStatus: null,
                        lastUpdated: null
                    };
                });
                
                if (append && trackingData.length > 0) {
                    // Merge with existing data, avoiding duplicates
                    const existingTickets = new Set(trackingData.map(item => item.ticketNumber));
                    let addedCount = 0;
                    
                    newData.forEach(item => {
                        if (!existingTickets.has(item.ticketNumber) && item.ticketNumber) {
                            trackingData.push(item);
                            newlyAddedIds.push(item.id);
                            addedCount++;
                        }
                    });
                    
                    showToast(`Added ${addedCount} new tracking items`);
                } else {
                    // Replace existing data
                    trackingData = newData;
                    newlyAddedIds = newData.map(item => item.id);
                    showToast(`Imported ${newData.length} tracking items`);
                }
                
                // Fetch tracking statuses
                updateTrackingStatuses();
                
                // Update last updated timestamp
                const timestamp = new Date();
                lastUpdatedEl.textContent = 'Last updated: ' + timestamp.toLocaleString();
                
                // Save to localStorage
                saveToLocalStorage();
                
                // Show results section
                resultsSection.classList.remove('hidden');
            }

            // Find key in object by pattern
            function findKeyByPattern(obj, patterns) {
                const keys = Object.keys(obj);
                for (const pattern of patterns) {
                    const matchingKey = keys.find(key => 
                        key.toLowerCase().includes(pattern.toLowerCase()));
                    if (matchingKey) return matchingKey;
                }
                return keys[0]; // Return first key as fallback
            }

            // Update tracking statuses (simulated FedEx API call)
            function updateTrackingStatuses() {
                // Simulate API call for each tracking number
                trackingData.forEach((item, index) => {
                    // Simulate different statuses based on the tracking number
                    const outboundStatus = simulateTrackingStatus(item.outboundTracking);
                    const inboundStatus = item.inboundTracking ? 
                        simulateTrackingStatus(item.inboundTracking) : 
                        { status: 'N/A', details: 'No tracking number provided' };
                    
                    // Update the data
                    trackingData[index].outboundStatus = outboundStatus;
                    trackingData[index].inboundStatus = inboundStatus;
                    trackingData[index].lastUpdated = new Date().toLocaleString();
                });
                
                // Apply any active filters and sorting
                applyFiltersAndSort();
                
                // Update the display
                updateTrackingDisplay();
            }
            
            // Apply filter
            function applyFilter(filterType) {
                // Check if filter is already applied
                if (activeFiltersList.includes(filterType)) {
                    showToast('Filter already applied');
                    return;
                }
                
                // Handle sort filters differently
                if (filterType.startsWith('sort-')) {
                    // Remove any existing sort filters
                    activeFiltersList = activeFiltersList.filter(f => !f.startsWith('sort-'));
                    
                    // Parse the sort parameters
                    const [_, field, direction] = filterType.split('-');
                    
                    // Set current sort field and direction
                    currentSortField = field;
                    currentSortDirection = direction;
                    
                    // Update sort icons
                    updateSortIcons();
                    
                    // Apply the sort
                    sortData(field, direction);
                } else {
                    // For status filters, remove any conflicting ones
                    if (filterType.startsWith('status-')) {
                        activeFiltersList = activeFiltersList.filter(f => !f.startsWith('status-'));
                    }
                    
                    // Add the new filter
                    activeFiltersList.push(filterType);
                }
                
                // Update the display of active filters
                updateActiveFiltersDisplay();
                
                // Apply filters and update display
                applyFiltersAndSort();
                updateTrackingDisplay();
                
                // Save filters to localStorage
                saveFiltersToLocalStorage();
            }
            
            // Remove filter
            function removeFilter(filterType) {
                activeFiltersList = activeFiltersList.filter(f => f !== filterType);
                
                // If it was a sort filter, reset sort
                if (filterType.startsWith('sort-')) {
                    currentSortField = null;
                    currentSortDirection = null;
                    updateSortIcons();
                }
                
                // Update the display of active filters
                updateActiveFiltersDisplay();
                
                // Apply remaining filters and update display
                applyFiltersAndSort();
                updateTrackingDisplay();
                
                // Save filters to localStorage
                saveFiltersToLocalStorage();
            }
            
            // Update active filters display
            function updateActiveFiltersDisplay() {
                activeFilters.innerHTML = '';
                
                if (activeFiltersList.length === 0) {
                    return;
                }
                
                activeFiltersList.forEach(filter => {
                    const badge = document.createElement('div');
                    badge.className = 'filter-badge';
                    
                    let filterText = '';
                    
                    // Set appropriate filter text
                    switch(filter) {
                        case 'status-delivered':
                            filterText = 'Show Only Delivered';
                            break;
                        case 'status-not-delivered':
                            filterText = 'Hide Delivered';
                            break;
                        case 'status-exception':
                            filterText = 'Show Only Exceptions';
                            break;
                        case 'status-transit':
                            filterText = 'Show Only In Transit';
                            break;
                        case 'sort-ticket-asc':
                            filterText = 'Sort: Ticket # (A-Z)';
                            break;
                        case 'sort-ticket-desc':
                            filterText = 'Sort: Ticket # (Z-A)';
                            break;
                        case 'sort-date-asc':
                            filterText = 'Sort: Last Update (Oldest)';
                            break;
                        case 'sort-date-desc':
                            filterText = 'Sort: Last Update (Newest)';
                            break;
                        default:
                            filterText = filter;
                    }
                    
                    badge.innerHTML = `
                        ${filterText}
                        <button data-filter="${filter}">×</button>
                    `;
                    
                    activeFilters.appendChild(badge);
                });
                
                // Add event listeners to remove buttons
                document.querySelectorAll('.filter-badge button').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const filterToRemove = this.getAttribute('data-filter');
                        removeFilter(filterToRemove);
                    });
                });
            }
            
            // Apply all active filters and sorting
            function applyFiltersAndSort() {
                // Apply sorting if set
                if (currentSortField && currentSortDirection) {
                    sortData(currentSortField, currentSortDirection);
                }
            }
            
            // Sort data
            function sortData(field, direction) {
                switch(field) {
                    case 'ticket':
                        trackingData.sort((a, b) => {
                            return direction === 'asc' 
                                ? a.ticketNumber.localeCompare(b.ticketNumber)
                                : b.ticketNumber.localeCompare(a.ticketNumber);
                        });
                        break;
                    case 'status':
                        trackingData.sort((a, b) => {
                            const statusA = a.outboundStatus?.status || '';
                            const statusB = b.outboundStatus?.status || '';
                            return direction === 'asc'
                                ? statusA.localeCompare(statusB)
                                : statusB.localeCompare(statusA);
                        });
                        break;
                    case 'date':
                        trackingData.sort((a, b) => {
                            // Convert to Date objects for comparison
                            const dateA = a.lastUpdated ? new Date(a.lastUpdated) : new Date(0);
                            const dateB = b.lastUpdated ? new Date(b.lastUpdated) : new Date(0);
                            
                            return direction === 'asc'
                                ? dateA - dateB
                                : dateB - dateA;
                        });
                        break;
                }
            }
            
            // Update sort icons
            function updateSortIcons() {
                // Clear all sort icons
                document.querySelectorAll('.sort-icon').forEach(icon => {
                    icon.className = 'sort-icon ml-1';
                });
                
                // Set the active sort icon
                if (currentSortField) {
                    const activeHeader = document.querySelector(`.sort-header[data-sort="${currentSortField}"]`);
                    if (activeHeader) {
                        const icon = activeHeader.querySelector('.sort-icon');
                        icon.classList.add(currentSortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
                    }
                }
            }
            
            // Update tracking display
            function updateTrackingDisplay() {
                // Clear existing results
                trackingResults.innerHTML = '';
                
                if (trackingData.length === 0) {
                    noResults.classList.remove('hidden');
                    trackingCountEl.textContent = '0';
                    return;
                }
                
                noResults.classList.add('hidden');
                
                // Filter data if needed
                let displayData = [...trackingData]; // Create a copy to avoid modifying original
                
                // Apply status filters
                if (activeFiltersList.includes('status-delivered')) {
                    displayData = displayData.filter(item => {
                        return item.outboundStatus?.status === 'Delivered' || 
                               (item.inboundTracking && item.inboundStatus?.status === 'Delivered');
                    });
                } else if (activeFiltersList.includes('status-not-delivered')) {
                    displayData = displayData.filter(item => {
                        // If outbound is delivered and either there's no inbound or inbound is also delivered, hide it
                        if (item.outboundStatus?.status === 'Delivered') {
                            if (!item.inboundTracking || item.inboundStatus?.status === 'Delivered') {
                                return false;
                            }
                        }
                        return true;
                    });
                } else if (activeFiltersList.includes('status-exception')) {
                    displayData = displayData.filter(item => {
                        return item.outboundStatus?.status === 'Exception' || 
                               (item.inboundTracking && item.inboundStatus?.status === 'Exception');
                    });
                } else if (activeFiltersList.includes('status-transit')) {
                    displayData = displayData.filter(item => {
                        return item.outboundStatus?.status === 'In Transit' || 
                               item.outboundStatus?.status === 'Out for Delivery' ||
                               (item.inboundTracking && 
                                (item.inboundStatus?.status === 'In Transit' || 
                                 item.inboundStatus?.status === 'Out for Delivery'));
                    });
                }
                
                // Update count
                trackingCountEl.textContent = displayData.length;
                
                // Display data
                displayData.forEach((item) => {
                    const row = document.createElement('tr');
                    row.id = `row-${item.id}`;
                    
                    // Highlight newly added rows
                    if (newlyAddedIds.includes(item.id)) {
                        row.classList.add('highlight-row');
                    }
                    
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.ticketNumber}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <a href="https://www.fedex.com/apps/fedextrack/?tracknumbers=${item.outboundTracking}" target="_blank" class="text-blue-600 hover:text-blue-800">${item.outboundTracking}</a>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${item.inboundTracking ? 
                                `<a href="https://www.fedex.com/apps/fedextrack/?tracknumbers=${item.inboundTracking}" target="_blank" class="text-blue-600 hover:text-blue-800">${item.inboundTracking}</a>` : 
                                '<span class="text-gray-400">N/A</span>'}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex flex-col space-y-1">
                                <span class="px-2 py-1 text-xs rounded-full inline-block ${getStatusClass(item.outboundStatus?.status)}">
                                    Out: ${item.outboundStatus?.status || 'Unknown'}
                                </span>
                                ${item.inboundTracking ? 
                                    `<span class="px-2 py-1 text-xs rounded-full inline-block ${getStatusClass(item.inboundStatus?.status)}">
                                        In: ${item.inboundStatus?.status || 'Unknown'}
                                    </span>` : 
                                    ''}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.lastUpdated || 'Never'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button class="copy-btn text-indigo-600 hover:text-indigo-900 mr-3" data-id="${item.id}">
                                <div class="tooltip">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                    <span class="tooltiptext">Copy Status</span>
                                </div>
                            </button>
                            <button class="details-btn text-blue-600 hover:text-blue-900 mr-3" data-id="${item.id}">
                                <div class="tooltip">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span class="tooltiptext">View Details</span>
                                </div>
                            </button>
                            <button class="delete-btn text-red-600 hover:text-red-900" data-id="${item.id}">
                                <div class="tooltip">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span class="tooltiptext">Remove</span>
                                </div>
                            </button>
                        </td>
                    `;
                    
                    trackingResults.appendChild(row);
                });
                
                // Add event listeners for copy buttons
                document.querySelectorAll('.copy-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const item = trackingData.find(i => i.id === id);
                        const statusText = `Ticket: ${item.ticketNumber}\nOutbound: ${item.outboundTracking} - ${item.outboundStatus?.status || 'Unknown'}\n${item.inboundTracking ? `Inbound: ${item.inboundTracking} - ${item.inboundStatus?.status || 'Unknown'}` : ''}`;
                        
                        // Try to use the clipboard API
                        copyToClipboard(statusText);
                    });
                });
                
                // Add event listeners for details buttons
                document.querySelectorAll('.details-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const item = trackingData.find(i => i.id === id);
                        alert(`Tracking Details for ${item.ticketNumber}:\n\nOutbound (${item.outboundTracking}):\n${item.outboundStatus?.details || 'No details available'}\n\n${item.inboundTracking ? `Inbound (${item.inboundTracking}):\n${item.inboundStatus?.details || 'No details available'}` : ''}`);
                    });
                });
                
                // Add event listeners for delete buttons
                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const item = trackingData.find(i => i.id === id);
                        if (confirm(`Are you sure you want to remove tracking for ticket ${item.ticketNumber}?`)) {
                            trackingData = trackingData.filter(i => i.id !== id);
                            saveToLocalStorage();
                            updateTrackingDisplay();
                            showToast('Tracking item removed');
                        }
                    });
                });
                
                // Show tooltips on hover
                document.querySelectorAll('.tooltip').forEach(tooltip => {
                    tooltip.addEventListener('mouseenter', function() {
                        this.querySelector('.tooltiptext').style.visibility = 'visible';
                        this.querySelector('.tooltiptext').style.opacity = '1';
                    });
                    
                    tooltip.addEventListener('mouseleave', function() {
                        this.querySelector('.tooltiptext').style.visibility = 'hidden';
                        this.querySelector('.tooltiptext').style.opacity = '0';
                    });
                });
            }

            // Copy to clipboard with fallback
            function copyToClipboard(text) {
                // Try the modern Clipboard API first
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(text)
                        .then(() => {
                            showToast('Status copied to clipboard');
                        })
                        .catch(() => {
                            // If that fails, show the modal with the text
                            showCopyModal(text);
                        });
                } else {
                    // For older browsers or non-secure contexts
                    showCopyModal(text);
                }
            }
            
            // Show copy modal
            function showCopyModal(text) {
                copyText.value = text;
                copyModal.style.display = 'block';
                copyText.select();
            }

            // Simulate tracking status based on tracking number
            function simulateTrackingStatus(trackingNumber) {
                if (!trackingNumber) {
                    return { status: 'N/A', details: 'No tracking number provided' };
                }
                
                // Convert to string and ensure it's valid
                const trackingStr = String(trackingNumber);
                if (!trackingStr || trackingStr.length === 0) {
                    return { status: 'Unknown', details: 'Invalid tracking number' };
                }
                
                // Use the last character to determine status
                const lastChar = trackingStr.charAt(trackingStr.length - 1);
                
                // Convert to number if possible, or use character code
                let statusIndex;
                if (!isNaN(parseInt(lastChar))) {
                    statusIndex = parseInt(lastChar);
                } else {
                    statusIndex = lastChar.charCodeAt(0) % 5;
                }
                
                const statuses = [
                    { 
                        status: 'Delivered', 
                        details: 'Package was delivered on ' + new Date(Date.now() - Math.random() * 86400000 * 3).toLocaleString() + '.\nSigned for by: J. SMITH' 
                    },
                    { 
                        status: 'In Transit', 
                        details: 'Package is in transit.\nLast scan: ' + new Date(Date.now() - Math.random() * 86400000).toLocaleString() + ' at MEMPHIS, TN\nScheduled delivery: ' + new Date(Date.now() + 86400000).toLocaleDateString()
                    },
                    { 
                        status: 'Out for Delivery', 
                        details: 'Package is out for delivery today.\nLoaded on delivery vehicle at ' + new Date(Date.now() - 14400000).toLocaleTimeString() + '\nExpected by end of day.' 
                    },
                    { 
                        status: 'Pending', 
                        details: 'Shipping label created on ' + new Date(Date.now() - 172800000).toLocaleString() + '.\nWaiting for package to be tendered to FedEx.' 
                    },
                    { 
                        status: 'Exception', 
                        details: 'Delivery exception: ' + ['Weather delay - severe weather conditions have delayed delivery operations', 'Address issue - incorrect address provided', 'Customs delay - package held in customs'][Math.floor(Math.random() * 3)] + '\nNext delivery attempt: ' + new Date(Date.now() + 86400000).toLocaleDateString()
                    }
                ];
                
                return statuses[statusIndex % statuses.length];
            }

            // Get CSS class for status
            function getStatusClass(status) {
                switch(status) {
                    case 'Delivered': return 'status-delivered';
                    case 'In Transit': 
                    case 'Out for Delivery': return 'status-transit';
                    case 'Pending': return 'status-pending';
                    case 'Exception': return 'status-exception';
                    default: return 'bg-gray-100 text-gray-800';
                }
            }

            // Convert data to CSV
            function convertToCSV(data) {
                const headers = ['Ticket Number', 'Outbound Tracking', 'Outbound Status', 'Inbound Tracking', 'Inbound Status', 'Last Updated'];
                const rows = data.map(item => [
                    item.ticketNumber || '',
                    item.outboundTracking || '',
                    item.outboundStatus?.status || 'N/A',
                    item.inboundTracking || 'N/A',
                    item.inboundStatus?.status || 'N/A',
                    item.lastUpdated || 'Never'
                ]);
                
                // Properly escape CSV values
                const escapeCsvValue = (value) => {
                    if (value === null || value === undefined) return '""';
                    return `"${String(value).replace(/"/g, '""')}"`;
                };
                
                return [headers, ...rows].map(row => 
                    row.map(escapeCsvValue).join(',')
                ).join('\n');
            }

            // Download file (CSV or other)
            function downloadFile(content, filename, mimeType) {
                // Create a Blob with the data and MIME type
                const blob = new Blob([content], { type: mimeType });
                
                // Create a download link
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                
                // Append to the document, click it, and remove it
                document.body.appendChild(link);
                link.click();
                
                // Clean up
                setTimeout(() => {
                    URL.revokeObjectURL(link.href);
                    document.body.removeChild(link);
                }, 100);
            }

            // Export to Excel
            function exportToExcel(data, filename) {
                // Prepare the data for Excel
                const excelData = [
                    ['Ticket Number', 'Outbound Tracking', 'Outbound Status', 'Inbound Tracking', 'Inbound Status', 'Last Updated']
                ];
                
                data.forEach(item => {
                    excelData.push([
                        item.ticketNumber || '',
                        item.outboundTracking || '',
                        item.outboundStatus?.status || 'N/A',
                        item.inboundTracking || 'N/A',
                        item.inboundStatus?.status || 'N/A',
                        item.lastUpdated || 'Never'
                    ]);
                });
                
                // Create a new workbook
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.aoa_to_sheet(excelData);
                
                // Add the worksheet to the workbook
                XLSX.utils.book_append_sheet(wb, ws, 'Tracking Data');
                
                // Generate the Excel file and trigger download
                XLSX.writeFile(wb, filename);
            }

            // Save data to localStorage
            function saveToLocalStorage() {
                try {
                    localStorage.setItem('fedexTrackingData', JSON.stringify(trackingData));
                    localStorage.setItem('fedexLastUpdated', lastUpdatedEl.textContent);
                    saveFiltersToLocalStorage();
                } catch (error) {
                    console.error('Error saving to localStorage:', error);
                    showToast('Error saving data to browser storage');
                }
            }
            
            // Save filters to localStorage
            function saveFiltersToLocalStorage() {
                try {
                    localStorage.setItem('fedexFilters', JSON.stringify(activeFiltersList));
                    localStorage.setItem('fedexSort', JSON.stringify({
                        field: currentSortField,
                        direction: currentSortDirection
                    }));
                } catch (error) {
                    console.error('Error saving filters to localStorage:', error);
                }
            }

            // Load data from localStorage
            function loadFromLocalStorage() {
                try {
                    const savedData = localStorage.getItem('fedexTrackingData');
                    const savedLastUpdated = localStorage.getItem('fedexLastUpdated');
                    const savedFilters = localStorage.getItem('fedexFilters');
                    const savedSort = localStorage.getItem('fedexSort');
                    
                    if (savedData) {
                        trackingData = JSON.parse(savedData);
                        
                        // Ensure all items have IDs (for backward compatibility)
                        trackingData.forEach(item => {
                            if (!item.id) {
                                item.id = Date.now() + Math.random().toString(36).substr(2, 9);
                            }
                        });
                        
                        resultsSection.classList.remove('hidden');
                    }
                    
                    if (savedLastUpdated) {
                        lastUpdatedEl.textContent = savedLastUpdated;
                    }
                    
                    // Load filters
                    if (savedFilters) {
                        activeFiltersList = JSON.parse(savedFilters);
                        updateActiveFiltersDisplay();
                    }
                    
                    // Load sort settings
                    if (savedSort) {
                        const sortSettings = JSON.parse(savedSort);
                        currentSortField = sortSettings.field;
                        currentSortDirection = sortSettings.direction;
                        updateSortIcons();
                    }
                    
                    if (trackingData.length > 0) {
                        applyFiltersAndSort();
                        updateTrackingDisplay();
                    }
                } catch (error) {
                    console.error('Error loading from localStorage:', error);
                    showToast('Error loading saved data');
                }
            }

            // Show toast notification
            function showToast(message) {
                toastMessage.textContent = message;
                toast.classList.remove('translate-y-20', 'opacity-0');
                
                setTimeout(() => {
                    toast.classList.add('translate-y-20', 'opacity-0');
                }, 3000);
            }
        });
    </script>
</body>
</html>
