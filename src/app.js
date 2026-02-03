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

// Initialize all systems
function initializeApp() {
    console.log('Initializing systems...');

    // Initialize utilities
    initNavigation();
    initStorage();
    initLogger();
    initSystemStatus();
    initCrisisMode();
    
    // Initialize pages
    initHomePage();
    initContactsPage();
    initPlansPage();
    initIncidentsPage();
    initIncidentDetailPage();

    // Expose functions globally for onclick handlers
    window.navigateTo = navigateTo;
    window.goBack = goBack;
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

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
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
