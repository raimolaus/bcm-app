// Scenario Card Component - BCM App
// Renders a crisis scenario card

export function renderScenarioCard(scenario) {
    return `
        <div class="scenario-card" onclick="window.scenarioActions.open('${scenario.id}')">
            <div class="scenario-icon">${scenario.icon}</div>
            <h3>${scenario.name}</h3>
        </div>
    `;
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
