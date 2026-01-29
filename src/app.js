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

// Import pages
import { initHomePage } from './pages/HomePage.js';
import { initContactsPage, renderContacts } from './pages/ContactsPage.js';
import { initPlansPage, renderPlans, plansActions } from './pages/PlansPage.js';

// Import data
import { scenarios, plans } from './data/crisis-data.js';
import { contacts } from './data/contacts.js';

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
    
    // Initialize pages
    initHomePage();
    initContactsPage();
    initPlansPage();

    // Expose functions globally for onclick handlers
    window.navigateTo = navigateTo;
    window.goBack = goBack;
    window.goHome = goHome;
    window.plansActions = plansActions;

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

    // Expose data globally for legacy scripts
    window.scenarios = scenarios;
    window.plans = plans;
    window.contacts = contacts;

    // Render initial content
    renderContacts();
    renderPlans();

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
