// Crisis Mode Application Logic

import {
    SLevelDetails,
    IncidentMetrics,
    IncidentLogEntry,
    isCyberScenario,
    getDefaultNotificationRequirements
} from './src/data/incident-types.js';

let currentScenario = null;
let incidentLog = []; // LEGACY: will be migrated to bcm_incidents.actions
let checklistStates = {};
let currentIncidentMetrics = null;
let currentIncidentLogId = null;

// =============================================================================
// INCIDENT ACTIONS HELPERS (bcm_incidents integration)
// =============================================================================

/**
 * Get current active incident from bcm_incidents
 */
function getCurrentIncident() {
    // Try from incidentGate first
    if (typeof window.getActiveIncidentId === 'function') {
        const activeId = window.getActiveIncidentId();
        if (activeId) {
            const incidents = JSON.parse(localStorage.getItem('bcm_incidents') || '[]');
            return incidents.find(i => i.id === activeId);
        }
    }

    // Fallback: most recent active incident
    const incidents = JSON.parse(localStorage.getItem('bcm_incidents') || '[]');
    return incidents
        .filter(i => i.status === 'ACTIVE' || i.status === 'OPEN')
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))[0]
        || null;
}

/**
 * Load actions/timeline from current incident
 */
function loadIncidentActions() {
    const incident = getCurrentIncident();
    if (!incident) return [];
    return incident.actions || [];
}

/**
 * Add action to current incident's timeline
 */
function appendIncidentAction(type, message, timestamp = null) {
    const incident = getCurrentIncident();
    if (!incident) {
        console.warn('[ACTION] No active incident, cannot append action');
        return;
    }

    if (!incident.actions) {
        incident.actions = [];
    }

    incident.actions.push({
        timestamp: timestamp || new Date().toISOString(),
        user: 'Kasutaja',
        action: message,
        category: type
    });

    incident.updatedAt = new Date().toISOString();

    // Save back to bcm_incidents
    const incidents = JSON.parse(localStorage.getItem('bcm_incidents') || '[]');
    const index = incidents.findIndex(i => i.id === incident.id);
    if (index >= 0) {
        incidents[index] = incident;
        localStorage.setItem('bcm_incidents', JSON.stringify(incidents));
        console.log(`[ACTION] Saved action to incident ${incident.id}`);
    }
}

// Render Scenarios Grid
function renderScenarios() {
    const grid = document.getElementById('scenariosGrid');
    if (!grid) return;

    grid.innerHTML = scenarios.map(scenario => `
        <div class="scenario-card priority-${scenario.priority.toLowerCase()}" onclick="openScenario('${scenario.id}')">
            <div class="scenario-icon">${scenario.icon}</div>
            <h3>${scenario.name}</h3>
        </div>
    `).join('');
}

function getPriorityText(priority) {
    const texts = {
        'CRITICAL': 'Kriitiline',
        'HIGH': 'Kõrge',
        'MEDIUM': 'Keskmine',
        'LOW': 'Madal'
    };
    return texts[priority] || priority;
}

// Open Scenario Detail
function openScenario(scenarioId) {
    currentScenario = scenarios.find(s => s.id === scenarioId);
    if (!currentScenario) return;

    // ============================================
    // UUENDATUD: Kasuta alati incidentGate'd
    // ============================================
    
    // Kui _skipGateDialog on true, siis tuleme gate'ist tagasi
    // ja ei näita dialoog uuesti
    if (window._skipGateDialog) {
        // Jätka otse renderdamisega
        renderScenarioPage(scenarioId);
        return;
    }
    
    // Kasuta uut gate'i — see näitab kinnitusdialoogi
    if (typeof window.openScenarioWithGate === 'function') {
        window.openScenarioWithGate(scenarioId, currentScenario);
        return;
    }
    
    // Fallback (kui gate pole laetud)
    console.warn('[CRISIS-APP] incidentGate not loaded, using old flow');
    renderScenarioPage(scenarioId);
}

// Renderda stsenaariumi leht (kutsutakse pärast gate kinnitust)
function renderScenarioPage(scenarioId) {
    if (!currentScenario) {
        currentScenario = scenarios.find(s => s.id === scenarioId);
    }
    if (!currentScenario) return;

    navigateTo('scenarioDetailPage');

    // Update header
    document.getElementById('scenarioTitle').textContent = currentScenario.name;
    document.getElementById('scenarioDescription').textContent = currentScenario.description;

    // Render blocks
    renderQuickActions();

    // Show/hide Incident Metrics block for cyber scenarios only
    const metricsBlock = document.getElementById('incidentMetricsBlock');
    if (isCyberScenario(scenarioId)) {
        metricsBlock.style.display = 'block';
        renderIncidentMetrics();
    } else {
        metricsBlock.style.display = 'none';
    }

    renderActionPlan();
    renderCommunicationButtons();
    renderScenarioContacts();

    // Uuenda incident banner
    if (typeof window.updateIncidentBanner === 'function') {
        window.updateIncidentBanner();
    }

    addToLog('ACTION', window.t('crisis.log.openedScenario', { scenario: currentScenario.name }));
}

// Render Quick Actions
function renderQuickActions() {
    const container = document.getElementById('quickActionsChecklist');
    if (!container || !currentScenario) return;

    container.innerHTML = currentScenario.quickActions.map(action => {
        const isChecked = checklistStates[`quick_${action.id}`] || false;
        return `
            <div class="checklist-item ${isChecked ? 'checked' : ''}">
                <input type="checkbox" id="quick_${action.id}" ${isChecked ? 'checked' : ''}
                       onchange="toggleChecklistItem('quick_${action.id}', '${action.title}')">
                <label for="quick_${action.id}">
                    <strong>${action.title}</strong>
                    ${action.phone ? `<span class="phone-number">${action.phone}</span>` : ''}
                </label>
                ${action.type === 'CALL' && action.phone ?
                    `<button class="quick-call-btn" onclick="makeCall('${action.phone}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        ${window.t('contact.action.call')}
                    </button>` : ''}
            </div>
        `;
    }).join('');
}

// Render Action Plan
function renderActionPlan() {
    const container = document.getElementById('actionPlanChecklist');
    if (!container || !currentScenario) return;

    container.innerHTML = currentScenario.actionPlan.map((action, index) => {
        const isChecked = checklistStates[`action_${action.id}`] || false;
        return `
            <div class="checklist-item ${isChecked ? 'checked' : ''}">
                <input type="checkbox" id="action_${action.id}" ${isChecked ? 'checked' : ''}
                       onchange="toggleChecklistItem('action_${action.id}', '${action.title}')">
                <label for="action_${action.id}">
                    <div class="action-number">${index + 1}</div>
                    <div class="action-content">
                        <strong>${action.title}</strong>
                        <p>${action.description}</p>
                    </div>
                </label>
            </div>
        `;
    }).join('');
}

// Render Communication Buttons
function renderCommunicationButtons() {
    const container = document.getElementById('communicationButtons');
    if (!container || !currentScenario) return;

    container.innerHTML = currentScenario.communications.map(comm => `
        <button class="comm-btn comm-${comm.channel.toLowerCase()}"
                onclick="sendCommunication('${comm.id}', '${comm.channel}', '${comm.title}')">
            <div class="comm-btn-icon">
                ${getCommIcon(comm.channel)}
            </div>
            <div class="comm-btn-content">
                <strong>${comm.title}</strong>
                <span>${getChannelName(comm.channel)}</span>
            </div>
        </button>
    `).join('');
}

function getCommIcon(channel) {
    const icons = {
        'SMS': `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="2" width="14" height="20" rx="2"/></svg>`,
        'CALL': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
        'EMAIL': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6" stroke="white" stroke-width="2" fill="none"/></svg>`
    };
    return icons[channel] || '';
}

function getChannelName(channel) {
    const keys = {
        'SMS': 'sms',
        'CALL': 'call',
        'EMAIL': 'email'
    };
    return keys[channel] ? window.t(`comm.channel.${keys[channel]}`) : channel;
}

// Render Scenario Contacts
function renderScenarioContacts() {
    const container = document.getElementById('scenarioContacts');
    if (!container || !currentScenario) return;

    const scenarioContacts = contacts.filter(c => currentScenario.contacts.includes(c.id));

    container.innerHTML = scenarioContacts.map(contact => `
        <div class="contact-quick-card">
            <div class="contact-quick-info">
                <strong>${contact.name}</strong>
                <span>${contact.role}</span>
            </div>
            <div class="contact-quick-actions">
                <button class="contact-quick-btn" onclick="makeCall('${contact.phone}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                </button>
                <span class="contact-phone">${contact.phone}</span>
            </div>
        </div>
    `).join('');
}

// Checklist Toggle
function toggleChecklistItem(itemId, itemTitle) {
    // ============================================
    // UUENDATUD: Kontrolli kas intsident on aktiivne
    // ============================================
    const hasActive = typeof window.hasActiveIncident === 'function' && window.hasActiveIncident();
    
    if (!hasActive) {
        // Preview mode — näita hoiatust ja ära salvesta
        alert(window.t('crisis.warning.notOpen') + '\n\n' + window.t('crisis.warning.checklistSave'));
        
        // Pööra checkbox tagasi
        const checkbox = document.getElementById(itemId);
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
        }
        return;
    }
    
    const checkbox = document.getElementById(itemId);
    const isChecked = checkbox.checked;

    checklistStates[itemId] = isChecked;

    // Update visual state
    const item = checkbox.closest('.checklist-item');
    if (isChecked) {
        item.classList.add('checked');
        addToLog('ACTION', window.t('crisis.log.checked', { title: itemTitle }), getCurrentTimestamp());
    } else {
        item.classList.remove('checked');
        addToLog('INFO', window.t('crisis.log.unchecked', { title: itemTitle }));
    }
    
    // ============================================
    // UUENDATUD: Salvesta incidenti
    // ============================================
    saveChecklistToIncident();
}

// ============================================
// UUENDATUD: Salvesta checklist andmed incidenti
// ============================================
function saveChecklistToIncident() {
    const incidentId = typeof window.getActiveIncidentId === 'function' ? window.getActiveIncidentId() : null;
    if (!incidentId) return;
    
    // Loe incident
    const incidents = JSON.parse(localStorage.getItem('bcm_incidents') || '[]');
    const incident = incidents.find(i => i.id === incidentId);
    if (!incident) return;
    
    // Salvesta checklistStates
    incident.checklistStates = checklistStates;
    
    // Arvuta progress
    let quickCompleted = 0;
    let quickTotal = 0;
    let actionCompleted = 0;
    let actionTotal = 0;
    
    Object.keys(checklistStates).forEach(key => {
        if (key.startsWith('quick_')) {
            quickTotal++;
            if (checklistStates[key]) quickCompleted++;
        } else if (key.startsWith('action_')) {
            actionTotal++;
            if (checklistStates[key]) actionCompleted++;
        }
    });
    
    incident.checklistProgress = {
        quickActions: { completed: quickCompleted, total: quickTotal },
        actionPlan: { completed: actionCompleted, total: actionTotal }
    };
    
    incident.updatedAt = new Date().toISOString();
    
    // Salvesta tagasi
    localStorage.setItem('bcm_incidents', JSON.stringify(incidents));
    
    console.log('[CRISIS-APP] Checklist saved to incident:', incidentId);
}

// Communications
function sendCommunication(commId, channel, title) {
    const comm = currentScenario.communications.find(c => c.id == commId);

    if (channel === 'SMS') {
        alert(window.t('comm.sendSms', { template: comm.template }));
    } else if (channel === 'EMAIL') {
        alert(window.t('comm.sendEmail', { subject: comm.subject || title, body: comm.template || window.t('comm.emailTemplateFallback') }));
    } else if (channel === 'CALL') {
        makeCall(comm.phone);
    }

    addToLog('COMMUNICATION', `${channel}: ${title}`);
}

function makeCall(phoneNumber) {
    addToLog('COMMUNICATION', window.t('log.callMade', { phone: phoneNumber }));
    alert(window.t('contact.action.callMessage', { phone: phoneNumber }));
    // In real app: window.location.href = `tel:${phoneNumber}`;
}

// Incident Log
function addToLog(type, message, timestamp) {
    const time = timestamp || getCurrentTimestamp();

    // NEW: Write to bcm_incidents.actions (canonical)
    appendIncidentAction(type, message, time);

    // LEGACY: Keep in-memory for backwards compatibility (will be phased out)
    incidentLog.push({
        type,
        message,
        timestamp: time,
        user: 'Kasutaja'
    });
}

function getCurrentTimestamp() {
    const now = new Date();
    return `${padZero(now.getHours())}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())}`;
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

function renderIncidentLog() {
    const container = document.getElementById('logTimeline');
    if (!container) return;

    // Load incidents from canonical source (bcm_incidents)
    const storedLog = JSON.parse(localStorage.getItem('bcm_incidents') || '[]');

    if (storedLog.length === 0) {
        container.innerHTML = `<p class="empty-log">${window.t('log.empty')}</p>`;
        return;
    }

    container.innerHTML = storedLog.reverse().map(entry => {
        const metrics = entry.incidentMetrics;
        const hasMetrics = metrics && isCyberScenario(entry.scenarioId);

        const createdDate = new Date(entry.createdAt);
        const updatedDate = new Date(entry.updatedAt);

        const isExercise = entry.isExercise === true;
        const status = entry.status || 'OPEN';

        return `
            <div class="incident-log-entry ${hasMetrics ? 'cyber-incident' : ''} ${isExercise ? 'exercise' : ''} ${status === 'OPEN' ? 'status-open' : 'status-closed'}">
                <div class="log-entry-header">
                    <h3>
                        ${entry.scenarioName}
                        ${isExercise ? `<span class="exercise-badge">${window.t('log.badgeExercise')}</span>` : ''}
                        <span class="status-badge status-${status.toLowerCase()}">${status}</span>
                    </h3>
                    <span class="log-entry-id">${entry.id}</span>
                </div>
                <div class="log-entry-meta">
                    <span>🕐 ${window.t('log.createdLabel')} ${createdDate.toLocaleString('et-EE')}</span>
                    ${entry.updatedAt !== entry.createdAt ? `<span>🔄 ${window.t('log.updatedLabel')} ${updatedDate.toLocaleString('et-EE')}</span>` : ''}
                </div>

                ${hasMetrics ? `
                    <div class="log-metrics-summary">
                        <h4>${window.t('log.metricsTitle')}</h4>
                        <div class="metrics-grid">
                            ${metrics.t0 ? `<div class="metric-item"><strong>t0:</strong> ${new Date(metrics.t0).toLocaleString('et-EE')}</div>` : ''}
                            ${metrics.sLevel ? `<div class="metric-item"><strong>S-tase:</strong> <span class="badge badge-${SLevelDetails[metrics.sLevel].class}">${metrics.sLevel}</span></div>` : ''}
                            ${metrics.affectedDomain ? `<div class="metric-item"><strong>Domeen:</strong> ${metrics.affectedDomain}</div>` : ''}
                            ${metrics.serviceDisruption ? `<div class="metric-item"><strong>Teenuse seiskus:</strong> ${metrics.serviceDisruption}</div>` : ''}
                            ${metrics.dataBreachSuspicion ? `<div class="metric-item"><strong>Andmeleke kahtlus:</strong> ${metrics.dataBreachSuspicion}</div>` : ''}
                            ${metrics.spreadStatus ? `<div class="metric-item"><strong>Leviku staatus:</strong> ${metrics.spreadStatus}</div>` : ''}
                        </div>
                        ${metrics.shortDescription ? `<div class="metric-description"><strong>Kirjeldus:</strong> ${metrics.shortDescription}</div>` : ''}

                        <div class="notifications-summary">
                            <h5>${window.t('log.notificationsTitle')}</h5>
                            <div class="notifications-list">
                                ${renderNotificationStatus('CERT-EE', metrics.notifications.certEE)}
                                ${renderNotificationStatus('DPO/GDPR', metrics.notifications.dpoGDPR)}
                                ${renderNotificationStatus(window.t('incident.metrics.notification.management'), metrics.notifications.management)}
                            </div>
                        </div>

                        ${metrics.reporter || metrics.systemLocation || metrics.logger ? `
                            <div class="additional-info">
                                ${metrics.reporter ? `<div><strong>${window.t('log.reporter')}</strong> ${metrics.reporter}</div>` : ''}
                                ${metrics.systemLocation ? `<div><strong>${window.t('log.system')}</strong> ${metrics.systemLocation}</div>` : ''}
                                ${metrics.logger ? `<div><strong>${window.t('log.logger')}</strong> ${metrics.logger}</div>` : ''}
                            </div>
                        ` : ''}
                    </div>
                ` : ''}

                <div class="log-entry-actions">
                    <button class="btn-secondary-sm" onclick="viewLogEntry('${entry.id}')">${window.t('log.action.view')}</button>
                    ${status === 'OPEN' ?
                        `<button class="btn-secondary-sm" onclick="closeIncident('${entry.id}')">${window.t('log.action.close')}</button>` :
                        `<button class="btn-secondary-sm" onclick="reopenIncident('${entry.id}')">${window.t('log.action.reopen')}</button>`
                    }
                    <button class="btn-secondary-sm" onclick="deleteLogEntry('${entry.id}')">${window.t('log.action.delete')}</button>
                </div>
            </div>
        `;
    }).join('');
}

// Helper function to render notification status
function renderNotificationStatus(recipient, notification) {
    if (!notification) return '';

    const statusBadge = notification.status === 'SENT' ? 'success' :
                       notification.status === 'PLANNED' ? 'warning' : 'default';

    const timestamp = notification.timestamp ?
                     ` (${new Date(notification.timestamp).toLocaleString('et-EE')})` : '';

    return `
        <div class="notification-summary-item">
            <strong>${recipient}:</strong>
            <span class="badge badge-${statusBadge}">${getNotificationStatusText(notification.status)}</span>
            ${notification.required === 'REQUIRED' ? `<span class="required-badge">${window.t('log.notificationRequired')}</span>` : ''}
            ${timestamp}
        </div>
    `;
}

// Helper function to get notification status text
function getNotificationStatusText(status) {
    const keys = {
        'PLANNED': 'statusPlanned',
        'SENT': 'statusSent',
        'NOT_NEEDED': 'statusNotNeeded'
    };
    return keys[status] ? window.t(`incident.metrics.notification.${keys[status]}`) : status;
}

// View log entry details
function viewLogEntry(entryId) {
    const storedLog = JSON.parse(localStorage.getItem('bcm_incidents') || '[]');
    const entry = storedLog.find(e => e.id === entryId);

    if (!entry) {
        alert(window.t('log.notFound'));
        return;
    }

    alert(window.t('log.details') + `\n\n${JSON.stringify(entry, null, 2)}`);
    // TODO: Implement proper detail view modal
}

// Delete log entry
function deleteLogEntry(entryId) {
    if (!confirm(window.t('confirm.deleteLog'))) {
        return;
    }

    let storedLog = JSON.parse(localStorage.getItem('bcm_incidents') || '[]');
    storedLog = storedLog.filter(e => e.id !== entryId);
    localStorage.setItem('bcm_incidents', JSON.stringify(storedLog));

    alert(window.t('log.deleted'));
    renderIncidentLog();
    addToLog('SYSTEM_EVENT', window.t('log.event.deleted', { id: entryId }));

    // Update system status after deletion
    if (window.updateSystemStatus) {
        window.updateSystemStatus();
    }
}

// Close incident
function closeIncident(entryId) {
    if (!confirm(window.t('confirm.closeIncident'))) {
        return;
    }

    let storedLog = JSON.parse(localStorage.getItem('bcm_incidents') || '[]');
    const entry = storedLog.find(e => e.id === entryId);

    if (entry) {
        entry.status = 'CLOSED';
        entry.updatedAt = new Date().toISOString();
        localStorage.setItem('bcm_incidents', JSON.stringify(storedLog));

        alert(window.t('incident.closed'));
        renderIncidentLog();
        addToLog('SYSTEM_EVENT', window.t('log.event.closed', { id: entryId }));

        // Update system status after closing
        if (window.updateSystemStatus) {
            window.updateSystemStatus();
        }
    }
}

// Reopen incident
function reopenIncident(entryId) {
    if (!confirm(window.t('confirm.reopenIncident'))) {
        return;
    }

    let storedLog = JSON.parse(localStorage.getItem('bcm_incidents') || '[]');
    const entry = storedLog.find(e => e.id === entryId);

    if (entry) {
        entry.status = 'OPEN';
        entry.updatedAt = new Date().toISOString();
        localStorage.setItem('bcm_incidents', JSON.stringify(storedLog));

        alert(window.t('incident.opened'));
        renderIncidentLog();
        addToLog('SYSTEM_EVENT', window.t('log.event.reopened', { id: entryId }));

        // Update system status after reopening
        if (window.updateSystemStatus) {
            window.updateSystemStatus();
        }
    }
}

function getLogTypeIcon(type) {
    const icons = {
        'INFO': 'ℹ️',
        'ACTION': '✔',
        'COMMUNICATION': '📧',
        'SYSTEM_EVENT': '⚙️'
    };
    return icons[type] || '•';
}

function exportLog() {
    if (incidentLog.length === 0) {
        alert(window.t('log.empty'));
        return;
    }

    let logText = `${window.t('log.filenameTitle')}\n${window.t('log.exported', { date: new Date().toLocaleString('et-EE') })}\n\n`;
    logText += `${window.t('log.scenario', { name: currentScenario ? currentScenario.name : window.t('log.notSelected') })}\n\n`;
    logText += `---\n\n`;

    incidentLog.forEach(entry => {
        logText += `[${entry.timestamp}] ${entry.type}: ${entry.message} (${entry.user})\n`;
    });

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BCM_Log_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToLog('SYSTEM_EVENT', window.t('log.exportEvent'));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('BCM Crisis Mode initialized');

    // Override navigateTo for log page
    const originalNavigateTo = window.navigateTo;
    window.navigateTo = function(pageId) {
        if (pageId === 'incidentLogPage') {
            renderIncidentLog();
        }
        originalNavigateTo(pageId);
    };
});
console.log('crisis-app.js loaded');


// =============================================================================
// INCIDENT METRICS FUNCTIONALITY
// =============================================================================

let selectedSLevel = null;

// Render Incident Metrics Form
function renderIncidentMetrics() {
    renderSLevelGrid();

    // Initialize with new metrics if none exist
    if (!currentIncidentMetrics) {
        currentIncidentMetrics = new IncidentMetrics();
    }

    // Load existing values if any
    loadIncidentMetricsToForm();
}

// Render S-Level Grid
function renderSLevelGrid() {
    const grid = document.getElementById('sLevelGrid');
    if (!grid) return;

    grid.innerHTML = Object.values(SLevelDetails).map(level => `
        <div class="s-level-card ${level.class} ${selectedSLevel === level.id ? 'selected' : ''}"
             onclick="selectSLevel('${level.id}')">
            <div class="s-level-badge ${level.class}">${level.id}</div>
            <div class="s-level-info">
                <h4>${level.name}</h4>
                <p>${level.description}</p>
                <div class="s-level-meta">
                    <span>⏱️ ${level.response}</span>
                    <span>🎯 ${level.containment}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Select S-Level
function selectSLevel(level) {
    selectedSLevel = level;
    renderSLevelGrid();

    // Auto-suggest notifications based on S-Level
    const dataBreachSuspicion = document.getElementById('dataBreachSuspicion').value;
    updateNotificationSuggestions(level, dataBreachSuspicion);

    addToLog('INFO', window.t('log.slevelSelected', { level }));
}

// Set t0 to current time
function setT0Now() {
    const now = new Date();
    const dateTimeLocal = now.toISOString().slice(0, 16);
    document.getElementById('t0Time').value = dateTimeLocal;
    addToLog('INFO', window.t('log.t0Set'));
}

// Toggle Additional Metrics
function toggleAdditionalMetrics() {
    const content = document.getElementById('additionalMetricsContent');
    const toggleText = document.getElementById('additionalMetricsToggleText');

    if (content.style.display === 'none') {
        content.style.display = 'block';
        toggleText.textContent = window.t('incident.metrics.toggle.hide');
    } else {
        content.style.display = 'none';
        toggleText.textContent = window.t('incident.metrics.toggle.show');
    }
}

// Update Notification Suggestions based on S-Level and Data Breach
function updateNotificationSuggestions(sLevel, dataBreachSuspicion) {
    const suggestions = getDefaultNotificationRequirements(sLevel, dataBreachSuspicion);

    if (suggestions.certEE) {
        document.getElementById('certEE_required').value = suggestions.certEE;
    }
    if (suggestions.dpoGDPR) {
        document.getElementById('dpoGDPR_required').value = suggestions.dpoGDPR;
    }
    if (suggestions.management) {
        document.getElementById('management_required').value = suggestions.management;
    }
}

// Data Breach Suspicion change handler
document.addEventListener('DOMContentLoaded', function() {
    const dataBreachSelect = document.getElementById('dataBreachSuspicion');
    if (dataBreachSelect) {
        dataBreachSelect.addEventListener('change', function() {
            if (selectedSLevel) {
                updateNotificationSuggestions(selectedSLevel, this.value);
            }
        });
    }
});

// Save Incident Metrics
function saveIncidentMetrics() {
    // ============================================
    // UUENDATUD: Kontrolli kas intsident on aktiivne
    // ============================================
    const hasActive = typeof window.hasActiveIncident === 'function' && window.hasActiveIncident();
    const incidentId = typeof window.getActiveIncidentId === 'function' ? window.getActiveIncidentId() : null;
    
    if (!hasActive || !incidentId) {
        alert(window.t('crisis.warning.notOpen') + '\n\n' + window.t('crisis.warning.saveFirst'));
        return;
    }

    if (!currentScenario) {
        alert(window.t('incident.metrics.errorNoScenario'));
        return;
    }

    // Validate MVP fields
    if (!selectedSLevel) {
        alert(window.t('incident.metrics.errorNoSlevel'));
        return;
    }

    // Collect form data
    const metrics = new IncidentMetrics();

    // MVP fields
    const t0Value = document.getElementById('t0Time').value;
    metrics.t0 = t0Value ? new Date(t0Value).toISOString() : null;
    metrics.sLevel = selectedSLevel;
    metrics.affectedDomain = document.getElementById('affectedDomain').value;
    metrics.serviceDisruption = document.getElementById('serviceDisruption').value;
    metrics.dataBreachSuspicion = document.getElementById('dataBreachSuspicion').value;
    metrics.spreadStatus = document.getElementById('spreadStatus').value;
    metrics.shortDescription = document.getElementById('shortDescription').value;

    // Notifications
    metrics.notifications.certEE.required = document.getElementById('certEE_required').value;
    metrics.notifications.certEE.status = document.getElementById('certEE_status').value;
    const certEETimestamp = document.getElementById('certEE_timestamp').value;
    metrics.notifications.certEE.timestamp = certEETimestamp ? new Date(certEETimestamp).toISOString() : null;

    metrics.notifications.dpoGDPR.required = document.getElementById('dpoGDPR_required').value;
    metrics.notifications.dpoGDPR.status = document.getElementById('dpoGDPR_status').value;
    const dpoTimestamp = document.getElementById('dpoGDPR_timestamp').value;
    metrics.notifications.dpoGDPR.timestamp = dpoTimestamp ? new Date(dpoTimestamp).toISOString() : null;

    metrics.notifications.management.required = document.getElementById('management_required').value;
    metrics.notifications.management.status = document.getElementById('management_status').value;
    const mgmtTimestamp = document.getElementById('management_timestamp').value;
    metrics.notifications.management.timestamp = mgmtTimestamp ? new Date(mgmtTimestamp).toISOString() : null;

    // Nice-to-have fields
    metrics.reporter = document.getElementById('reporter').value;
    metrics.systemLocation = document.getElementById('systemLocation').value;
    metrics.nis2Relevant = document.getElementById('nis2Relevant').value;
    metrics.initialIndicators = document.getElementById('initialIndicators').value;

    const evidenceText = document.getElementById('evidenceArtifacts').value;
    metrics.evidenceArtifacts = evidenceText ? evidenceText.split('\n').filter(e => e.trim()) : [];

    metrics.logger = document.getElementById('logger').value;

    // ============================================
    // UUENDATUD: Salvesta bcm_incidents võtmesse
    // ============================================
    const incidents = JSON.parse(localStorage.getItem('bcm_incidents') || '[]');
    const incident = incidents.find(i => i.id === incidentId);
    
    if (incident) {
        incident.incidentMetrics = metrics;
        incident.severity = selectedSLevel;
        incident.updatedAt = new Date().toISOString();
        
        // Lisa timeline action
        incident.actions = incident.actions || [];
        incident.actions.push({
            timestamp: new Date().toISOString(),
            user: window.t('incident.detail.user'),
            action: window.t('incident.metrics.saved'),
            category: 'METRICS'
        });
        
        localStorage.setItem('bcm_incidents', JSON.stringify(incidents));
        
        currentIncidentMetrics = metrics;

        alert(window.t('incident.metrics.saved'));
        addToLog('SYSTEM_EVENT', `💾 ${window.t('incident.metrics.saved')} (${incidentId})`);

        console.log('[CRISIS-APP] Saved incident metrics:', incidentId, metrics);
    } else {
        alert(window.t('incident.detail.alertNotFound'));
        console.error('[CRISIS-APP] Incident not found:', incidentId);
    }

    // Update system status and UI
    if (typeof window.updateHomeStatusAndList === 'function') {
        window.updateHomeStatusAndList();
    }
    if (typeof window.updateIncidentsBadge === 'function') {
        window.updateIncidentsBadge();
    }
}

// Clear Incident Metrics Form
function clearIncidentMetrics() {
    if (!confirm(window.t('incident.metrics.clearConfirm'))) {
        return;
    }

    selectedSLevel = null;
    currentIncidentMetrics = null;
    currentIncidentLogId = null;

    // Clear form
    document.getElementById('t0Time').value = '';
    renderSLevelGrid();
    document.getElementById('affectedDomain').value = '';
    document.getElementById('serviceDisruption').value = '';
    document.getElementById('dataBreachSuspicion').value = '';
    document.getElementById('spreadStatus').value = '';
    document.getElementById('shortDescription').value = '';

    // Clear notifications
    ['certEE', 'dpoGDPR', 'management'].forEach(recipient => {
        document.getElementById(`${recipient}_required`).value = 'TO_BE_ASSESSED';
        document.getElementById(`${recipient}_status`).value = 'PLANNED';
        document.getElementById(`${recipient}_timestamp`).value = '';
    });

    // Clear additional fields
    document.getElementById('reporter').value = '';
    document.getElementById('systemLocation').value = '';
    document.getElementById('nis2Relevant').value = 'UNKNOWN';
    document.getElementById('initialIndicators').value = '';
    document.getElementById('evidenceArtifacts').value = '';
    document.getElementById('logger').value = '';

    addToLog('INFO', window.t('incident.metrics.cleared'));
}

// Load Incident Metrics to Form (if editing existing)
function loadIncidentMetricsToForm() {
    if (!currentIncidentMetrics) return;

    const metrics = currentIncidentMetrics;

    // Load MVP fields
    if (metrics.t0) {
        const t0Date = new Date(metrics.t0);
        document.getElementById('t0Time').value = t0Date.toISOString().slice(0, 16);
    }

    if (metrics.sLevel) {
        selectedSLevel = metrics.sLevel;
        renderSLevelGrid();
    }

    if (metrics.affectedDomain) document.getElementById('affectedDomain').value = metrics.affectedDomain;
    if (metrics.serviceDisruption) document.getElementById('serviceDisruption').value = metrics.serviceDisruption;
    if (metrics.dataBreachSuspicion) document.getElementById('dataBreachSuspicion').value = metrics.dataBreachSuspicion;
    if (metrics.spreadStatus) document.getElementById('spreadStatus').value = metrics.spreadStatus;
    if (metrics.shortDescription) document.getElementById('shortDescription').value = metrics.shortDescription;

    // Load notifications
    if (metrics.notifications) {
        ['certEE', 'dpoGDPR', 'management'].forEach(recipient => {
            const notif = metrics.notifications[recipient];
            if (notif) {
                if (notif.required) document.getElementById(`${recipient}_required`).value = notif.required;
                if (notif.status) document.getElementById(`${recipient}_status`).value = notif.status;
                if (notif.timestamp) {
                    const timestamp = new Date(notif.timestamp);
                    document.getElementById(`${recipient}_timestamp`).value = timestamp.toISOString().slice(0, 16);
                }
            }
        });
    }

    // Load additional fields
    if (metrics.reporter) document.getElementById('reporter').value = metrics.reporter;
    if (metrics.systemLocation) document.getElementById('systemLocation').value = metrics.systemLocation;
    if (metrics.nis2Relevant) document.getElementById('nis2Relevant').value = metrics.nis2Relevant;
    if (metrics.initialIndicators) document.getElementById('initialIndicators').value = metrics.initialIndicators;
    if (metrics.evidenceArtifacts) document.getElementById('evidenceArtifacts').value = metrics.evidenceArtifacts.join('\n');
    if (metrics.logger) document.getElementById('logger').value = metrics.logger;
}

// =============================================================================
// MIGRATION: incidentLog → incident.actions (bcm_incidents)
// =============================================================================

/**
 * One-time migration: move legacy incidentLog entries into bcm_incidents.actions
 */
function migrateIncidentLog() {
    // Check if already migrated
    if (localStorage.getItem('incidentLog_migrated_v1') === 'true') {
        console.log('[MIGRATION] Already migrated incidentLog → skipping');
        return;
    }

    console.log('[MIGRATION] Starting incidentLog → bcm_incidents migration...');

    // Load legacy incidentLog
    const legacyLog = JSON.parse(localStorage.getItem('incidentLog') || '[]');
    if (legacyLog.length === 0) {
        console.log('[MIGRATION] No legacy incidentLog data → marking as migrated');
        localStorage.setItem('incidentLog_migrated_v1', 'true');
        return;
    }

    // Load bcm_incidents
    const incidents = JSON.parse(localStorage.getItem('bcm_incidents') || '[]');
    if (incidents.length === 0) {
        console.warn('[MIGRATION] No incidents found in bcm_incidents → cannot migrate, skipping');
        localStorage.setItem('incidentLog_migrated_v1', 'true');
        return;
    }

    // Find target incident (most recent active/open)
    const targetIncident = incidents
        .filter(inc => inc.status === 'ACTIVE' || inc.status === 'OPEN')
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))[0]
        || incidents[incidents.length - 1]; // fallback: last incident

    if (!targetIncident) {
        console.warn('[MIGRATION] No target incident found');
        localStorage.setItem('incidentLog_migrated_v1', 'true');
        return;
    }

    console.log(`[MIGRATION] Target incident: ${targetIncident.id}`);

    // Initialize actions array if missing
    if (!targetIncident.actions) {
        targetIncident.actions = [];
    }

    // Dedupe: create set of existing action signatures
    const existingSignatures = new Set(
        targetIncident.actions.map(a =>
            `${a.timestamp}|${a.category || a.type}|${a.action || a.message}`
        )
    );

    // Migrate legacy entries
    let migratedCount = 0;
    legacyLog.forEach(entry => {
        const signature = `${entry.timestamp}|${entry.type}|${entry.message}`;
        if (!existingSignatures.has(signature)) {
            targetIncident.actions.push({
                timestamp: entry.timestamp || new Date().toISOString(),
                user: entry.user || 'Kasutaja',
                action: entry.message || '',
                category: entry.type || 'ACTION'
            });
            migratedCount++;
        }
    });

    // Sort actions by timestamp
    targetIncident.actions.sort((a, b) =>
        new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Save back to bcm_incidents
    targetIncident.updatedAt = new Date().toISOString();
    const targetIndex = incidents.findIndex(i => i.id === targetIncident.id);
    if (targetIndex >= 0) {
        incidents[targetIndex] = targetIncident;
    }
    localStorage.setItem('bcm_incidents', JSON.stringify(incidents));

    // Mark as migrated
    localStorage.setItem('incidentLog_migrated_v1', 'true');

    console.log(`[MIGRATION] ✅ Migrated ${migratedCount} entries to incident ${targetIncident.id}`);
    console.log(`[MIGRATION] Legacy incidentLog kept for safety (can be removed later)`);
}

// Load incident log from localStorage on startup
document.addEventListener('DOMContentLoaded', function() {
    // Run migration first
    migrateIncidentLog();

    const savedLog = localStorage.getItem('incidentLog');
    if (savedLog) {
        try {
            incidentLog = JSON.parse(savedLog);
            console.log('Loaded incident log from storage:', incidentLog.length, 'entries');
        } catch (e) {
            console.error('Error loading incident log:', e);
        }
    }
});

console.log('Incident metrics functions loaded');

// =============================================================================
// FAAS2: NEW INCIDENT FLOW - REAL/TRAINING CONFIRMATION
// =============================================================================

let selectedIncidentMode = 'REAL'; // Default

// Show incident confirmation dialog with REAL/TRAINING toggle
function showIncidentConfirmationDialog(scenarioId, scenarioData) {
    const existingDialog = document.getElementById('faas2IncidentDialog');
    if (existingDialog) {
        existingDialog.remove();
    }

    const dialog = document.createElement('div');
    dialog.id = 'faas2IncidentDialog';
    dialog.className = 'modal';
    dialog.style.display = 'flex';
    dialog.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>${window.t('faas2.dialogTitle')}</h2>
            </div>
            <div class="modal-body">
                <p><strong>${window.t('faas2.dialogScenario')}</strong> ${scenarioData.name}</p>
                <p style="margin-bottom: 24px;">${scenarioData.description}</p>

                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">${window.t('faas2.dialogMode')}</label>
                    <div style="display: flex; gap: 12px;">
                        <button class="btn-mode-toggle active" id="modeReal" onclick="selectIncidentMode('REAL')" style="flex: 1; padding: 12px; border-radius: 8px; border: 2px solid #3b82f6; background: #3b82f6; color: white; font-weight: 600; cursor: pointer;">
                            REAL
                        </button>
                        <button class="btn-mode-toggle" id="modeTraining" onclick="selectIncidentMode('TRAINING')" style="flex: 1; padding: 12px; border-radius: 8px; border: 2px solid #d1d5db; background: white; color: #374151; font-weight: 600; cursor: pointer;">
                            TRAINING
                        </button>
                    </div>
                    <p style="margin-top: 8px; font-size: 14px; color: #6b7280;">
                        <span id="modeDescription">${window.t('faas2.mode.realDescription')}</span>
                    </p>
                </div>

                <p style="font-size: 14px; color: #6b7280;">${window.t('faas2.confirmCreate')}</p>

                <div class="modal-actions" style="margin-top: 24px;">
                    <button class="btn-primary" onclick="confirmCreateIncident('${scenarioId}')" style="flex: 1;">
                        ${window.t('faas2.actionConfirm')}
                    </button>
                    <button class="btn-secondary" onclick="cancelIncidentCreation()" style="flex: 1;">
                        ${window.t('common.cancel')}
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
}

// Select incident mode (REAL/TRAINING)
function selectIncidentMode(mode) {
    selectedIncidentMode = mode;

    const realBtn = document.getElementById('modeReal');
    const trainingBtn = document.getElementById('modeTraining');
    const description = document.getElementById('modeDescription');

    if (mode === 'REAL') {
        realBtn.classList.add('active');
        realBtn.style.background = '#3b82f6';
        realBtn.style.color = 'white';
        realBtn.style.borderColor = '#3b82f6';

        trainingBtn.classList.remove('active');
        trainingBtn.style.background = 'white';
        trainingBtn.style.color = '#374151';
        trainingBtn.style.borderColor = '#d1d5db';

        description.textContent = window.t('faas2.mode.realDescription');
    } else {
        trainingBtn.classList.add('active');
        trainingBtn.style.background = '#3b82f6';
        trainingBtn.style.color = 'white';
        trainingBtn.style.borderColor = '#3b82f6';

        realBtn.classList.remove('active');
        realBtn.style.background = 'white';
        realBtn.style.color = '#374151';
        realBtn.style.borderColor = '#d1d5db';

        description.textContent = window.t('faas2.mode.trainingDescription');
    }
}

// Confirm and create incident
function confirmCreateIncident(scenarioId) {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) {
        alert(window.t('error.scenarioNotFound'));
        return;
    }

    // Create incident with selected mode
    if (typeof window.createIncidentFromScenario === 'function') {
        const incident = window.createIncidentFromScenario(scenarioId, scenario);

        // Update isExercise flag based on mode
        if (incident) {
            const incidents = JSON.parse(localStorage.getItem('bcm_incidents') || '[]');
            const idx = incidents.findIndex(i => i.id === incident);
            if (idx >= 0) {
                incidents[idx].isExercise = (selectedIncidentMode === 'TRAINING');
                localStorage.setItem('bcm_incidents', JSON.stringify(incidents));
            }
        }

        console.log(`[FAAS2] Incident created: ${incident} (${selectedIncidentMode})`);

        // Add timeline entry
        addToLog('SYSTEM_EVENT', window.t('crisis.log.created', { scenario: scenario.name, mode: selectedIncidentMode }));
    }

    // Clear flow state
    sessionStorage.removeItem('faas2_incident_flow');
    sessionStorage.setItem('faas2_incident_mode', selectedIncidentMode);

    // Close dialog
    const dialog = document.getElementById('faas2IncidentDialog');
    if (dialog) {
        dialog.remove();
    }

    // Reset mode to default
    selectedIncidentMode = 'REAL';

    // Update context box
    if (typeof window.updateContextBox === 'function') {
        window.updateContextBox();
    }

    // Navigate to scenario detail page
    currentScenario = scenario;
    navigateTo('scenarioDetailPage');

    // Update header
    document.getElementById('scenarioTitle').textContent = currentScenario.name;
    document.getElementById('scenarioDescription').textContent = currentScenario.description;

    // Render blocks
    renderQuickActions();

    // Show/hide Incident Metrics block for cyber scenarios only
    const metricsBlock = document.getElementById('incidentMetricsBlock');
    if (isCyberScenario(scenarioId)) {
        metricsBlock.style.display = 'block';
        renderIncidentMetrics();
    } else {
        metricsBlock.style.display = 'none';
    }

    renderActionPlan();
    renderCommunicationButtons();
    renderScenarioContacts();

    addToLog('ACTION', window.t('crisis.log.openedScenario', { scenario: currentScenario.name }));
}

// Cancel incident creation
function cancelIncidentCreation() {
    // Clear flow state
    sessionStorage.removeItem('faas2_incident_flow');
    sessionStorage.removeItem('faas2_selected_scenario');

    // Close dialog
    const dialog = document.getElementById('faas2IncidentDialog');
    if (dialog) {
        dialog.remove();
    }

    // Reset mode to default
    selectedIncidentMode = 'REAL';

    // Navigate back to home
    if (typeof window.goHome === 'function') {
        window.goHome();
    }
}

// Expose all functions globally for onclick handlers
// Note: activateCrisisMode and deactivateCrisisMode are now in src/utils/crisisMode.js
window.renderScenarios = renderScenarios;
window.openScenario = openScenario;
window.toggleChecklistItem = toggleChecklistItem;
window.sendCommunication = sendCommunication;
window.makeCall = makeCall;
window.exportLog = exportLog;
window.selectSLevel = selectSLevel;
window.setT0Now = setT0Now;
window.toggleAdditionalMetrics = toggleAdditionalMetrics;
window.saveIncidentMetrics = saveIncidentMetrics;
window.clearIncidentMetrics = clearIncidentMetrics;
window.viewLogEntry = viewLogEntry;
window.deleteLogEntry = deleteLogEntry;
window.selectIncidentMode = selectIncidentMode;
window.confirmCreateIncident = confirmCreateIncident;
window.cancelIncidentCreation = cancelIncidentCreation;
window.renderScenarioPage = renderScenarioPage;
window.renderScenarioDetail = renderScenarioPage; // Alias for incidentGate

// =============================================================================
// SALVESTA NUPP — salvestab kõik stsenaariumi andmed
// =============================================================================
function saveScenarioData() {
    // Kontrolli kas intsident on aktiivne
    const hasActive = typeof window.hasActiveIncident === 'function' && window.hasActiveIncident();
    const incidentId = typeof window.getActiveIncidentId === 'function' ? window.getActiveIncidentId() : null;
    
    if (!hasActive || !incidentId) {
        alert(window.t('crisis.warning.notOpen') + '\n\n' + window.t('crisis.warning.saveFirst'));
        return;
    }
    
    // Salvesta checklist
    saveChecklistToIncident();
    
    // Salvesta metrics (kui on cyber stsenaarium)
    if (currentScenario && isCyberScenario(currentScenario.id)) {
        // Metrics salvestatakse ainult kui vorm on täidetud
        if (selectedSLevel) {
            saveIncidentMetricsQuiet();
        }
    }
    
    // Näita kinnitust
    const statusEl = document.getElementById('saveStatus');
    if (statusEl) {
        statusEl.textContent = window.t('common.saved');
        statusEl.classList.add('show');
        setTimeout(() => {
            statusEl.classList.remove('show');
        }, 3000);
    }
    
    console.log('[CRISIS-APP] Scenario data saved for incident:', incidentId);
}

// Vaikne metrics salvestus (ilma alert'ita)
function saveIncidentMetricsQuiet() {
    const hasActive = typeof window.hasActiveIncident === 'function' && window.hasActiveIncident();
    const incidentId = typeof window.getActiveIncidentId === 'function' ? window.getActiveIncidentId() : null;
    
    if (!hasActive || !incidentId || !currentScenario) return;
    if (!selectedSLevel) return; // S-tase on kohustuslik

    // Collect form data
    const metrics = new IncidentMetrics();

    const t0Value = document.getElementById('t0Time')?.value;
    metrics.t0 = t0Value ? new Date(t0Value).toISOString() : null;
    metrics.sLevel = selectedSLevel;
    metrics.affectedDomain = document.getElementById('affectedDomain')?.value || '';
    metrics.serviceDisruption = document.getElementById('serviceDisruption')?.value || '';
    metrics.dataBreachSuspicion = document.getElementById('dataBreachSuspicion')?.value || '';
    metrics.spreadStatus = document.getElementById('spreadStatus')?.value || '';
    metrics.shortDescription = document.getElementById('shortDescription')?.value || '';

    // Notifications
    metrics.notifications.certEE.required = document.getElementById('certEE_required')?.value || 'TO_BE_ASSESSED';
    metrics.notifications.certEE.status = document.getElementById('certEE_status')?.value || 'PLANNED';
    metrics.notifications.dpoGDPR.required = document.getElementById('dpoGDPR_required')?.value || 'TO_BE_ASSESSED';
    metrics.notifications.dpoGDPR.status = document.getElementById('dpoGDPR_status')?.value || 'PLANNED';
    metrics.notifications.management.required = document.getElementById('management_required')?.value || 'TO_BE_ASSESSED';
    metrics.notifications.management.status = document.getElementById('management_status')?.value || 'PLANNED';

    // Save to bcm_incidents
    const incidents = JSON.parse(localStorage.getItem('bcm_incidents') || '[]');
    const incident = incidents.find(i => i.id === incidentId);
    
    if (incident) {
        incident.incidentMetrics = metrics;
        incident.severity = selectedSLevel;
        incident.updatedAt = new Date().toISOString();
        localStorage.setItem('bcm_incidents', JSON.stringify(incidents));
    }
}

// Expose globally
window.saveScenarioData = saveScenarioData;
