// Contacts Data - BCM App
// Critical contacts for crisis management

export const contacts = [
    {
        id: 1,
        name: "Riia Sillave",
        role: "Tegevjuht",
        group: "HHLA",
        phone: "+3725550001",
        email: "riia.sillave@hhla-tk.ee",
        critical: true
    },
    {
        id: 2,
        name: "Tanel Ringo",
        role: "Tehnika juht",
        group: "HTK",
        phone: "+3725550002",
        email: "tanel.ringo@hhla-tk.ee",
        critical: true
    },
    {
        id: 3,
        name: "Toomas Uibokant",
        role: "Tootmisjuht",
        group: "HHLA",
        phone: "+3725550003",
        email: "toomas.uibokant@hhla-tk.ee",
        critical: true
    },
    {
        id: 4,
        name: "Raimo Laus",
        role: "IT juht",
        group: "HTK",
        phone: "+3725550004",
        email: "raimo.laus@hhla-tk.ee",
        critical: true
    },
    {
        id: 7,
        name: "CERT-EE 24/7",
        role: "Küberturbe reageerimiskeskus",
        group: "CERT",
        phone: "+372 663 0299",
        alternatePhone: "+372 5308 8299",
        email: "cert@cert.ee",
        website: "raport.cert.ee",
        critical: true
    },
    {
        id: 6,
        name: "Jüri Kask",
        role: "Sadamadirektor",
        group: "SADAM",
        phone: "+3725550006",
        email: "juri.kask@sadam.ee",
        critical: false
    }
];

// Get contact by ID
export function getContactById(id) {
    return contacts.find(c => c.id === id);
}

// Get contacts by group
export function getContactsByGroup(group) {
    if (group === 'all') return contacts;
    return contacts.filter(c => c.group === group);
}

// Get critical contacts only
export function getCriticalContacts() {
    return contacts.filter(c => c.critical);
}

// Get all unique groups
export function getGroups() {
    const groups = [...new Set(contacts.map(c => c.group))];
    return ['all', ...groups];
}
