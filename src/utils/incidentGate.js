// =============================================================================
// INCIDENT GATE — AINUKE koht kus intsidenti luuakse
// =============================================================================
//
// See moodul tagab, et:
// 1. Intsident luuakse AINULT läbi kinnitusdialoo
// 2. Kasutaja peab valima INTSIDENT vs ÕPPUS
// 3. Ilma kinnituseta on stsenaariumi vaade "preview" režiimis
//

import { createIncident, saveIncident, loadIncidents } from '../data/incidents.js';

// =============================================================================
// STATE
// =============================================================================

// Praegune aktiivne intsident (kui on avatud)
let currentActiveIncident = null;

// Valitud stsenaarium (enne kinnitust)
let pendingScenario = null;

// =============================================================================
// INCIDENT GATE — PÕHIFUNKTSIOON
// =============================================================================

/**
 * Avab stsenaariumi vaate ja näitab kinnitusdialoog
 * See on AINUKE koht kust incident luuakse!
 * 
 * @param {string} scenarioId - Stsenaariumi ID
 * @param {object} scenarioData - Stsenaariumi andmed (name, description, jne)
 */
export function openScenarioWithGate(scenarioId, scenarioData) {
    console.log('[GATE] openScenarioWithGate:', scenarioId);
    
    // Salvesta pending stsenaarium
    pendingScenario = { id: scenarioId, data: scenarioData };
    
    // Näita kinnitusdialoog
    showIncidentConfirmationDialog(scenarioId, scenarioData);
}

/**
 * Kontrolli kas praegu on aktiivne intsident
 */
export function hasActiveIncident() {
    return currentActiveIncident !== null;
}

/**
 * Tagasta praegune aktiivne intsident
 */
export function getActiveIncident() {
    return currentActiveIncident;
}

/**
 * Tagasta praegune aktiivne intsident ID
 */
export function getActiveIncidentId() {
    return currentActiveIncident ? currentActiveIncident.id : null;
}

/**
 * Tühjenda aktiivne intsident (kui suletakse)
 */
export function clearActiveIncident() {
    currentActiveIncident = null;
    pendingScenario = null;
    updateIncidentBanner();
}

// =============================================================================
// KINNITUSDIALOOG
// =============================================================================

/**
 * Näita kinnitusdialoog — kasutaja peab valima INTSIDENT vs ÕPPUS
 */
function showIncidentConfirmationDialog(scenarioId, scenarioData) {
    // Eemalda vana dialoog kui on
    const existingDialog = document.getElementById('incidentGateDialog');
    if (existingDialog) {
        existingDialog.remove();
    }

    const dialog = document.createElement('div');
    dialog.id = 'incidentGateDialog';
    dialog.className = 'incident-gate-modal';
    dialog.innerHTML = `
        <div class="incident-gate-backdrop"></div>
        <div class="incident-gate-content">
            <div class="incident-gate-header">
                <h2>Kas avada intsident?</h2>
            </div>
            <div class="incident-gate-body">
                <div class="incident-gate-scenario">
                    <span class="incident-gate-label">Stsenaarium:</span>
                    <span class="incident-gate-value">${scenarioData.name}</span>
                </div>
                
                <div class="incident-gate-mode-section">
                    <span class="incident-gate-label">Vali režiim:</span>
                    <div class="incident-gate-mode-toggle">
                        <button class="incident-gate-mode-btn active" id="modeIncident" onclick="window.incidentGate.selectMode('INCIDENT')">
                            <span class="mode-icon">🔴</span>
                            <span class="mode-text">INTSIDENT</span>
                        </button>
                        <button class="incident-gate-mode-btn" id="modeExercise" onclick="window.incidentGate.selectMode('EXERCISE')">
                            <span class="mode-icon">🎓</span>
                            <span class="mode-text">ÕPPUS</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="incident-gate-actions">
                <button class="incident-gate-btn cancel" onclick="window.incidentGate.cancelAndPreview()">
                    TÜHISTA
                </button>
                <button class="incident-gate-btn confirm" onclick="window.incidentGate.confirmAndCreate()">
                    AVA
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
    
    // Lisa stiilid kui pole veel
    injectDialogStyles();
}

// Valitud režiim (default: INCIDENT)
let selectedMode = 'INCIDENT';

/**
 * Vali režiim (INCIDENT / EXERCISE)
 */
export function selectMode(mode) {
    selectedMode = mode;
    
    const incidentBtn = document.getElementById('modeIncident');
    const exerciseBtn = document.getElementById('modeExercise');
    
    if (mode === 'INCIDENT') {
        incidentBtn.classList.add('active');
        exerciseBtn.classList.remove('active');
    } else {
        incidentBtn.classList.remove('active');
        exerciseBtn.classList.add('active');
    }
}

/**
 * Kinnita ja loo intsident
 */
export function confirmAndCreate() {
    if (!pendingScenario) {
        console.error('[GATE] No pending scenario!');
        return;
    }

    console.log('[GATE] Creating incident:', pendingScenario.id, 'Mode:', selectedMode);

    // Loo intsident
    const incident = createIncident(pendingScenario.id, pendingScenario.data);
    
    // Määra õppuse lipp
    incident.isExercise = (selectedMode === 'EXERCISE');
    
    // Salvesta
    saveIncident(incident);
    
    // Määra aktiivseks
    currentActiveIncident = incident;
    
    // Sulge dialoog
    closeDialog();
    
    // Uuenda UI
    updateIncidentBanner();
    updateHomeAndBadges();
    
    // Navigeeri stsenaariumi lehele (kui pole juba seal)
    if (typeof window.navigateTo === 'function') {
        window.navigateTo('scenarioDetailPage');
    }
    
    // Renderda stsenaarium
    if (typeof window.renderScenarioDetail === 'function') {
        window.renderScenarioDetail(pendingScenario.id, pendingScenario.data);
    } else if (typeof window.openScenario === 'function') {
        // Fallback vanale funktsioonile, aga ilma uue dialoogita
        window._skipGateDialog = true;
        window.openScenario(pendingScenario.id);
        window._skipGateDialog = false;
    }
    
    console.log('[GATE] Incident created:', incident.id);
}

/**
 * Tühista ja mine preview režiimi
 */
export function cancelAndPreview() {
    console.log('[GATE] Cancelled, entering preview mode');
    
    // Sulge dialoog
    closeDialog();
    
    // Jäta pending stsenaarium alles (preview jaoks)
    // AGA ära loo intsidenti
    currentActiveIncident = null;
    
    // Uuenda banner (näita preview)
    updateIncidentBanner();
    
    // Navigeeri stsenaariumi lehele preview režiimis
    if (typeof window.navigateTo === 'function') {
        window.navigateTo('scenarioDetailPage');
    }
    
    // Renderda stsenaarium preview režiimis
    if (typeof window.openScenario === 'function') {
        window._skipGateDialog = true;
        window._previewMode = true;
        window.openScenario(pendingScenario.id);
        window._skipGateDialog = false;
        window._previewMode = false;
    }
}

/**
 * Sulge dialoog
 */
function closeDialog() {
    const dialog = document.getElementById('incidentGateDialog');
    if (dialog) {
        dialog.remove();
    }
    selectedMode = 'INCIDENT'; // Reset
}

// =============================================================================
// INCIDENT BANNER — näitab kas intsident on aktiivne või preview
// =============================================================================

/**
 * Uuenda incident banner stsenaariumi vaates
 */
export function updateIncidentBanner() {
    let banner = document.getElementById('incidentStatusBanner');
    
    // Loo banner kui pole olemas
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'incidentStatusBanner';
        
        // Lisa stsenaariumi lehe algusesse
        const scenarioPage = document.getElementById('scenarioDetailPage');
        if (scenarioPage) {
            const header = scenarioPage.querySelector('.scenario-detail-header');
            if (header) {
                header.insertAdjacentElement('afterend', banner);
            } else {
                scenarioPage.prepend(banner);
            }
        }
    }
    
    if (!banner) return;
    
    if (currentActiveIncident) {
        // AKTIIVNE INTSIDENT
        const isExercise = currentActiveIncident.isExercise;
        const bgColor = isExercise ? '#3b82f6' : '#dc2626';
        const label = isExercise ? 'ÕPPUS' : 'AKTIIVNE INTSIDENT';
        const time = new Date(currentActiveIncident.createdAt).toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit' });
        
        banner.className = 'incident-banner incident-banner-active';
        banner.style.backgroundColor = bgColor;
        banner.innerHTML = `
            <div class="incident-banner-content">
                <div class="incident-banner-status">
                    <span class="incident-banner-icon">${isExercise ? '🎓' : '🔴'}</span>
                    <span class="incident-banner-label">${label}: ${currentActiveIncident.id}</span>
                </div>
                <div class="incident-banner-meta">
                    <span>${currentActiveIncident.scenarioName}</span>
                    <span>•</span>
                    <span>Alustatud: ${time}</span>
                </div>
            </div>
        `;
        banner.style.display = 'block';
        
        // Eemalda preview stiilid content'ilt
        const content = document.querySelector('.scenario-content');
        if (content) {
            content.classList.remove('preview-mode');
        }
        
    } else if (pendingScenario) {
        // PREVIEW MODE
        banner.className = 'incident-banner incident-banner-preview';
        banner.style.backgroundColor = '#f59e0b';
        banner.innerHTML = `
            <div class="incident-banner-content">
                <div class="incident-banner-status">
                    <span class="incident-banner-icon">⚠️</span>
                    <span class="incident-banner-label">EELVAADE — INTSIDENT POLE AVATUD</span>
                </div>
                <button class="incident-banner-action" onclick="window.incidentGate.openFromPreview()">
                    AVA INTSIDENT
                </button>
            </div>
        `;
        banner.style.display = 'block';
        
        // Lisa preview stiilid content'ile
        const content = document.querySelector('.scenario-content');
        if (content) {
            content.classList.add('preview-mode');
        }
        
    } else {
        // Pole midagi
        banner.style.display = 'none';
    }
}

/**
 * Ava intsident preview režiimist
 */
export function openFromPreview() {
    if (pendingScenario) {
        showIncidentConfirmationDialog(pendingScenario.id, pendingScenario.data);
    }
}

// =============================================================================
// HELPER FUNKTSIOONID
// =============================================================================

/**
 * Uuenda Home leht ja badge'id
 */
function updateHomeAndBadges() {
    if (typeof window.updateHomeStatusAndList === 'function') {
        window.updateHomeStatusAndList();
    }
    if (typeof window.updateIncidentsBadge === 'function') {
        window.updateIncidentsBadge();
    }
    if (typeof window.renderIncidentsList === 'function') {
        window.renderIncidentsList();
    }
}

/**
 * Lisa CSS stiilid dialoogile
 */
function injectDialogStyles() {
    if (document.getElementById('incidentGateStyles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'incidentGateStyles';
    styles.textContent = `
        /* ================================================
           INCIDENT GATE MODAL
           ================================================ */
        .incident-gate-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .incident-gate-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
        }
        
        .incident-gate-content {
            position: relative;
            background: white;
            border-radius: 16px;
            width: 90%;
            max-width: 420px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            overflow: hidden;
        }
        
        .incident-gate-header {
            padding: 24px 24px 16px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .incident-gate-header h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            color: #111827;
        }
        
        .incident-gate-body {
            padding: 24px;
        }
        
        .incident-gate-scenario {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-bottom: 24px;
        }
        
        .incident-gate-label {
            font-size: 14px;
            font-weight: 500;
            color: #6b7280;
        }
        
        .incident-gate-value {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
        }
        
        .incident-gate-mode-section {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .incident-gate-mode-toggle {
            display: flex;
            gap: 12px;
        }
        
        .incident-gate-mode-btn {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 16px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            background: white;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .incident-gate-mode-btn:hover {
            border-color: #d1d5db;
            background: #f9fafb;
        }
        
        .incident-gate-mode-btn.active {
            border-color: #3b82f6;
            background: #eff6ff;
        }
        
        .incident-gate-mode-btn .mode-icon {
            font-size: 28px;
        }
        
        .incident-gate-mode-btn .mode-text {
            font-size: 14px;
            font-weight: 700;
            color: #374151;
        }
        
        .incident-gate-mode-btn.active .mode-text {
            color: #1d4ed8;
        }
        
        .incident-gate-actions {
            display: flex;
            gap: 12px;
            padding: 16px 24px 24px;
        }
        
        .incident-gate-btn {
            flex: 1;
            padding: 14px 24px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
        }
        
        .incident-gate-btn.cancel {
            background: #f3f4f6;
            color: #374151;
        }
        
        .incident-gate-btn.cancel:hover {
            background: #e5e7eb;
        }
        
        .incident-gate-btn.confirm {
            background: #dc2626;
            color: white;
        }
        
        .incident-gate-btn.confirm:hover {
            background: #b91c1c;
        }
        
        /* ================================================
           INCIDENT BANNER
           ================================================ */
        .incident-banner {
            padding: 12px 16px;
            color: white;
            font-weight: 600;
        }
        
        .incident-banner-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .incident-banner-status {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .incident-banner-icon {
            font-size: 18px;
        }
        
        .incident-banner-label {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .incident-banner-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 500;
            opacity: 0.9;
        }
        
        .incident-banner-action {
            padding: 8px 16px;
            background: white;
            color: #b45309;
            border: none;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .incident-banner-action:hover {
            background: #fef3c7;
        }
        
        /* ================================================
           PREVIEW MODE — tuhm sisu
           ================================================ */
        .scenario-content.preview-mode {
            opacity: 0.6;
            pointer-events: none;
            user-select: none;
        }
        
        .scenario-content.preview-mode::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(245, 158, 11, 0.05) 10px,
                rgba(245, 158, 11, 0.05) 20px
            );
            pointer-events: none;
            z-index: 1;
        }
    `;
    
    document.head.appendChild(styles);
}

// =============================================================================
// INIT & EXPORT
// =============================================================================

/**
 * Initsialiseeri incident gate
 */
export function initIncidentGate() {
    console.log('[GATE] Incident Gate initialized');
    
    // Inject styles
    injectDialogStyles();
    
    // Expose to window for onclick handlers
    window.incidentGate = {
        openScenarioWithGate,
        selectMode,
        confirmAndCreate,
        cancelAndPreview,
        openFromPreview,
        hasActiveIncident,
        getActiveIncident,
        getActiveIncidentId,
        clearActiveIncident,
        updateIncidentBanner
    };
}

console.log('incidentGate.js loaded');
