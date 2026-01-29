// Incident Management Types and Enums

// S-Level Classification
export const SLevel = {
    S0: 'S0',
    S1: 'S1',
    S2: 'S2',
    S3: 'S3'
};

export const SLevelDetails = {
    S0: {
        id: 'S0',
        name: 'KRIITILINE',
        description: 'OT/terminali põhiprotsess seiskub; ransomware',
        response: '≤15 min',
        containment: '≤1 h',
        nis2: 'TÕENÄOLINE',
        class: 'critical'
    },
    S1: {
        id: 'S1',
        name: 'KÕRGE',
        description: 'Oluline teenusehäire; kinnitatud pahavara',
        response: '≤30 min',
        containment: '≤4 h',
        nis2: 'VÕIMALIK',
        class: 'high'
    },
    S2: {
        id: 'S2',
        name: 'KESKMINE',
        description: 'Piiratud intsident ühes süsteemis',
        response: '≤2 h',
        containment: '≤24 h',
        nis2: 'EBAUSUTAV',
        class: 'medium'
    },
    S3: {
        id: 'S3',
        name: 'MADAL',
        description: 'Turvasündmus/hoiatus, false positive',
        response: '≤24 h',
        containment: '≤48 h',
        nis2: 'EI',
        class: 'low'
    }
};

// Affected Domain
export const AffectedDomain = {
    IT: 'IT',
    OT: 'OT',
    BOTH: 'Mõlemad',
    UNKNOWN: 'Teadmata'
};

// Service Disruption
export const ServiceDisruption = {
    YES: 'Jah',
    NO: 'Ei',
    PARTIAL: 'Osaline',
    UNKNOWN: 'Teadmata'
};

// Data Breach Suspicion
export const DataBreachSuspicion = {
    YES: 'Jah',
    NO: 'Ei',
    UNKNOWN: 'Teadmata'
};

// Spread Status
export const SpreadStatus = {
    ONGOING: 'Käib',
    LIMITED: 'Piiratud',
    STOPPED: 'Peatatud',
    UNKNOWN: 'Teadmata'
};

// NIS2 Relevance
export const NIS2Relevance = {
    YES: 'Jah',
    NO: 'Ei',
    UNKNOWN: 'Teadmata'
};

// Notification Requirement
export const NotificationRequirement = {
    REQUIRED: 'Vajalik',
    NOT_REQUIRED: 'Pole vaja',
    TO_BE_ASSESSED: 'Hinnata'
};

// Notification Status
export const NotificationStatus = {
    PLANNED: 'Planeeritud',
    SENT: 'Saadetud',
    NOT_NEEDED: 'Pole vaja'
};

// Notification Recipients
export const NotificationRecipient = {
    CERT_EE: 'CERT-EE',
    DPO_GDPR: 'DPO/GDPR',
    MANAGEMENT: 'Juhtkond'
};

// Incident Metrics Structure (for forms and storage)
export class IncidentMetrics {
    constructor() {
        this.t0 = null; // DateTime
        this.sLevel = null; // SLevel enum
        this.affectedDomain = null; // AffectedDomain enum
        this.serviceDisruption = null; // ServiceDisruption enum
        this.dataBreachSuspicion = null; // DataBreachSuspicion enum
        this.spreadStatus = null; // SpreadStatus enum
        this.shortDescription = ''; // Text

        // Notifications
        this.notifications = {
            certEE: {
                required: NotificationRequirement.TO_BE_ASSESSED,
                status: NotificationStatus.PLANNED,
                timestamp: null
            },
            dpoGDPR: {
                required: NotificationRequirement.TO_BE_ASSESSED,
                status: NotificationStatus.PLANNED,
                timestamp: null
            },
            management: {
                required: NotificationRequirement.TO_BE_ASSESSED,
                status: NotificationStatus.PLANNED,
                timestamp: null
            }
        };

        // Additional fields (nice-to-have)
        this.reporter = ''; // Text/ContactRef
        this.systemLocation = ''; // Text
        this.nis2Relevant = NIS2Relevance.UNKNOWN; // NIS2Relevance enum
        this.initialIndicators = ''; // Text
        this.evidenceArtifacts = []; // Array of strings
        this.logger = ''; // Text/ContactRef (kes hoiab ajajoont)
    }
}

// Incident Log Entry Status
export const IncidentStatus = {
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
    RESOLVED: 'RESOLVED'
};

// Incident Log Entry Structure
export class IncidentLogEntry {
    constructor(scenarioId, scenarioName, incidentMetrics = null) {
        this.id = `INC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.scenarioId = scenarioId;
        this.scenarioName = scenarioName;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        this.incidentMetrics = incidentMetrics || new IncidentMetrics();
        this.actions = []; // Array of completed actions
        this.communications = []; // Array of sent communications
        this.notes = []; // Array of timestamped notes

        // New fields for iteration 2
        this.isExercise = isExerciseMode(); // Auto-detect from global exercise mode
        this.status = IncidentStatus.OPEN; // OPEN, CLOSED, RESOLVED
    }
}

// Cyber scenario IDs (for filtering)
export const CyberScenarioIds = [
    'CYBER_INCIDENT',
    'RANSOMWARE',
    'REMOTE_ACCESS_COMPROMISE',
    'OT_DISRUPTION'
];

// Helper function to check if scenario is cyber-related
export function isCyberScenario(scenarioId) {
    return CyberScenarioIds.includes(scenarioId);
}

// Helper function to get default notification requirements based on S-Level
export function getDefaultNotificationRequirements(sLevel, dataBreachSuspicion) {
    const requirements = {
        certEE: NotificationRequirement.TO_BE_ASSESSED,
        dpoGDPR: NotificationRequirement.TO_BE_ASSESSED,
        management: NotificationRequirement.TO_BE_ASSESSED
    };

    // Auto-suggest based on S-Level
    if (sLevel === SLevel.S0 || sLevel === SLevel.S1) {
        requirements.certEE = NotificationRequirement.REQUIRED;
        requirements.management = NotificationRequirement.REQUIRED;
    }

    // Auto-suggest based on data breach suspicion
    if (dataBreachSuspicion === DataBreachSuspicion.YES) {
        requirements.dpoGDPR = NotificationRequirement.REQUIRED;
    }

    return requirements;
}

// ========================================================================
// SYSTEM STATUS (for Dashboard status card and top bar indicator)
// ========================================================================

// System Status Levels
export const SystemStatusLevel = {
    OK: 'OK',
    WARNING: 'WARNING',
    ALERT: 'ALERT'
};

// System Status Source
export const SystemStatusSource = {
    AUTO: 'AUTO',
    MANUAL: 'MANUAL'
};

// System Status Structure
export class SystemStatus {
    constructor() {
        this.status = SystemStatusLevel.OK;
        this.reason = '';
        this.source = SystemStatusSource.AUTO;
        this.updatedAt = new Date().toISOString();
        this.updatedBy = null; // Optional user info
    }
}

// Helper function to get status display info
export function getSystemStatusDisplay(status) {
    const displays = {
        OK: {
            level: 'OK',
            label: 'Kõik süsteemid töötavad tavapäraselt',
            color: '#22c55e',
            bgColor: '#f0fdf4',
            icon: '✓'
        },
        WARNING: {
            level: 'WARNING',
            label: 'Hoiatus',
            color: '#f59e0b',
            bgColor: '#fffbeb',
            icon: '⚠'
        },
        ALERT: {
            level: 'ALERT',
            label: 'Häire',
            color: '#dc2626',
            bgColor: '#fef2f2',
            icon: '🚨'
        }
    };
    return displays[status] || displays.OK;
}

// ========================================================================
// EXERCISE MODE
// ========================================================================

// Exercise mode state (stored in localStorage)
export function isExerciseMode() {
    return localStorage.getItem('exerciseMode') === 'true';
}

export function setExerciseMode(enabled) {
    localStorage.setItem('exerciseMode', enabled ? 'true' : 'false');
}

console.log('incident-types.js loaded');
