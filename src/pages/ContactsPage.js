// Contacts Page - BCM App
// Manages contacts display and filtering

import { contacts, getContactsByGroup, getGroups } from '../data/contacts.js';
import { renderContactCard, contactActions } from '../components/ContactCard.js';

let currentFilter = 'all';

export function initContactsPage() {
    console.log('Contacts page initialized');
    renderContacts();
}

export function filterContacts(group) {
    currentFilter = group;
    
    // Update filter button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderContacts();
}

export function renderContacts() {
    const contactsGrid = document.getElementById('contactsGrid');
    if (!contactsGrid) return;
    
    const filteredContacts = getContactsByGroup(currentFilter);
    
    // Update count
    const contactsCount = document.querySelector('.contacts-count');
    if (contactsCount) {
        contactsCount.textContent = `${filteredContacts.length} kontakti leitud`;
    }
    
    // Render cards
    contactsGrid.innerHTML = filteredContacts
        .map(contact => renderContactCard(contact))
        .join('');
}

// Expose globally for onclick handlers
window.filterContacts = filterContacts;
window.contactActions = contactActions;
