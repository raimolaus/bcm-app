// Logger Utility - BCM App
// Handles incident logging and tracking

import { addLogEntry, loadIncidentLog } from './storage.js';

export const LogTypes = {
    INFO: 'INFO',
    ACTION: 'ACTION',
    COMMUNICATION: 'COMMUNICATION',
    SYSTEM_EVENT: 'SYSTEM_EVENT',
    ERROR: 'ERROR'
};

export function addToLog(type, message, timestamp = null) {
    const time = timestamp || getCurrentTimestamp();
    const entry = {
        type,
        message,
        timestamp: time,
        user: 'Kasutaja',
        date: new Date().toISOString()
    };
    
    addLogEntry(entry);
    console.log(`[${type}] ${message}`);
    
    return entry;
}

export function getCurrentTimestamp() {
    const now = new Date();
    return `${padZero(now.getHours())}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())}`;
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

export function getLogTypeIcon(type) {
    const icons = {
        'INFO': 'ℹ️',
        'ACTION': '✓',
        'COMMUNICATION': '📧',
        'SYSTEM_EVENT': '⚙️',
        'ERROR': '❌'
    };
    return icons[type] || '•';
}

export function exportLogAsText() {
    const log = loadIncidentLog();
    
    if (log.length === 0) {
        return null;
    }
    
    let logText = `BCM Sündmuste Logi\nEksportitud: ${new Date().toLocaleString('et-EE')}\n\n`;
    logText += `---\n\n`;
    
    log.forEach(entry => {
        logText += `[${entry.timestamp}] ${entry.type}: ${entry.message} (${entry.user})\n`;
    });
    
    return logText;
}

export function downloadLog() {
    const logText = exportLogAsText();
    
    if (!logText) {
        alert('Logis pole veel kirjeid');
        return false;
    }
    
    const blob = new Blob([logText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BCM_Log_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addToLog(LogTypes.SYSTEM_EVENT, 'Logi eksporditud');
    return true;
}

export function clearLog() {
    if (confirm('Kas oled kindel, et soovid logi tühjendada?')) {
        // This will be handled by storage.js
        return true;
    }
    return false;
}

// Initialize logger
export function initLogger() {
    console.log('Logger system initialized');
}
