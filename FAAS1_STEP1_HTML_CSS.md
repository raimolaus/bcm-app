# 📋 FAAS 1 - STEP 1: HTML STRUKTUUR JA CSS STIILID

## 🎯 EESMÄRK
Lisa avalehele neljas kaart "Logid & Intsidendid" ning loo 2 uut tühja lehte koos põhiliste CSS stiilidega.

---

## ✅ SAMMUD

### 1. UUENDA index.html - AVALEHT

**LEIA:** homePage sees `.cards-grid`

**MUUDA:** 3-kaardilisest gridist 4-kaardiliseks

```html
<div class="cards-grid cards-grid-4"> <!-- Lisa class: cards-grid-4 -->
    <!-- Olemasolevad 3 kaarti jäävad samaks -->
    <div class="card" onclick="navigateTo('plansPage')">
        <div class="icon-circle icon-blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
            </svg>
        </div>
        <h2>Plaanid</h2>
        <p>Business Continuity plaanide vaatamine ja otsing</p>
    </div>
    
    <div class="card" onclick="navigateTo('contactsPage')">
        <div class="icon-circle icon-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
            </svg>
        </div>
        <h2>Kriitilised kontaktid</h2>
        <p>Kriitilised kontaktid ja kommunikatsioon</p>
    </div>
    
    <div class="card" onclick="navigateTo('commPage')">
        <div class="icon-circle icon-orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
        </div>
        <h2>Kommunikatsioon</h2>
        <p>Kommunikatsiooni plaanid ja kanalid</p>
    </div>
    
    <!-- ============================================ -->
    <!-- NELJAS KAART - UUS! -->
    <!-- ============================================ -->
    <div class="card" onclick="navigateTo('incidentsPage')">
        <div class="icon-circle icon-red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                <path d="M9 12h6m-6 4h6"/>
            </svg>
        </div>
        <h2>Logid & Intsidendid</h2>
        <p>Intsidentide jälgimine ja raporteerimine</p>
        <div class="card-badge" id="activeIncidentsBadge" style="display: none;">
            <span class="active-incidents-count">0</span>
        </div>
    </div>
</div>
```

---

### 2. LISA UUED LEHED index.html'i

**LISA:** Enne `</main>` sulgeva tagi (peale kõiki olemasolevaid `.page` elemente)

```html
<!-- ========================================= -->
<!-- INCIDENTS LIST PAGE -->
<!-- ========================================= -->
<div class="page" id="incidentsPage">
    <div class="page-header">
        <button class="back-btn" onclick="goBack()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
        </button>
        <h1>Logid & Intsidendid</h1>
    </div>
    
    <!-- FILTERS -->
    <div class="incident-filters">
        <button class="filter-btn active" onclick="window.incidentActions.filter('all')" data-filter="all">
            Kõik <span class="count" id="countAll">0</span>
        </button>
        <button class="filter-btn" onclick="window.incidentActions.filter('active')" data-filter="active">
            🔴 Aktiivsed <span class="count" id="countActive">0</span>
        </button>
        <button class="filter-btn" onclick="window.incidentActions.filter('exercise')" data-filter="exercise">
            🎓 Õppused <span class="count" id="countExercise">0</span>
        </button>
        <button class="filter-btn" onclick="window.incidentActions.filter('closed')" data-filter="closed">
            ✅ Suletud <span class="count" id="countClosed">0</span>
        </button>
    </div>
    
    <!-- SORT & ACTIONS -->
    <div class="incidents-toolbar">
        <div class="sort-controls">
            <label>Sorteeri:</label>
            <select id="incidentSort" onchange="window.incidentActions.sort(this.value)">
                <option value="date-desc">Uusim enne</option>
                <option value="date-asc">Vanim enne</option>
                <option value="severity">Tõsiduse järgi</option>
                <option value="status">Staatuse järgi</option>
            </select>
        </div>
        <button class="btn-secondary btn-small" onclick="window.incidentActions.exportAll()">
            📄 Ekspordi kõik
        </button>
    </div>
    
    <!-- INCIDENTS LIST -->
    <div class="incidents-list" id="incidentsList">
        <p class="empty-message">Intsidente pole veel</p>
    </div>
</div>

<!-- ========================================= -->
<!-- INCIDENT DETAIL PAGE -->
<!-- ========================================= -->
<div class="page" id="incidentDetailPage">
    <div class="page-header">
        <button class="back-btn" onclick="goBack()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
        </button>
        <div class="incident-detail-header">
            <h1 id="incidentDetailTitle">Intsident</h1>
            <div class="incident-meta-badges">
                <span class="status-badge" id="incidentStatusBadge">AKTIIVNE</span>
                <span class="severity-badge" id="incidentSeverityBadge">S1</span>
                <span class="type-badge" id="incidentTypeBadge">PÄRIS</span>
            </div>
        </div>
    </div>
    
    <!-- PROGRESS BAR -->
    <div class="incident-progress-section" id="incidentProgressSection">
        <div class="progress-bar-large">
            <div class="progress-fill" id="incidentProgressFill" style="width: 0%"></div>
        </div>
        <div class="progress-info">
            <span class="progress-text" id="incidentProgressText">0% valmis</span>
            <span class="progress-steps" id="incidentProgressSteps">0/0 sammud</span>
        </div>
    </div>
    
    <!-- TABS -->
    <div class="incident-tabs">
        <button class="tab-btn active" onclick="window.incidentActions.switchTab('overview')" data-tab="overview">
            📊 Ülevaade
        </button>
        <button class="tab-btn" onclick="window.incidentActions.switchTab('timeline')" data-tab="timeline">
            ⏱️ Timeline
        </button>
        <button class="tab-btn" onclick="window.incidentActions.switchTab('checklist')" data-tab="checklist">
            ☑️ Tegevused
        </button>
        <button class="tab-btn" onclick="window.incidentActions.switchTab('notifications')" data-tab="notifications">
            📢 Teavitused
        </button>
    </div>
    
    <!-- TAB CONTENT -->
    <div class="incident-content" id="incidentTabContent">
        <!-- Dynamic content -->
    </div>
    
    <!-- ACTIONS -->
    <div class="incident-actions-bar">
        <button class="btn-secondary" onclick="window.incidentActions.exportCurrent()">
            📄 Eksport
        </button>
        <button class="btn-primary" onclick="window.incidentActions.updateStatus()" id="updateStatusBtn">
            ✏️ Uuenda staatus
        </button>
    </div>
</div>
```

---

### 3. LISA CSS STIILID - src/styles/main.css

**LISA:** Faili lõppu (pärast kõiki olemasolevaid stiile)

```css
/* ===== INCIDENTS & LOGS STYLES ===== */

/* Cards grid - 4 columns */
.cards-grid-4 {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

/* Card badge for active incidents count */
.card-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #dc2626;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
}

/* ===== INCIDENTS LIST PAGE ===== */

.incident-filters {
    display: flex;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: white;
    border-bottom: 1px solid #e5e7eb;
    overflow-x: auto;
}

.filter-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    color: #374151;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;
    white-space: nowrap;
}

.filter-btn:hover {
    background: #e5e7eb;
}

.filter-btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

.filter-btn .count {
    background: rgba(0, 0, 0, 0.1);
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
}

.filter-btn.active .count {
    background: rgba(255, 255, 255, 0.2);
}

.incidents-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: white;
    border-bottom: 1px solid #e5e7eb;
}

.sort-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.sort-controls label {
    font-size: 0.875rem;
    color: #6b7280;
}

.sort-controls select {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
}

.incidents-list {
    padding: 1.5rem;
    display: grid;
    gap: 1rem;
}

.incident-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
}

.incident-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.incident-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
}

.incident-icon {
    font-size: 2rem;
    line-height: 1;
}

.incident-title {
    flex: 1;
}

.incident-title h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
}

.incident-id {
    margin: 0;
    font-size: 0.75rem;
    color: #6b7280;
    font-family: monospace;
}

.incident-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
}

.status-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
}

.status-active {
    background: #fecaca;
    color: #991b1b;
}

.status-active .status-dot {
    background: #dc2626;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.status-contained {
    background: #fed7aa;
    color: #9a3412;
}

.status-contained .status-dot {
    background: #f97316;
}

.status-resolved {
    background: #bfdbfe;
    color: #1e40af;
}

.status-resolved .status-dot {
    background: #3b82f6;
}

.status-closed {
    background: #bbf7d0;
    color: #166534;
}

.status-closed .status-dot {
    background: #22c55e;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.incident-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 0.5rem;
}

.meta-item {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: #4b5563;
}

.incident-progress {
    margin-bottom: 1rem;
}

.progress-bar {
    height: 0.5rem;
    background: #e5e7eb;
    border-radius: 9999px;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
    transition: width 0.3s ease;
}

.progress-text {
    font-size: 0.75rem;
    color: #6b7280;
}

.incident-summary {
    font-size: 0.875rem;
    color: #4b5563;
    line-height: 1.5;
    margin-bottom: 1rem;
}

.incident-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tag {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
}

.tag-cyber {
    background: #dbeafe;
    color: #1e40af;
}

.tag-physical {
    background: #fef3c7;
    color: #92400e;
}

.tag-nis2 {
    background: #fce7f3;
    color: #9f1239;
}

.tag-certee {
    background: #dcfce7;
    color: #166534;
}

.type-exercise {
    background: #e0e7ff;
    color: #4f46e5;
    border: 2px dashed #4f46e5;
    padding: 0.25rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
}

.type-real {
    background: #fecaca;
    color: #991b1b;
    padding: 0.25rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
}

/* ===== INCIDENT DETAIL PAGE ===== */

.incident-detail-header {
    flex: 1;
}

.incident-detail-header h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
}

.incident-meta-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.status-badge, .severity-badge, .type-badge {
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
}

.severity-badge {
    color: white;
}

.severity-s0 {
    background: #dc2626;
}

.severity-s1 {
    background: #f97316;
}

.severity-s2 {
    background: #eab308;
    color: #1f2937;
}

.severity-s3 {
    background: #3b82f6;
}

.incident-progress-section {
    padding: 1.5rem;
    background: white;
    border-bottom: 1px solid #e5e7eb;
}

.progress-bar-large {
    height: 1.5rem;
    background: #e5e7eb;
    border-radius: 9999px;
    overflow: hidden;
    margin-bottom: 0.75rem;
}

.progress-bar-large .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
    transition: width 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 0.75rem;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
}

.progress-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: #6b7280;
}

.incident-tabs {
    display: flex;
    gap: 0;
    background: white;
    border-bottom: 2px solid #e5e7eb;
    overflow-x: auto;
}

.tab-btn {
    flex: 1;
    min-width: fit-content;
    padding: 1rem 1.5rem;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    color: #6b7280;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;
}

.tab-btn:hover {
    background: #f9fafb;
    color: #1f2937;
}

.tab-btn.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
    background: #eff6ff;
}

.incident-content {
    padding: 1.5rem;
    min-height: 400px;
}

.incident-actions-bar {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    background: white;
    border-top: 1px solid #e5e7eb;
}

.btn-small {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
}

.empty-message {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
    font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
    .cards-grid-4 {
        grid-template-columns: 1fr;
    }
    
    .incident-filters {
        padding: 0.75rem;
    }
    
    .incidents-toolbar {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }
    
    .incident-tabs {
        flex-wrap: nowrap;
    }
    
    .tab-btn {
        font-size: 0.75rem;
        padding: 0.75rem 1rem;
    }
}
```

---

## ✅ TESTIMINE

Pärast neid muudatusi:

1. **Ava rakendus:** `http://localhost:8080`
2. **Kontrolli avalehte:**
   - Peaks olema 4 kaarti (Plaanid, Kontaktid, Kommunikatsioon, Logid)
   - Neljas kaart peaks olema punane ikoon
3. **Kliki "Logid & Intsidendid" kaardil**
   - Peaks avanema incidentsPage
   - Näitab praegu "Intsidente pole veel"
4. **Kontrolli konsooli (F12):**
   - Ei tohi olla CSS vigu
   - Ei tohi olla JavaScript vigu (veel pole JS-i lisatud)

---

## 📝 MÄRKUSED

- ✅ HTML struktuur on loodud
- ✅ CSS stiilid on lisatud
- ✅ Lehed avanevad (tühjad)
- ❌ Andmed ei renderdu veel (tuleb STEP 2-s)
- ❌ Funktsioonid ei tööta veel (tuleb STEP 2 ja 3-s)

---

## 🎯 JÄRGMINE SAMM

Kui STEP 1 on valmis ja testitud, mine STEP 2 juurde:
- Loo `src/data/incidents.js`
- Loo `src/pages/IncidentsPage.js`
- Loo `src/pages/IncidentDetailPage.js`

**Palun testi ja kinnita, et STEP 1 töötab enne järgmise sammu juurde minekut!** ✅
