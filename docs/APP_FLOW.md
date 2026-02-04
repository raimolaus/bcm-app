# APP_FLOW — Rakenduse töövood ja navigatsioon

## JUHISED

### Miks see dokument on olemas
See dokument kirjeldab BCM rakenduse **kõiki põhilisi kasutajatöövoogusid**, ekraane, navigatsioonipunkte ja otsuste ahelaid. See on "kuidas rakendus töötab" kaart arendajale ja AI-le.

### Kuidas seda kasutada
- **Arendajad**: Enne uue flow implementeerimist loe vastav sektsioon läbi ja veendu, et kõik sammud on kaetud.
- **AI/Claude**: Kui implementeerid või parandad funktsionaalsust, vii esmalt siin kirjeldatu ellu enne uue loogika lisamist.
- **QA**: Kasuta seda manuaalsete testide stsenaariumide loomiseks.

### Mis peab siin olema
- ✅ **Ekraanide inventuur**: tabel kõikidest ekraanidest (page ID, entry points, exits)
- ✅ **Navigatsioonikaart**: kust kuhu saab liikuda (plain English)
- ✅ **Detailsed töövood**: samm-sammult flow'id koos otsustuspunktidega (if/else, success/error)
- ✅ **Veakäsitlus**: tühjad olekud, valideerimise reeglid, kasutaja tagasiside
- ✅ **Edge case'id**: mis juhtub, kui LocalStorage on tühi vms

### Mida siia ei tohi panna
- ❌ Täpseid UI värvikoodid (need kuuluvad FRONTEND_GUIDELINES.md-sse)
- ❌ Andmemudeleid (need on BACKEND_STRUCTURE.md-s ja data-model.md-s)
- ❌ Tehnoloogilisi detaile (need on TECH_STACK.md-s)
- ❌ Ärinõudeid (need on PRD.md-s)

---

## Ekraanide inventuur

| Ekraani nimi | Page ID (DOM) | Sisendpunktid | Peamised toimingud | Väljundpunktid |
|--------------|---------------|---------------|-------------------|----------------|
| Avaleht | `homePage` | App start, goHome() | AVA INTSIDENT, navigeeri kaartidele | plansPage, contactsPage, commPage, incidentsPage, crisisModePage |
| Plaanid | `plansPage` | Home → Plaanid kaart | Otsi plaane, vaata detaile | goBack() → Home |
| Kontaktid | `contactsPage` | Home → Kontaktid kaart | Vaata kontakte, filtreeri | goBack() → Home |
| Kommunikatsioon | `commPage` | Home → Kommunikatsioon kaart | Vaata kanaleid | goBack() → Home |
| Logid & Intsidendid | `incidentsPage` | Home → Logid kaart | Filtreeri intsidente, ava detail | goBack() → Home, → incidentDetailPage |
| AVA INTSIDENT | `crisisModePage` | Home → AVA INTSIDENT, top bar nupp | Vali stsenaarium | goBack() → Home, → scenarioDetailPage |
| Stsenaariumi detail | `scenarioDetailPage` | crisisModePage → vali stsenaarium | Täida kiiretoimingud, Incident Metrics, kommunikatsioon | goBack() → crisisModePage |
| Intsidendi detail | `incidentDetailPage` | incidentsPage → vali intsident | Vaata timeline, uuenda staatus, ekspordi, sulge | goBack() → incidentsPage |

---

## Navigatsioonikaart (Plain English)

```
Home (homePage)
├─→ Plaanid (plansPage)
├─→ Kontaktid (contactsPage)
├─→ Kommunikatsioon (commPage)
├─→ Logid & Intsidendid (incidentsPage)
│   └─→ Intsidendi detail (incidentDetailPage)
└─→ AVA INTSIDENT (crisisModePage)
    └─→ Stsenaariumi detail (scenarioDetailPage)
        └─→ [Loob/uuendab intsidenti] → (vajadusel incidentDetailPage)
```

**Routing konventsioon:**
- SPA-stiilis: `navigateTo(pageId)` peidab kõik `.page` elemendid ja näitab ainult target'it `.page.active`
- `goBack()`: navigation history stack (LIFO)
- `goHome()`: alati tagasi `homePage`

---

## Detailsed töövood

### 1) Kriisirežiimi / intsidendi avamine

#### 1.1 Kasutaja klikib "AVA INTSIDENT" kaardil

**Sammud:**
1. **Kinnitusdialoog:** "Kas oled kindel, et soovid avada uue intsidendi?"
   - **Cancel:** Tühista, jää Home-le
   - **OK:** Jätka → Samm 2
2. **REAL/TRAINING valik:** "Kas soovid avada uue intsidendi REAL režiimis?"
   - **OK:** `__incidentMode = 'REAL'`
   - **Cancel:** `__incidentMode = 'TRAINING'`
3. **Navigeeri:** `navigateTo('crisisModePage')`
4. **Renderdа:** Kutsu `renderScenarios()` → kuva stsenaariumide grid

**Otsustuspunktid:**
- Kui dialoogid tühistatakse: ÄRA loo intsidenti, jää Home-le
- Kui stsenaariumide renderer puudub: Kuva veateade "Stsenaariumite loogika pole laetud"

#### 1.2 Kasutaja valib stsenaariumi

**Sammud:**
1. **Klikk stsenaariumikaardil:** Salvestab `currentScenario`
2. **Navigeeri:** `navigateTo('scenarioDetailPage')`
3. **Renderdа:** Scenario detail vaade (pealkiri, kirjeldus, kiiretoimingud jne)
4. **Incident Metrics plokk:** Kui `type === 'cyber'`, kuva "Intsidendi mõõtmed" vorm

**Otsustuspunktid:**
- Kui stsenaarium puudub (invalid ID): Kuva error, jää crisisModePage-le
- Kui intsidenti juba eksisteerib (sama stsenaarium + ACTIVE status): TODO: dedupe loogika (praegu puudub, märgi siin)

### 2) Incident Metrics salvestamine (küberintsident)

**Eeldus:** Kasutaja on `scenarioDetailPage`-l, `currentScenario.type === 'cyber'`

**Sammud:**
1. **Kasutaja täidab väljad:**
   - `t0` (t0Time datetime-local)
   - `sLevel` (S0-S3 valik klikkides kaardile)
   - `affectedDomain`, `serviceDisruption`, `dataBreachSuspicion` jne
2. **Kasutaja klikib "💾 Salvesta":**
   - **Validatsioon:** `selectedSLevel` peab olema määratud
     - **Fail:** Alert "Palun vali S-tase", stopp
   - **Success:** Jätka → Samm 3
3. **Andmete kogumine:**
   - Koguda kõik vormiväljad → `IncidentMetrics` objekt
4. **Intsidendi loomine/uuendamine:**
   - Kui `currentIncidentLogId` eksisteerib: **UPDATE** olemasolevat
   - Muidu: **CREATE** uus `IncidentLogEntry`
5. **LocalStorage salvestamine:**
   - `localStorage.setItem('incidentLog', JSON.stringify(incidentLog))`
6. **Tagasiside:** Alert "Intsidenti mõõtmed salvestatud!"
7. **UI uuendamine:**
   - Kutsu `updateHomeStatusAndList()`
   - Kutsu `updateIncidentsBadge()`

**Otsustuspunktid:**
- Kui S-tase puudub: Blokeerib salvestamist
- Kui t0 puudub: Lubab salvestada (optional field)
- Kui stsenaarium on `null`: Error "Palun vali esmalt stsenaarium"

**Edge case'id:**
- Kui LocalStorage on täis: Browser error (pole app-is käsitletud)
- Kui vormiväli ID puudub DOM-is: Vaikeväärtus `undefined` või skip

### 3) Intsidentide loetelu ja filtreerimine

**Eeldus:** Kasutaja on `incidentsPage`-l

**Sammud:**
1. **Lae intsidendid:** `loadIncidentsSafe()` → LocalStorage 'bcm_incidents'
2. **Kuva loetelu:** Renderda iga intsidendi kaart
   - **Näita:** `title`, `status`, `severity`, `type`, `isExercise` badge
3. **Filtrid (kui implementeeritud):**
   - **ACTIVE:** `status === 'ACTIVE'`
   - **CLOSED:** `status === 'CLOSED'`
   - **EXERCISE:** `isExercise === true`
4. **Tühi olek:** Kui intsidente pole: Kuva "Intsidente ei ole veel loodud"

**Otsustuspunktid:**
- Kui intsidendid puuduvad: Kuva tühi olek tekst
- Kui filter ei leia midagi: Kuva "Ei leidnud vastavaid intsidente"

#### 3.1 Intsidendi avamine detailvaates

**Sammud:**
1. **Klikk intsidendi kaardil:** Salvestab `currentIncident`
2. **Navigeeri:** `navigateTo('incidentDetailPage')`
3. **Renderdа detailvaade:**
   - **Ülevaade:** Põhiinfo, severity, status, timestamps
   - **Ajajoon:** Toimingute list (timeline)
   - **Checklist:** Progress trackimise elemendid
   - **Teavitused:** CERT-EE, DPO, juhtkond
   - **Eksport:** TXT formaadis ekspordi nupp

**Otsustuspunktid:**
- Kui intsidenti ei leitud: Error, jää incidentsPage-le
- Kui timeline on tühi: Kuva "Toiminguid pole veel salvestatud"

### 4) Intsidendi staatuse uuendamine

**Eeldus:** Kasutaja on `incidentDetailPage`-l

**Sammud:**
1. **Kasutaja klikib "✏️ Uuenda staatus":**
   - **Avatakse dialoog:** FAAS2 Status Dialog
2. **Kasutaja valib uue staatuse:**
   - **ACTIVE / CONTAINED / RESOLVED / CLOSED**
3. **Kasutaja sisestab põhjenduse:**
   - **Required:** Tekstiväli (min length soovitavalt 5 tähte)
4. **Kasutaja klikib "Salvesta":**
   - **Validatsioon:** Põhjendus ei tohi olla tühi
     - **Fail:** Alert "Palun sisesta põhjendus"
   - **Success:** Jätka → Samm 5
5. **Uuenda intsidenti:**
   - `currentIncident.status = newStatus`
   - `currentIncident.updatedAt = now`
   - Lisa timeline action: "Staatus muudetud: [status] - [reason]"
6. **Salvesta:** `saveIncident(currentIncident)`
7. **UI uuendamine:**
   - Kutsu `updateHomeStatusAndList()`
   - Kutsu `updateIncidentsBadge()`
   - Re-render `renderIncidentDetail()`
8. **Sulge dialoog**

**Otsustuspunktid:**
- Kui põhjendus on tühi: Blokeerib salvestamist
- Kui status on juba sama: Lubab (lihtsalt lisa timeline entry)

### 5) Intsidendi sulgemine

**Eeldus:** Kasutaja on `incidentDetailPage`-l

**Sammud:**
1. **Kasutaja klikib "🔒 Sulge intsident":**
   - **Avatakse dialoog:** Close Confirmation Dialog
2. **Kasutaja sisestab sulgemise põhjuse:**
   - **Required:** Tekstiväli
3. **Kasutaja klikib "Sulge":**
   - **Validatsioon:** Põhjus ei tohi olla tühi
     - **Fail:** Alert "Palun sisesta sulgemise põhjus"
   - **Success:** Jätka → Samm 4
4. **Uuenda intsidenti:**
   - `currentIncident.status = 'CLOSED'`
   - `currentIncident.tClosed = now`
   - `currentIncident.updatedAt = now`
   - Lisa timeline action: "Intsident suletud: [reason]"
5. **Salvesta:** `saveIncident(currentIncident)`
6. **UI uuendamine:**
   - Kutsu `updateHomeStatusAndList()`
   - Kutsu `updateIncidentsBadge()`
7. **Alert:** "Intsident suletud!"
8. **Navigeeri tagasi:** `goBack()` → incidentsPage

**Otsustuspunktid:**
- Kui põhjus on tühi: Blokeerib sulgemist
- Kui intsident on juba CLOSED: Lubab (lihtsalt lisa timeline entry)

### 6) ÕPPUS režiimi toggle

**Eeldus:** Top bar sisaldab ÕPPUS toggle (NB: varasema paranduse järel see eemaldati!)

**Märkus:** Praeguses versioonis ÕPPUS toggle on top bar'ist eemaldatud. REAL/TRAINING valik toimub intsidendi avamise dialoogis.

**Alternatiivne flow (kui toggle taastatatakse):**

**Sammud:**
1. **Kasutaja klikib ÕPPUS toggle:**
   - **ON → OFF või OFF → ON**
2. **Salvestamine:**
   - `localStorage.setItem('exerciseMode', 'true'/'false')`
3. **UI uuendamine:**
   - Uuenda toggle tekst: "ÕPPUS: SEES" või "ÕPPUS: VÄLJAS"
   - Uuenda värvikood (orange kui SEES)
4. **Mõju uutele intsidentidele:**
   - Kui SEES: `isExercise = true`
   - Kui VÄLJAS: `isExercise = false`
5. **Badge'id ja filtrid:**
   - Intsidentide loetelu näitab "ÕPPUS" badge'i
   - Filtrid peavad eraldi näitama õppus-intsidente

**Otsustuspunktid:**
- Õppus-režiim EI mõjuta olemasolevaid intsidente, ainult uusi

### 7) System Status (auto vs manual)

**Auto režiim:**
- Arvutatakse intsidentide alusel:
  - 0 ACTIVE: Status = OK, "Kõik süsteemid töötavad tavapäraselt"
  - ≥1 ACTIVE: Status = ALERT, "AKTIIVSED INTSIDENDID: N"

**Manual override:**
1. **Kasutaja klikib Status Pill:**
   - **Avatakse:** System Status Modal
2. **Kasutaja valib staatuse:**
   - **OK / WARNING / ALERT**
3. **Kasutaja sisestab põhjuse:**
   - **Required:** Max 120 tähemärki
4. **Kasutaja klikib "Salvesta":**
   - **Validatsioon:** Põhjus ei tohi olla tühi
     - **Fail:** Alert "Palun sisesta põhjus"
   - **Success:** Jätka → Samm 5
5. **Salvestamine:**
   - `localStorage.setItem('systemStatus', JSON.stringify({mode: 'MANUAL', level, reason, updatedAt}))`
6. **UI uuendamine:**
   - Uuenda Status Pill värvus ja tekst
7. **Sulge modal**

**Taastamine AUTO-sse:**
- Kasutaja klikib "Taasta automaatne" → `mode = 'AUTO'`

**Otsustuspunktid:**
- Manual override ALATI võidab AUTO arvutuse
- Kui manual reason on tühi: Blokeerib salvestamist

### 8) Ekspordi flow

**Eeldus:** Kasutaja on `incidentDetailPage`-l

**Sammud:**
1. **Kasutaja klikib "📄 Eksport":**
   - **Genereeritakse TXT fail:**
     - Incident ID, title, status, timestamps
     - Timeline (kõik actions)
     - Metrics (kui küberintsident)
     - Checklist progress
2. **Brauseri allalaadimine:**
   - `Blob` + `URL.createObjectURL()` + `<a download>`
3. **Failinimi:** `incident_[id]_[timestamp].txt`

**Otsustuspunktid:**
- Kui intsidenti ei leitud: Error
- Kui timeline on tühi: Ekspordi ikkagi (lihtsalt tühi sektsioon)

---

## Veakäsitlus ja edge case'id

### Tühjad olekud
- **Intsidentide loetelu tühi:** Kuva "Intsidente ei ole veel loodud. Alusta intsidendi avamisest."
- **Timeline tühi:** Kuva "Toiminguid pole veel salvestatud."
- **Kontaktide loetelu tühi:** Kuva "Kontakte ei ole lisatud."

### Valideerimise reeglid
- **S-tase (Incident Metrics):** Required
- **Staatuse muutmise põhjus:** Required, min length 1
- **Sulgemise põhjus:** Required, min length 1
- **System Status põhjus:** Required, max 120 tähemärki

### LocalStorage edge case'id
- **Puudub:** `loadIncidentsSafe()` tagastab `[]`
- **Corrupt JSON:** Try-catch, tagastab `[]`
- **Täis:** Browser error (pole rakenduses käsitletud)

### Duplikaadi vältimine
- **TODO:** Praegu pole dedupe loogi galelu kui sama stsenaarium avatakse mitu korda
- **Soovitus:** Kontrolli kas `scenarioId` + `status === 'ACTIVE'` eksisteerib, siis UPDATE, mitte CREATE

---

## Navigeerimise konventsioonid

### Global navigation
- **goHome():** Alati tagasi Home-le, tühjenda history
- **goBack():** LIFO navigation stack, kui tühi → goHome()
- **navigateTo(pageId, skipHistory):** Peida kõik `.page`, näita target, lisa history-sse

### Crisis mode navigation lock (EEMALDATUD FAAS2-s)
- **Varem:** Crisis mode blokeeris navigeerimise, kuni "Lõpeta kriis"
- **Nüüd:** Navigeerimine on alati lubatud (FAAS2 FIX: remove crisis nav lock)

---

## Muud märkused

- **Incident Mode (REAL/TRAINING):** Session-only, salvestatakse `__incidentMode` muutujasse, ei säili localStorage'is
- **currentIncident / currentScenario:** Runtime muutujad, ei säili page reload'il
- **Badge arv:** Logid & Intsidendid badge näitab NOT CLOSED count (kõik peale CLOSED)
- **Home status kast:** Näitab ACTIVE count (ainult `status === 'ACTIVE'`)

---

**Viimati uuendatud:** 2026-02-04
**Seotud dokumendid:** PRD.md, BACKEND_STRUCTURE.md, FRONTEND_GUIDELINES.md
