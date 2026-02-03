# FAAS2_UI_FINALIZE_STEP — Avalehe UI lukustatud korrastamine (rakendusfail)

**Staatus:** LUKUS (vastavalt kinnitatud UI-reeglitele)  
**Ulatus:** Ainult UI (HTML + CSS + minimaalne JS olekupõhine näitamine)  
**Ei muuda:** intsidendi äriloogikat, LocalStorage skeemi, olemasolevaid flow’sid

---

## EESMÄRK
Viia avalehe UI lõplikku, järjepidevasse olekusse vastavalt FAAS2 otsustele:
- selge olukorrateadlikkus
- üks primaarne tegevus
- õige värvide roll
- dünaamiline kaardijärjestus sõltuvalt olekust

---

## 0) Muudetavad failid
- `index.html`
- `src/styles/main.css`
- `src/app.js` (ainult UI-oleku arvutus ja DOM-i järjestus)

---

# 1) index.html — struktuur ja elemendid

## 1.1 Ülemine olekuindikaator (kontekst)
**NÕUE**
- Kui 0 aktiivset intsidenti → roheline pill “Kõik süsteemid töötavad tavapäraselt”
- Kui ≥1 aktiivset intsidenti → punane kontekstibänner “AKTIIVSED INTSIDENDID: N”
- Need kaks EI TOHI olla korraga nähtavad.

**HTML (jäta mõlemad alles, JS juhib nähtavust):**
```html
<!-- Tavaolukord -->
<div class="status-pill status-ok" id="statusOk">
  Kõik süsteemid töötavad tavapäraselt
</div>

<!-- Aktiivne intsident -->
<div class="incident-context" id="incidentContext">
  AKTIIVSED INTSIDENDID: <span id="activeIncidentCount">0</span>
</div>
```

> NB! `incident-context` EI OLE klikitav, EI SISALDA linke ega alamteksti.

---

## 1.2 Kaardid — fikseeritud markup, dünaamiline järjekord
**Reegel:** kaardid on DOM-is olemas ühes konteineris, JS muudab nende järjekorda.

**HTML (cards-grid sees):**
```html
<div class="cards-grid" id="homeCards">

  <div class="card card-action" data-card="openIncident" onclick="activateCrisisMode()">
    <div class="icon-circle icon-neutral"></div>
    <h2>AVA INTSIDENT</h2>
    <p>Vali hädaolukorra stsenaarium</p>
  </div>

  <div class="card" data-card="plans" onclick="navigateTo('plansPage')">
    <div class="icon-circle icon-blue"></div>
    <h2>Plaanid</h2>
    <p>Business Continuity plaanide vaatamine ja otsing</p>
  </div>

  <div class="card" data-card="contacts" onclick="navigateTo('contactsPage')">
    <div class="icon-circle icon-green"></div>
    <h2>Kriitilised kontaktid</h2>
    <p>Kriitilised kontaktid ja kommunikatsioon</p>
  </div>

  <div class="card" data-card="communication" onclick="navigateTo('communicationPage')">
    <div class="icon-circle icon-amber"></div>
    <h2>Kommunikatsioon</h2>
    <p>Kommunikatsiooni plaanid ja kanalid</p>
  </div>

  <div class="card" data-card="logs" onclick="navigateTo('incidentsPage')">
    <div class="icon-circle icon-red"></div>
    <h2>Logid & Intsidendid</h2>
    <p>Intsidentide jälgimine ja raporteerimine</p>
  </div>

</div>
```

---

# 2) CSS — värvide ja rollide lukustus

## 2.1 Olekuindikaatorid
```css
.status-pill {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  margin-bottom: 16px;
}

.status-ok {
  background: #e6f7ee;
  color: #047857;
  border: 1px solid #86efac;
}

.incident-context {
  background: #b91c1c;
  color: #ffffff;
  padding: 14px 18px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-weight: 600;
}
```

## 2.2 AVA INTSIDENT kaardi neutraalsus
```css
.icon-neutral {
  background: #e5e7eb;
  color: #374151;
}
```

---

# 3) JS — oleku tuvastus ja kaardijärjestus

## 3.1 Aktiivsete intsidentide arvu funktsioon
```js
function getActiveIncidentCount() {
  const incidents = JSON.parse(localStorage.getItem('incidents') || '[]');
  return incidents.filter(i => i.status && i.status !== 'CLOSED').length;
}
```

## 3.2 Avalehe UI init
```js
function updateHomeUI() {
  const count = getActiveIncidentCount();

  const statusOk = document.getElementById('statusOk');
  const context = document.getElementById('incidentContext');
  const countEl = document.getElementById('activeIncidentCount');

  if (count > 0) {
    statusOk.style.display = 'none';
    context.style.display = 'block';
    countEl.textContent = count;
    orderCardsForActiveIncident();
  } else {
    statusOk.style.display = 'inline-block';
    context.style.display = 'none';
    orderCardsForNormal();
  }
}
```

## 3.3 Kaartide järjestus
```js
function orderCardsForNormal() {
  reorderCards(['openIncident', 'plans', 'contacts', 'communication', 'logs']);
}

function orderCardsForActiveIncident() {
  reorderCards(['openIncident', 'logs', 'communication', 'contacts', 'plans']);
}

function reorderCards(order) {
  const container = document.getElementById('homeCards');
  order.forEach(key => {
    const el = container.querySelector(`[data-card="${key}"]`);
    if (el) container.appendChild(el);
  });
}
```

## 3.4 Init
```js
document.addEventListener('DOMContentLoaded', updateHomeUI);
```

---

## Commit
```bash
git add .
git commit -m "FAAS2 UI: finalize home page hierarchy, colors and dynamic card order"
```
