# TECH_STACK.md  
## Business Continuity Management (BCM) App — Technical Stack & Constraints (V1, Canonical)

---

## JUHISED

### Milleks see dokument on
See dokument kirjeldab **BCM rakenduse tehnoloogilist alust ja piiranguid**.

TECH_STACK:
- lukustab, *mida kasutatakse*
- lukustab, *mida EI kasutata*
- hoiab ära tehnoloogilise triivi (nt “äkki React”, “äkki backend”)

See dokument EI OLE:
- arendusjuhend
- koodistandard
- infrastruktuuri kirjeldus
- tööriistade õpetus

---

### Kuidas seda dokumenti kasutada
- Kontrolliks enne uute tehnoloogiate lisamist
- AI ja arendaja lähtealusena tehniliste otsuste tegemisel
- Sisendina IMPLEMENTATION_PLAN.md-le

Kui keegi tahab lisada tehnoloogiat, mida siin ei ole:
- see on **out of scope**
- või nõuab TECH_STACK muudatust (teadlik otsus)

---

### Kohustuslikud osad (kontrollnimekiri)
- Runtime keskkond
- Keeled ja standardid
- Sõltuvused
- Andmesalvestus
- Testimise lähenemine
- Versioonihaldus ja lukustused
- Teadlikud piirangud

---

### Out of scope
- Backend tehnoloogiad
- Raamistike (framework) võrdlus
- CI/CD
- Pilveinfrastruktuur

---

## 1. Runtime keskkond

### 1.1 Käivituskeskkond
- Rakendus töötab **otse veebibrauseris**
- Toetatud brauserid:
  - kaasaegsed evergreen brauserid
    - Chrome
    - Edge
    - Firefox
    - Safari (uusimad versioonid)

Rakendus ei ole mõeldud:
- Internet Explorerile
- vanadele brauseritele

---

### 1.2 Käivitamine
- Rakendus on staatiline (HTML/CSS/JS)
- Vajab:
  - lihtsat HTTP serverit
  - või GitHub Pages’i sarnast hostimist

**Soovituslikud lokaalsed variandid:**
- `python -m http.server`
- `npx serve`
- VS Code Live Server

---

## 2. Kasutatavad keeled ja standardid

### 2.1 Keeled
- HTML5
- CSS3
- JavaScript (ES6+)

### 2.2 JavaScripti kasutus
- Vanilla JavaScript
- ES modules (kui koodibaas seda kasutab)
- Ei kasutata transpileerimist (Babel vms)

---

## 3. Sõltuvused (Dependencies)

### 3.1 Välised teegid
- Rakendus EI kasuta:
  - Reacti
  - Vue’d
  - Angularit
  - jQueryt
  - UI teegid (Bootstrap, MUI, Tailwind jne)

### 3.2 Package manager
- Puudub `package.json`
- Puudub NPM/Yarn/PNPM runtime sõltuvus

> TODO: Kui repo’s eksisteerib `package.json`, tuleb see siin eraldi dokumenteerida.  
> Praeguse teadmise järgi: **puudub**.

---

## 4. Andmesalvestus

### 4.1 Salvestuslahendus
- Ainus püsiv salvestus:
  - **LocalStorage**

### 4.2 Põhimõtted
- Offline-first
- Local-first
- Ei ole serverisünkroniseerimist
- Ei ole mitme kasutaja koordineerimist

Täpsed reeglid:
- vt `BACKEND_STRUCTURE.md`

---

## 5. Rakenduse arhitektuuriline stiil

### 5.1 Üldine stiil
- SPA-laadne käitumine
- Vaated vahetuvad JavaScripti abil
- Lehte ei laeta uuesti

### 5.2 Seisundi haldus
- Keskne andmeallikas: LocalStorage
- Vaated:
  - loevad andmeid
  - ei halda oma püsivat olekut

---

## 6. Testimine

### 6.1 Testimise lähenemine
- Automatiseeritud teste EI OLE
- Testimine toimub:
  - käsitsi
  - acceptance criteria alusel

### 6.2 Testimise alus
- PRD.md
- APP_FLOW.md
- FRONTEND_GUIDELINES.md

Kui käitumine ei vasta dokumentidele:
- tegemist on bugi või regressiooniga

---

## 7. Versioonihaldus ja lukustused

### 7.1 Versioonid
- Rakendusel ei ole semantilist versioonihaldust
- Dokumentide versioonid:
  - hallatakse faili tasemel (V1, V2 jne)

### 7.2 Tagasiühilduvus
- Andmemudeli muudatused:
  - peavad arvestama olemasolevat LocalStorage sisu
- Migratsioonid:
  - peavad olema vaiksed ja idempotentsed  
  (vt BACKEND_STRUCTURE.md)

---

## 8. Teadlikud tehnilised piirangud

- Puudub backend
- Puudub autentimine
- Puudub rollimudel
- Puudub reaalajas sünkroniseerimine
- Puudub serveripoolne valideerimine

Need EI OLE:
- ajutised puudused
- “hiljem parandame” kohad

Need ON:
- teadlikud arhitektuursed otsused

---

## 9. Turvalisus (piiratud ulatus)

- LocalStorage ei ole turvaline
- Rakendus ei tohi:
  - salvestada paroole
  - salvestada API võtmeid
  - käsitleda tundlikke isikuandmeid

Rakendus eeldab:
- piiratud kasutuskeskkonda
- usaldatud seadet

---

**TECH_STACK.md (V1) on kanoniline tehnoloogiline alus.**  
Kõik tehnilised otsused peavad olema sellega kooskõlas.
