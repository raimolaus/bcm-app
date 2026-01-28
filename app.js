// Sample data
const contacts = [
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
        id: 5,
        name: "Maris Tamm",
        role: "Turvajuht",
        group: "CERT",
        phone: "+3725550005",
        email: "maris.tamm@cert.ee",
        critical: false
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

    // In real app: window.location.href = `tel:${phone}`;
}

function smsContact(phone) {
    alert(`Saadetakse SMS numbrile: ${phone}`);
    // In real app: window.location.href = `sms:${phone}`;
}

function emailContact(email) {
    alert(`Saadetakse e-post aadressile: ${email}`);
    // In real app: window.location.href = `mailto:${email}`;
}

    // In real app: navigate to plan detail page
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderContacts();
    
});
console.log('app.js loaded');
