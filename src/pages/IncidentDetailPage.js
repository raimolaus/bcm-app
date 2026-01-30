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
    return `
        <div class="incident-overview-grid">
            <div class="overview-section">
                <h3>📊 Põhiinfo</h3>
                <div class="overview-item">
                    <span class="overview-label">t0 (Tuvastamine):</span>
                    <span class="overview-value">${formatDateTime(currentIncident.t0)}</span>
                </div>
                <div class="overview-item">
                    <span class="overview-label">Incident Commander:</span>
                    <span class="overview-value">${currentIncident.incidentCommander || 'Määramata'}</span>
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
                    <span class="overview-label">Mõjutatud süsteemid:</span>
                    <span class="overview-value">${currentIncident.impact?.affectedSystems?.join(', ') || 'Määramata'}</span>
                </div>
                <div class="overview-item">
                    <span class="overview-label">Teenuse katkestus:</span>
                    <span class="overview-value">${currentIncident.impact?.serviceInterruption ? '❌ Jah' : '✅ Ei'}</span>
                </div>
                <div class="overview-item">
                    <span class="overview-label">Andmeleke kahtlus:</span>
                    <span class="overview-value">${currentIncident.impact?.dataLeakSuspected ? '⚠️ Jah' : '✅ Ei'}</span>
                </div>
            </div>
            ` : ''}

            <div class="overview-section">
                <h3>👥 Meeskond</h3>
                ${currentIncident.team && currentIncident.team.length > 0 ?
                    currentIncident.team.map(member => `
                        <div class="overview-item">
                            <span class="overview-value">👤 ${member}</span>
                        </div>
                    `).join('') :
                    '<p>Meeskond määramata</p>'
                }
            </div>

            <div class="overview-section">
                <h3>📝 Kokkuvõte</h3>
                <p>${currentIncident.summary || 'Kokkuvõte puudub'}</p>
            </div>
        </div>
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

// Incident detail actions (exposed globally)
export const incidentDetailActions = {
    loadIncident: loadIncidentDetail,
    switchTab: switchTab,
    exportCurrent: exportCurrentIncident,
    updateStatus: () => {
        alert('Staatuse uuendamine tuleb järgmises faasis');
    }
};

console.log('IncidentDetailPage.js loaded');
