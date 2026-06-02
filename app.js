<script>
    document.addEventListener('DOMContentLoaded', function() {

        // --- Utility: Toast ---
        function showToast(message) {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            if (!toast || !toastMessage) return;

            toastMessage.textContent = message;

            // show
            toast.classList.remove('translate-y-20', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');

            // hide after 2.5s
            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0');
                toast.classList.remove('translate-y-0', 'opacity-100');
            }, 2500);
        }

        // --- Local Storage ---
        function saveToLocalStorage() {
            try {
                localStorage.setItem('fedexTrackingData', JSON.stringify(trackingData || []));
                localStorage.setItem('fedexLastUpdated', new Date().toLocaleString());
            } catch (e) {
                console.error('localStorage save failed:', e);
            }
        }

        function loadFromLocalStorage() {
            try {
                const saved = localStorage.getItem('fedexTrackingData');
                const last = localStorage.getItem('fedexLastUpdated');

                if (saved) {
                    trackingData = JSON.parse(saved);

                    // Ensure types are sane (in case older saves exist)
                    trackingData = Array.isArray(trackingData) ? trackingData : [];

                    // Show results section if there's data
                    const resultsSection = document.getElementById('resultsSection');
                    if (resultsSection && trackingData.length > 0) {
                        resultsSection.classList.remove('hidden');
                    }
                }

                const lastUpdatedEl = document.getElementById('lastUpdated');
                if (lastUpdatedEl && last) {
                    lastUpdatedEl.textContent = 'Last updated: ' + last;
                }

                // restore filters/sort if present
                const savedFilters = localStorage.getItem('fedexFilters');
                if (savedFilters) {
                    activeFiltersList = JSON.parse(savedFilters) || [];
                }
                const savedSort = localStorage.getItem('fedexSort');
                if (savedSort) {
                    const parsed = JSON.parse(savedSort);
                    currentSortField = parsed?.field ?? null;
                    currentSortDirection = parsed?.direction ?? null;
                }

                // refresh UI if functions exist
                if (typeof updateActiveFiltersDisplay === 'function') updateActiveFiltersDisplay();
                if (typeof updateSortIcons === 'function') updateSortIcons();
                if (typeof applyFiltersAndSort === 'function') applyFiltersAndSort();
                if (typeof updateTrackingDisplay === 'function') updateTrackingDisplay();
            } catch (e) {
                console.error('localStorage load failed:', e);
            }
        }

        function saveFiltersToLocalStorage() {
            try {
                localStorage.setItem('fedexFilters', JSON.stringify(activeFiltersList || []));
            } catch (e) {
                console.error('saveFilters failed:', e);
            }
        }

        function saveSortToLocalStorage() {
            try {
                localStorage.setItem('fedexSort', JSON.stringify({
                    field: currentSortField,
                    direction: currentSortDirection
                }));
            } catch (e) {
                console.error('saveSort failed:', e);
            }
        }

        // --- Convert data to CSV  ---
        function convertToCSV(data) {
            const headers = ['Ticket Number', 'Outbound Tracking', 'Outbound Status', 'Inbound Tracking', 'Inbound Status', 'Last Updated'];
            const rows = (data || []).map(item => [
                item.ticketNumber || '',
                item.outboundTracking || '',
                item.outboundStatus?.status || 'N/A',
                item.inboundTracking || 'N/A',
                item.inboundStatus?.status || 'N/A',
                item.lastUpdated || 'Never'
            ]);

            const escapeCsvValue = (value) => {
                if (value === null || value === undefined) return '""';
                return `"${String(value).replace(/"/g, '""')}"`;
            };

            return [headers, ...rows]
                .map(row => row.map(escapeCsvValue).join(','))
                .join('\n');
        }

        // --- Export to Excel  ---
        function exportToExcel(data, fileName) {
            const safe = (data || []).map(item => ({
                'Ticket Number': item.ticketNumber ?? '',
                'Outbound Tracking': item.outboundTracking ?? '',
                'Outbound Status': item.outboundStatus?.status ?? 'N/A',
                'Inbound Tracking': item.inboundTracking ?? 'N/A',
                'Inbound Status': item.inboundStatus?.status ?? 'N/A',
                'Last Updated': item.lastUpdated ?? 'Never'
            }));

            const ws = XLSX.utils.json_to_sheet(safe);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Tracking');
            XLSX.writeFile(wb, fileName || 'fedex_tracking_data.xlsx');
        }

        // --- Download helper ---
        function downloadFile(content, fileName, mimeType) {
            // Method 1: Blob
            try {
                const blob = new Blob([content], { type: mimeType });
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                document.body.appendChild(link);
                link.style.display = 'none';
                link.href = url;
                link.download = fileName;
                link.click();

                setTimeout(() => {
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                }, 100);

                return true;
            } catch (err1) {
                console.error("Method 1 failed:", err1);
            }

            // Method 2: Data URI
            try {
                const dataUri = 'data:' + mimeType + ',' + encodeURIComponent(content);
                const link = document.createElement('a');
                document.body.appendChild(link);
                link.style.display = 'none';
                link.href = dataUri;
                link.download = fileName;
                link.click();

                setTimeout(() => {
                    document.body.removeChild(link);
                }, 100);

                return true;
            } catch (err2) {
                console.error("Method 2 failed:", err2);
            }

            // Method 3: window.open
            try {
                const dataUri = 'data:' + mimeType + ',' + encodeURIComponent(content);
                const newWindow = window.open(dataUri);
                if (!newWindow) throw new Error("Popup blocked");
                newWindow.document.title = fileName;
                showToast('File opened in new tab. Please save it manually.');
                return true;
            } catch (err3) {
                console.error("Method 3 failed:", err3);
            }

            // Method 4: modal fallback
            showManualDownloadModal(content, fileName);
            return false;
        }

        // --- Manual download modal  ---
        function showManualDownloadModal(content, fileName) {
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
            modal.style.zIndex = '1000';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.padding = '24px';

            const panel = document.createElement('div');
            panel.style.background = '#fff';
            panel.style.width = 'min(900px, 95vw)';
            panel.style.maxHeight = '85vh';
            panel.style.overflow = 'auto';
            panel.style.borderRadius = '12px';
            panel.style.padding = '16px';
            panel.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';

            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.gap = '12px';
            header.style.marginBottom = '12px';

            const title = document.createElement('div');
            title.style.fontWeight = '600';
            title.textContent = `Manual download: ${fileName}`;

            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'Close';
            closeBtn.style.padding = '8px 12px';
            closeBtn.style.borderRadius = '8px';
            closeBtn.style.border = '1px solid #ddd';
            closeBtn.style.background = '#f8f8f8';
            closeBtn.style.cursor = 'pointer';

            closeBtn.onclick = () => document.body.removeChild(modal);

            header.appendChild(title);
            header.appendChild(closeBtn);

            const note = document.createElement('p');
            note.style.fontSize = '13px';
            note.style.color = '#555';
            note.style.marginBottom = '10px';
            note.textContent = 'Your browser blocked automatic download. Copy the content below into a file manually.';

            const textarea = document.createElement('textarea');
            textarea.value = content;
            textarea.style.width = '100%';
            textarea.style.height = '320px';
            textarea.style.fontFamily = 'monospace';
            textarea.style.fontSize = '12px';
            textarea.style.border = '1px solid #ddd';
            textarea.style.borderRadius = '10px';
            textarea.style.padding = '10px';

            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'Copy to clipboard';
            copyBtn.style.marginTop = '10px';
            copyBtn.style.padding = '10px 12px';
            copyBtn.style.borderRadius = '10px';
            copyBtn.style.border = 'none';
            copyBtn.style.background = '#2563eb';
            copyBtn.style.color = '#fff';
            copyBtn.style.cursor = 'pointer';

            copyBtn.onclick = async () => {
                try {
                    await navigator.clipboard.writeText(content);
                    showToast('Copied to clipboard');
                } catch (e) {
                    textarea.focus();
                    textarea.select();
                    document.execCommand('copy');
                    showToast('Copied to clipboard');
                }
            };

            // click outside closes
            modal.addEventListener('click', (e) => {
                if (e.target === modal) document.body.removeChild(modal);
            });

            panel.appendChild(header);
            panel.appendChild(note);
            panel.appendChild(textarea);
            panel.appendChild(copyBtn);
            modal.appendChild(panel);
            document.body.appendChild(modal);
        }

        // Export buttons
        const exportCsvBtn = document.getElementById('exportCsvBtn');
        const exportXlsxBtn = document.getElementById('exportXlsxBtn');

        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', function() {
                if (!trackingData || trackingData.length === 0) {
                    showToast('No data to export');
                    return;
                }
                const csv = convertToCSV(trackingData);
                downloadFile(csv, 'fedex_tracking_data.csv', 'text/csv;charset=utf-8;');
                showToast('CSV downloaded');
            });
        }

        if (exportXlsxBtn) {
            exportXlsxBtn.addEventListener('click', function() {
                if (!trackingData || trackingData.length === 0) {
                    showToast('No data to export');
                    return;
                }
                exportToExcel(trackingData, 'fedex_tracking_data.xlsx');
                showToast('Excel downloaded');
            });
        }

        const sortHeaders = document.querySelectorAll('.sort-header');
        sortHeaders.forEach(h => {
            h.addEventListener('click', () => {
                saveSortToLocalStorage();
            });
        });

        window.showToast = showToast;
        window.saveToLocalStorage = saveToLocalStorage;
        window.loadFromLocalStorage = loadFromLocalStorage;
        window.saveFiltersToLocalStorage = saveFiltersToLocalStorage;
        window.exportToExcel = exportToExcel;

        loadFromLocalStorage();
    });
</script>
