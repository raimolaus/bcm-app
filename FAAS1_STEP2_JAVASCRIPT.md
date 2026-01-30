# 📋 FAAS 1 - STEP 2: JAVASCRIPT ANDMED JA LOOGIKA

## 🎯 EESMÄRK
Loo andmestruktuurid ja JavaScript loogika intsidentide haldamiseks.

---

## ✅ SAMMUD

### 1. LOO UUS FAIL: src/data/incidents.js

```javascript
// Incidents Data Structure & Management
// This module handles incident creation, storage, and retrieval

// Incident status constants
export const IncidentStatus = {
    ACTIVE: 'ACTIVE',
    CONTAINED: 'CONTAINED',
    RESOLVED: 'RESOLVED',
    CLOSED: 'CLOSED'
};

// Incident type constants
export const IncidentType = {
    PHYSICAL: 'PHYSICAL',
    CYBER: 'CYBER'
};

// Severity levels (for cyber incidents)
export const SeverityLevel = {
    S0: 'S0', // Critical
    S1: 'S1', // High
    S2: 'S2', // Medium
    S3: 'S3'  // Low
};

// NIS2 Classification
export const NIS2Classification = {
    PROBABLE: 'PROBABLE',
    LIKELY: 'LIKELY',
    UNLIKELY: 'UNLIKELY',
    NO: 'NO'
};

// Generate unique incident ID
export function generateIncidentId() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-4);
    return `INC_${year}${month}${day}_${timestamp}`;
}

// Create new incident
export function createIncident(scenarioId, scenarioData) {
    const now = new Date().toISOString();
    
    const incident = {
        id: generateIncidentId(),
        scenarioId: scenarioId,
        scenarioName: scenarioData.name,
        type: determineIncidentType(scenarioId),
        isExercise: false, // Will be set by exercise mode toggle (Phase 2)
        status: IncidentStatus.ACTIVE,
        
        // Timing
        t0: now, // Detection time
        t1: now, // Start time
        tContainment: null,
        tResolution: null,
        tClosed: null,
        
        // Classification (for cyber incidents)
        severity: null,
        nis2Flag: null,
        
        // Impact
        impact: {
            affectedSystems: [],
            serviceInterruption: false,
            dataLeakSuspected: false,
            financialImpact: null,
            reputationalRisk: null
        },
        
        // People
        reportedBy: 'Kasutaja', // Will be replaced with actual user in Phase 3
        incidentCommander: null,
        team: [],
        
        // Actions timeline
        actions: [
            {
                timestamp: now,
                user: 'Süsteem',
                action: `Intsident loodud: ${scenarioData.name}`,
                category: 'SYSTEM'
            }
        ],
        
        // Checklist progress
        checklistProgress: {
            quickActions: {
                completed: 0,
                total: scenarioData.quickActions ? scenarioData.quickActions.length : 0
            },
            actionPlan: {
                completed: 0,
                total: scenarioData.actionPlan ? scenarioData.actionPlan.length : 0
            }
        },
        
        // Notifications
        notifications: {
            certee: { required: false, notified: false, timestamp: null, method: null },
            dpo: { required: false, notified: false, timestamp: null, method: null },
            management: { notified: false, timestamp: null, method: null }
        },
        
        // Communications
        communications: [],
        
        // Summary
        summary: '',
        rootCause: '',
        lessonsLearned: [],
        
        // Meta
        createdAt: now,
        updatedAt: now,
        createdBy: 'Kasutaja'
    };
    
    return incident;
}

// Determine incident type from scenario ID
function determineIncidentType(scenarioId) {
    const cyberScenarios = ['CYBER_INCIDENT', 'RANSOMWARE', 'REMOTE_ACCESS_COMPROMISE', 'OT_DISRUPTION'];
    return cyberScenarios.includes(scenarioId) ? IncidentType.CYBER : IncidentType.PHYSICAL;
}

// Save incident to LocalStorage
export function saveIncident(incident) {
    const incidents = loadIncidents();
    const existingIndex = incidents.findIndex(i => i.id === incident.id);
    
    incident.updatedAt = new Date().toISOString();
    
    if (existingIndex >= 0) {
        incidents[existingIndex] = incident;
    } else {
        incidents.push(incident);
    }
    
    localStorage.setItem('bcm_incidents', JSON.stringify(incidents));
    return incident;
}

// Load all incidents from LocalStorage
export function loadIncidents() {
    try {
        const data = localStorage.getItem('bcm_incidents');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading incidents:', error);
        return [];
    }
}

// Load single incident by ID
export function loadIncident(incidentId) {
    const incidents = loadIncidents();
    return incidents.find(i => i.id === incidentId);
}

// Add action to incident timeline
export function addIncidentAction(incidentId, action, category = 'ACTION') {
    const incident = loadIncident(incidentId);
    if (!incident) return null;
    
    incident.actions.push({
        timestamp: new Date().toISOString(),
        user: 'Kasutaja', // Will be replaced with actual user in Phase 3
        action: action,
        category: category
    });
    
    return saveIncident(incident);
}

// Update checklist progress
export function updateChecklistProgress(incidentId, checklistType, completed, total) {
    const incident = loadIncident(incidentId);
    if (!incident) return null;
    
    incident.checklistProgress[checklistType] = { completed, total };
    
    return saveIncident(incident);
}

// Calculate overall progress percentage
export function calculateProgress(incident) {
    if (!incident) return 0;
    
    const quick = incident.checklistProgress.quickActions;
    const plan = incident.checklistProgress.actionPlan;
    
    const totalCompleted = quick.completed + plan.completed;
    const totalItems = quick.total + plan.total;
    
    if (totalItems === 0) return 0;
    
    return Math.round((totalCompleted / totalItems) * 100);
}

// Get incidents by filter
export function getIncidentsByFilter(filter) {
    const incidents = loadIncidents();
    
    switch (filter) {
        case 'active':
            return incidents.filter(i => i.status === IncidentStatus.ACTIVE || i.status === IncidentStatus.CONTAINED);
        case 'exercise':
            return incidents.filter(i => i.isExercise === true);
        case 'closed':
            return incidents.filter(i => i.status === IncidentStatus.CLOSED);
        default:
            return incidents;
    }
}

// Sort incidents
export function sortIncidents(incidents, sortBy) {
    const sorted = [...incidents];
    
    switch (sortBy) {
        case 'date-desc':
            return sorted.sort((a, b) => new Date(b.t0) - new Date(a.t0));
        case 'date-asc':
            return sorted.sort((a, b) => new Date(a.t0) - new Date(b.t0));
        case 'severity':
            const severityOrder = { S0: 0, S1: 1, S2: 2, S3: 3, null: 4 };
            return sorted.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
        case 'status':
            const statusOrder = { ACTIVE: 0, CONTAINED: 1, RESOLVED: 2, CLOSED: 3 };
            return sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        default:
            return sorted;
    }
}

// Export incident as text
export function exportIncidentAsText(incident) {
    if (!incident) return '';
    
    let text = `BCM INTSIDENDI RAPORT
=====================================

Intsidendi ID: ${incident.id}
Stsenaarium: ${incident.scenarioName}
Tüüp: ${incident.type === 'CYBER' ? 'Küberintsident' : 'Füüsiline intsident'}
Õppus: ${incident.isExercise ? 'Jah' : 'Ei'}
Staatus: ${incident.status}

AJAD:
-----
Tuvastamine (t0): ${formatDateTime(incident.t0)}
${incident.tContainment ? `Ohjeldamine: ${formatDateTime(incident.tContainment)}` : ''}
${incident.tResolution ? `Lahendamine: ${formatDateTime(incident.tResolution)}` : ''}
${incident.tClosed ? `Sulgemine: ${formatDateTime(incident.tClosed)}` : ''}

`;

    if (incident.type === 'CYBER' && incident.severity) {
        text += `KLASSIFIKATSIOON:
-----------------
Tõsidus: ${incident.severity}
NIS2 lipp: ${incident.nis2Flag || 'Määramata'}

`;
    }

    text += `TEGEVUSTE AJALUGU:
------------------
`;
    incident.actions.forEach(action => {
        text += `[${formatDateTime(action.timestamp)}] ${action.user}: ${action.action}
`;
    });

    text += `
MÄRKMED:
--------
${incident.summary || 'Puudub'}

`;

    return text;
}

// Format date time for display
function formatDateTime(isoString) {
    if (!isoString) return 'Määramata';
    const date = new Date(isoString);
    return date.toLocaleString('et-EE');
}

// Sample incidents for testing (optional - comment out in production)
export const sampleIncidents = [
    {
        id: 'INC_20260130_001',
        scenarioId: 'RANSOMWARE',
        scenarioName: 'Ransomware rünnak',
        type: IncidentType.CYBER,
        isExercise: false,
        status: IncidentStatus.ACTIVE,
        t0: '2026-01-30T14:23:00',
        t1: '2026-01-30T14:25:00',
        tContainment: null,
        tResolution: null,
        tClosed: null,
        severity: SeverityLevel.S1,
        nis2Flag: NIS2Classification.LIKELY,
        impact: {
            affectedSystems: ['TOS Server', 'File Share'],
            serviceInterruption: true,
            dataLeakSuspected: false,
            financialImpact: 'MEDIUM',
            reputationalRisk: 'HIGH'
        },
        reportedBy: 'Raimo Laus',
        incidentCommander: 'Tanel Ringo',
        team: ['Raimo Laus', 'Toomas Uibokant'],
        actions: [
            {
                timestamp: '2026-01-30T14:23:00',
                user: 'Raimo Laus',
                action: 'Intsident tuvastatud - Ransomware TOS serveris',
                category: 'DETECTION'
            },
            {
                timestamp: '2026-01-30T14:25:00',
                user: 'Raimo Laus',
                action: 'TOS server isoleeritud võrgust',
                category: 'CONTAINMENT'
            },
            {
                timestamp: '2026-01-30T14:30:00',
                user: 'Tanel Ringo',
                action: 'Teavitatud CEO WhatsApp grupis',
                category: 'COMMUNICATION'
            }
        ],
        checklistProgress: {
            quickActions: { completed: 4, total: 4 },
            actionPlan: { completed: 3, total: 15 }
        },
        notifications: {
            certee: {
                required: true,
                notified: false,
                timestamp: null,
                method: null
            },
            dpo: {
                required: false,
                notified: false,
                timestamp: null,
                method: null
            },
            management: {
                required: true,
                notified: true,
                timestamp: '2026-01-30T14:30:00',
                method: 'whatsapp'
            }
        },
        communications: [],
        attachments: [],
        summary: 'Ransomware tuvastatud TOS serveris. Server isoleeritud, backup kontroll käimas.',
        rootCause: '',
        lessonsLearned: [],
        createdAt: '2026-01-30T14:23:00',
        updatedAt: '2026-01-30T14:30:00',
        createdBy: 'Raimo Laus'
    }
];

console.log('incidents.js loaded');
```

---

### 2. LOO UUS FAIL: src/pages/IncidentsPage.js

```javascript
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
        listContainer.innerHTML = '<p class="empty-message">Intsidente pole veel</p>';
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
                    ${incident.isExercise ? '🎓 ÕPPUS' : '⚠️ PÄRIS'}
                </div>
            </div>
            
            ${incident.status !== 'CLOSED' ? `
            <div class="incident-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <span class="progress-text">${progress}% valmis</span>
            </div>
            ` : ''}
            
            ${incident.summary ? `
            <div class="incident-summary">
                ${incident.summary.substring(0, 150)}${incident.summary.length > 150 ? '...' : ''}
            </div>
            ` : ''}
            
            <div class="incident-tags">
                <span class="tag tag-${incident.type.toLowerCase()}">${incident.type === 'CYBER' ? 'KÜBER' : 'FÜÜSILINE'}</span>
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
    const texts = {
        'ACTIVE': 'AKTIIVNE',
        'CONTAINED': 'OHJELDATUD',
        'RESOLVED': 'LAHENDATUD',
        'CLOSED': 'SULETUD'
    };
    return texts[status] || status;
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
    const texts = {
        'S0': 'KRIITILINE',
        'S1': 'KÕRGE',
        'S2': 'KESKMINE',
        'S3': 'MADAL'
    };
    return texts[severity] || '';
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
        alert('Intsidente pole veel');
        return;
    }
    
    let text = `BCM INTSIDENTIDE KOONDRAPORT
==============================
Eksporditud: ${new Date().toLocaleString('et-EE')}
Kokku intsidente: ${incidents.length}

`;

    incidents.forEach((incident, index) => {
        text += `
${index + 1}. ${incident.scenarioName} (${incident.id})
   Staatus: ${getStatusText(incident.status)}
   Aeg: ${formatDate(incident.t0)}
   Tüüp: ${incident.type === 'CYBER' ? 'Küber' : 'Füüsiline'}
   Õppus: ${incident.isExercise ? 'Jah' : 'Ei'}

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
```

---

### 3. LOO UUS FAIL: src/pages/IncidentDetailPage.js

```javascript
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
```

---

## ✅ TESTIMINE

Pärast neid muudatusi:

1. **Kontrolli failid:**
   - `src/data/incidents.js` on loodud ✓
   - `src/pages/IncidentsPage.js` on loodud ✓
   - `src/pages/IncidentDetailPage.js` on loodud ✓

2. **Kontrolli konsooli:**
   - Ava brauseris DevTools (F12)
   - Refresh lehte
   - Peaks nägema: "incidents.js loaded", "IncidentsPage.js loaded", "IncidentDetailPage.js loaded"

3. **Veel ei tööta:**
   - ❌ Lehed veel ei näita andmeid (tuleb STEP 3-s, kui integreerime app.js'iga)
   - ❌ Klõpsamine kaartidel ei tee midagi (tuleb STEP 3-s)

---

## 📝 MÄRKUSED

- ✅ Andmestruktuurid loodud
- ✅ JavaScript loogika valmis
- ✅ Sample data olemas (1 test intsident)
- ❌ Integratsioon puudub (tuleb STEP 3-s)

---

## 🎯 JÄRGMINE SAMM

**STEP 3:** Integreeri app.js'iga:
- Import'i uued moodulid
- Expose globaalsed funktsioonid
- Render'i incidentsList
- Update navigation

**Palun testi ja kinnita, et STEP 2 on tehtud (failid loodud)!** ✅

Siis annan sulle STEP 3! 😊
