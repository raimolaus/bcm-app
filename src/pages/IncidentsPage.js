// Incidents Page - BCM App
// Displays list of all incidents with filtering and sorting

import {
    loadIncidents,
    getIncidentsByFilter,
    sortIncidents,
    calculateProgress,
    exportIncidentAsText,
    sampleIncidents
} from '../data/incidents.js';

let currentFilter = 'all';
let currentSort = 'date-desc';

export function initIncidentsPage() {
    console.log('Incidents page initialized');

    // Load sample data if no incidents exist (for testing)
    const existing = loadIncidents();
    if (existing.length === 0 && sampleIncidents.length > 0) {
        localStorage.setItem('bcm_incidents', JSON.stringify(sampleIncidents));
        console.log('Loaded sample incidents for testing');
    }
}

export function renderIncidentsList() {
    updateIncidentsCounts();

    let incidents = getIncidentsByFilter(currentFilter);
    incidents = sortIncidents(incidents, currentSort);

    const listContainer = document.getElementById('incidentsList');
    if (!listContainer) return;

    if (incidents.length === 0) {
        listContainer.innerHTML = `<p class="empty-message">${window.t('incidents.empty')}</p>`;
        return;
    }

    listContainer.innerHTML = incidents.map(incident => renderIncidentCard(incident)).join('');
}

function renderIncidentCard(incident) {
    const progress = calculateProgress(incident);
    const statusClass = `status-${incident.status.toLowerCase()}`;
    const typeClass = incident.isExercise ? 'type-exercise' : 'type-real';

    return `
        <div class="incident-card ${statusClass}" onclick="window.incidentActions.openIncident('${incident.id}')">
            <div class="incident-header">
                <div class="incident-icon">${getIncidentIcon(incident.type)}</div>
                <div class="incident-title">
                    <h3>${incident.scenarioName}</h3>
                    <p class="incident-id">${incident.id}</p>
                </div>
                <div class="incident-status ${statusClass}">
                    <span class="status-dot"></span>
                    ${getStatusText(incident.status)}
                </div>
            </div>

            <div class="incident-meta">
                <div class="meta-item">
                    📅 ${formatDate(incident.t0)}
                </div>
                ${incident.severity ? `
                <div class="meta-item">
                    ${getSeverityEmoji(incident.severity)} ${incident.severity} - ${getSeverityText(incident.severity)}
                </div>
                ` : ''}
                ${incident.incidentCommander ? `
                <div class="meta-item">
                    👤 ${incident.incidentCommander}
                </div>
                ` : ''}
                <div class="meta-item ${typeClass}">
                    ${incident.isExercise ? '🎓 ' + window.t('incident.type.exercise') : '⚠️ ' + window.t('incident.type.real')}
                </div>
            </div>

            ${incident.status !== 'CLOSED' ? `
            <div class="incident-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <span class="progress-text">${window.t('incident.progress', { progress })}</span>
            </div>
            ` : ''}

            ${incident.summary ? `
            <div class="incident-summary">
                ${incident.summary.substring(0, 150)}${incident.summary.length > 150 ? '...' : ''}
            </div>
            ` : ''}

            <div class="incident-tags">
                <span class="tag tag-${incident.type.toLowerCase()}">${incident.type === 'CYBER' ? window.t('incident.type.cyber') : window.t('incident.type.physical')}</span>
                ${incident.nis2Flag && incident.nis2Flag !== 'NO' ? '<span class="tag tag-nis2">NIS2</span>' : ''}
                ${incident.notifications?.certee?.notified ? '<span class="tag tag-certee">CERT-EE ✓</span>' : ''}
            </div>
        </div>
    `;
}

function getIncidentIcon(type) {
    return type === 'CYBER' ? '🔐' : '⚠️';
}

function getStatusText(status) {
    const keys = {
        'ACTIVE': 'active',
        'CONTAINED': 'contained',
        'RESOLVED': 'resolved',
        'CLOSED': 'closed'
    };
    return keys[status] ? window.t(`incident.status.${keys[status]}`) : status;
}

function getSeverityEmoji(severity) {
    const emojis = {
        'S0': '🔴',
        'S1': '🟠',
        'S2': '🟡',
        'S3': '🔵'
    };
    return emojis[severity] || '';
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

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('et-EE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function updateIncidentsCounts() {
    const all = loadIncidents();
    const active = all.filter(i => i.status === 'ACTIVE' || i.status === 'CONTAINED');
    const exercise = all.filter(i => i.isExercise === true);
    const closed = all.filter(i => i.status === 'CLOSED');

    const countAll = document.getElementById('countAll');
    const countActive = document.getElementById('countActive');
    const countExercise = document.getElementById('countExercise');
    const countClosed = document.getElementById('countClosed');

    if (countAll) countAll.textContent = `(${all.length})`;
    if (countActive) countActive.textContent = `(${active.length})`;
    if (countExercise) countExercise.textContent = `(${exercise.length})`;
    if (countClosed) countClosed.textContent = `(${closed.length})`;

    // Update home page badge
    const badge = document.getElementById('activeIncidentsBadge');
    const count = document.querySelector('.active-incidents-count');
    if (badge && count) {
        if (active.length > 0) {
            badge.style.display = 'block';
            count.textContent = active.length;
        } else {
            badge.style.display = 'none';
        }
    }
}

export function filterIncidents(filter) {
    currentFilter = filter;

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });

    renderIncidentsList();
}

export function sortIncidentsBy(sortBy) {
    currentSort = sortBy;
    renderIncidentsList();
}

export function exportAllIncidents() {
    const incidents = loadIncidents();
    if (incidents.length === 0) {
        alert(window.t('incidents.empty'));
        return;
    }

    let text = `${window.t('report.incidentsTitle')}
==============================
${window.t('report.header.exported', { date: new Date().toLocaleString('et-EE') })}
${window.t('report.header.total', { count: incidents.length })}

`;

    incidents.forEach((incident, index) => {
        const typeText = incident.type === 'CYBER' ? window.t('report.type.cyber') : window.t('report.type.physical');
        const exerciseText = incident.isExercise ? window.t('common.yes') : window.t('common.no');
        text += `
${index + 1}. ${incident.scenarioName} (${incident.id})
   ${window.t('report.incident.status', { status: getStatusText(incident.status) })}
   ${window.t('report.incident.time', { time: formatDate(incident.t0) })}
   ${window.t('report.incident.type', { type: typeText })}
   ${window.t('report.incident.exercise', { value: exerciseText })}

`;
    });

    downloadTextFile(text, `BCM_Intsidendid_${Date.now()}.txt`);
}

export function openIncident(incidentId) {
    if (window.navigateTo) {
        window.navigateTo('incidentDetailPage');
    }

    // Will be implemented in IncidentDetailPage.js
    if (window.incidentDetailActions && window.incidentDetailActions.loadIncident) {
        window.incidentDetailActions.loadIncident(incidentId);
    }
}

function downloadTextFile(text, filename) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Incident actions (exposed globally for onclick handlers)
export const incidentActions = {
    filter: filterIncidents,
    sort: sortIncidentsBy,
    exportAll: exportAllIncidents,
    openIncident: openIncident,
    switchTab: (tab) => {
        console.log('Switch tab:', tab);
        // Will be implemented in IncidentDetailPage
    },
    exportCurrent: () => {
        console.log('Export current incident');
        // Will be implemented in IncidentDetailPage
    },
    updateStatus: () => {
        console.log('Update status');
        // Will be implemented in IncidentDetailPage
    }
};

console.log('IncidentsPage.js loaded');
