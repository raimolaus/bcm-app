// Navigation Utility - BCM App
// Handles page navigation and routing with history

// Navigation history stack
let navigationHistory = ['homePage'];

// Flag to prevent double-handling of popstate
let isHandlingPopstate = false;

export function navigateTo(pageId, skipHistory = false) {
    const targetPage = document.getElementById(pageId);
    if (!targetPage) {
        console.error(`❌ Page not found: ${pageId}`);
        return false;
    }

    // Get current page before navigation
    const currentPageId = getCurrentPage();

    // FAAS2: Navigation is never blocked (legacy crisis mode guard removed)

    // Add to history (if not going back and not same page)
    if (!skipHistory && currentPageId && currentPageId !== pageId) {
        navigationHistory.push(pageId);
        
        // Add to browser history for Back button support
        if (!isHandlingPopstate) {
            history.pushState({ pageId: pageId }, '', `#${pageId}`);
        }
        
        console.log(`📍 Navigation: ${currentPageId} → ${pageId}`);
        console.log(`📚 History stack:`, navigationHistory);
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    targetPage.classList.add('active');

    // Update navigation buttons visibility
    updateNavigationButtons(pageId);

    // Scroll to top
    window.scrollTo(0, 0);

    return true;
}

export function getCurrentPage() {
    const activePage = document.querySelector('.page.active');
    return activePage ? activePage.id : null;
}

export function goBack() {
    // Use browser history as single source of truth
    console.log(`⬅️ Going back via browser history`);
    history.back();
}

export function goHome() {
    // Navigate to home (adds to browser history)
    console.log(`🏠 Going home`);
    navigationHistory = ['homePage'];
    navigateTo('homePage');
}

// Update navigation buttons visibility
function updateNavigationButtons(pageId) {
    const isHomePage = pageId === 'homePage';

    // Fixed home button
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.style.display = isHomePage ? 'none' : 'block';
    }

    // Back buttons
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(btn => {
        btn.style.display = isHomePage ? 'none' : 'flex';
    });

    // Crisis banner (only on Home page)
    const crisisBanner = document.getElementById('crisisBanner');
    if (crisisBanner) {
        crisisBanner.style.display = isHomePage ? 'block' : 'none';
    }

    // Small crisis button in top bar (only on non-Home pages)
    const crisisBtnSmall = document.getElementById('crisisBtnSmall');
    if (crisisBtnSmall) {
        crisisBtnSmall.style.display = isHomePage ? 'none' : 'block';
    }

    // Update status pill visibility based on page and status
    updateStatusPillVisibility(isHomePage);

    // Crisis mode pages - add class to body for styling
    const crisisPages = ['crisisModePage', 'scenarioDetailPage', 'warRoomPage', 'incidentLogPage'];

    if (crisisPages.includes(pageId)) {
        document.body.classList.add('crisis-mode');
    } else {
        document.body.classList.remove('crisis-mode');
    }
}

// Update status pill visibility
function updateStatusPillVisibility(isHomePage) {
    const statusPill = document.getElementById('statusPill');
    if (!statusPill) return;

    // Get current system status
    const storedStatus = localStorage.getItem('systemStatus');
    if (!storedStatus) {
        statusPill.style.display = isHomePage ? 'flex' : 'none';
        return;
    }

    const status = JSON.parse(storedStatus);
    const SystemStatusLevel = {
        OK: 'OK',
        WARNING: 'WARNING',
        ALERT: 'ALERT'
    };

    // ALERT or WARNING: always visible on all pages
    // OK: only visible on Home page
    if (status.status === SystemStatusLevel.ALERT || status.status === SystemStatusLevel.WARNING) {
        statusPill.style.display = 'flex';
    } else {
        statusPill.style.display = isHomePage ? 'flex' : 'none';
    }
}

// Initialize navigation
export function initNavigation() {
    console.log('✅ Navigation system initialized');
    console.log(`📍 Starting page: homePage`);

    // Set up global functions for onclick handlers
    window.goBack = goBack;
    window.goHome = goHome;

    // Set initial browser history state
    if (!history.state) {
        history.replaceState({ pageId: 'homePage' }, '', '#homePage');
    }

    // Listen for browser Back/Forward buttons
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.pageId) {
            console.log(`🔙 Browser back/forward to: ${event.state.pageId}`);
            isHandlingPopstate = true;
            
            // Update our history stack to match
            const idx = navigationHistory.lastIndexOf(event.state.pageId);
            if (idx >= 0) {
                navigationHistory = navigationHistory.slice(0, idx + 1);
            } else {
                navigationHistory.push(event.state.pageId);
            }
            
            navigateTo(event.state.pageId, true);
            isHandlingPopstate = false;
        } else {
            // No state, go home
            isHandlingPopstate = true;
            navigationHistory = ['homePage'];
            navigateTo('homePage', true);
            isHandlingPopstate = false;
        }
    });

    // Initial update of navigation buttons
    updateNavigationButtons('homePage');
}
