# 📋 FAAS 2 – INCIDENT LIFECYCLE REDESIGN (MASTER)

> **ÜKS AINUS TERVIKFAIL**  
> See dokument koondab:  
> 1) disaini- ja käitumisspetsifikatsiooni (use-case’ide kaupa)  
> 2) tehnilised rakendussammud (STEP1–STEP3) FAAS1 dokumentide stiilis  
> 3) testimise ja kontroll-lehed

Dokumendi toon ja ülesehitus on kooskõlas FAAS1 stiiliga fileciteturn2file0.

---

## 🎯 FAASI EESMÄRK

FAAS 2 eesmärk on ümber kujundada BCM rakenduse intsidendi elutsükkel nii, et:

- intsidendi loomine on **teadlik ja kontrollitud tegevus**
- UI **peegeldab olukorda**, mitte ei käivita seda
- toetatud on **mitu paralleelset intsidenti**
- Incident Metrics (triage) roll on **üheselt mõistetav**
- intsidendi staatused ja sulgemine on **juhtimisotsused**, mitte automaatika
- tegevused on **ajaliselt jälgitavad (timeline)**

FAAS 2 ei lisa backend’i ega mitmekasutajat – fookus on **UX + loogika korrastamisel**.

---

## 🧠 LUKUSTATUD PÕHIMÕTTED

1. **Intsident ≠ kriisirežiim**
2. **Intsident luuakse ainult teadliku kinnituse järel**
3. **UI ei tohi automaatselt luua ega sulgeda intsidenti**
4. **Võib olla mitu aktiivset intsidenti korraga**
5. **Checkbox = tegevus on TEHTUD**
6. **Staatus ei muutu automaatselt – ainult käsitsi**
7. **Kontekstikast on informatiivne, mitte interaktiivne**
8. **Incidentide leht on informatiivne (sealt ei looda intsidenti)**
9. **REAL/TRAINING valik on selge ja pöördumatu**

---

# ✅ DISAINI- JA KÄITUMISSPEKT (USE-CASE’ID)

## USE CASE 1: TAVAOLUKORD (0 AKTIIVSET INTSIDENTI)

### Olukord
Süsteemis ei ole ühtegi aktiivset intsidenti.

### UI
- Avalehel kuvatakse **kontekstikast**:
  ```
  BUSINESS CONTINUITY MANAGEMENT
  ```
- Kontekstikast:
  - hele / neutraalne
  - mitteklikiga
  - ainult informatiivne
- System Status: `OK`
- Avalehel on suur CTA: **AVA INTSIDENT**

---

## USE CASE 2: UUE INTSIDENDI AVAMINE (AINUS SISSEPÄÄS)

### Algus
Kasutaja vajutab avalehel **AVA INTSIDENT**.

### Sammud
1. Avaneb stsenaariumite valik
2. Kasutaja valib stsenaariumi
3. Avaneb kinnitusvaade, kus valitakse režiim:
   ```
   [ REAL ]   [ TRAINING ]
   ```
   - vaikimisi REAL
   - TRAINING = õppus
4. Kasutaja kinnitab

### Tulemus
- luuakse uus intsident
- staatus: `ACTIVE`
- lisatakse timeline sündmus: „Intsident loodud (REAL/TRAINING)”

---

## USE CASE 3: INCIDENT METRICS (TRIAGE)

### Roll
Incident Metrics on **esmane triage**, mitte ametlik raport ega sulgemise mehhanism.

### Käitumine
- avaneb kohe pärast intsidendi loomist
- avaneb igal intsidendi uuesti avamisel
- väljad on eeltäidetud, kui info on olemas

### SAVE
- nupp **SAVE**
- SAVE:
  - uuendab andmeid
  - EI muuda staatust
  - EI sulge intsidenti
  - lisab timeline sündmuse (mis muutus)

---

## USE CASE 4: CHECKBOXID = TEHTUD

- Checkbox tähendab alati: **tegevus on TEHTUD**
- Sõnastus peab seda kajastama (nt **„CERT-EE teavitatud”**)
- „Plaanime teha / tegemisel” on timeline märkus, mitte checkbox

---

## USE CASE 5: STAATUSED (AINULT KÄSITSI)

Staatused:
- `ACTIVE`
- `CONTAINED`
- `RESOLVED`
- `CLOSED`

Reeglid:
- staatus EI muutu automaatselt
- staatus muutub Incident Detail vaates:
  - **Muuda staatust** (nõuab põhjendust)
  - logib timeline’i

---

## USE CASE 6: MITU INTSIDENTI KORRAGA

- süsteemis võib olla mitu aktiivset intsidenti
- avalehe kontekstikast:
  - 1 aktiivne: `INTSIDENT: <nimi>`
  - 2+: `AKTIIVSED INTSIDENDID: <arv>`

---

## USE CASE 7: SULGEMINE

- sulgemine on eraldi tegevus Incident Detail vaates
- nõuab kinnitust ja põhjendust
- staatus → `CLOSED`
- logitakse timeline’i

---

# 🛠️ TEHNILINE RAKENDUS (STEP1–STEP3)

> **Töörežiim Claude Code’iga:**  
> Claude täidab selle dokumendi juhised **järjest**, STEP1 → STEP2 → STEP3.  
> Pärast iga STEPi tee testimine ja commit.

---

## 📋 STEP 1: UI & NAV

### 🎯 EESMÄRK
- eemaldada „kriisirežiimi aktiveerimise” UI
- lisada avalehele kontekstikast (mitteklikiga)
- lisada avalehele suur CTA „AVA INTSIDENT”
- Incidentide leht jääb informatiivseks (sealt ei looda intsidenti)

### ✅ SAMMUD

#### 1) UUENDA `index.html`

**A) EEMALDA kriisirežiimi UI**
- Eemalda/puhasta avalehe punane kriisibänner ja/või kriisinupp (kui olemas)
- UI-s ei tohi olla „Aktiveeri kriisirežiim / kriisirežiim” elemente

**B) LISA kontekstikast Home page’i ülaossa**
```html
<div class="bcm-context-box normal" id="bcmContextBox">
  <div class="bcm-context-title" id="bcmContextTitle">BUSINESS CONTINUITY MANAGEMENT</div>
  <div class="bcm-context-sub" id="bcmContextSub"></div>
</div>
```
- Ei ole klikitav (ei `onclick` ega link)

**C) LISA suur CTA „AVA INTSIDENT”**
```html
<button class="btn-primary btn-open-incident" onclick="openNewIncidentFlow()">AVA INTSIDENT</button>
```

#### 2) UUENDA Incidentide leht
- Eemalda sealt „➕ Ava uus intsident” / “Create incident” UI (kui see on)

#### 3) UUENDA CSS (`src/styles/main.css` vms)
Lisa lõppu:
```css
/* ===== FAAS2 STEP1: Context box + Open Incident CTA ===== */
.bcm-context-box{padding:20px;border-radius:16px;border:1px solid #ddd;margin-bottom:16px;user-select:none;cursor:default}
.bcm-context-box.normal{background:#fff;color:#111}
.bcm-context-box.alert{background:#b91c1c;color:#fff}
.bcm-context-title{font-size:22px;font-weight:700}
.bcm-context-sub{font-size:14px;opacity:.9;margin-top:4px}
.btn-open-incident{width:100%;margin:16px 0;font-size:18px;padding:16px;border-radius:16px}
```

#### 4) UUENDA `src/app.js` – placeholder
Lisa global expose sektsiooni:
```javascript
window.openNewIncidentFlow = function () {
  console.log('[FAAS2] openNewIncidentFlow() called - implement in STEP2');
};
```

### ✅ TESTIMINE
- Avalehel on kontekstikast ja suur „AVA INTSIDENT” nupp
- Kriisinupp/bänner puudub
- „AVA INTSIDENT” vajutus logib konsooli (placeholder)
- Incidentide lehel pole „Ava uus intsident” nuppu

### ✅ COMMIT
```bash
git add .
git commit -m "FAAS2 STEP1: UI+NAV - remove crisis UI, add context box and open incident CTA"
```

---

## 📋 STEP 2: UUE INTSIDENDI AVAMISE FLOW + KONTEKSTIKASTI LOOGIKA

### 🎯 EESMÄRK
- rakendada **AVA INTSIDENT** flow:
  - stsenaariumi valik
  - REAL/TRAINING toggle
  - kinnitus
  - intsidendi loomine
- uuendada avalehe kontekstikasti olek aktiivsete intsidentide alusel

### ✅ SAMMUD

#### 1) UUENDA `src/app.js`

**A) Implement `openNewIncidentFlow()`**
- Avab olemasoleva stsenaariumite valiku vaate
- Kui eraldi “scenario picker” lehte pole, siis:
  - kasuta olemasolevat stsenaariumite listi lehte
  - või kuva lihtne modal/overlay (kasuta olemasolevat UI mustrit)

**B) LISA REAL/TRAINING toggle**
- Kaks nuppu kõrvuti:
  - REAL (default)
  - TRAINING
- Toggle väärtus muutub enne kinnitust
- Kinnitatud intsidendi juures on `isExercise` väärtus pöördumatu

**C) LISA kinnitusdialoog**
- „Oled kindel, et soovid avada uue intsidendi?”
- Näita valitud stsenaariumi nime ja valitud režiimi

**D) LOO intsident alles kinnitamisel**
Pseudo:
```text
confirmCreateIncident(scenarioId, mode)
  incident = createIncidentFromScenario(scenarioId)
  incident.isExercise = (mode == TRAINING)
  incident.status = ACTIVE
  saveIncident(incident)
  addTimeline('Intsident loodud (REAL/TRAINING)')
```

> NB! STEP2-s tuleb eemaldada FAAS1 automaatne “intsident luuakse stsenaariumi avamisel” loogika. Intsident luuakse AINULT kinnituse järel.

#### 2) UUENDA kontekstikast
- `updateContextBox()` käivitatakse:
  - app init
  - pärast uue intsidendi loomist
  - pärast staatusmuutust / sulgemist (STEP3)

Reegel:
- 0 ACTIVE → normal + BCM tekst
- 1+ ACTIVE → alert + “INTSIDENT: <nimi>” (kui 1) või “AKTIIVSED INTSIDENDID: N” (kui >1)

### ✅ TESTIMINE
- „AVA INTSIDENT” avab valiku
- REAL/TRAINING toggle töötab (default REAL)
- kinnituse järel tekib uus intsident Incident Log’i
- kontekstikast muutub punaseks, kui on ACTIVE intsident

### ✅ COMMIT
```bash
git add .
git commit -m "FAAS2 STEP2: controlled incident creation flow with REAL/TRAINING and context box logic"
```

---

## 📋 STEP 3: TRIAGE SAVE + CHECKBOX=TEHTUD + STAATUSED + SULGEMINE

### 🎯 EESMÄRK
- triage (Incident Metrics) muutub update-only (SAVE)
- checkboxid = TEHTUD ja tekstid vastavaks
- staatused ainult käsitsi põhjendusega
- sulgemine kinnituse ja põhjendusega
- kõik olulised muutused logitakse timeline’i

### ✅ SAMMUD

#### 1) TRIAGE / Incident Metrics
- Triage avaneb alati olemasoleva incidentId kontekstis
- Väljad eeltäidetud
- Nupp **SAVE**:
  - uuendab incidenti
  - EI muuda staatust
  - lisab timeline sündmuse (muudatus)

#### 2) Checkboxid
- Muuda sõnastus “TEHTUD” semantikasse:
  - „CERT-EE teavitatud”
  - „DPO teavitatud”
  - „Juhtkond teavitatud”
- Linnukese lisamine/maha võtmine logib timeline’i

#### 3) Staatused
- Lisa Incident Detail vaates tegevus “Muuda staatust”
- Valikud: ACTIVE/CONTAINED/RESOLVED/CLOSED
- Nõua põhjendust (min 3–5 tähemärki)
- Salvesta ja logi timeline’i

#### 4) Sulgemine
- “Sulge intsident” on eraldi tegevus
- Nõuab kinnitust + põhjendust
- Staatus → CLOSED
- Logi timeline’i

### ✅ TESTIMINE
- Triage SAVE uuendab ja jätab staatuse samaks
- Checkboxid tähendavad “tehtud” (tekstid korras)
- Staatus ei muutu automaatselt
- Staatusmuutus nõuab põhjendust
- Sulgemine nõuab kinnitust + põhjendust

### ✅ COMMIT
```bash
git add .
git commit -m "FAAS2 STEP3: triage save, done-checkbox semantics, manual statuses and incident closing"
```

---

# ✅ LÕPPKONTROLL (FAAS 2)

FAAS 2 on valmis, kui:
- kriisirežiimi UI puudub
- avalehel on kontekstikast (mitteklikiga)
- uue intsidendi loomine käib AINULT avalehe nupust ja kinnitusega
- REAL/TRAINING on selge ja pöördumatu
- incidentide leht on informatiivne
- triage SAVE = update-only
- checkboxid = TEHTUD
- staatused ainult käsitsi põhjendusega
- sulgemine kinnituse+põhjendusega
- timeline kajastab olulisi muudatusi

