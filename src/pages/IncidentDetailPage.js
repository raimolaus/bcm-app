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
        alert(window.t('incident.notFound'));
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
        typeBadge.textContent = currentIncident.isExercise ? '🎓 ' + window.t('incident.type.exercise') : '⚠️ ' + window.t('incident.type.real');
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
        progressText.textContent = window.t('incident.progress', { progress });
    }

    if (progressSteps) {
        const quick = currentIncident.checklistProgress.quickActions;
        const plan = currentIncident.checklistProgress.actionPlan;
        const total = quick.completed + plan.completed;
        const max = quick.total + plan.total;
        progressSteps.textContent = window.t('incident.progressSteps', { completed: total, total: max });
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
            content.innerHTML = `<p>${window.t('incident.tab.coming')}</p>`;
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
                <h3>${window.t('incident.overview.basicInfo')}</h3>
                <div class="overview-item">
                    <label class="overview-label">${window.t('incident.overview.t0')}</label>
                    <input type="datetime-local"
                           id="detailT0"
                           class="overview-input"
                           value="${currentIncident.t0 ? new Date(currentIncident.t0).toISOString().slice(0, 16) : ''}"
                           ${canEdit ? '' : 'disabled'}>
                </div>
                <div class="overview-item">
                    <label class="overview-label">${window.t('incident.overview.commander')}</label>
                    <input type="text"
                           id="detailCommander"
                           class="overview-input"
                           value="${currentIncident.incidentCommander || ''}"
                           placeholder="${window.t('common.name')}"
                           ${canEdit ? '' : 'disabled'}>
                </div>
                <div class="overview-item">
                    <span class="overview-label">${window.t('incident.overview.type')}</span>
                    <span class="overview-value">${currentIncident.type === 'CYBER' ? window.t('incident.type.cyberFull') : window.t('incident.type.physicalFull')}</span>
                </div>
                <div class="overview-item">
                    <span class="overview-label">${window.t('incident.overview.exercise')}</span>
                    <span class="overview-value">${currentIncident.isExercise ? '🎓 ' + window.t('common.yes') : '⚠️ ' + window.t('common.no')}</span>
                </div>
            </div>

            ${currentIncident.type === 'CYBER' ? `
            <div class="overview-section">
                <h3>${window.t('incident.overview.impact')}</h3>
                <div class="overview-item">
                    <label class="overview-label">${window.t('incident.overview.affectedSystems')}</label>
                    <textarea id="detailAffectedSystems"
                              class="overview-textarea"
                              placeholder="${window.t('incident.overview.affectedSystemsPlaceholder')}"
                              ${canEdit ? '' : 'disabled'}>${currentIncident.impact?.affectedSystems?.join('\n') || ''}</textarea>
                </div>
                <div class="overview-item">
                    <label class="overview-label">
                        <input type="checkbox"
                               id="detailServiceInterruption"
                               ${currentIncident.impact?.serviceInterruption ? 'checked' : ''}
                               ${canEdit ? '' : 'disabled'}>
                        ${window.t('incident.overview.disruption')}
                    </label>
                </div>
                <div class="overview-item">
                    <label class="overview-label">
                        <input type="checkbox"
                               id="detailDataLeakSuspected"
                               ${currentIncident.impact?.dataLeakSuspected ? 'checked' : ''}
                               ${canEdit ? '' : 'disabled'}>
                        ${window.t('incident.overview.dataBreach')}
                    </label>
                </div>
            </div>
            ` : ''}

            <div class="overview-section">
                <h3>${window.t('incident.detail.team')}</h3>
                <div class="overview-item">
                    <label class="overview-label">${window.t('incident.detail.teamMembers')}</label>
                    <textarea id="detailTeam"
                              class="overview-textarea"
                              placeholder="${window.t('incident.detail.teamPlaceholder')}"
                              ${canEdit ? '' : 'disabled'}>${currentIncident.team?.join('\n') || ''}</textarea>
                </div>
            </div>

            <div class="overview-section">
                <h3>${window.t('incident.detail.summary')}</h3>
                <textarea id="detailSummary"
                          class="overview-textarea overview-textarea-large"
                          placeholder="${window.t('incident.detail.summaryPlaceholder')}"
                          ${canEdit ? '' : 'disabled'}>${currentIncident.summary || ''}</textarea>
            </div>
        </div>

        ${canEdit ? `
        <div class="overview-actions">
            <button class="btn-primary" onclick="window.incidentDetailActions.saveDetail()">
                ${window.t('incident.save')}
            </button>
        </div>
        ` : ''}

        ${isPreview ? `
        <div class="preview-warning">
            ${window.t('incident.detail.previewWarning')}
        </div>
        ` : ''}

        ${isClosed && !isPreview ? `
        <div class="closed-info">
            ${window.t('incident.detail.closedInfo')}
        </div>
        ` : ''}
    `;
}

function renderTimelineTab() {
    const actions = currentIncident.actions || [];

    if (actions.length === 0) {
        return `<p class="empty-message">${window.t('incident.detail.timelineEmpty')}</p>`;
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
            <h3>${window.t('incident.quickActions.title')}</h3>
            <div class="checklist-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${quick.total > 0 ? (quick.completed / quick.total * 100) : 0}%"></div>
                </div>
                <span>${window.t('incident.detail.done', { completed: quick.completed, total: quick.total })}</span>
            </div>
        </div>

        <div class="checklist-section">
            <h3>${window.t('incident.actionPlan.title')}</h3>
            <div class="checklist-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${plan.total > 0 ? (plan.completed / plan.total * 100) : 0}%"></div>
                </div>
                <span>${window.t('incident.detail.done', { completed: plan.completed, total: plan.total })}</span>
            </div>
        </div>
    `;
}

function renderNotificationsTab() {
    const notifications = currentIncident.notifications || {};

    return `
        <div class="notifications-grid">
            ${renderNotificationItem('CERT-EE', notifications.certee)}
            ${renderNotificationItem(window.t('incident.detail.dpo'), notifications.dpo)}
            ${renderNotificationItem(window.t('incident.metrics.notification.management'), notifications.management)}
        </div>
    `;
}

function renderNotificationItem(name, notification) {
    if (!notification) return '';

    const status = notification.notified ? window.t('incident.detail.notifiedStatus') :
                   (notification.required ? window.t('incident.detail.pendingStatus') : window.t('incident.detail.notRequiredStatus'));
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
                    ${window.t('incident.detail.notifTime')} ${formatDateTime(notification.timestamp)}<br>
                    ${window.t('incident.detail.notifMethod')} ${notification.method}
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
        alert(window.t('incident.detail.alertNotFound'));
        return;
    }

    // Check if editing is allowed
    const isClosed = currentIncident.status === 'CLOSED';
    const isPreview = checkIfPreviewMode();

    if (isClosed) {
        alert(window.t('incident.detail.alertCannotEditClosed'));
        return;
    }

    if (isPreview) {
        alert(window.t('incident.detail.alertNotOpen'));
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
        user: window.t('incident.detail.user'),
        action: window.t('incident.detail.actionDetailUpdated'),
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

    alert(window.t('incident.detail.alertSaved'));
    console.log('[DETAIL] Incident updated:', currentIncident.id);
}

// Helper functions
function getStatusText(status) {
    const keys = {
        'ACTIVE': 'active',
        'CONTAINED': 'contained',
        'RESOLVED': 'resolved',
        'CLOSED': 'closed'
    };
    return keys[status] ? window.t(`incident.status.${keys[status]}`) : status;
}

function getSeverityText(severity) {
    const keys = {
        'S0': 'critical',
        'S1': 'high',
        'S2': 'medium',
        'S3': 'low'
    };
    return keys[severity] ? window.t(`incident.severity.${keys[severity]}`) : '';
}

function formatDateTime(isoString) {
    if (!isoString) return window.t('common.undefined');
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

    alert(window.t('incident.detail.alertExported'));
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
                <h2>${window.t('incident.detail.statusDialogTitle')}</h2>
            </div>
            <div class="modal-body">
                <p><strong>${window.t('incident.detail.currentStatus')}</strong> ${getStatusText(currentIncident.status)}</p>

                <div style="margin: 16px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">${window.t('incident.detail.newStatus')}</label>
                    <select id="newStatusSelect" class="metric-select" style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #d1d5db;">
                        <option value="ACTIVE" ${currentIncident.status === 'ACTIVE' ? 'selected' : ''}>${window.t('incident.status.active')}</option>
                        <option value="CONTAINED" ${currentIncident.status === 'CONTAINED' ? 'selected' : ''}>${window.t('incident.status.contained')}</option>
                        <option value="RESOLVED" ${currentIncident.status === 'RESOLVED' ? 'selected' : ''}>${window.t('incident.status.resolved')}</option>
                        <option value="CLOSED" ${currentIncident.status === 'CLOSED' ? 'selected' : ''}>${window.t('incident.status.closed')}</option>
                    </select>
                </div>

                <div style="margin: 16px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">${window.t('incident.detail.statusReason')}</label>
                    <textarea id="statusChangeReason" style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #d1d5db; min-height: 80px;" placeholder="${window.t('incident.detail.statusReasonPlaceholder')}"></textarea>
                    <p id="reasonError" style="color: #dc2626; font-size: 14px; margin-top: 4px; display: none;">${window.t('incident.detail.reasonError')}</p>
                </div>

                <div class="modal-actions" style="margin-top: 24px;">
                    <button class="btn-primary" onclick="window.incidentDetailActions.confirmStatusChange()" style="flex: 1;">
                        ${window.t('common.save')}
                    </button>
                    <button class="btn-secondary" onclick="window.incidentDetailActions.cancelStatusChange()" style="flex: 1;">
                        ${window.t('common.cancel')}
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
        alert(window.t('incident.detail.sameStatus'));
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
        user: window.t('incident.detail.user'),
        action: window.t('incident.detail.actionStatusChanged', { status: getStatusText(currentIncident.status), reason }),
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
                <h2>${window.t('incident.detail.closeDialogTitle')}</h2>
            </div>
            <div class="modal-body">
                <p><strong>${window.t('incident.detail.incidentLabel')}</strong> ${currentIncident.scenarioName}</p>
                <p><strong>${window.t('incident.detail.idLabel')}</strong> ${currentIncident.id}</p>

                <div style="margin: 16px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">${window.t('incident.detail.closeReason')}</label>
                    <textarea id="closeReason" style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #d1d5db; min-height: 80px;" placeholder="${window.t('incident.detail.closeReasonPlaceholder')}"></textarea>
                    <p id="closeReasonError" style="color: #dc2626; font-size: 14px; margin-top: 4px; display: none;">${window.t('incident.detail.reasonError')}</p>
                </div>

                <p style="font-size: 14px; color: #6b7280; margin-top: 16px;">
                    ${window.t('incident.detail.closeConfirm')}
                </p>

                <div class="modal-actions" style="margin-top: 24px;">
                    <button class="btn-primary" onclick="window.incidentDetailActions.confirmClose()" style="flex: 1; background: #dc2626;">
                        ${window.t('incident.detail.closeDialogTitle')}
                    </button>
                    <button class="btn-secondary" onclick="window.incidentDetailActions.cancelClose()" style="flex: 1;">
                        ${window.t('common.cancel')}
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
        user: window.t('incident.detail.user'),
        action: window.t('incident.detail.actionClosed', { reason }),
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

    alert(window.t('incident.detail.alertClosed'));

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
