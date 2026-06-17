// Plans Page - BCM App
// Displays and manages Business Continuity Plans

import { plans } from '../data/crisis-data.js';

let currentPlanModal = null;

export function initPlansPage() {
    console.log('Plans page initialized');
}

export function renderPlans() {
    const plansGrid = document.getElementById('plansGrid');
    if (!plansGrid) {
        console.warn('plansGrid element not found');
        return;
    }

    console.log('Rendering plans:', plans.length);

    if (plans.length === 0) {
        plansGrid.innerHTML = `<p class="empty-message">${window.t('plans.empty')}</p>`;
        return;
    }

    plansGrid.innerHTML = plans.map(plan => `
        <div class="plan-card" onclick="window.plansActions.openPlan('${plan.id}')">
            <div class="plan-header">
                <div class="plan-icon">📋</div>
                <div class="plan-title-section">
                    <h3 class="plan-title">${plan.title}</h3>
                    <p class="plan-code">${plan.code || 'N/A'}</p>
                </div>
            </div>
            <p class="plan-description">${plan.description}</p>
            <div class="plan-metadata-grid">
                <div class="plan-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>${window.t('plans.version', { version: plan.version || 'N/A' })}</span>
                </div>
                <div class="plan-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>${window.t('plans.validUntil', { date: formatDate(plan.validUntil) })}</span>
                </div>
            </div>
            ${plan.tags && plan.tags.length > 0 ? `
                <div class="plan-tags">
                    ${plan.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            ${plan.annexes && plan.annexes.length > 0 ? `
                <div class="plan-annexes-count">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    ${window.t('plans.annexes.count', { count: plan.annexes.length })}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function formatDate(dateString) {
    if (!dateString) return window.t('common.undefined');
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('et-EE');
    } catch (error) {
        return window.t('common.undefined');
    }
}

export function openPlan(planId) {
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
        console.error('Plan not found:', planId);
        return;
    }

    console.log('Opening plan:', plan.title);

    let annexesHTML = '';
    if (plan.annexes && plan.annexes.length > 0) {
        annexesHTML = `
            <div class="plan-detail-section">
                <h3>${window.t('plan.detail.annexes')}</h3>
                <ul class="plan-annexes-list">
                    ${plan.annexes.map(annex => `<li>${annex}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    let scenariosHTML = '';
    if (plan.relatedScenarioIds && plan.relatedScenarioIds.length > 0) {
        // Import scenarios from crisis-data.js
        import('../data/crisis-data.js').then(({ scenarios }) => {
            const relatedScenarios = scenarios.filter(s => plan.relatedScenarioIds.includes(s.id));
            if (relatedScenarios.length > 0) {
                const scenariosSection = document.querySelector('.related-scenarios-section');
                if (scenariosSection) {
                    scenariosSection.innerHTML = `
                        <h3>${window.t('plan.detail.relatedScenarios')}</h3>
                        <div class="related-scenarios">
                            ${relatedScenarios.map(s => `
                                <span class="scenario-tag">${s.icon} ${s.name}</span>
                            `).join('')}
                        </div>
                    `;
                }
            }
        });
        scenariosHTML = '<div class="plan-detail-section related-scenarios-section"></div>';
    }

    const modalHTML = `
        <div class="plan-detail-modal" onclick="if(event.target === this) window.plansActions.closePlan()">
            <div class="plan-detail-content">
                <button class="plan-detail-close" onclick="window.plansActions.closePlan()">✕</button>
                <h2>${plan.title}</h2>
                <p class="plan-detail-code">${plan.code || 'N/A'} - ${plan.version || 'N/A'}</p>

                <div class="plan-detail-section">
                    <h3>${window.t('plan.detail.description')}</h3>
                    <p>${plan.description}</p>
                </div>

                ${plan.scope ? `
                <div class="plan-detail-section">
                    <h3>${window.t('plan.detail.scope')}</h3>
                    <p>${plan.scope}</p>
                </div>
                ` : ''}

                <div class="plan-detail-metadata">
                    ${plan.documentNumber ? `
                    <div class="metadata-item">
                        <strong>${window.t('plan.detail.documentNumber')}</strong> ${plan.documentNumber}
                    </div>
                    ` : ''}
                    ${plan.validFrom ? `
                    <div class="metadata-item">
                        <strong>${window.t('plan.detail.validFrom')}</strong> ${formatDate(plan.validFrom)}
                    </div>
                    ` : ''}
                    ${plan.validUntil ? `
                    <div class="metadata-item">
                        <strong>${window.t('plan.detail.validUntil')}</strong> ${formatDate(plan.validUntil)}
                    </div>
                    ` : ''}
                    ${plan.lastReviewedDate ? `
                    <div class="metadata-item">
                        <strong>${window.t('plan.detail.lastReviewed')}</strong> ${formatDate(plan.lastReviewedDate)}
                    </div>
                    ` : ''}
                </div>

                ${annexesHTML}
                ${scenariosHTML}

                <div class="plan-detail-actions">
                    <button class="btn-primary" onclick="window.plansActions.downloadPlan('${plan.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        ${window.t('plan.action.downloadPdf')}
                    </button>
                    <button class="btn-secondary" onclick="window.plansActions.closePlan()">${window.t('plan.action.close')}</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    currentPlanModal = document.querySelector('.plan-detail-modal');
}

export function closePlan() {
    if (currentPlanModal) {
        currentPlanModal.remove();
        currentPlanModal = null;
    }
}

export function downloadPlan(planId) {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    alert(window.t('plan.action.downloadPdfMessage', { title: plan.title }));
    console.log('Download plan:', planId);
}

// Plans actions (exposed globally for onclick handlers)
export const plansActions = {
    openPlan,
    closePlan,
    downloadPlan
};
