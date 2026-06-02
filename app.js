// ===== State =====
let trackingData = [];
let displayData  = [];
let activeFiltersList   = [];
let currentSortField    = null;
let currentSortDirection = null;
let isRefreshing = false;

// ===== Sample Dataset =====
const SAMPLE_DATA = [
    {
        id: 's1', ticketNumber: 'TKT-2026-001',
        outboundTracking: '7489023456781234', inboundTracking: '7489023456785678',
        outboundStatus: { status: 'Delivered',   details: 'Package delivered — left at front door', lastLocation: 'Austin, TX',          estimatedDelivery: 'May 28, 2026' },
        inboundStatus:  { status: 'In Transit',  details: 'Package in transit to destination hub',  lastLocation: 'Dallas FedEx Hub, TX', estimatedDelivery: 'Jun 4, 2026'  },
        lastUpdated: 'May 28, 2026, 2:34 PM'
    },
    {
        id: 's2', ticketNumber: 'TKT-2026-002',
        outboundTracking: '7748902312349871', inboundTracking: '7748902312340002',
        outboundStatus: { status: 'In Transit',  details: 'Arrived at FedEx facility',              lastLocation: 'Memphis, TN FedEx Hub', estimatedDelivery: 'Jun 3, 2026'  },
        inboundStatus:  { status: 'Pending',     details: 'Shipping label created, not yet picked up', lastLocation: 'N/A',               estimatedDelivery: 'TBD'          },
        lastUpdated: 'Jun 1, 2026, 9:12 AM'
    },
    {
        id: 's3', ticketNumber: 'TKT-2026-003',
        outboundTracking: '6120934500128734', inboundTracking: '',
        outboundStatus: { status: 'Delivered',   details: 'Delivered — signed by J. SMITH',         lastLocation: 'Chicago, IL',           estimatedDelivery: 'May 30, 2026' },
        inboundStatus:  { status: 'N/A',         details: 'No inbound tracking provided',           lastLocation: 'N/A',                   estimatedDelivery: 'N/A'          },
        lastUpdated: 'May 30, 2026, 11:48 AM'
    },
    {
        id: 's4', ticketNumber: 'TKT-2026-004',
        outboundTracking: '9612003490125583', inboundTracking: '9612003490125590',
        outboundStatus: { status: 'Exception',   details: 'Delivery attempted — no access to delivery location', lastLocation: 'New York, NY', estimatedDelivery: 'Jun 2, 2026' },
        inboundStatus:  { status: 'In Transit',  details: 'Package in transit',                     lastLocation: 'Newark, NJ FedEx Hub',  estimatedDelivery: 'Jun 5, 2026'  },
        lastUpdated: 'Jun 1, 2026, 4:55 PM'
    },
    {
        id: 's5', ticketNumber: 'TKT-2026-005',
        outboundTracking: '3318290045670034', inboundTracking: '3318290045670041',
        outboundStatus: { status: 'Out for Delivery', details: 'On FedEx vehicle for delivery today',  lastLocation: 'Seattle, WA',        estimatedDelivery: 'Jun 2, 2026'  },
        inboundStatus:  { status: 'Delivered',   details: 'Package delivered to reception desk',    lastLocation: 'Portland, OR',          estimatedDelivery: 'May 29, 2026' },
        lastUpdated: 'Jun 2, 2026, 8:30 AM'
    },
    {
        id: 's6', ticketNumber: 'TKT-2026-006',
        outboundTracking: '5920183740029911', inboundTracking: '5920183740029928',
        outboundStatus: { status: 'Pending',     details: 'Shipment information sent to FedEx',     lastLocation: 'N/A',                   estimatedDelivery: 'Jun 6, 2026'  },
        inboundStatus:  { status: 'Pending',     details: 'Shipment information sent to FedEx',     lastLocation: 'N/A',                   estimatedDelivery: 'Jun 8, 2026'  },
        lastUpdated: 'Jun 2, 2026, 7:00 AM'
    },
    {
        id: 's7', ticketNumber: 'TKT-2026-007',
        outboundTracking: '8873641200394471', inboundTracking: '8873641200394488',
        outboundStatus: { status: 'Exception',   details: 'Clearance delay — additional documentation required', lastLocation: 'Miami Customs, FL', estimatedDelivery: 'Jun 7, 2026' },
        inboundStatus:  { status: 'In Transit',  details: 'In transit — on time',                   lastLocation: 'Miami, FL',             estimatedDelivery: 'Jun 4, 2026'  },
        lastUpdated: 'Jun 1, 2026, 6:22 PM'
    },
    {
        id: 's8', ticketNumber: 'TKT-2026-008',
        outboundTracking: '2200045918263740', inboundTracking: '2200045918263757',
        outboundStatus: { status: 'Delivered',   details: 'Delivered to mailroom',                  lastLocation: 'Denver, CO',            estimatedDelivery: 'May 27, 2026' },
        inboundStatus:  { status: 'Delivered',   details: 'Delivered — signed by T. RODRIGUEZ',     lastLocation: 'Denver, CO',            estimatedDelivery: 'Jun 1, 2026'  },
        lastUpdated: 'Jun 1, 2026, 1:15 PM'
    },
    {
        id: 's9', ticketNumber: 'TKT-2026-009',
        outboundTracking: '4409182736450019', inboundTracking: '',
        outboundStatus: { status: 'In Transit',  details: 'Departed FedEx facility',                lastLocation: 'Phoenix, AZ',           estimatedDelivery: 'Jun 3, 2026'  },
        inboundStatus:  { status: 'N/A',         details: 'No inbound tracking provided',           lastLocation: 'N/A',                   estimatedDelivery: 'N/A'          },
        lastUpdated: 'Jun 2, 2026, 3:40 AM'
    },
    {
        id: 's10', ticketNumber: 'TKT-2026-010',
        outboundTracking: '7761029384750183', inboundTracking: '7761029384750190',
        outboundStatus: { status: 'Delivered',   details: 'Package delivered — no signature required', lastLocation: 'Boston, MA',         estimatedDelivery: 'May 31, 2026' },
        inboundStatus:  { status: 'Out for Delivery', details: 'On delivery vehicle — expected today', lastLocation: 'Boston, MA',         estimatedDelivery: 'Jun 2, 2026'  },
        lastUpdated: 'Jun 2, 2026, 10:05 AM'
    },
    {
        id: 's11', ticketNumber: 'TKT-2026-011',
        outboundTracking: '3390274618290034', inboundTracking: '3390274618290041',
        outboundStatus: { status: 'Exception',   details: 'Address information needed — unable to deliver', lastLocation: 'Atlanta, GA', estimatedDelivery: 'Jun 3, 2026'  },
        inboundStatus:  { status: 'Exception',   details: 'Weather delay — service disruption in area', lastLocation: 'Atlanta, GA',     estimatedDelivery: 'Jun 5, 2026'  },
        lastUpdated: 'Jun 1, 2026, 5:30 PM'
    },
    {
        id: 's12', ticketNumber: 'TKT-2026-012',
        outboundTracking: '1120093847561234', inboundTracking: '1120093847561241',
        outboundStatus: { status: 'In Transit',  details: 'On FedEx vehicle en route to destination facility', lastLocation: 'Las Vegas, NV', estimatedDelivery: 'Jun 4, 2026' },
        inboundStatus:  { status: 'Pending',     details: 'Label created, awaiting pickup',         lastLocation: 'N/A',                   estimatedDelivery: 'Jun 9, 2026'  },
        lastUpdated: 'Jun 2, 2026, 6:48 AM'
    }
];

// ===== Utilities =====
function generateId() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function getStatusClass(status) {
    if (!status || status === 'N/A') return 'status-na';
    const s = status.toLowerCase();
    if (s.includes('delivered'))         return 'status-delivered';
    if (s.includes('out for delivery'))  return 'status-transit';
    if (s.includes('transit'))           return 'status-transit';
    if (s.includes('exception'))         return 'status-exception';
    if (s.includes('pending'))           return 'status-pending';
    return 'status-na';
}

function getStatusLabel(status) {
    return status && status !== 'N/A' ? status : 'N/A';
}

function getProgressSteps(status) {
    if (!status || status === 'N/A') return [false, false, false, false];
    const s = status.toLowerCase();
    if (s.includes('delivered'))        return [true, true, true, true];
    if (s.includes('out for delivery')) return [true, true, true, false];
    if (s.includes('transit'))          return [true, true, false, false];
    if (s.includes('exception'))        return [true, true, 'error', false];
    if (s.includes('pending'))          return [true, false, false, false];
    return [false, false, false, false];
}

const PROGRESS_LABELS = ['Label Created', 'Picked Up', 'In Transit', 'Delivered'];

function buildProgressBar(status) {
    const steps = getProgressSteps(status);
    let html = '<div class="progress-track" title="';
    const activeStep = steps.lastIndexOf(true);
    html += PROGRESS_LABELS[activeStep] || 'Unknown';
    html += '">';
    steps.forEach((s, i) => {
        const isLast = i === steps.length - 1;
        let cls = 'progress-step';
        if (s === 'error') cls += ' error';
        else if (s === true && isLast) cls += ' done last';
        else if (s === true) {
            const next = steps[i + 1];
            cls += (next === false || next === undefined) ? ' active' : ' done';
        }
        html += `<div class="${cls}"></div>`;
    });
    html += '</div>';
    return html;
}

function buildStatusCell(statusObj) {
    if (!statusObj) return `<span class="status-badge status-na"><span class="status-dot"></span>N/A</span>`;
    const cls   = getStatusClass(statusObj.status);
    const label = getStatusLabel(statusObj.status);
    const progress = buildProgressBar(statusObj.status);
    return `<span class="status-badge ${cls}"><span class="status-dot"></span>${label}</span>${progress}`;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ===== Rendering =====
function renderSkeletonRows(count = 5) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `<tr>
            <td><div class="skeleton" style="height:16px;width:90px"></div></td>
            <td><div class="skeleton" style="height:14px;width:140px"></div></td>
            <td><div class="skeleton" style="height:14px;width:140px"></div></td>
            <td>
                <div class="skeleton" style="height:22px;width:80px;border-radius:999px"></div>
                <div class="skeleton mt-2" style="height:3px;width:120px;border-radius:2px"></div>
            </td>
            <td><div class="skeleton" style="height:14px;width:100px"></div></td>
            <td><div class="skeleton" style="height:28px;width:80px;border-radius:8px"></div></td>
        </tr>`;
    }
    return html;
}

function renderRow(item) {
    const outCls   = getStatusClass(item.outboundStatus?.status);
    const inCls    = getStatusClass(item.inboundStatus?.status);
    const outLabel = getStatusLabel(item.outboundStatus?.status);
    const inLabel  = getStatusLabel(item.inboundStatus?.status);

    const outProgress = buildProgressBar(item.outboundStatus?.status);
    const inProgress  = buildProgressBar(item.inboundStatus?.status);

    const outTracking = escapeHtml(item.outboundTracking) || '—';
    const inTracking  = item.inboundTracking ? escapeHtml(item.inboundTracking) : '—';

    return `<tr id="row-${item.id}">
        <td><span class="ticket-number">${escapeHtml(item.ticketNumber)}</span></td>
        <td><span class="tracking-number">${outTracking}</span></td>
        <td><span class="tracking-number">${inTracking}</span></td>
        <td>
            <div>
                <div class="mb-1">
                    <span class="text-xs font-medium mr-1" style="color:var(--text-muted)">Out:</span>
                    <span class="status-badge ${outCls}"><span class="status-dot"></span>${outLabel}</span>
                    ${outProgress}
                </div>
                <div>
                    <span class="text-xs font-medium mr-1" style="color:var(--text-muted)">In:</span>
                    <span class="status-badge ${inCls}"><span class="status-dot"></span>${inLabel}</span>
                    ${inProgress}
                </div>
            </div>
        </td>
        <td class="text-xs" style="color:var(--text-muted)">${escapeHtml(item.lastUpdated) || 'Never'}</td>
        <td>
            <div class="flex gap-1.5">
                <button class="btn-icon" title="View Details" onclick="openDetailsModal('${item.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </button>
                <button class="btn-icon" title="Copy Tracking" onclick="openCopyModal('${item.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                </button>
                <button class="btn-icon btn-icon-red" title="Remove" onclick="openDeleteModal('${item.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
            </div>
        </td>
    </tr>`;
}

// ===== Display update =====
function updateTrackingDisplay() {
    const tbody   = document.getElementById('trackingResults');
    const noRes   = document.getElementById('noResults');
    const countEl = document.getElementById('trackingCount');
    const section = document.getElementById('resultsSection');

    if (!tbody) return;

    if (trackingData.length === 0) {
        section && section.classList.add('hidden');
        return;
    }

    section && section.classList.remove('hidden');

    if (displayData.length === 0) {
        tbody.innerHTML = '';
        noRes && noRes.classList.remove('hidden');
        countEl && (countEl.textContent = '(0 of ' + trackingData.length + ' shown)');
        return;
    }

    noRes && noRes.classList.add('hidden');
    tbody.innerHTML = displayData.map(renderRow).join('');
    countEl && (countEl.textContent = '(' + displayData.length + ' of ' + trackingData.length + ' shipments)');
}

// ===== Filters & Sort =====
const FILTER_LABELS = {
    'status-delivered':     'Delivered only',
    'status-not-delivered': 'Hide Delivered',
    'status-exception':     'Exceptions only',
    'status-transit':       'In Transit only',
    'status-pending':       'Pending only',
    'sort-ticket-asc':      'Ticket A→Z',
    'sort-ticket-desc':     'Ticket Z→A',
    'sort-date-asc':        'Oldest first',
    'sort-date-desc':       'Newest first',
};

function applyFiltersAndSort() {
    let data = [...trackingData];

    activeFiltersList.forEach(f => {
        if (f === 'status-delivered')     data = data.filter(i => i.outboundStatus?.status === 'Delivered' || i.inboundStatus?.status === 'Delivered');
        if (f === 'status-not-delivered') data = data.filter(i => i.outboundStatus?.status !== 'Delivered' && i.inboundStatus?.status !== 'Delivered');
        if (f === 'status-exception')     data = data.filter(i => i.outboundStatus?.status === 'Exception' || i.inboundStatus?.status === 'Exception');
        if (f === 'status-transit')       data = data.filter(i => ['In Transit','Out for Delivery'].includes(i.outboundStatus?.status) || ['In Transit','Out for Delivery'].includes(i.inboundStatus?.status));
        if (f === 'status-pending')       data = data.filter(i => i.outboundStatus?.status === 'Pending' || i.inboundStatus?.status === 'Pending');
    });

    const sortFilter = activeFiltersList.find(f => f.startsWith('sort-'));
    if (sortFilter) {
        if (sortFilter === 'sort-ticket-asc')  data.sort((a,b) => (a.ticketNumber||'').localeCompare(b.ticketNumber||''));
        if (sortFilter === 'sort-ticket-desc') data.sort((a,b) => (b.ticketNumber||'').localeCompare(a.ticketNumber||''));
        if (sortFilter === 'sort-date-asc')    data.sort((a,b) => new Date(a.lastUpdated||0) - new Date(b.lastUpdated||0));
        if (sortFilter === 'sort-date-desc')   data.sort((a,b) => new Date(b.lastUpdated||0) - new Date(a.lastUpdated||0));
    }

    if (currentSortField && currentSortDirection) {
        data.sort((a,b) => {
            let va, vb;
            if (currentSortField === 'ticket') { va = a.ticketNumber||''; vb = b.ticketNumber||''; }
            if (currentSortField === 'status') { va = a.outboundStatus?.status||''; vb = b.outboundStatus?.status||''; }
            if (currentSortField === 'date')   { va = new Date(a.lastUpdated||0); vb = new Date(b.lastUpdated||0); }
            if (va < vb) return currentSortDirection === 'asc' ? -1 : 1;
            if (va > vb) return currentSortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    displayData = data;
}

function updateActiveFiltersDisplay() {
    const container = document.getElementById('activeFilters');
    if (!container) return;
    if (activeFiltersList.length === 0) {
        container.innerHTML = '<span class="text-xs" style="color:var(--text-muted)">No filters applied</span>';
        return;
    }
    container.innerHTML = activeFiltersList.map(f => `
        <span class="filter-chip">
            ${FILTER_LABELS[f] || f}
            <button class="filter-chip-x" onclick="removeFilter('${f}')" title="Remove filter">✕</button>
        </span>
    `).join('');
}

function removeFilter(f) {
    activeFiltersList = activeFiltersList.filter(x => x !== f);
    applyFiltersAndSort();
    updateActiveFiltersDisplay();
    updateTrackingDisplay();
    updateSortIcons();
    saveFiltersToLocalStorage();
}

function updateSortIcons() {
    document.querySelectorAll('.sort-header').forEach(btn => {
        const field = btn.dataset.sort;
        btn.classList.remove('active','asc','desc');
        if (field === currentSortField && currentSortDirection) {
            btn.classList.add('active', currentSortDirection);
        }
    });
}

// ===== Modal helpers =====
function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
}
function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
}

window.openDetailsModal = function(itemId) {
    const item = trackingData.find(i => i.id === itemId);
    if (!item) return;

    const outCls = getStatusClass(item.outboundStatus?.status);
    const inCls  = getStatusClass(item.inboundStatus?.status);

    document.getElementById('detailsContent').innerHTML = `
        <div class="flex flex-col gap-5">
            <div>
                <p class="text-xs font-semibold uppercase tracking-wider mb-1" style="color:var(--text-muted)">Ticket</p>
                <p class="font-semibold text-lg" style="color:var(--purple)">${escapeHtml(item.ticketNumber)}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="rounded-xl p-4" style="background:rgba(77,20,140,0.04);border:1px solid var(--border)">
                    <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color:var(--text-muted)">Outbound</p>
                    <p class="tracking-number text-sm mb-3">${escapeHtml(item.outboundTracking) || '—'}</p>
                    <span class="status-badge ${outCls}"><span class="status-dot"></span>${getStatusLabel(item.outboundStatus?.status)}</span>
                    ${buildProgressBar(item.outboundStatus?.status)}
                    ${item.outboundStatus?.details    ? `<p class="text-xs mt-3" style="color:var(--text-muted)">${escapeHtml(item.outboundStatus.details)}</p>` : ''}
                    ${item.outboundStatus?.lastLocation ? `<p class="text-xs mt-1" style="color:var(--text-muted)">📍 ${escapeHtml(item.outboundStatus.lastLocation)}</p>` : ''}
                    ${item.outboundStatus?.estimatedDelivery ? `<p class="text-xs mt-1" style="color:var(--text-muted)">📅 Est. ${escapeHtml(item.outboundStatus.estimatedDelivery)}</p>` : ''}
                </div>

                <div class="rounded-xl p-4" style="background:rgba(77,20,140,0.04);border:1px solid var(--border)">
                    <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color:var(--text-muted)">Inbound</p>
                    <p class="tracking-number text-sm mb-3">${item.inboundTracking ? escapeHtml(item.inboundTracking) : '—'}</p>
                    <span class="status-badge ${inCls}"><span class="status-dot"></span>${getStatusLabel(item.inboundStatus?.status)}</span>
                    ${buildProgressBar(item.inboundStatus?.status)}
                    ${item.inboundStatus?.details    ? `<p class="text-xs mt-3" style="color:var(--text-muted)">${escapeHtml(item.inboundStatus.details)}</p>` : ''}
                    ${item.inboundStatus?.lastLocation ? `<p class="text-xs mt-1" style="color:var(--text-muted)">📍 ${escapeHtml(item.inboundStatus.lastLocation)}</p>` : ''}
                    ${item.inboundStatus?.estimatedDelivery ? `<p class="text-xs mt-1" style="color:var(--text-muted)">📅 Est. ${escapeHtml(item.inboundStatus.estimatedDelivery)}</p>` : ''}
                </div>
            </div>

            <p class="text-xs" style="color:var(--text-muted)">Last updated: ${escapeHtml(item.lastUpdated) || 'Never'}</p>
        </div>
    `;
    openModal('detailsModal');
};

window.openCopyModal = function(itemId) {
    const item = trackingData.find(i => i.id === itemId);
    if (!item) return;
    const text = [
        `Ticket: ${item.ticketNumber}`,
        `Outbound Tracking: ${item.outboundTracking || 'N/A'}`,
        `Outbound Status: ${item.outboundStatus?.status || 'N/A'}`,
        `Inbound Tracking: ${item.inboundTracking || 'N/A'}`,
        `Inbound Status: ${item.inboundStatus?.status || 'N/A'}`,
        `Last Updated: ${item.lastUpdated || 'Never'}`,
    ].join('\n');
    document.getElementById('copyText').value = text;
    openModal('copyModal');
};

window.openDeleteModal = function(itemId) {
    const item = trackingData.find(i => i.id === itemId);
    if (!item) return;
    document.getElementById('deleteTicketNumber').textContent = item.ticketNumber;
    document.getElementById('confirmDeleteBtn').dataset.id = itemId;
    openModal('deleteModal');
};

// ===== Toast =====
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const msg   = document.getElementById('toastMessage');
    const icon  = document.getElementById('toastIcon');
    if (!toast || !msg) return;

    msg.textContent = message;
    toast.className = toast.className.replace(/toast-\w+/g, '').trim();
    toast.classList.add('toast-' + type);

    const icons = {
        success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>',
        error:   '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>',
        info:    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    };
    if (icon) icon.innerHTML = icons[type] || icons.info;

    toast.classList.remove('translate-y-20','opacity-0');
    toast.classList.add('translate-y-0','opacity-100');

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.add('translate-y-20','opacity-0');
        toast.classList.remove('translate-y-0','opacity-100');
    }, 2800);
}

// ===== Status simulation (no real API) =====
const SIMULATED_STATUSES = [
    { status: 'Delivered',        details: 'Package delivered',                    lastLocation: 'Destination City' },
    { status: 'In Transit',       details: 'Package in transit to next facility',  lastLocation: 'FedEx Hub'        },
    { status: 'Out for Delivery', details: 'On FedEx vehicle for delivery today',  lastLocation: 'Local Facility'   },
    { status: 'Pending',          details: 'Shipment information sent to FedEx',   lastLocation: 'N/A'              },
    { status: 'Exception',        details: 'Delivery exception — action required', lastLocation: 'Last Known'       },
];

function simulateStatusForTracking(tracking) {
    if (!tracking) return { status: 'N/A', details: 'No tracking provided', lastLocation: 'N/A', estimatedDelivery: 'N/A' };
    const seed = tracking.split('').reduce((a,c) => a + c.charCodeAt(0), 0);
    const s = SIMULATED_STATUSES[seed % SIMULATED_STATUSES.length];
    const days = (seed % 5) + 1;
    const est  = new Date(Date.now() + days * 86400000);
    return {
        ...s,
        estimatedDelivery: est.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })
    };
}

function simulateRefresh() {
    trackingData = trackingData.map(item => ({
        ...item,
        outboundStatus: item.outboundTracking ? simulateStatusForTracking(item.outboundTracking) : { status: 'N/A', details: 'No tracking', lastLocation: 'N/A', estimatedDelivery: 'N/A' },
        inboundStatus:  item.inboundTracking  ? simulateStatusForTracking(item.inboundTracking)  : { status: 'N/A', details: 'No tracking', lastLocation: 'N/A', estimatedDelivery: 'N/A' },
        lastUpdated: new Date().toLocaleString(),
    }));
}

// ===== Excel Import =====
function parseExcelFile(file, append) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const wb   = XLSX.read(data, { type: 'array' });
            const ws   = wb.Sheets[wb.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

            if (rows.length < 2) throw new Error('File appears empty or has no data rows.');

            const header = rows[0].map(c => String(c).trim().toLowerCase());
            const ticketIdx   = header.findIndex(h => h.includes('ticket'));
            const outboundIdx = header.findIndex(h => h.includes('outbound'));
            const inboundIdx  = header.findIndex(h => h.includes('inbound'));

            if (ticketIdx === -1 || outboundIdx === -1) {
                throw new Error('Could not find required columns. Expected: "Ticket Number", "Outbound Tracking", and optionally "Inbound Tracking".');
            }

            const imported = rows.slice(1).filter(r => r[ticketIdx] || r[outboundIdx]).map(r => {
                const outTracking = String(r[outboundIdx] || '').trim();
                const inTracking  = inboundIdx !== -1 ? String(r[inboundIdx] || '').trim() : '';
                return {
                    id: generateId(),
                    ticketNumber:     String(r[ticketIdx] || '').trim(),
                    outboundTracking: outTracking,
                    inboundTracking:  inTracking,
                    outboundStatus:   outTracking ? simulateStatusForTracking(outTracking) : { status:'N/A', details:'No tracking', lastLocation:'N/A', estimatedDelivery:'N/A' },
                    inboundStatus:    inTracking  ? simulateStatusForTracking(inTracking)  : { status:'N/A', details:'No tracking', lastLocation:'N/A', estimatedDelivery:'N/A' },
                    lastUpdated:      new Date().toLocaleString(),
                };
            });

            if (imported.length === 0) throw new Error('No valid data rows found in the file.');

            if (append) {
                const existingTickets = new Set(trackingData.map(i => i.ticketNumber));
                const newItems = imported.filter(i => !existingTickets.has(i.ticketNumber));
                trackingData = [...trackingData, ...newItems];
                showToast(`Appended ${newItems.length} new shipments`, 'success');
            } else {
                trackingData = imported;
                showToast(`Imported ${imported.length} shipments`, 'success');
            }

            applyFiltersAndSort();
            updateActiveFiltersDisplay();
            updateTrackingDisplay();
            saveToLocalStorage();
            updateLastUpdatedDisplay();

        } catch(err) {
            document.getElementById('importErrorMessage').textContent = 'Failed to import the file.';
            document.getElementById('importErrorDetails').textContent = err.message;
            openModal('importErrorModal');
        }
    };
    reader.onerror = () => {
        document.getElementById('importErrorMessage').textContent = 'Failed to read the file.';
        document.getElementById('importErrorDetails').textContent = 'The file could not be read. Please try again.';
        openModal('importErrorModal');
    };
    reader.readAsArrayBuffer(file);
}

// ===== Export =====
function convertToCSV(data) {
    const headers = ['Ticket Number','Outbound Tracking','Outbound Status','Inbound Tracking','Inbound Status','Last Updated'];
    const esc = v => `"${String(v ?? '').replace(/"/g,'""')}"`;
    const rows = data.map(item => [
        item.ticketNumber       || '',
        item.outboundTracking   || '',
        item.outboundStatus?.status || 'N/A',
        item.inboundTracking    || 'N/A',
        item.inboundStatus?.status  || 'N/A',
        item.lastUpdated        || 'Never',
    ]);
    return [headers, ...rows].map(r => r.map(esc).join(',')).join('\n');
}

function exportToExcel(data, fileName) {
    const rows = data.map(item => ({
        'Ticket Number':    item.ticketNumber       ?? '',
        'Outbound Tracking':item.outboundTracking   ?? '',
        'Outbound Status':  item.outboundStatus?.status ?? 'N/A',
        'Inbound Tracking': item.inboundTracking    ?? 'N/A',
        'Inbound Status':   item.inboundStatus?.status  ?? 'N/A',
        'Last Updated':     item.lastUpdated        ?? 'Never',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tracking');
    XLSX.writeFile(wb, fileName || 'fedex_tracking_data.xlsx');
}

function downloadFile(content, fileName, mimeType) {
    try {
        const blob = new Blob([content], { type: mimeType });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.style.display = 'none';
        a.href     = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
        return true;
    } catch(e) {
        console.error('Download failed:', e);
        return false;
    }
}

// ===== localStorage =====
function saveToLocalStorage() {
    try {
        localStorage.setItem('fedexTrackingData', JSON.stringify(trackingData));
        localStorage.setItem('fedexLastUpdated', new Date().toLocaleString());
    } catch(e) { console.error('Save failed:', e); }
}

function saveFiltersToLocalStorage() {
    try {
        localStorage.setItem('fedexFilters', JSON.stringify(activeFiltersList));
        localStorage.setItem('fedexSort', JSON.stringify({ field: currentSortField, direction: currentSortDirection }));
    } catch(e) {}
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('fedexTrackingData');
        if (saved) {
            const parsed = JSON.parse(saved);
            trackingData = Array.isArray(parsed) ? parsed : [];
        }
        const savedFilters = localStorage.getItem('fedexFilters');
        if (savedFilters) activeFiltersList = JSON.parse(savedFilters) || [];
        const savedSort = localStorage.getItem('fedexSort');
        if (savedSort) {
            const s = JSON.parse(savedSort);
            currentSortField     = s?.field     || null;
            currentSortDirection = s?.direction || null;
        }
    } catch(e) { console.error('Load failed:', e); }
}

function updateLastUpdatedDisplay() {
    const el = document.getElementById('lastUpdated');
    if (el) {
        const ts = localStorage.getItem('fedexLastUpdated') || new Date().toLocaleString();
        el.textContent = 'Last updated: ' + ts;
    }
}

// ===== Dark mode =====
function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    const sun  = document.getElementById('themeIconSun');
    const moon = document.getElementById('themeIconMoon');
    const lbl  = document.getElementById('themeLabel');
    if (sun)  sun.style.display  = dark ? 'none'  : '';
    if (moon) moon.style.display = dark ? ''      : 'none';
    if (lbl)  lbl.textContent    = dark ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('fedexTheme', dark ? 'dark' : 'light');
}

// ===== Sticky header =====
function initScrollHeader() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', function() {

    // Theme init
    const savedTheme = localStorage.getItem('fedexTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark);

    document.getElementById('themeToggle')?.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        applyTheme(!isDark);
    });

    initScrollHeader();

    // Load persisted data
    loadFromLocalStorage();
    applyFiltersAndSort();
    updateActiveFiltersDisplay();
    updateSortIcons();
    updateTrackingDisplay();
    updateLastUpdatedDisplay();

    // Import
    document.getElementById('importBtn')?.addEventListener('click', () => {
        const file = document.getElementById('fileInput')?.files[0];
        if (!file) { showToast('Please select a file first', 'error'); return; }
        parseExcelFile(file, false);
    });

    document.getElementById('appendBtn')?.addEventListener('click', () => {
        const file = document.getElementById('fileInput')?.files[0];
        if (!file) { showToast('Please select a file first', 'error'); return; }
        parseExcelFile(file, true);
    });

    // Sample data
    document.getElementById('loadSampleBtn')?.addEventListener('click', () => {
        trackingData = SAMPLE_DATA.map(d => ({ ...d }));
        activeFiltersList   = [];
        currentSortField    = null;
        currentSortDirection = null;
        applyFiltersAndSort();
        updateActiveFiltersDisplay();
        updateSortIcons();
        updateTrackingDisplay();
        saveToLocalStorage();
        updateLastUpdatedDisplay();
        showToast('Sample data loaded — 12 shipments', 'success');
    });

    // Refresh
    document.getElementById('refreshBtn')?.addEventListener('click', () => {
        if (isRefreshing || trackingData.length === 0) return;
        isRefreshing = true;

        const icon = document.getElementById('refreshIcon');
        if (icon) icon.style.animation = 'spin 0.8s linear infinite';
        const styleEl = document.createElement('style');
        styleEl.textContent = '@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}';
        document.head.appendChild(styleEl);

        const tbody = document.getElementById('trackingResults');
        if (tbody) tbody.innerHTML = renderSkeletonRows(Math.min(trackingData.length, 6));

        setTimeout(() => {
            simulateRefresh();
            applyFiltersAndSort();
            updateTrackingDisplay();
            saveToLocalStorage();
            updateLastUpdatedDisplay();
            if (icon) icon.style.animation = '';
            document.head.removeChild(styleEl);
            isRefreshing = false;
            showToast('Status refreshed', 'success');
        }, 1400);
    });

    // Clear
    document.getElementById('clearBtn')?.addEventListener('click', () => openModal('clearModal'));
    document.getElementById('closeClearModal')?.addEventListener('click',  () => closeModal('clearModal'));
    document.getElementById('cancelClearBtn')?.addEventListener('click',   () => closeModal('clearModal'));
    document.getElementById('clearModalBackdrop')?.addEventListener('click', () => closeModal('clearModal'));
    document.getElementById('confirmClearBtn')?.addEventListener('click',  () => {
        trackingData = [];
        displayData  = [];
        activeFiltersList   = [];
        currentSortField    = null;
        currentSortDirection = null;
        localStorage.removeItem('fedexTrackingData');
        localStorage.removeItem('fedexFilters');
        localStorage.removeItem('fedexSort');
        updateActiveFiltersDisplay();
        updateSortIcons();
        updateTrackingDisplay();
        closeModal('clearModal');
        showToast('All data cleared', 'info');
    });

    // Delete
    document.getElementById('closeDeleteModal')?.addEventListener('click',   () => closeModal('deleteModal'));
    document.getElementById('cancelDeleteBtn')?.addEventListener('click',    () => closeModal('deleteModal'));
    document.getElementById('deleteModalBackdrop')?.addEventListener('click',() => closeModal('deleteModal'));
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', function() {
        const id = this.dataset.id;
        trackingData = trackingData.filter(i => i.id !== id);
        applyFiltersAndSort();
        updateTrackingDisplay();
        saveToLocalStorage();
        closeModal('deleteModal');
        showToast('Shipment removed', 'info');
    });

    // Copy modal
    document.getElementById('closeModal')?.addEventListener('click',       () => closeModal('copyModal'));
    document.getElementById('copyModalBackdrop')?.addEventListener('click',() => closeModal('copyModal'));
    document.getElementById('modalCopyBtn')?.addEventListener('click', async () => {
        const text = document.getElementById('copyText')?.value;
        try {
            await navigator.clipboard.writeText(text);
            showToast('Copied to clipboard', 'success');
        } catch(e) {
            document.getElementById('copyText')?.select();
            document.execCommand('copy');
            showToast('Copied to clipboard', 'success');
        }
        closeModal('copyModal');
    });

    // Details modal
    document.getElementById('closeDetailsModal')?.addEventListener('click',   () => closeModal('detailsModal'));
    document.getElementById('closeDetailsBtn')?.addEventListener('click',     () => closeModal('detailsModal'));
    document.getElementById('detailsModalBackdrop')?.addEventListener('click',() => closeModal('detailsModal'));

    // Import error modal
    document.getElementById('closeImportErrorModal')?.addEventListener('click', () => closeModal('importErrorModal'));
    document.getElementById('closeImportErrorBtn')?.addEventListener('click',   () => closeModal('importErrorModal'));
    document.getElementById('importErrorModalBackdrop')?.addEventListener('click', () => closeModal('importErrorModal'));

    // Export
    document.getElementById('exportDropdownBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('exportDropdown')?.classList.toggle('show');
    });

    document.getElementById('exportCsvBtn')?.addEventListener('click', () => {
        if (!trackingData.length) { showToast('No data to export', 'error'); return; }
        downloadFile(convertToCSV(trackingData), 'fedex_tracking_data.csv', 'text/csv;charset=utf-8;');
        document.getElementById('exportDropdown')?.classList.remove('show');
        showToast('CSV downloaded', 'success');
    });

    document.getElementById('exportXlsxBtn')?.addEventListener('click', () => {
        if (!trackingData.length) { showToast('No data to export', 'error'); return; }
        exportToExcel(trackingData, 'fedex_tracking_data.xlsx');
        document.getElementById('exportDropdown')?.classList.remove('show');
        showToast('Excel file downloaded', 'success');
    });

    // Filter dropdown
    document.getElementById('filterDropdownBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('filterDropdown')?.classList.toggle('show');
    });

    document.getElementById('filterDropdown')?.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const f = item.dataset.filter;
            document.getElementById('filterDropdown')?.classList.remove('show');

            if (f === 'show-all') {
                activeFiltersList   = [];
                currentSortField    = null;
                currentSortDirection = null;
                updateSortIcons();
            } else if (f.startsWith('sort-')) {
                activeFiltersList = activeFiltersList.filter(x => !x.startsWith('sort-'));
                activeFiltersList.push(f);
            } else {
                if (!activeFiltersList.includes(f)) activeFiltersList.push(f);
            }

            applyFiltersAndSort();
            updateActiveFiltersDisplay();
            updateTrackingDisplay();
            saveFiltersToLocalStorage();
        });
    });

    // Sort headers (column click)
    document.querySelectorAll('.sort-header').forEach(btn => {
        btn.addEventListener('click', () => {
            const field = btn.dataset.sort;
            if (currentSortField === field) {
                if (currentSortDirection === 'asc')  currentSortDirection = 'desc';
                else if (currentSortDirection === 'desc') { currentSortField = null; currentSortDirection = null; }
            } else {
                currentSortField     = field;
                currentSortDirection = 'asc';
            }
            updateSortIcons();
            applyFiltersAndSort();
            updateTrackingDisplay();
            saveFiltersToLocalStorage();
        });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
        document.getElementById('exportDropdown')?.classList.remove('show');
        document.getElementById('filterDropdown')?.classList.remove('show');
    });

    // ESC closes modals
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            ['copyModal','detailsModal','clearModal','deleteModal','importErrorModal'].forEach(closeModal);
        }
    });

    // Expose globals used by inline onclick attributes
    window.showToast            = showToast;
    window.saveToLocalStorage   = saveToLocalStorage;
    window.saveFiltersToLocalStorage = saveFiltersToLocalStorage;
    window.exportToExcel        = exportToExcel;
});
