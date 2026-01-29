// Crisis Mode Application Logic

import {
    SLevelDetails,
    IncidentMetrics,
    IncidentLogEntry,
    isCyberScenario,
    getDefaultNotificationRequirements
} from './src/data/incident-types.js';

let currentScenario = null;
let incidentLog = [];
let checklistStates = {};
let currentIncidentMetrics = null;
let currentIncidentLogId = null;

// Crisis Mode Activation
function activateCrisisMode() {
    navigateTo('crisisModePage');
    renderScenarios();
    addToLog('INFO', 'Kriisirežiim aktiveeritud');
}

function deactivateCrisisMode() {
    if (confirm('Kas oled kindel, et soovid kriisirežiimi deaktiveerida?')) {
        navigateTo('homePage');
        addToLog('INFO', 'Kriisirežiim deaktiveeritud');
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
            <p>${scenario.description}</p>
            <span class="priority-badge">${getPriorityText(scenario.priority)}</span>
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

    addToLog('ACTION', `Avatud stsenaarium: ${currentScenario.name}`);
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
                        Helista
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
    const names = {
        'SMS': 'SMS teavitus',
        'CALL': 'Telefoni kõne',
        'EMAIL': 'E-posti teavitus'
    };
    return names[channel] || channel;
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
    const checkbox = document.getElementById(itemId);
    const isChecked = checkbox.checked;

    checklistStates[itemId] = isChecked;

    // Update visual state
    const item = checkbox.closest('.checklist-item');
    if (isChecked) {
        item.classList.add('checked');
        addToLog('ACTION', `✓ ${itemTitle}`, getCurrentTimestamp());
    } else {
        item.classList.remove('checked');
        addToLog('INFO', `Eemaldatud linnuke: ${itemTitle}`);
    }
}

// Communications
function sendCommunication(commId, channel, title) {
    const comm = currentScenario.communications.find(c => c.id == commId);

    if (channel === 'SMS') {
        alert(`SMS saadetakse:\n\n${comm.template}`);
    } else if (channel === 'EMAIL') {
        alert(`E-post saadetakse:\n\nTeema: ${comm.subject || title}\n\n${comm.template || 'Mall saadetakse...'}`);
    } else if (channel === 'CALL') {
        makeCall(comm.phone);
    }

    addToLog('COMMUNICATION', `${channel}: ${title}`);
}

function makeCall(phoneNumber) {
    addToLog('COMMUNICATION', `Helistatud numbrile: ${phoneNumber}`);
    alert(`Helistatakse numbrile: ${phoneNumber}`);
    // In real app: window.location.href = `tel:${phoneNumber}`;
}

// Incident Log
function addToLog(type, message, timestamp) {
    const time = timestamp || getCurrentTimestamp();
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

    if (incidentLog.length === 0) {
        container.innerHTML = '<p class="empty-log">Logis pole veel kirjeid</p>';
        return;
    }

    // Get stored incident log entries (with metrics)
    const storedLog = JSON.parse(localStorage.getItem('incidentLog') || '[]');

    if (storedLog.length === 0) {
        container.innerHTML = '<p class="empty-log">Logis pole veel kirjeid</p>';
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
                        ${isExercise ? '<span class="exercise-badge">[ÕPPUS]</span>' : ''}
                        <span class="status-badge status-${status.toLowerCase()}">${status}</span>
                    </h3>
                    <span class="log-entry-id">${entry.id}</span>
                </div>
                <div class="log-entry-meta">
                    <span>🕐 Loodud: ${createdDate.toLocaleString('et-EE')}</span>
                    ${entry.updatedAt !== entry.createdAt ? `<span>🔄 Uuendatud: ${updatedDate.toLocaleString('et-EE')}</span>` : ''}
                </div>

                ${hasMetrics ? `
                    <div class="log-metrics-summary">
                        <h4>📊 Intsidenti mõõtmed</h4>
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
                            <h5>Teavituste staatus:</h5>
                            <div class="notifications-list">
                                ${renderNotificationStatus('CERT-EE', metrics.notifications.certEE)}
                                ${renderNotificationStatus('DPO/GDPR', metrics.notifications.dpoGDPR)}
                                ${renderNotificationStatus('Juhtkond', metrics.notifications.management)}
                            </div>
                        </div>

                        ${metrics.reporter || metrics.systemLocation || metrics.logger ? `
                            <div class="additional-info">
                                ${metrics.reporter ? `<div><strong>Raporteerija:</strong> ${metrics.reporter}</div>` : ''}
                                ${metrics.systemLocation ? `<div><strong>Süsteem:</strong> ${metrics.systemLocation}</div>` : ''}
                                ${metrics.logger ? `<div><strong>Logija:</strong> ${metrics.logger}</div>` : ''}
                            </div>
                        ` : ''}
                    </div>
                ` : ''}

                <div class="log-entry-actions">
                    <button class="btn-secondary-sm" onclick="viewLogEntry('${entry.id}')">👁️ Vaata</button>
                    ${status === 'OPEN' ?
                        `<button class="btn-secondary-sm" onclick="closeIncident('${entry.id}')">✓ Sulge intsident</button>` :
                        `<button class="btn-secondary-sm" onclick="reopenIncident('${entry.id}')">↻ Ava uuesti</button>`
                    }
                    <button class="btn-secondary-sm" onclick="deleteLogEntry('${entry.id}')">🗑️ Kustuta</button>
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
            ${notification.required === 'REQUIRED' ? '<span class="required-badge">⚠️ Vajalik</span>' : ''}
            ${timestamp}
        </div>
    `;
}

// Helper function to get notification status text
function getNotificationStatusText(status) {
    const texts = {
        'PLANNED': 'Planeeritud',
        'SENT': 'Saadetud',
        'NOT_NEEDED': 'Pole vaja'
    };
    return texts[status] || status;
}

// View log entry details
function viewLogEntry(entryId) {
    const storedLog = JSON.parse(localStorage.getItem('incidentLog') || '[]');
    const entry = storedLog.find(e => e.id === entryId);

    if (!entry) {
        alert('Logikirjet ei leitud');
        return;
    }

    alert(`Logikirje detailid:\n\n${JSON.stringify(entry, null, 2)}`);
    // TODO: Implement proper detail view modal
}

// Delete log entry
function deleteLogEntry(entryId) {
    if (!confirm('Kas oled kindel, et soovid selle logikirje kustutada?')) {
        return;
    }

    let storedLog = JSON.parse(localStorage.getItem('incidentLog') || '[]');
    storedLog = storedLog.filter(e => e.id !== entryId);
    localStorage.setItem('incidentLog', JSON.stringify(storedLog));

    alert('Logikirje kustutatud');
    renderIncidentLog();
    addToLog('SYSTEM_EVENT', `Logikirje kustutatud: ${entryId}`);

    // Update system status after deletion
    if (window.updateSystemStatus) {
        window.updateSystemStatus();
    }
}

// Close incident
function closeIncident(entryId) {
    if (!confirm('Kas oled kindel, et soovid selle intsidendi sulgeda?')) {
        return;
    }

    let storedLog = JSON.parse(localStorage.getItem('incidentLog') || '[]');
    const entry = storedLog.find(e => e.id === entryId);

    if (entry) {
        entry.status = 'CLOSED';
        entry.updatedAt = new Date().toISOString();
        localStorage.setItem('incidentLog', JSON.stringify(storedLog));

        alert('Intsident suletud');
        renderIncidentLog();
        addToLog('SYSTEM_EVENT', `Intsident suletud: ${entryId}`);

        // Update system status after closing
        if (window.updateSystemStatus) {
            window.updateSystemStatus();
        }
    }
}

// Reopen incident
function reopenIncident(entryId) {
    if (!confirm('Kas oled kindel, et soovid selle intsidendi uuesti avada?')) {
        return;
    }

    let storedLog = JSON.parse(localStorage.getItem('incidentLog') || '[]');
    const entry = storedLog.find(e => e.id === entryId);

    if (entry) {
        entry.status = 'OPEN';
        entry.updatedAt = new Date().toISOString();
        localStorage.setItem('incidentLog', JSON.stringify(storedLog));

        alert('Intsident avatud');
        renderIncidentLog();
        addToLog('SYSTEM_EVENT', `Intsident avatud uuesti: ${entryId}`);

        // Update system status after reopening
        if (window.updateSystemStatus) {
            window.updateSystemStatus();
        }
    }
}

function getLogTypeIcon(type) {
    const icons = {
        'INFO': 'ℹ️',
        'ACTION': '✓',
        'COMMUNICATION': '📧',
        'SYSTEM_EVENT': '⚙️'
    };
    return icons[type] || '•';
}

function exportLog() {
    if (incidentLog.length === 0) {
        alert('Logis pole veel kirjeid');
        return;
    }

    let logText = `BCM Sündmuste Logi\nEksportitud: ${new Date().toLocaleString('et-EE')}\n\n`;
    logText += `Stsenaarium: ${currentScenario ? currentScenario.name : 'Pole valitud'}\n\n`;
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

    addToLog('SYSTEM_EVENT', 'Logi eksporditud');
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

    addToLog('INFO', `S-tase valitud: ${level}`);
}

// Set t0 to current time
function setT0Now() {
    const now = new Date();
    const dateTimeLocal = now.toISOString().slice(0, 16);
    document.getElementById('t0Time').value = dateTimeLocal;
    addToLog('INFO', 't0 määratud praegusele ajale');
}

// Toggle Additional Metrics
function toggleAdditionalMetrics() {
    const content = document.getElementById('additionalMetricsContent');
    const toggleText = document.getElementById('additionalMetricsToggleText');

    if (content.style.display === 'none') {
        content.style.display = 'block';
        toggleText.textContent = '▼ Peida lisaväljad';
    } else {
        content.style.display = 'none';
        toggleText.textContent = '▶ Näita lisaväljad';
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
    if (!currentScenario) {
        alert('Palun vali esmalt stsenaarium');
        return;
    }

    // Validate MVP fields
    if (!selectedSLevel) {
        alert('Palun vali S-tase');
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

    // Create or update incident log entry
    let logEntry;
    if (currentIncidentLogId) {
        // Update existing
        const existingIndex = incidentLog.findIndex(log => log.id === currentIncidentLogId);
        if (existingIndex >= 0) {
            logEntry = incidentLog[existingIndex];
            logEntry.incidentMetrics = metrics;
            logEntry.updatedAt = new Date().toISOString();
        }
    } else {
        // Create new
        logEntry = new IncidentLogEntry(currentScenario.id, currentScenario.name, metrics);
        incidentLog.push(logEntry);
        currentIncidentLogId = logEntry.id;
    }

    // Save to localStorage
    localStorage.setItem('incidentLog', JSON.stringify(incidentLog));

    currentIncidentMetrics = metrics;

    alert('Intsidenti mõõtmed salvestatud!');
    addToLog('SYSTEM_EVENT', `💾 Intsidenti mõõtmed salvestatud (${logEntry.id})`);

    console.log('Saved incident metrics:', metrics);
    console.log('Saved log entry:', logEntry);

    // Update system status after saving incident
    if (window.updateSystemStatus) {
        window.updateSystemStatus();
    }
}

// Clear Incident Metrics Form
function clearIncidentMetrics() {
    if (!confirm('Kas oled kindel, et soovid vormi tühjendada?')) {
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

    addToLog('INFO', 'Intsidenti mõõtmed tühjendatud');
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

// Load incident log from localStorage on startup
document.addEventListener('DOMContentLoaded', function() {
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

// Expose all functions globally for onclick handlers
window.activateCrisisMode = activateCrisisMode;
window.deactivateCrisisMode = deactivateCrisisMode;
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
