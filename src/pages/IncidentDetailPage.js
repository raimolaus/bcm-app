// Incident Detail Page - BCM App
// Displays detailed view of a single incident

import {
    loadIncident,
    calculateProgress,
    exportIncidentAsText
} from '../data/incidents.js';

let currentIncident = null;
let currentTab = 'overview';

export function initIncidentDetailPage() {
    console.log('Incident Detail Page initialized');
}

export function loadIncidentDetail(incidentId) {
    currentIncident = loadIncident(incidentId);

    if (!currentIncident) {
        console.error('Incident not found:', incidentId);
        alert('Intsidenti ei leitud!');
        if (window.goBack) window.goBack();
        return;
    }

    renderIncidentDetail();
}

function renderIncidentDetail() {
    if (!currentIncident) return;

    // Update title
    const titleEl = document.getElementById('incidentDetailTitle');
    if (titleEl) {
        titleEl.textContent = `${currentIncident.scenarioName} - ${currentIncident.id}`;
    }

    // Update badges
    updateBadges();

    // Update progress
    updateProgress();

    // Render current tab
    renderTab(currentTab);
}

function updateBadges() {
    const statusBadge = document.getElementById('incidentStatusBadge');
    const severityBadge = document.getElementById('incidentSeverityBadge');
    const typeBadge = document.getElementById('incidentTypeBadge');

    if (statusBadge) {
        statusBadge.textContent = getStatusText(currentIncident.status);
        statusBadge.className = `status-badge status-${currentIncident.status.toLowerCase()}`;
    }

    if (severityBadge && currentIncident.severity) {
        severityBadge.textContent = `${currentIncident.severity} ${getSeverityText(currentIncident.severity)}`;
        severityBadge.className = `severity-badge severity-${currentIncident.severity.toLowerCase()}`;
        severityBadge.style.display = 'inline-block';
    } else if (severityBadge) {
        severityBadge.style.display = 'none';
    }

    if (typeBadge) {
        typeBadge.textContent = currentIncident.isExercise ? '🎓 ÕPPUS' : '⚠️ PÄRIS';
        typeBadge.className = `type-badge ${currentIncident.isExercise ? 'type-exercise' : 'type-real'}`;
    }
}

function updateProgress() {
    const progressFill = document.getElementById('incidentProgressFill');
    const progressText = document.getElementById('incidentProgressText');
    const progressSteps = document.getElementById('incidentProgressSteps');

    const progress = calculateProgress(currentIncident);

    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }

    if (progressText) {
        progressText.textContent = `${progress}% valmis`;
    }

    if (progressSteps) {
        const quick = currentIncident.checklistProgress.quickActions;
        const plan = currentIncident.checklistProgress.actionPlan;
        const total = quick.completed + plan.completed;
        const max = quick.total + plan.total;
        progressSteps.textContent = `${total}/${max} sammud`;
    }
}

export function switchTab(tabName) {
    currentTab = tabName;

    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });

    renderTab(tabName);
}

function renderTab(tabName) {
    const content = document.getElementById('incidentTabContent');
    if (!content) return;

    switch (tabName) {
        case 'overview':
            content.innerHTML = renderOverviewTab();
            break;
        case 'timeline':
            content.innerHTML = renderTimelineTab();
            break;
        case 'checklist':
            content.innerHTML = renderChecklistTab();
            break;
        case 'notifications':
            content.innerHTML = renderNotificationsTab();
            break;
        default:
            content.innerHTML = '<p>Tab sisu tuleb varsti...</p>';
    }
}

function renderOverviewTab() {
    // Determine if fields can be edited
    const isClosed = currentIncident.status === 'CLOSED';
    const isPreview = checkIfPreviewMode();
    const canEdit = !isClosed && !isPreview;

    return `
        <div class="incident-overview-grid">
            <div class="overview-section">
                <h3>📊 Põhiinfo</h3>
                <div class="overview-item">
                    <label class="overview-label">t0 (Tuvastamine):</label>
                    <input type="datetime-local"
                           id="detailT0"
                           class="overview-input"
                           value="${currentIncident.t0 ? new Date(currentIncident.t0).toISOString().slice(0, 16) : ''}"
                           ${canEdit ? '' : 'disabled'}>
                </div>
                <div class="overview-item">
                    <label class="overview-label">Incident Commander:</label>
                    <input type="text"
                           id="detailCommander"
                           class="overview-input"
                           value="${currentIncident.incidentCommander || ''}"
                           placeholder="Nimi"
                           ${canEdit ? '' : 'disabled'}>
                </div>
                <div class="overview-item">
                    <span class="overview-label">Tüüp:</span>
                    <span class="overview-value">${currentIncident.type === 'CYBER' ? 'Küberintsident' : 'Füüsiline'}</span>
                </div>
                <div class="overview-item">
                    <span class="overview-label">Õppus:</span>
                    <span class="overview-value">${currentIncident.isExercise ? '🎓 Jah' : '⚠️ Ei'}</span>
                </div>
            </div>

            ${currentIncident.type === 'CYBER' ? `
            <div class="overview-section">
                <h3>💻 Mõju</h3>
                <div class="overview-item">
                    <label class="overview-label">Mõjutatud süsteemid:</label>
                    <textarea id="detailAffectedSystems"
                              class="overview-textarea"
                              placeholder="Iga süsteem eraldi real"
                              ${canEdit ? '' : 'disabled'}>${currentIncident.impact?.affectedSystems?.join('\n') || ''}</textarea>
                </div>
                <div class="overview-item">
                    <label class="overview-label">
                        <input type="checkbox"
                               id="detailServiceInterruption"
                               ${currentIncident.impact?.serviceInterruption ? 'checked' : ''}
                               ${canEdit ? '' : 'disabled'}>
                        Teenuse katkestus
                    </label>
                </div>
                <div class="overview-item">
                    <label class="overview-label">
                        <input type="checkbox"
                               id="detailDataLeakSuspected"
                               ${currentIncident.impact?.dataLeakSuspected ? 'checked' : ''}
                               ${canEdit ? '' : 'disabled'}>
                        Andmeleke kahtlus
                    </label>
                </div>
            </div>
            ` : ''}

            <div class="overview-section">
                <h3>👥 Meeskond</h3>
                <div class="overview-item">
                    <label class="overview-label">Meeskonna liikmed:</label>
                    <textarea id="detailTeam"
                              class="overview-textarea"
                              placeholder="Iga liige eraldi real"
                              ${canEdit ? '' : 'disabled'}>${currentIncident.team?.join('\n') || ''}</textarea>
                </div>
            </div>

            <div class="overview-section">
                <h3>📝 Kokkuvõte</h3>
                <textarea id="detailSummary"
                          class="overview-textarea overview-textarea-large"
                          placeholder="Intsidendi kokkuvõte"
                          ${canEdit ? '' : 'disabled'}>${currentIncident.summary || ''}</textarea>
            </div>
        </div>

        ${canEdit ? `
        <div class="overview-actions">
            <button class="btn-primary" onclick="window.incidentDetailActions.saveDetail()">
                💾 SALVESTA
            </button>
        </div>
        ` : ''}

        ${isPreview ? `
        <div class="preview-warning">
            ⚠️ EELVAADE — Intsident pole avatud. Väljad on lukustatud.
        </div>
        ` : ''}

        ${isClosed && !isPreview ? `
        <div class="closed-info">
            🔒 Intsident on SULETUD. Väljad pole muudetavad.
        </div>
        ` : ''}
    `;
}

function renderTimelineTab() {
    const actions = currentIncident.actions || [];

    if (actions.length === 0) {
        return '<p class="empty-message">Timeline on tühi</p>';
    }

    return `
        <div class="timeline-list">
            ${actions.map(action => `
                <div class="timeline-item">
                    <div class="timeline-time">${formatDateTime(action.timestamp)}</div>
                    <div class="timeline-content">
                        <div class="timeline-user">👤 ${action.user}</div>
                        <div class="timeline-action">${action.action}</div>
                        <div class="timeline-category">${action.category}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderChecklistTab() {
    const quick = currentIncident.checklistProgress?.quickActions || { completed: 0, total: 0 };
    const plan = currentIncident.checklistProgress?.actionPlan || { completed: 0, total: 0 };

    return `
        <div class="checklist-section">
            <h3>⚡ Kiiretoimingud</h3>
            <div class="checklist-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${quick.total > 0 ? (quick.completed / quick.total * 100) : 0}%"></div>
                </div>
                <span>${quick.completed} / ${quick.total} tehtud</span>
            </div>
        </div>

        <div class="checklist-section">
            <h3>📋 Tegevuskava</h3>
            <div class="checklist-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${plan.total > 0 ? (plan.completed / plan.total * 100) : 0}%"></div>
                </div>
                <span>${plan.completed} / ${plan.total} tehtud</span>
            </div>
        </div>
    `;
}

function renderNotificationsTab() {
    const notifications = currentIncident.notifications || {};

    return `
        <div class="notifications-grid">
            ${renderNotificationItem('CERT-EE', notifications.certee)}
            ${renderNotificationItem('Andmekaitsespetsialist (DPO)', notifications.dpo)}
            ${renderNotificationItem('Juhtkond', notifications.management)}
        </div>
    `;
}

function renderNotificationItem(name, notification) {
    if (!notification) return '';

    const status = notification.notified ? '✅ Teavitatud' :
                   (notification.required ? '⏳ Ootel' : '➖ Pole vajalik');
    const statusClass = notification.notified ? 'notified' :
                       (notification.required ? 'pending' : 'not-required');

    return `
        <div class="notification-item ${statusClass}">
            <div class="notification-header">
                <span class="notification-title">${name}</span>
                <span class="notification-status ${statusClass}">${status}</span>
            </div>
            ${notification.notified ? `
                <div class="notification-details">
                    Aeg: ${formatDateTime(notification.timestamp)}<br>
                    Meetod: ${notification.method}
                </div>
            ` : ''}
        </div>
    `;
}

// Check if we're in preview mode
function checkIfPreviewMode() {
    // IncidentDetailPage ALWAYS loads incident from localStorage.
    // If we reached this point, the incident exists and is real (not preview).
    //
    // Preview mode is ONLY relevant for scenarioDetailPage (gate CANCEL flow),
    // where user clicks TÜHISTA and views scenario without creating incident.
    //
    // IncidentDetailPage is accessed via:
    // - Logs & Intsidendid (opens saved incident) -> NOT preview
    // - Direct navigation with incidentId -> NOT preview
    //
    // Therefore, in IncidentDetailPage context, preview mode is NEVER true.
    return false;
}

// Save incident detail changes
export function saveIncidentDetail() {
    if (!currentIncident) {
        alert('Viga: Intsidenti ei leitud!');
        return;
    }

    // Check if editing is allowed
    const isClosed = currentIncident.status === 'CLOSED';
    const isPreview = checkIfPreviewMode();

    if (isClosed) {
        alert('❌ SULETUD intsidenti ei saa muuta!');
        return;
    }

    if (isPreview) {
        alert('⚠️ Intsident pole avatud! Ava intsident enne muudatuste tegemist.');
        return;
    }

    // Collect data from form
    const t0Input = document.getElementById('detailT0');
    const commanderInput = document.getElementById('detailCommander');
    const summaryInput = document.getElementById('detailSummary');
    const teamInput = document.getElementById('detailTeam');

    // Update basic fields
    if (t0Input && t0Input.value) {
        currentIncident.t0 = new Date(t0Input.value).toISOString();
    }

    if (commanderInput) {
        currentIncident.incidentCommander = commanderInput.value.trim();
    }

    if (summaryInput) {
        currentIncident.summary = summaryInput.value.trim();
    }

    if (teamInput) {
        const teamText = teamInput.value.trim();
        currentIncident.team = teamText ? teamText.split('\n').map(m => m.trim()).filter(m => m) : [];
    }

    // Update impact fields (for cyber incidents)
    if (currentIncident.type === 'CYBER') {
        const affectedSystemsInput = document.getElementById('detailAffectedSystems');
        const serviceInterruptionInput = document.getElementById('detailServiceInterruption');
        const dataLeakInput = document.getElementById('detailDataLeakSuspected');

        if (!currentIncident.impact) {
            currentIncident.impact = {
                affectedSystems: [],
                serviceInterruption: false,
                dataLeakSuspected: false
            };
        }

        if (affectedSystemsInput) {
            const systemsText = affectedSystemsInput.value.trim();
            currentIncident.impact.affectedSystems = systemsText ? systemsText.split('\n').map(s => s.trim()).filter(s => s) : [];
        }

        if (serviceInterruptionInput) {
            currentIncident.impact.serviceInterruption = serviceInterruptionInput.checked;
        }

        if (dataLeakInput) {
            currentIncident.impact.dataLeakSuspected = dataLeakInput.checked;
        }
    }

    // Update timestamp
    currentIncident.updatedAt = new Date().toISOString();

    // Add timeline action
    currentIncident.actions.push({
        timestamp: new Date().toISOString(),
        user: 'Kasutaja',
        action: 'Intsidendi detailid uuendatud',
        category: 'UPDATE'
    });

    // Save to localStorage
    const { saveIncident } = window;
    if (saveIncident) {
        saveIncident(currentIncident);
    }

    // Update UI
    updateBadges();
    updateProgress();

    // Update home status and badge
    if (typeof window.updateHomeStatusAndList === 'function') {
        window.updateHomeStatusAndList();
    }
    if (typeof window.updateIncidentsBadge === 'function') {
        window.updateIncidentsBadge();
    }

    alert('✅ Muudatused salvestatud!');
    console.log('[DETAIL] Incident updated:', currentIncident.id);
}

// Helper functions
function getStatusText(status) {
    const texts = {
        'ACTIVE': 'AKTIIVNE',
        'CONTAINED': 'OHJELDATUD',
        'RESOLVED': 'LAHENDATUD',
        'CLOSED': 'SULETUD'
    };
    return texts[status] || status;
}

function getSeverityText(severity) {
    const texts = {
        'S0': 'KRIITILINE',
        'S1': 'KÕRGE',
        'S2': 'KESKMINE',
        'S3': 'MADAL'
    };
    return texts[severity] || '';
}

function formatDateTime(isoString) {
    if (!isoString) return 'Määramata';
    const date = new Date(isoString);
    return date.toLocaleString('et-EE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function exportCurrentIncident() {
    if (!currentIncident) return;

    const text = exportIncidentAsText(currentIncident);

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Incident_${currentIncident.id}_Export.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Intsident eksporditud!');
}

// FAAS2: Update incident status with reason
export function updateIncidentStatus() {
    if (!currentIncident) return;

    // Create modal dialog for status selection
    const existingDialog = document.getElementById('faas2StatusDialog');
    if (existingDialog) {
        existingDialog.remove();
    }

    const dialog = document.createElement('div');
    dialog.id = 'faas2StatusDialog';
    dialog.className = 'modal';
    dialog.style.display = 'flex';
    dialog.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>Muuda intsidendi staatust</h2>
            </div>
            <div class="modal-body">
                <p><strong>Praegune staatus:</strong> ${getStatusText(currentIncident.status)}</p>

                <div style="margin: 16px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Uus staatus:</label>
                    <select id="newStatusSelect" class="metric-select" style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #d1d5db;">
                        <option value="ACTIVE" ${currentIncident.status === 'ACTIVE' ? 'selected' : ''}>AKTIIVNE</option>
                        <option value="CONTAINED" ${currentIncident.status === 'CONTAINED' ? 'selected' : ''}>OHJELDATUD</option>
                        <option value="RESOLVED" ${currentIncident.status === 'RESOLVED' ? 'selected' : ''}>LAHENDATUD</option>
                        <option value="CLOSED" ${currentIncident.status === 'CLOSED' ? 'selected' : ''}>SULETUD</option>
                    </select>
                </div>

                <div style="margin: 16px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Põhjendus (kohustuslik, min 5 tähemärki):</label>
                    <textarea id="statusChangeReason" style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #d1d5db; min-height: 80px;" placeholder="Kirjelda, miks muudad staatust..."></textarea>
                    <p id="reasonError" style="color: #dc2626; font-size: 14px; margin-top: 4px; display: none;">Põhjendus peab olema vähemalt 5 tähemärki pikk</p>
                </div>

                <div class="modal-actions" style="margin-top: 24px;">
                    <button class="btn-primary" onclick="window.incidentDetailActions.confirmStatusChange()" style="flex: 1;">
                        Salvesta
                    </button>
                    <button class="btn-secondary" onclick="window.incidentDetailActions.cancelStatusChange()" style="flex: 1;">
                        Tühista
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
}

// Confirm status change
export function confirmStatusChange() {
    const newStatus = document.getElementById('newStatusSelect').value;
    const reason = document.getElementById('statusChangeReason').value.trim();
    const reasonError = document.getElementById('reasonError');

    // Validate reason
    if (reason.length < 5) {
        reasonError.style.display = 'block';
        return;
    }

    // Don't allow changing to same status
    if (newStatus === currentIncident.status) {
        alert('Uus staatus on sama mis praegune!');
        return;
    }

    // Update incident
    currentIncident.status = newStatus;
    currentIncident.updatedAt = new Date().toISOString();

    // Set timing fields based on status
    const now = new Date().toISOString();
    if (newStatus === 'CONTAINED' && !currentIncident.tContainment) {
        currentIncident.tContainment = now;
    } else if (newStatus === 'RESOLVED' && !currentIncident.tResolution) {
        currentIncident.tResolution = now;
    } else if (newStatus === 'CLOSED' && !currentIncident.tClosed) {
        currentIncident.tClosed = now;
    }

    // Add timeline action
    currentIncident.actions.push({
        timestamp: now,
        user: 'Kasutaja',
        action: `Staatus muudetud: ${getStatusText(currentIncident.status)} - ${reason}`,
        category: 'STATUS_CHANGE'
    });

    // Save to localStorage
    const { saveIncident } = window;
    if (saveIncident) {
        saveIncident(currentIncident);
    }

    // Close dialog
    const dialog = document.getElementById('faas2StatusDialog');
    if (dialog) {
        dialog.remove();
    }

    // FAAS2 RESTORE: Update home status and badge
    if (typeof window.updateHomeStatusAndList === 'function') {
        window.updateHomeStatusAndList();
    }
    if (typeof window.updateIncidentsBadge === 'function') {
        window.updateIncidentsBadge();
    }

    // Re-render incident detail
    renderIncidentDetail();

    console.log(`[FAAS2] Status changed to ${newStatus}: ${reason}`);
}

// Cancel status change
export function cancelStatusChange() {
    const dialog = document.getElementById('faas2StatusDialog');
    if (dialog) {
        dialog.remove();
    }
}

// FAAS2: Close incident with confirmation and reason
export function closeIncident() {
    if (!currentIncident) return;

    // Create confirmation dialog
    const existingDialog = document.getElementById('faas2CloseDialog');
    if (existingDialog) {
        existingDialog.remove();
    }

    const dialog = document.createElement('div');
    dialog.id = 'faas2CloseDialog';
    dialog.className = 'modal';
    dialog.style.display = 'flex';
    dialog.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>Sulge intsident</h2>
            </div>
            <div class="modal-body">
                <p><strong>Intsident:</strong> ${currentIncident.scenarioName}</p>
                <p><strong>ID:</strong> ${currentIncident.id}</p>

                <div style="margin: 16px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Põhjendus sulgemiseks (kohustuslik, min 5 tähemärki):</label>
                    <textarea id="closeReason" style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #d1d5db; min-height: 80px;" placeholder="Kirjelda, miks sulged intsidendi..."></textarea>
                    <p id="closeReasonError" style="color: #dc2626; font-size: 14px; margin-top: 4px; display: none;">Põhjendus peab olema vähemalt 5 tähemärki pikk</p>
                </div>

                <p style="font-size: 14px; color: #6b7280; margin-top: 16px;">
                    Kas oled kindel, et soovid selle intsidendi sulgeda?
                </p>

                <div class="modal-actions" style="margin-top: 24px;">
                    <button class="btn-primary" onclick="window.incidentDetailActions.confirmClose()" style="flex: 1; background: #dc2626;">
                        Sulge intsident
                    </button>
                    <button class="btn-secondary" onclick="window.incidentDetailActions.cancelClose()" style="flex: 1;">
                        Tühista
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
}

// Confirm close
export function confirmClose() {
    const reason = document.getElementById('closeReason').value.trim();
    const reasonError = document.getElementById('closeReasonError');

    // Validate reason
    if (reason.length < 5) {
        reasonError.style.display = 'block';
        return;
    }

    // Update incident
    const now = new Date().toISOString();
    currentIncident.status = 'CLOSED';
    currentIncident.tClosed = now;
    currentIncident.updatedAt = now;

    // Add timeline action
    currentIncident.actions.push({
        timestamp: now,
        user: 'Kasutaja',
        action: `Intsident suletud: ${reason}`,
        category: 'CLOSURE'
    });

    // Save to localStorage
    const { saveIncident } = window;
    if (saveIncident) {
        saveIncident(currentIncident);
    }

    // Close dialog
    const dialog = document.getElementById('faas2CloseDialog');
    if (dialog) {
        dialog.remove();
    }

    // FAAS2 RESTORE: Update home status and badge
    if (typeof window.updateHomeStatusAndList === 'function') {
        window.updateHomeStatusAndList();
    }
    if (typeof window.updateIncidentsBadge === 'function') {
        window.updateIncidentsBadge();
    }

    alert('Intsident suletud!');

    // Navigate back to incidents list
    if (window.goBack) {
        window.goBack();
    }

    console.log(`[FAAS2] Incident closed: ${reason}`);
}

// Cancel close
export function cancelClose() {
    const dialog = document.getElementById('faas2CloseDialog');
    if (dialog) {
        dialog.remove();
    }
}

// Incident detail actions (exposed globally)
export const incidentDetailActions = {
    loadIncident: loadIncidentDetail,
    switchTab: switchTab,
    exportCurrent: exportCurrentIncident,
    updateStatus: updateIncidentStatus,
    confirmStatusChange: confirmStatusChange,
    cancelStatusChange: cancelStatusChange,
    closeIncident: closeIncident,
    confirmClose: confirmClose,
    cancelClose: cancelClose,
    saveDetail: saveIncidentDetail
};

console.log('IncidentDetailPage.js loaded');
