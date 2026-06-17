// Home Page - BCM App
// Main dashboard page

import { navigateTo } from '../utils/navigation.js';

export function initHomePage() {
    console.log('Home page initialized');

    // Initialize i18n texts for Home page
    initializeHomeTexts();

    // Set up card click handlers
    setupCardHandlers();
}

function initializeHomeTexts() {
    // Initialize home status title
    const statusTitle = document.getElementById('homeStatusTitle');
    if (statusTitle && statusTitle.textContent.includes('OLUKORD')) {
        // Only set if it's the normal status (not active incidents)
        statusTitle.textContent = window.t('home.status.normal');
    }

    // Initialize card texts
    const cards = [
        {
            selector: '[data-card="openIncident"]',
            titleKey: 'home.card.openIncident.title',
            descKey: 'home.card.openIncident.description'
        },
        {
            selector: '[data-card="plans"]',
            titleKey: 'home.card.plans.title',
            descKey: 'home.card.plans.description'
        },
        {
            selector: '[data-card="contacts"]',
            titleKey: 'home.card.contacts.title',
            descKey: 'home.card.contacts.description'
        },
        {
            selector: '[data-card="communication"]',
            titleKey: 'home.card.communication.title',
            descKey: 'home.card.communication.description'
        },
        {
            selector: '[data-card="logs"]',
            titleKey: 'home.card.incidents.title',
            descKey: 'home.card.incidents.description'
        }
    ];

    cards.forEach(card => {
        const element = document.querySelector(card.selector);
        if (element) {
            const h2 = element.querySelector('h2');
            const p = element.querySelector('p');

            if (h2) h2.textContent = window.t(card.titleKey);
            if (p) p.textContent = window.t(card.descKey);
        }
    });
}

function setupCardHandlers() {
    // Cards are already set up with onclick in HTML
    // This is for any additional logic
}

// Session-only incident mode
let __incidentMode = 'REAL';

function askIncidentMode() {
    const real = window.confirm(window.t('home.confirm.mode'));
    return real ? 'REAL' : 'TRAINING';
}

export function activateCrisisMode() {
    // 1) Confirmation dialog
    const ok = window.confirm(window.t('home.confirm.open'));
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
