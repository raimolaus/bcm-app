// System Status Management
import {
    SystemStatus,
    SystemStatusLevel,
    SystemStatusSource,
    getSystemStatusDisplay,
    isExerciseMode,
    setExerciseMode,
    IncidentStatus,
    SLevel
} from '../data/incident-types.js';

// Get current system status from localStorage
export function getSystemStatus() {
    const stored = localStorage.getItem('systemStatus');
    if (stored) {
        return JSON.parse(stored);
    }
    // Default
    const status = new SystemStatus();
    saveSystemStatus(status);
    return status;
}

// Save system status to localStorage
export function saveSystemStatus(status) {
    localStorage.setItem('systemStatus', JSON.stringify(status));
}

// Calculate automatic system status based on open incidents
export function calculateAutoSystemStatus() {
    const incidentLog = JSON.parse(localStorage.getItem('incidentLog') || '[]');

    // Filter open incidents (not exercise mode)
    const openRealIncidents = incidentLog.filter(entry =>
        entry.status === IncidentStatus.OPEN &&
        !entry.isExercise
    );

    // Check if exercise mode is active
    const exerciseMode = isExerciseMode();

    // Rule 1: If there's an open S0/S1 real incident -> ALERT
    const criticalIncident = openRealIncidents.find(entry =>
        entry.incidentMetrics &&
        (entry.incidentMetrics.sLevel === SLevel.S0 || entry.incidentMetrics.sLevel === SLevel.S1)
    );

    if (criticalIncident) {
        return {
            status: SystemStatusLevel.ALERT,
            reason: `Aktiivne intsident: ${criticalIncident.scenarioName} (${criticalIncident.incidentMetrics.sLevel}), alates ${new Date(criticalIncident.createdAt).toLocaleString('et-EE')}`,
            source: SystemStatusSource.AUTO
        };
    }

    // Rule 2: If there's an open S2/S3 real incident -> WARNING
    const warningIncident = openRealIncidents.find(entry =>
        entry.incidentMetrics &&
        (entry.incidentMetrics.sLevel === SLevel.S2 || entry.incidentMetrics.sLevel === SLevel.S3)
    );

    if (warningIncident) {
        return {
            status: SystemStatusLevel.WARNING,
            reason: `Aktiivne intsident: ${warningIncident.scenarioName} (${warningIncident.incidentMetrics.sLevel})`,
            source: SystemStatusSource.AUTO
        };
    }

    // Rule 3: If exercise mode is active and no open real incidents -> WARNING
    if (exerciseMode && openRealIncidents.length === 0) {
        return {
            status: SystemStatusLevel.WARNING,
            reason: 'ÕPPUS režiim aktiivne',
            source: SystemStatusSource.AUTO
        };
    }

    // Rule 4: No open real incidents and no exercise mode -> OK
    return {
        status: SystemStatusLevel.OK,
        reason: 'Kõik kriitilised süsteemid töötavad tavapäraselt',
        source: SystemStatusSource.AUTO
    };
}

// Update system status (check if manual override exists, otherwise calculate auto)
export function updateSystemStatus() {
    let currentStatus = getSystemStatus();
    const autoStatus = calculateAutoSystemStatus();

    // If manual override exists, check if it should be overridden by critical incident
    if (currentStatus.source === SystemStatusSource.MANUAL) {
        // Critical S0/S1 incident always overrides manual status to ALERT
        if (autoStatus.status === SystemStatusLevel.ALERT) {
            currentStatus = {
                ...autoStatus,
                source: SystemStatusSource.AUTO,
                updatedAt: new Date().toISOString()
            };
        }
        // Otherwise keep manual status
    } else {
        // Auto mode - use calculated status
        currentStatus = {
            ...autoStatus,
            updatedAt: new Date().toISOString()
        };
    }

    saveSystemStatus(currentStatus);
    updateSystemStatusUI(currentStatus);
    return currentStatus;
}

// Update UI based on system status
export function updateSystemStatusUI(status) {
    const display = getSystemStatusDisplay(status.status);

    // Update top bar status pill
    const pill = document.getElementById('statusPill');
    const pillIcon = document.getElementById('statusPillIcon');
    const pillText = document.getElementById('statusPillText');

    if (pill && pillIcon && pillText) {
        pill.style.backgroundColor = display.bgColor;
        pill.style.color = display.color;
        pill.style.borderColor = display.color;

        pillIcon.textContent = display.icon;
        pillText.textContent = display.label;

        // Update visibility based on status and current page
        const isHome = document.getElementById('homePage')?.classList.contains('active') || false;
        if (status.status === SystemStatusLevel.ALERT || status.status === SystemStatusLevel.WARNING) {
            pill.style.display = 'flex'; // Always visible
        } else {
            pill.style.display = isHome ? 'flex' : 'none'; // OK only on Home
        }
    }

    // Update Home page system status card
    const statusIcon = document.getElementById('statusIcon');
    const statusReason = document.getElementById('systemStatusReason');
    const statusSource = document.getElementById('statusSource');
    const statusCard = document.getElementById('systemStatusCard');
    const statusActions = document.getElementById('systemStatusActions');

    if (statusCard && statusReason) {
        statusCard.style.backgroundColor = display.bgColor;
        statusCard.style.borderColor = display.color;

        if (statusIcon) {
            statusIcon.style.stroke = display.color;
        }

        statusReason.textContent = status.reason;

        if (statusSource) {
            statusSource.textContent = status.source === SystemStatusSource.MANUAL ? '(Käsitsi määratud)' : '';
        }

        // Show "View active incidents" link if ALERT
        if (statusActions) {
            statusActions.style.display = status.status === SystemStatusLevel.ALERT ? 'block' : 'none';
        }
    }
}

// Initialize system status on page load
export function initSystemStatus() {
    updateSystemStatus();

    // Update exercise toggle UI
    const exerciseToggle = document.getElementById('exerciseToggle');
    const exerciseText = document.getElementById('exerciseText');

    if (exerciseToggle && exerciseText) {
        const isExercise = isExerciseMode();
        exerciseToggle.checked = isExercise;
        exerciseText.textContent = isExercise ? 'ÕPPUS: SEES' : 'ÕPPUS: VÄLJAS';
        exerciseText.style.color = isExercise ? '#f59e0b' : '#64748b';
        exerciseText.style.fontWeight = isExercise ? '700' : '600';
    }
}

// Toggle exercise mode
export function toggleExerciseMode() {
    const exerciseToggle = document.getElementById('exerciseToggle');
    const exerciseText = document.getElementById('exerciseText');

    const isExercise = exerciseToggle.checked;
    setExerciseMode(isExercise);

    exerciseText.textContent = isExercise ? 'ÕPPUS: SEES' : 'ÕPPUS: VÄLJAS';
    exerciseText.style.color = isExercise ? '#f59e0b' : '#64748b';
    exerciseText.style.fontWeight = isExercise ? '700' : '600';

    // Update system status after toggle
    updateSystemStatus();

    console.log('Exercise mode:', isExercise ? 'ENABLED' : 'DISABLED');
}

// Manual status management
let selectedManualStatus = null;

export function openSystemStatusModal() {
    const modal = document.getElementById('systemStatusModal');
    const currentStatus = getSystemStatus();
    const resetBtn = document.getElementById('resetAutoBtn');

    if (modal) {
        modal.style.display = 'flex';
    }

    // Show reset button if current status is manual
    if (resetBtn) {
        resetBtn.style.display = currentStatus.source === SystemStatusSource.MANUAL ? 'inline-block' : 'none';
    }
}

export function closeSystemStatusModal() {
    const modal = document.getElementById('systemStatusModal');
    const form = document.getElementById('manualStatusForm');
    const reasonInput = document.getElementById('manualStatusReason');

    if (modal) {
        modal.style.display = 'none';
    }

    if (form) {
        form.style.display = 'none';
    }

    if (reasonInput) {
        reasonInput.value = '';
    }

    selectedManualStatus = null;
}

export function selectManualStatus(status) {
    selectedManualStatus = status;
    const form = document.getElementById('manualStatusForm');

    if (form) {
        form.style.display = 'block';
    }
}

export function saveManualStatus() {
    if (!selectedManualStatus) {
        alert('Palun vali olek');
        return;
    }

    const reasonInput = document.getElementById('manualStatusReason');
    const reason = reasonInput ? reasonInput.value.trim() : '';

    if (!reason) {
        alert('Palun sisesta põhjus');
        return;
    }

    const status = new SystemStatus();
    status.status = selectedManualStatus;
    status.reason = reason;
    status.source = SystemStatusSource.MANUAL;
    status.updatedAt = new Date().toISOString();

    saveSystemStatus(status);
    updateSystemStatusUI(status);
    closeSystemStatusModal();

    console.log('Manual status saved:', status);
}

export function resetToAutoStatus() {
    const autoStatus = calculateAutoSystemStatus();
    const status = {
        ...autoStatus,
        updatedAt: new Date().toISOString()
    };

    saveSystemStatus(status);
    updateSystemStatus();
    closeSystemStatusModal();

    console.log('Reset to auto status:', status);
}

export function goToSystemStatus() {
    // If on home page, do nothing (already there)
    // If on other page, go to home and scroll to system status card
    const isHome = document.getElementById('homePage').classList.contains('active');
    if (!isHome) {
        window.goHome();
        setTimeout(() => {
            const card = document.getElementById('systemStatusCard');
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 300);
    }
}

export function viewActiveIncidents() {
    // Navigate to incident log and filter for OPEN incidents
    window.navigateTo('incidentLogPage');
    // TODO: Implement filtering in incident log
}

console.log('systemStatus.js loaded');
