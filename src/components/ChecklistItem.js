// Checklist Item Component - BCM App
// Renders a checklist item with checkbox

export function renderChecklistItem(item, prefix, isChecked = false) {
    const itemId = `${prefix}_${item.id}`;
    
    return `
        <div class="checklist-item ${isChecked ? 'checked' : ''}">
            <input 
                type="checkbox" 
                id="${itemId}" 
                ${isChecked ? 'checked' : ''}
                onchange="window.checklistActions.toggle('${itemId}', '${escapeHtml(item.title)}')"
            >
            <label for="${itemId}">
                <strong>${item.title}</strong>
                ${item.description ? `<br><span class="checklist-description">${item.description}</span>` : ''}
                ${item.phone ? `<span class="phone-number">${item.phone}</span>` : ''}
            </label>
            ${item.type === 'CALL' && item.phone ? `
                <button class="quick-call-btn" onclick="window.contactActions.call('${item.phone}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    Helista
                </button>
            ` : ''}
        </div>
    `;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Checklist actions (exposed globally)
export const checklistActions = {
    toggle: (itemId, title) => {
        if (window.checklistManager && window.checklistManager.toggle) {
            window.checklistManager.toggle(itemId, title);
        }
    }
};
