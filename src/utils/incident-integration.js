// Incident Integration - BCM App
// Connects crisis scenarios with incident logging

import { createIncident, saveIncident } from '../data/incidents.js';
import { addToLog, LogTypes } from './logger.js';

/**
 * Create incident from crisis scenario
 * Called automatically when scenario is activated
 */
export function createIncidentFromScenario(scenarioId, scenarioData) {
    try {
        // Create incident
        const incident = createIncident(scenarioId, scenarioData);

        // Save to LocalStorage
        saveIncident(incident);

        // Log event
        addToLog(LogTypes.SYSTEM_EVENT, `Intsident loodud: ${incident.id} - ${scenarioData.name}`);

        console.log('✅ Incident created:', incident.id);

        // Update incidents list if on that page
        if (window.renderIncidentsList && typeof window.renderIncidentsList === 'function') {
            window.renderIncidentsList();
        }

        return incident.id;

    } catch (error) {
        console.error('Failed to create incident:', error);
        addToLog(LogTypes.ERROR, `Intsidendi loomine ebaõnnestus: ${error.message}`);
        return null;
    }
}

/**
 * Update incident checklist progress
 * Called when user completes checklist items
 */
export async function updateIncidentChecklist(incidentId, checklistType, completed, total) {
    try {
        const { updateChecklistProgress, addIncidentAction } =
            await import('../data/incidents.js');

        updateChecklistProgress(incidentId, checklistType, completed, total);

        addIncidentAction(
            incidentId,
            `Checklist uuendatud: ${checklistType} (${completed}/${total})`,
            'PROGRESS'
        );

        console.log(`✅ Checklist updated: ${checklistType} ${completed}/${total}`);

        return true;

    } catch (error) {
        console.error('Failed to update checklist:', error);
        return false;
    }
}

/**
 * Mark scenario action as complete
 * Adds entry to incident timeline
 */
export async function markActionComplete(incidentId, actionText) {
    try {
        const { addIncidentAction } = await import('../data/incidents.js');

        addIncidentAction(incidentId, actionText, 'ACTION');

        addToLog(LogTypes.ACTION, actionText);

        console.log('✅ Action logged:', actionText);

        return true;

    } catch (error) {
        console.error('Failed to mark action:', error);
        return false;
    }
}

console.log('incident-integration.js loaded');
