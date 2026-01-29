// Crisis Mode State Management

// Check if crisis mode is active
export function isCrisisModeActive() {
    return localStorage.getItem('crisisMode') === 'true';
}

// Activate crisis mode
export function activateCrisisMode() {
    localStorage.setItem('crisisMode', 'true');
    localStorage.setItem('crisisModeActivatedAt', new Date().toISOString());
    updateCrisisModeUI();

    // Navigate to crisis mode page
    window.navigateTo('crisisModePage');

    // Render scenarios (if available from crisis-app.js)
    if (window.renderScenarios) {
        window.renderScenarios();
    }

    // Add to log
    if (window.addToLog) {
        window.addToLog('INFO', 'KRIISIREŽIIM AKTIVEERITUD');
    }

    console.log('🚨 Crisis mode ACTIVATED');
}

// Deactivate crisis mode
export function deactivateCrisisMode() {
    if (!confirm('Kas oled kindel, et soovid kriisirežiimi lõpetada?\n\nSee deaktiveerib kriisioleku ja lubab tavapärase navigatsiooni.')) {
        return;
    }

    localStorage.setItem('crisisMode', 'false');
    localStorage.setItem('crisisModeDeactivatedAt', new Date().toISOString());
    updateCrisisModeUI();

    // Navigate to home
    window.goHome();

    // Add to log
    if (window.addToLog) {
        window.addToLog('INFO', 'Kriisirežiim lõpetatud');
    }

    console.log('✅ Crisis mode DEACTIVATED');
}

// Update crisis mode UI (top bar banner/button)
export function updateCrisisModeUI() {
    const isActive = isCrisisModeActive();

    // Update small crisis button
    const crisisBtnSmall = document.getElementById('crisisBtnSmall');
    if (crisisBtnSmall) {
        if (isActive) {
            crisisBtnSmall.classList.add('crisis-active');
            crisisBtnSmall.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                KRIIS AKTIIVNE
            `;
        } else {
            crisisBtnSmall.classList.remove('crisis-active');
            crisisBtnSmall.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Kriisirežiim
            `;
        }
    }

    // Update crisis banner
    const crisisBanner = document.getElementById('crisisBanner');
    if (crisisBanner) {
        if (isActive) {
            crisisBanner.classList.add('crisis-active');
        } else {
            crisisBanner.classList.remove('crisis-active');
        }
    }
}

// Block navigation if crisis is active (called from navigation.js)
export function canNavigateAway(fromPage) {
    const isActive = isCrisisModeActive();
    const crisisPages = ['crisisModePage', 'scenarioDetailPage', 'incidentLogPage'];

    // If crisis is active and trying to leave crisis pages
    if (isActive && crisisPages.includes(fromPage)) {
        alert('KRIIS ON AKTIIVNE!\n\nKriisirežiimist ei saa väljuda, kuni kriis on lõpetatud.\n\nKasuta "Lõpeta kriis" nuppu kriisirežiimi lehel.');
        return false;
    }

    return true;
}

// Initialize crisis mode on page load
export function initCrisisMode() {
    updateCrisisModeUI();

    // If crisis mode is active, show indicator
    if (isCrisisModeActive()) {
        console.log('🚨 Crisis mode is ACTIVE');
    }
}

console.log('crisisMode.js loaded');
