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
    // 1) Navigate to crisis mode page
    if (typeof navigateTo === 'function') {
        navigateTo('crisisModePage');
    } else if (typeof window.navigateTo === 'function') {
        window.navigateTo('crisisModePage');
    }

    // 2) Render scenarios - try different renderer functions
    // Check for renderScenarios (from crisis-app.js)
    if (typeof window.renderScenarios === 'function') {
        window.renderScenarios();
        return;
    }
    if (typeof renderScenarios === 'function') {
        renderScenarios();
        return;
    }
    // Check for renderCrisisScenarios (alternative name)
    if (typeof window.renderCrisisScenarios === 'function') {
        window.renderCrisisScenarios();
        return;
    }
    if (typeof renderCrisisScenarios === 'function') {
        renderCrisisScenarios();
        return;
    }

    // 3) Fallback - if no renderer found, show a message
    console.warn('⚠️ No scenario renderer found. Scenarios grid may be empty.');
    const grid = document.getElementById('scenariosGrid');
    if (grid) {
        grid.innerHTML = '<p style="padding:16px;color:#6b7280">Stsenaariumite loogika pole laetud. Kontrolli JS-i init järjekorda.</p>';
    }
}

// Make activateCrisisMode globally available for onclick
window.activateCrisisMode = activateCrisisMode;
