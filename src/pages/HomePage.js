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

export function activateCrisisMode() {
    navigateTo('crisisModePage');
    
    if (window.crisisManager && window.crisisManager.activate) {
        window.crisisManager.activate();
    }
}

// Make activateCrisisMode globally available for onclick
window.activateCrisisMode = activateCrisisMode;
