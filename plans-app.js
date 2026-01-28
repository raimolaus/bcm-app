// Plans rendering and management

function renderPlans() {
    const plansGrid = document.getElementById('plansGrid');
    if (!plansGrid) return;

    plansGrid.innerHTML = plans.map(plan => `
        <div class="plan-card-new" onclick="openPlan('${plan.id}')">
            <div class="plan-header-new">
                <div class="plan-icon-new">📋</div>
                <div class="plan-title-section">
                    <h3 class="plan-title-new">${plan.title}</h3>
                    <p class="plan-code-new">${plan.code}</p>
                </div>
            </div>
            <p class="plan-description-new">${plan.description}</p>
            <div class="plan-metadata-grid">
                <div class="plan-meta-item-new">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>Versioon ${plan.version}</span>
                </div>
                <div class="plan-meta-item-new">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>Kehtib kuni ${formatDate(plan.validUntil)}</span>
                </div>
            </div>
            <div class="plan-tags-new">
                ${plan.tags.map(tag => `<span class="tag-new">${tag}</span>`).join('')}
            </div>
            ${plan.annexes && plan.annexes.length > 0 ? `
                <div class="plan-annexes-count-new">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    ${plan.annexes.length} lisa(t)
                </div>
            ` : ''}
        </div>
    `).join('');
}

function formatDate(dateString) {
    if (!dateString) return 'Määramata';
    const date = new Date(dateString);
    return date.toLocaleDateString('et-EE');
}

function openPlan(planId) {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    let annexesHTML = '';
    if (plan.annexes && plan.annexes.length > 0) {
        annexesHTML = `
            <div class="plan-detail-section">
                <h3>Lisad</h3>
                <ul class="plan-annexes-list">
                    ${plan.annexes.map(annex => `<li>${annex}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    let scenariosHTML = '';
    if (plan.relatedScenarioIds && plan.relatedScenarioIds.length > 0) {
        const relatedScenarios = scenarios.filter(s => plan.relatedScenarioIds.includes(s.id));
        if (relatedScenarios.length > 0) {
            scenariosHTML = `
                <div class="plan-detail-section">
                    <h3>Seotud stsenaariumid</h3>
                    <div class="related-scenarios">
                        ${relatedScenarios.map(s => `
                            <span class="scenario-tag">${s.icon} ${s.name}</span>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    const content = `
        <div class="plan-detail-modal" onclick="if(event.target === this) closePlanDetail()">
            <div class="plan-detail-content">
                <button class="plan-detail-close" onclick="closePlanDetail()">✕</button>
                <h2>${plan.title}</h2>
                <p class="plan-detail-code">${plan.code} - ${plan.version}</p>

                <div class="plan-detail-section">
                    <h3>Kirjeldus</h3>
                    <p>${plan.description}</p>
                </div>

                <div class="plan-detail-section">
                    <h3>Ulatus</h3>
                    <p>${plan.scope}</p>
                </div>

                <div class="plan-detail-metadata">
                    <div class="metadata-item">
                        <strong>Dokumendi number:</strong> ${plan.documentNumber || 'Määramata'}
                    </div>
                    <div class="metadata-item">
                        <strong>Kehtiv alates:</strong> ${formatDate(plan.validFrom)}
                    </div>
                    <div class="metadata-item">
                        <strong>Kehtiv kuni:</strong> ${formatDate(plan.validUntil)}
                    </div>
                    <div class="metadata-item">
                        <strong>Viimati üle vaadatud:</strong> ${formatDate(plan.lastReviewedDate)}
                    </div>
                </div>

                ${annexesHTML}
                ${scenariosHTML}

                <div class="plan-detail-actions">
                    <button class="btn-primary" onclick="downloadPlanPDF('${plan.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Laadi alla PDF
                    </button>
                    <button class="btn-secondary" onclick="closePlanDetail()">Sulge</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', content);
}

function closePlanDetail() {
    const modal = document.querySelector('.plan-detail-modal');
    if (modal) {
        modal.remove();
    }
}

function downloadPlanPDF(planId) {
    alert(`PDF allalaadimine: ${planId}\n\nTulevik: Siin laetakse alla plaani PDF dokument`);
}

// Initialize plans on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Plans module initialized');
});

console.log('plans-app.js loaded');
