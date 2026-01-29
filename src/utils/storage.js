// Storage Utility - BCM App
// Handles LocalStorage operations with error handling

const STORAGE_PREFIX = 'bcm_';

export function saveData(key, data) {
    try {
        const storageKey = STORAGE_PREFIX + key;
        localStorage.setItem(storageKey, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Storage save error:', error);
        return false;
    }
}

export function loadData(key, defaultValue = null) {
    try {
        const storageKey = STORAGE_PREFIX + key;
        const data = localStorage.getItem(storageKey);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Storage load error:', error);
        return defaultValue;
    }
}

export function removeData(key) {
    try {
        const storageKey = STORAGE_PREFIX + key;
        localStorage.removeItem(storageKey);
        return true;
    } catch (error) {
        console.error('Storage remove error:', error);
        return false;
    }
}

export function clearAllData() {
    try {
        // Only clear BCM data
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(STORAGE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
        return true;
    } catch (error) {
        console.error('Storage clear error:', error);
        return false;
    }
}

// Checklist state management
export function saveChecklistState(checklistId, isChecked) {
    const states = loadData('checklist_states', {});
    states[checklistId] = isChecked;
    return saveData('checklist_states', states);
}

export function loadChecklistState(checklistId) {
    const states = loadData('checklist_states', {});
    return states[checklistId] || false;
}

export function loadAllChecklistStates() {
    return loadData('checklist_states', {});
}

// War Room data management
export function saveWarRoomData(data) {
    return saveData('war_room', data);
}

export function loadWarRoomData() {
    return loadData('war_room', {
        t0: null,
        reporter: null,
        classification: null,
        isActive: false
    });
}

// Incident log management
export function saveIncidentLog(log) {
    return saveData('incident_log', log);
}

export function loadIncidentLog() {
    return loadData('incident_log', []);
}

export function addLogEntry(entry) {
    const log = loadIncidentLog();
    log.push(entry);
    return saveIncidentLog(log);
}

// Initialize storage
export function initStorage() {
    console.log('Storage system initialized');
}
