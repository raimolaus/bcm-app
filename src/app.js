// BCM Main Application - Modular Version
// Entry point for the application

// Import utilities
import { navigateTo, initNavigation } from './utils/navigation.js';
import { initStorage } from './utils/storage.js';
import { initLogger } from './utils/logger.js';

// Import pages
import { initHomePage } from './pages/HomePage.js';
import { initContactsPage } from './pages/ContactsPage.js';

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
    
    // Initialize pages
    initHomePage();
    initContactsPage();
    
    // Expose navigateTo globally for onclick handlers
    window.navigateTo = navigateTo;

    // Expose data globally for legacy scripts
    window.scenarios = scenarios;
    window.plans = plans;
    window.contacts = contacts;

    console.log('✅ BCM Application Ready!');
    console.log(`📊 Loaded: ${scenarios.length} scenarios, ${plans.length} plans, ${contacts.length} contacts`);
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Load legacy crisis and plans scripts
// These will be refactored in future versions
const legacyScripts = [
    'crisis-app.js',
    'plans-app.js'
];

legacyScripts.forEach(script => {
    const scriptElement = document.createElement('script');
    scriptElement.src = script;
    document.head.appendChild(scriptElement);
});
