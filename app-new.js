// BCM Base App - Clean Version

// Contacts data (from original app.js)
const contacts = [
    { id: 1, name: "Riia Sillave", role: "Tegevjuht", group: "HHLA", phone: "+3725550001", email: "riia.sillave@hhla-tk.ee", critical: true },
    { id: 2, name: "Tanel Ringo", role: "Tehnika juht", group: "HTK", phone: "+3725550002", email: "tanel.ringo@hhla-tk.ee", critical: true },
    { id: 3, name: "Toomas Uibokant", role: "Tootmisjuht", group: "HHLA", phone: "+3725550003", email: "toomas.uibokant@hhla-tk.ee", critical: true },
    { id: 4, name: "Raimo Laus", role: "IT juht", group: "HTK", phone: "+3725550004", email: "raimo.laus@hhla-tk.ee", critical: true },
    { id: 7, name: "CERT-EE 24/7", role: "Küberturbe reageerimiskeskus", group: "CERT", phone: "+372 663 0299", email: "cert@cert.ee", critical: true },
    { id: 6, name: "Jüri Kask", role: "Sadamadirektor", group: "SADAM", phone: "+3725550006", email: "juri.kask@sadam.ee", critical: false }
];
let currentFilter = 'all';

// Navigation
function navigateTo(pageId) {
    const targetPage = document.getElementById(pageId);
    if (!targetPage) {
        console.error("Page not found:", pageId);
        return;
    }
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
    targetPage.classList.add("active");
    window.scrollTo(0, 0);
}

// Contacts
function filterContacts(group) {
    currentFilter = group;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderContacts();
}

function renderContacts() {
    const contactsGrid = document.getElementById('contactsGrid');
    if (!contactsGrid) return; // Exit if element not in DOM yet

    const filteredContacts = currentFilter === 'all' ? contacts : contacts.filter(c => c.group === currentFilter);

    const contactsCount = document.querySelector(".contacts-count");
    if (contactsCount) {
        contactsCount.textContent = `${filteredContacts.length} kontakti leitud`;
    }

    contactsGrid.innerHTML = filteredContacts.map(contact => `
        <div class="contact-card">
            <div class="contact-header">
                <span class="contact-name">${contact.name}</span>
                ${contact.critical ? `
                    <svg class="critical-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                ` : ''}
            </div>
            <div class="contact-role">${contact.role}</div>
            <span class="contact-tag">${contact.group}</span>
            <div class="contact-info">
                <div class="contact-info-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span>${contact.phone}</span>
                </div>
                <div class="contact-info-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span>${contact.email}</span>
                </div>
            </div>
            <div class="contact-actions">
                <button class="contact-btn" onclick="callContact('${contact.phone}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    Helista
                </button>
                <button class="contact-btn" onclick="smsContact('${contact.phone}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    SMS
                </button>
                <button class="contact-btn" onclick="emailContact('${contact.email}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    E-post
                </button>
            </div>
        </div>
    `).join('');
}

function callContact(phone) {
    alert(`Helistatakse numbrile: ${phone}`);
}

function smsContact(phone) {
    alert(`Saadetakse SMS numbrile: ${phone}`);
}

function emailContact(email) {
    alert(`Saadetakse e-post aadressile: ${email}`);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('BCM App initialized');
    renderContacts();
    if (typeof renderPlans === 'function') {
        renderPlans();
    }
});

console.log('app-new.js loaded');
