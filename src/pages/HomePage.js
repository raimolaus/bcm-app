// Home Page - BCM App
// Main dashboard page

import { navigateTo } from '../utils/navigation.js';

export function initHomePage() {
    console.log('Home page initialized');
    
    // Set up card click handlers
    setupCardHandlers();
}

function setupCardHandlers() {
    // Cards are already set up with onclick in HTML
    // This is for any additional logic
}

// Session-only incident mode
let __incidentMode = 'REAL';

function askIncidentMode() {
    const real = window.confirm('Kas soovid avada uue intsidendi REAL režiimis?\n\nOK = REAL\nCancel = TRAINING');
    return real ? 'REAL' : 'TRAINING';
}

export function activateCrisisMode() {
    // 1) Confirmation dialog
    const ok = window.confirm('Kas oled kindel, et soovid avada uue intsidendi?');
    if (!ok) return;

    // 2) Ask for REAL/TRAINING mode
    __incidentMode = askIncidentMode();
    console.log(`[FAAS2 RESTORE] Incident mode selected: ${__incidentMode}`);

    // 3) Navigate to crisis mode page
    if (typeof navigateTo === 'function') {
        navigateTo('crisisModePage');
    } else if (typeof window.navigateTo === 'function') {
        window.navigateTo('crisisModePage');
    }

    // 4) Render scenarios - try different renderer functions
    if (typeof window.renderScenarios === 'function') {
        window.renderScenarios();
    } else if (typeof renderScenarios === 'function') {
        renderScenarios();
    } else if (typeof window.renderCrisisScenarios === 'function') {
        window.renderCrisisScenarios();
    } else if (typeof renderCrisisScenarios === 'function') {
        renderCrisisScenarios();
    } else {
        console.warn('⚠️ No scenario renderer found. Scenarios grid may be empty.');
        const grid = document.getElementById('scenariosGrid');
        if (grid) {
            grid.innerHTML = '<p style="padding:16px;color:#6b7280">Stsenaariumite loogika pole laetud. Kontrolli JS-i init järjekorda.</p>';
        }
    }
}

// Export incident mode getter
export function getIncidentMode() {
    return __incidentMode;
}

// Make activateCrisisMode globally available for onclick
window.activateCrisisMode = activateCrisisMode;
