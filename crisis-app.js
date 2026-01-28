// Crisis Mode Application Logic

let currentScenario = null;
let incidentLog = [];
let checklistStates = {};

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

    container.innerHTML = incidentLog.reverse().map(entry => `
        <div class="log-entry log-${entry.type.toLowerCase()}">
            <div class="log-time">${entry.timestamp}</div>
            <div class="log-content">
                <span class="log-type">${getLogTypeIcon(entry.type)}</span>
                <p>${entry.message}</p>
                <span class="log-user">${entry.user}</span>
            </div>
        </div>
    `).join('');
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


// WAR ROOM FUNCTIONALITY
let warRoomData = {
    t0: null,
    reporter: null,
    classification: null,
    isActive: false
};

function openWarRoom() {
    navigateTo('warRoomPage');
    renderClassificationCards();
    addToLog('INFO', 'War Room avatud');
}

function setT0Now() {
    const now = new Date();
    const dateTimeLocal = now.toISOString().slice(0, 16);
    document.getElementById('t0Time').value = dateTimeLocal;
    warRoomData.t0 = now;
}

function renderClassificationCards() {
    const classifications = [
        { id: 'S0', name: 'KRIITILINE', description: 'OT/terminali põhiprotsess seiskub; ransomware', response: '≤15 min', containment: '≤1 h', nis2: 'TÕENÄOLINE', class: 'critical' },
        { id: 'S1', name: 'KÕRGE', description: 'Oluline teenusehäire; kinnitatud pahavara', response: '≤30 min', containment: '≤4 h', nis2: 'VÕIMALIK', class: 'high' },
        { id: 'S2', name: 'KESKMINE', description: 'Piiratud intsident ühes süsteemis', response: '≤2 h', containment: '≤24 h', nis2: 'EBAUSUTAV', class: 'medium' },
        { id: 'S3', name: 'MADAL', description: 'Turvasündmus/hoiatus, false positive', response: '≤24 h', containment: '≤48 h', nis2: 'EI', class: 'low' }
    ];
    const grid = document.getElementById('classificationGrid');
    if (!grid) return;
    grid.innerHTML = classifications.map(c => `
        <div class="classification-card ${c.class}" onclick="selectClassification('${c.id}')">
            <div class="classification-badge ${c.class}">${c.id}</div>
            <h3>${c.name}</h3>
            <p>${c.description}</p>
            <div class="classification-meta">
                <div>⏱️ ${c.response}</div>
                <div>🎯 ${c.containment}</div>
                <div>📋 ${c.nis2}</div>
            </div>
        </div>
    `).join('');
}

function selectClassification(level) {
    warRoomData.classification = level;
    document.getElementById('selectedClassification').style.display = 'block';
    document.getElementById('classificationDisplay').textContent = level;
    document.querySelectorAll('.classification-card').forEach(card => card.classList.remove('selected'));
    event.target.closest('.classification-card').classList.add('selected');
    addToLog('INFO', 'Intsident klassifitseeritud: ' + level);
}

function activateWarRoom() {
    warRoomData.isActive = true;
    alert('WAR ROOM AKTIVEERITUD!');
    addToLog('SYSTEM_EVENT', '🚨 War Room aktiveeritud');
}

function notifyCERT() {
    alert('CERT-EE teavitamine: cert@cert.ee | +372 663 0299');
    addToLog('COMMUNICATION', 'CERT-EE teavitatud');
}

function saveAssessment() {
    localStorage.setItem('warRoomData', JSON.stringify(warRoomData));
    alert('Hindamine salvestatud!');
    addToLog('SYSTEM_EVENT', 'War Room hindamine salvestatud');
}

function exportAssessmentPDF() {
    const data = 'KÜBERINTSIDENDI HINDAMINE\n\nKlassifikatsioon: ' + (warRoomData.classification || 'Pole määratud');
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'War_Room_Hindamine.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToLog('SYSTEM_EVENT', 'Hindamine eksporditud');
}

console.log('War Room functions loaded');
