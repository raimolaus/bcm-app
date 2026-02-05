// BCM Main Application - Modular Version
// Entry point for the application

// Import utilities
import { navigateTo, goBack, goHome, initNavigation } from './utils/navigation.js';
import { initStorage } from './utils/storage.js';
import { initLogger } from './utils/logger.js';
import {
    initSystemStatus,
    updateSystemStatus,
    toggleExerciseMode,
    openSystemStatusModal,
    closeSystemStatusModal,
    selectManualStatus,
    saveManualStatus,
    resetToAutoStatus,
    goToSystemStatus,
    viewActiveIncidents
} from './utils/systemStatus.js';
import {
    initCrisisMode,
    activateCrisisMode,
    deactivateCrisisMode,
    isCrisisModeActive,
    updateCrisisModeUI
} from './utils/crisisMode.js';
import { createIncidentFromScenario, updateIncidentChecklist, markActionComplete } from './utils/incident-integration.js';
import {
    initIncidentGate,
    openScenarioWithGate,
    hasActiveIncident,
    getActiveIncident,
    getActiveIncidentId,
    clearActiveIncident,
    updateIncidentBanner
} from './utils/incidentGate.js';

// Import pages
import { initHomePage } from './pages/HomePage.js';
import { initContactsPage, renderContacts } from './pages/ContactsPage.js';
import { initPlansPage, renderPlans, plansActions } from './pages/PlansPage.js';
import { initIncidentsPage, renderIncidentsList, incidentActions } from './pages/IncidentsPage.js';
import { initIncidentDetailPage, incidentDetailActions } from './pages/IncidentDetailPage.js';

// Import data
import { scenarios, plans } from './data/crisis-data.js';
import { contacts } from './data/contacts.js';
import { loadIncidents, IncidentStatus, saveIncident } from './data/incidents.js';

// Import legacy scripts (temporarily keep crisis-app and plans-app until fully refactored)
// These will be loaded as classic scripts for now

console.log('🚀 BCM Application Starting...');
console.log('Version: 0.2 Modular');

// ===== BROWSER BACK BUTTON SUPPORT =====
// Store navigation history for browser back button
let navigationHistory = ['homePage'];

// Enhanced navigateTo with history support
function navigateToWithHistory(pageId) {
    // Add to history if not going back
    if (!window._isGoingBack) {
        navigationHistory.push(pageId);
        history.pushState({ pageId: pageId }, '', `#${pageId}`);
    }
    window._isGoingBack = false;
    
    // Call original navigateTo
    navigateTo(pageId);
}

// Enhanced goBack with history support  
function goBackWithHistory() {
    if (navigationHistory.length > 1) {
        navigationHistory.pop(); // Remove current
        const previousPage = navigationHistory[navigationHistory.length - 1];
        window._isGoingBack = true;
        navigateTo(previousPage);
    } else {
        navigateTo('homePage');
    }
}

// Listen for browser back/forward buttons
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.pageId) {
        window._isGoingBack = true;
        navigateTo(event.state.pageId);
        // Update history array
        const idx = navigationHistory.lastIndexOf(event.state.pageId);
        if (idx >= 0) {
            navigationHistory = navigationHistory.slice(0, idx + 1);
        }
    } else {
        // No state, go home
        window._isGoingBack = true;
        navigateTo('homePage');
        navigationHistory = ['homePage'];
    }
});

// Set initial state
if (!history.state) {
    history.replaceState({ pageId: 'homePage' }, '', '#homePage');
}

// Initialize all systems
function initializeApp() {
    console.log('Initializing systems...');

    // Initialize utilities
    initNavigation();
    initStorage();
    initLogger();
    initSystemStatus();
    initCrisisMode();
    initIncidentGate();  // AINUKE koht kus intsidenti luuakse
    
    // Initialize pages
    initHomePage();
    initContactsPage();
    initPlansPage();
    initIncidentsPage();
    initIncidentDetailPage();

    // Expose functions globally for onclick handlers
    // Use history-enabled versions for browser back button support
    window.navigateTo = navigateToWithHistory;
    window.goBack = goBackWithHistory;
    window.goHome = goHome;
    window.plansActions = plansActions;
    window.incidentActions = incidentActions;
    window.incidentDetailActions = incidentDetailActions;

    // Expose system status functions
    window.updateSystemStatus = updateSystemStatus;
    window.toggleExerciseMode = toggleExerciseMode;
    window.openSystemStatusModal = openSystemStatusModal;
    window.closeSystemStatusModal = closeSystemStatusModal;
    window.selectManualStatus = selectManualStatus;
    window.saveManualStatus = saveManualStatus;
    window.resetToAutoStatus = resetToAutoStatus;
    window.goToSystemStatus = goToSystemStatus;
    window.viewActiveIncidents = viewActiveIncidents;

    // Expose crisis mode functions
    window.activateCrisisMode = activateCrisisMode;
    window.deactivateCrisisMode = deactivateCrisisMode;
    window.isCrisisModeActive = isCrisisModeActive;
    window.updateCrisisModeUI = updateCrisisModeUI;

    // Expose incidentGate functions (AINUKE koht kus intsidenti luuakse)
    window.openScenarioWithGate = openScenarioWithGate;
    window.hasActiveIncident = hasActiveIncident;
    window.getActiveIncident = getActiveIncident;
    window.getActiveIncidentId = getActiveIncidentId;
    window.clearActiveIncident = clearActiveIncident;
    window.updateIncidentBanner = updateIncidentBanner;

    // FAAS2: New incident flow
    window.openNewIncidentFlow = function () {
        console.log('[FAAS2] openNewIncidentFlow() - Opening scenario selection');
        // Store that we are in "new incident flow" mode
        sessionStorage.setItem('faas2_incident_flow', 'true');
        sessionStorage.removeItem('faas2_selected_scenario');
        sessionStorage.removeItem('faas2_incident_mode');
        // Navigate to crisis mode page (scenario selection)
        window.navigateTo('crisisModePage');
    };

    // FAAS2: Update context box based on active incidents
    window.updateContextBox = function () {
        const contextBox = document.getElementById('bcmContextBox');
        const contextTitle = document.getElementById('bcmContextTitle');
        const contextSub = document.getElementById('bcmContextSub');

        if (!contextBox || !contextTitle || !contextSub) {
            console.warn('[FAAS2] Context box elements not found');
            return;
        }

        // Load active incidents (ACTIVE or CONTAINED status)
        const { loadIncidents, IncidentStatus } = window;
        if (!loadIncidents) {
            console.warn('[FAAS2] loadIncidents not available');
            return;
        }

        const allIncidents = loadIncidents();
        const activeIncidents = allIncidents.filter(i =>
            i.status === IncidentStatus.ACTIVE || i.status === IncidentStatus.CONTAINED
        );

        if (activeIncidents.length === 0) {
            // No active incidents - normal state
            contextBox.className = 'bcm-context-box normal';
            contextTitle.textContent = 'BUSINESS CONTINUITY MANAGEMENT';
            contextSub.textContent = '';
        } else if (activeIncidents.length === 1) {
            // Single active incident
            contextBox.className = 'bcm-context-box alert';
            contextTitle.textContent = 'INTSIDENT: ' + activeIncidents[0].scenarioName;
            contextSub.textContent = activeIncidents[0].id;
        } else {
            // Multiple active incidents
            contextBox.className = 'bcm-context-box alert';
            contextTitle.textContent = 'AKTIIVSED INTSIDENDID: ' + activeIncidents.length;
            contextSub.textContent = 'Vaata Logid & Intsidendid lehte';
        }

        console.log(`[FAAS2] Context box updated: ${activeIncidents.length} active incidents`);
    };

    // Incident integration
    window.createIncidentFromScenario = createIncidentFromScenario;
    window.updateIncidentChecklist = updateIncidentChecklist;
    window.markActionComplete = markActionComplete;
    window.renderIncidentsList = renderIncidentsList;

    // Expose data globally for legacy scripts
    window.scenarios = scenarios;
    window.plans = plans;
    window.contacts = contacts;
    window.loadIncidents = loadIncidents;
    window.IncidentStatus = IncidentStatus;
    window.saveIncident = saveIncident;

    // Render initial content
    renderContacts();
    renderPlans();
    renderIncidentsList();

    // FAAS2: Update context box on page load
    if (typeof window.updateContextBox === 'function') {
        window.updateContextBox();
    }

    console.log('✅ BCM Application Ready!');
    console.log(`📊 Loaded: ${scenarios.length} scenarios, ${plans.length} plans, ${contacts.length} contacts`);
}

// ===== FAAS2 RESTORE: Dynamic home page state management =====

// Safe load incidents
function loadIncidentsSafe() {
    try {
        const raw = localStorage.getItem('bcm_incidents');
        const arr = JSON.parse(raw || '[]');
        return Array.isArray(arr) ? arr : [];
    } catch {
        return [];
    }
}

// Count ACTIVE incidents (status === 'ACTIVE')
function countActiveIncidents(incidents) {
    return incidents.filter(i => (String(i.status || '')).toUpperCase() === 'ACTIVE').length;
}

// Count NOT CLOSED incidents (status !== 'CLOSED')
function countNotClosedIncidents(incidents) {
    return incidents.filter(i => (String(i.status || '')).toUpperCase() !== 'CLOSED').length;
}

// Update home status box and active incidents list
function updateHomeStatusAndList() {
    const incidents = loadIncidentsSafe();
    const activeCount = countActiveIncidents(incidents);

    const statusBox = document.getElementById('homeStatusBox');
    const title = document.getElementById('homeStatusTitle');
    const sub = document.getElementById('homeStatusSub');
    const ul = document.getElementById('homeActiveUl');

    if (!statusBox || !title) {
        console.warn('[FAAS2 RESTORE] Home status elements not found');
        return;
    }

    if (activeCount > 0) {
        statusBox.classList.remove('is-normal');
        statusBox.classList.add('is-active');
        title.textContent = `AKTIIVSED INTSIDENDID: ${activeCount}`;
        if (sub) sub.textContent = '';

        // Render active incident names INSIDE the status box
        if (ul) {
            const active = incidents.filter(i => (String(i.status || '')).toUpperCase() === 'ACTIVE');
            ul.innerHTML = '';
            active.forEach(i => {
                const name = i.title || i.name || i.scenarioName || i.type || 'Intsident';
                const li = document.createElement('li');
                li.textContent = name;
                ul.appendChild(li);
            });
            ul.style.display = active.length ? 'block' : 'none';
        }

        orderCardsForActiveIncident();
    } else {
        statusBox.classList.remove('is-active');
        statusBox.classList.add('is-normal');
        title.textContent = 'OLUKORD: TAVAPÄRANE';
        if (sub) sub.textContent = '';

        if (ul) {
            ul.style.display = 'none';
            ul.innerHTML = '';
        }

        orderCardsForNormal();
    }

    console.log(`[FAAS2 RESTORE] Home status updated: ${activeCount} active incidents`);
}

// Update incidents badge (shows NOT CLOSED count)
function updateIncidentsBadge() {
    const incidents = loadIncidentsSafe();
    const notClosed = countNotClosedIncidents(incidents);

    const badge = document.getElementById('incidentsBadge');
    if (!badge) return;

    if (notClosed > 0) {
        badge.textContent = String(notClosed);
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }

    console.log(`[FAAS2 RESTORE] Badge updated: ${notClosed} not-closed incidents`);
}

// Card ordering for normal state
function orderCardsForNormal() {
    reorderCards(['openIncident', 'plans', 'contacts', 'communication', 'logs']);
}

// Card ordering for active incident state
function orderCardsForActiveIncident() {
    reorderCards(['openIncident', 'logs', 'communication', 'contacts', 'plans']);
}

// Reorder cards in DOM
function reorderCards(order) {
    const container = document.getElementById('homeCards');
    if (!container) {
        console.warn('[FAAS2 RESTORE] homeCards container not found');
        return;
    }

    order.forEach(key => {
        const el = container.querySelector(`[data-card="${key}"]`);
        if (el) {
            container.appendChild(el);
        }
    });
}

// Make functions globally available
window.updateHomeStatusAndList = updateHomeStatusAndList;
window.updateIncidentsBadge = updateIncidentsBadge;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeApp();
        updateHomeStatusAndList();
        updateIncidentsBadge();
    });
} else {
    initializeApp();
    updateHomeStatusAndList();
    updateIncidentsBadge();
}

// Load legacy crisis script as module (contains ES6 imports)
const legacyScripts = [
    { src: 'crisis-app.js', type: 'module' }
];

legacyScripts.forEach(script => {
    const scriptElement = document.createElement('script');
    scriptElement.src = script.src;
    if (script.type) {
        scriptElement.type = script.type;
    }
    document.head.appendChild(scriptElement);
});
