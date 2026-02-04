# FAAS2_FIX_RESTORE_HOME_STATUS_BADGE_DIALOG_SAVE — Üks fail, kõik kokku (UI + flow taastamine)

**Staatus:** KINNITATUD / LUKUS  
**Eesmärk:** taastada FAAS2 kokkulepitud käitumine pärast regressioone.

Selles sammus parandad 5 regressiooni:
1) Avalehe **ülemine suur staatuskast**: *intsidentide olek*, mitte “süsteemid”.  
   - 0 aktiivset → ROHELINE taust, VALGE bold tekst: **OLUKORD: TAVAPÄRANE**  
   - ≥1 aktiivset → PUNANE taust, VALGE bold tekst: **AKTIIVSED INTSIDENDID: N**
2) Avalehel peab olema **aktiivsete intsidentide loetelu** (nimed) kohe staatuskasti all, kui neid on.
3) **Logid & Intsidendid badge** peab näitama **mitu intsidenti ei ole veel SULETUD** (st kõik statused peale `CLOSED`).  
   - Ülemine staatuskast võib olla ROHELINE (kui aktiivseid pole), aga badge võib jääda (kuni kõik on `CLOSED`).
4) Taasta **AVA INTSIDENT dialoog**: kinnitus + `REAL/TRAINING` valik (default REAL).
5) Taasta **Triage/Tegevuste lehe SAVE nupp**: uuendab andmeid, ei sulge, ei muuda staatust automaatselt.

> **NB!** Ära tee suuri refaktoreid. Ära muuda äriloogika skeemi. Paranda konkreetselt need 5 punkti.  
> Kui projektis on legacy “crisisMode” nimed, jäta nimed alles, aga UX peab vastama FAAS2-le.

---

## 0) Failid (tõenäolised)
Muuda ainult neid faile, kus tegelikult vastav kood elab (otsi).
- `index.html`
- `src/app.js` või `app.js`
- `src/styles/main.css` (või globaalne CSS)
- Vaadete failid, kui sul on eraldi `pages/*.js` või `pages/*.html`

---

# 1) Avalehe staatuskast (suur) + aktiivsete intsidentide loetelu

## 1.1 index.html — staatuskasti markup (üks, mitte pill)
**Leia** avalehel (Home) olemasolev status-pill / context box. Praegu on see väike pill “Kõik süsteemid töötavad…”.

**Asenda** see ühe suure konteineriga (jäta id-d nii, et JS saab juhtida):

```html
<!-- HOME STATUS (FAAS2) -->
<div class="home-status" id="homeStatusBox">
  <div class="home-status-title" id="homeStatusTitle">OLUKORD: TAVAPÄRANE</div>
  <div class="home-status-sub" id="homeStatusSub"></div>
</div>

<!-- ACTIVE INCIDENT LIST (FAAS2) -->
<div class="home-active-list" id="homeActiveList" style="display:none;">
  <ul class="home-active-ul" id="homeActiveUl"></ul>
</div>
```

**Reeglid:**
- `homeStatusBox` EI OLE klikitav.
- `homeStatusSub` võib olla tühi.
- Aktiivsete loetelu (`homeActiveList`) kuvatakse ainult siis, kui on aktiivseid intsidente (vt JS).

---

## 1.2 CSS — staatuskast suur ja selge, värvid lukus
**Lisa** globaalsesse CSS-i (main.css) lõppu:

```css
/* ===== FAAS2 Home Status Box (BIG) ===== */
.home-status{
  border-radius: 16px;
  padding: 18px 22px;
  margin: 18px auto 14px;
  width: min(1100px, 92%);
  color: #fff;
  font-weight: 700;
}

.home-status.is-normal{ background:#16a34a; } /* roheline */
.home-status.is-active{ background:#b91c1c; } /* punane */

.home-status-title{
  font-size: 24px;
  line-height: 1.2;
  letter-spacing: .2px;
}

.home-status-sub{
  margin-top: 6px;
  font-size: 14px;
  font-weight: 600;
  opacity: .95;
}

/* Active incident list under status */
.home-active-list{
  width: min(1100px, 92%);
  margin: 0 auto 16px;
}

.home-active-ul{
  margin: 0;
  padding: 0 0 0 18px;
  color: #374151;
  font-weight: 600;
}

.home-active-ul li{
  margin: 6px 0;
}
```

> Kui sul on juba keskne container/width süsteem, kohanda `width`/`margin`, kuid hoia staatuskast “suur ja domineeriv”.

---

## 1.3 JS — loogika: aktiivne vs tavapärane
**Leia** funktsioon, mis varem arvutas aktiivsete intsidentide arvu ja uuendas UI-d (võib olla `updateHomeUI`, `updateContextBox`, `renderHome`, vms).

**Rakenda** järgmised reeglid:

### Definitsioonid (lukus)
- **Aktiivne intsident** = incident, mille `status` on täpselt `ACTIVE`  
- **Mitte suletud intsident** = incident, mille `status` ei ole `CLOSED` (või puudub)

> See on oluline: ülemine kast sõltub ainult `ACTIVE`-st, badge sõltub `!= CLOSED`-st.

### Lisa / uuenda utilid:
```js
function loadIncidentsSafe() {
  try {
    const raw = localStorage.getItem('incidents');
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function countActiveIncidents(incidents) {
  return incidents.filter(i => (String(i.status || '')).toUpperCase() === 'ACTIVE').length;
}

function countNotClosedIncidents(incidents) {
  return incidents.filter(i => (String(i.status || '')).toUpperCase() !== 'CLOSED').length;
}
```

### Uuenda avalehe staatuskasti ja nimekirja:
```js
function updateHomeStatusAndList() {
  const incidents = loadIncidentsSafe();

  const activeCount = countActiveIncidents(incidents);
  const statusBox = document.getElementById('homeStatusBox');
  const title = document.getElementById('homeStatusTitle');
  const sub = document.getElementById('homeStatusSub');

  const listWrap = document.getElementById('homeActiveList');
  const ul = document.getElementById('homeActiveUl');

  if (!statusBox || !title) return;

  if (activeCount > 0) {
    statusBox.classList.remove('is-normal');
    statusBox.classList.add('is-active');
    title.textContent = `AKTIIVSED INTSIDENDID: ${activeCount}`;
    if (sub) sub.textContent = ''; // ei CTA teksti

    // Renderda aktiivsete nimed (minimaalne: title/name/scenario/type)
    if (listWrap && ul) {
      const active = incidents.filter(i => (String(i.status || '')).toUpperCase() === 'ACTIVE');
      ul.innerHTML = '';
      active.forEach(i => {
        const name = i.title || i.name || i.scenarioName || i.type || 'Intsident';
        const li = document.createElement('li');
        li.textContent = name;
        ul.appendChild(li);
      });
      listWrap.style.display = active.length ? 'block' : 'none';
    }
  } else {
    statusBox.classList.remove('is-active');
    statusBox.classList.add('is-normal');
    title.textContent = 'OLUKORD: TAVAPÄRANE';
    if (sub) sub.textContent = ''; // ära kirjuta “süsteemid...”

    if (listWrap) listWrap.style.display = 'none';
    if (ul) ul.innerHTML = '';
  }
}
```

### Kutsu init’is (ja igal home renderil)
- `DOMContentLoaded`
- pärast intsidendi loomist
- pärast staatuse muutust
- pärast sulgemist

Kui sul on olemas `navigateTo()` või `renderPage()`, lisa sinna:  
**kui leht = home**, siis kutsu `updateHomeStatusAndList()`.

---

# 2) Logid & Intsidendid badge — näitab MITTE-SULETUD intsidente

## 2.1 Badge UI element
Sinu kaart “Logid & Intsidendid” sisaldas varem badge’i numbriga.
**Leia** olemasolev badge element (nt `id="incidentsBadge"`).

Kui element on kadunud, **lisa tagasi** Logid kaardi sisse:
```html
<span class="badge" id="incidentsBadge" style="display:none;">0</span>
```

## 2.2 CSS (kui vajalik)
Kui badge stiil on kadunud, lisa (või taasta) min-stiil:
```css
.badge{
  position:absolute;
  top:14px;
  right:14px;
  min-width:22px;
  height:22px;
  border-radius:999px;
  background:#b91c1c;
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:12px;
  font-weight:700;
  padding:0 6px;
}
.card{ position:relative; }
```

## 2.3 JS — uuenda badge count (NOT CLOSED)
Lisa:
```js
function updateIncidentsBadge() {
  const incidents = loadIncidentsSafe();
  const notClosed = countNotClosedIncidents(incidents);

  const badge = document.getElementById('incidentsBadge');
  if (!badge) return;

  if (notClosed > 0) {
    badge.textContent = String(notClosed);
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}
```

Kutsu see samades kohtades, kus uuendad avalehe staatuskasti.

---

# 3) AVA INTSIDENT dialoog (kinnitus + REAL/TRAINING)

## 3.1 Nõue (lukus)
- AVA INTSIDENT ei tohi olla ühe-kliki tegevus.
- Enne stsenaariumite valikut tuleb:
  1) kinnitus
  2) REAL/TRAINING valik (default REAL)

## 3.2 Rakendus (minimaalne ja robustne)
**Leia** `activateCrisisMode()` (või `openNewIncidentFlow()`).

Muuda nii, et:
- avab dialoogid
- salvestab valiku session-scope’i (ajutiselt)
- seejärel navigeerib stsenaariumite valikule ja renderdab selle

```js
let __incidentMode = 'REAL'; // session-only

function askIncidentMode() {
  const real = window.confirm('Kas soovid avada uue intsidendi REAL režiimis?\n\nOK = REAL\nCancel = TRAINING');
  return real ? 'REAL' : 'TRAINING';
}

function activateCrisisMode() {
  const ok = window.confirm('Kas oled kindel, et soovid avada uue intsidendi?');
  if (!ok) return;

  __incidentMode = askIncidentMode();

  if (typeof window.navigateTo === 'function') window.navigateTo('crisisModePage');
  else if (typeof navigateTo === 'function') navigateTo('crisisModePage');

  if (typeof window.renderCrisisScenarios === 'function') window.renderCrisisScenarios();
  else if (typeof renderCrisisScenarios === 'function') renderCrisisScenarios();
  else if (typeof renderScenarios === 'function') renderScenarios();
}
```

> Kui sul on olemas parem modal UI, kasuta seda (soovitatav), aga säilita sama loogika ja default REAL.

---

# 4) Triage / tegevuste vaade — SAVE nupp tagasi

## 4.1 Nõue (lukus)
- Triage/tegevuste lehel peab olema **SAVE** nupp.
- SAVE:
  - uuendab intsidenti
  - ei muuda staatust automaatselt
  - ei sulge vaadet

## 4.2 Taasta SAVE nupp HTML-is
Leia triage leht (`triagePage` / `incidentMetricsPage` vms).
Kui SAVE nupp puudub, lisa vormi alla:

```html
<button class="btn-primary" id="triageSaveBtn" onclick="saveIncidentMetrics()">SAVE</button>
```

## 4.3 Taasta salvestusfunktsioon
Kui varem töötas ja kadus, **taasta olemasolev** funktsioon.

Kui funktsiooni pole või on katki, tee minimaalne, mis vähemalt salvestab:

```js
function saveIncidentMetrics() {
  const incidentId = window.currentIncidentId || localStorage.getItem('currentIncidentId');
  if (!incidentId) return;

  const incidents = loadIncidentsSafe();
  const idx = incidents.findIndex(i => String(i.id) === String(incidentId));
  if (idx === -1) return;

  // TODO: loe vormiväljad ja kirjuta incidents[idx] sisse vastavalt olemasolevale mudelile.
  // ÄRA muuda incidents[idx].status automaatselt.

  localStorage.setItem('incidents', JSON.stringify(incidents));
  console.log('[FAAS2] Metrics saved');
}
```

---

# 5) Ühine refresh hook
Pärast igat intsidenti mõjutavat tegevust (create/status change/close/save) kutsu:
```js
updateHomeStatusAndList();
updateIncidentsBadge();
```

Lisa `DOMContentLoaded` init:
```js
document.addEventListener('DOMContentLoaded', () => {
  updateHomeStatusAndList();
  updateIncidentsBadge();
});
```

Kui sul on SPA nav, kutsu neid ka Home renderil.

---

# 6) Smoke test

## 6.1 0 intsidenti
- Home: suur ROHELINE kast “OLUKORD: TAVAPÄRANE” (valge bold)
- Aktiivsete loetelu peidetud
- Logid badge peidetud

## 6.2 1 ACTIVE
- Home: suur PUNANE kast “AKTIIVSED INTSIDENDID: 1”
- All listis 1 nimi
- Logid badge vähemalt 1

## 6.3 0 ACTIVE, aga 1 not-closed (CONTAINED/RESOLVED)
- Home: ROHELINE “OLUKORD: TAVAPÄRANE”
- Logid badge = 1 (kuni CLOSED)

## 6.4 Avamise flow
- AVA INTSIDENT → kinnitus → REAL/TRAINING → stsenaariumid nähtavad

## 6.5 Triage SAVE
- Triage lehel SAVE olemas ja ei muuda staatust automaatselt

---

# 7) Commit
```bash
git add .
git commit -m "FAAS2 FIX: restore home status box (incident-based), active list, logs badge, open-incident dialog and triage SAVE"
```
