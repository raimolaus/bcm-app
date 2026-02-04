// Scenario Card Component - BCM App
// Renders a crisis scenario card

export function renderScenarioCard(scenario) {
    const priorityClass = scenario.priority.toLowerCase();
    
    return `
        <div class="scenario-card priority-${priorityClass}" onclick="window.scenarioActions.open('${scenario.id}')">
            <div class="scenario-icon">${scenario.icon}</div>
            <h3>${scenario.name}</h3>
            <p>${scenario.description}</p>
            <span class="priority-badge">${getPriorityText(scenario.priority)}</span>
        </div>
    `;
}

function getPriorityText(priority) {
    const texts = {
        'CRITICAL': 'Kriitiline',
        'HIGH': 'Kõrge',
        'MEDIUM': 'Keskmine',
        'LOW': 'Madal'
    };
    return texts[priority] || priority;
}

// Scenario actions (exposed globally)
export const scenarioActions = {
    open: (scenarioId) => {
        // This will be handled by the crisis page logic
        if (window.crisisManager && window.crisisManager.openScenario) {
            window.crisisManager.openScenario(scenarioId);
        }
    }
};
