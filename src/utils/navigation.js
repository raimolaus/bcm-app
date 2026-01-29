// Navigation Utility - BCM App
// Handles page navigation and routing

export function navigateTo(pageId) {
    const targetPage = document.getElementById(pageId);
    if (!targetPage) {
        console.error(`Page not found: ${pageId}`);
        return false;
    }
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    targetPage.classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Log navigation
    console.log(`Navigated to: ${pageId}`);
    
    return true;
}

export function getCurrentPage() {
    const activePage = document.querySelector('.page.active');
    return activePage ? activePage.id : null;
}

export function goBack() {
    // Simple back logic - goes to home by default
    navigateTo('homePage');
}

// Initialize navigation
export function initNavigation() {
    console.log('Navigation system initialized');
}
