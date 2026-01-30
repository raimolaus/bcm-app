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
