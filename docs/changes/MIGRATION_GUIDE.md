# 🔄 BCM MIGRATION GUIDE - Moodulisele Struktuurile Üleminek

## 📋 ÜLEVAADE

See juhend aitab sul üle minna praeguselt monoliitkoodilt moodulsele struktuurile.

---

## 🎯 MIS MUUTUB?

### ENNE (Monolith):
```
BCM/
├── index.html (329 rida, kõik HTML)
├── app-new.js (kontaktid + nav)
├── crisis-app.js (kriisirežiim)
├── crisis-data.js (andmed)
├── plans-app.js (plaanid)
├── styles.css
├── crisis-styles.css
└── plans-styles.css
```

### PÄRAST (Modular):
```
BCM/
├── index.html (väike, laeb moodulid)
├── src/
│   ├── app.js (peamine entry point)
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── ContactsPage.js
│   │   ├── CrisisPage.js
│   │   └── WarRoomPage.js
│   ├── components/
│   │   ├── ScenarioCard.js
│   │   ├── ContactCard.js
│   │   └── ChecklistItem.js
│   ├── data/
│   │   ├── crisis-data.js
│   │   └── contacts.js
│   ├── utils/
│   │   ├── navigation.js
│   │   ├── storage.js
│   │   └── logger.js
│   └── styles/
│       ├── main.css
│       ├── crisis.css
│       └── plans.css
└── legacy/
    ├── index-old.html (varukoopia)
    ├── app-old.js
    └── ...
```

---

## 📝 MIGRATSIOONISSAMMUD

### SAMM 1: VARUKOOPIA (5 min)

1. **Loo `legacy` kaust:**
```bash
cd C:\CLAUDE\BCM
mkdir legacy
```

2. **Kopeeri olemasolevad failid varuks:**
```bash
copy index.html legacy\index-old.html
copy app-new.js legacy\app-old.js
copy crisis-app.js legacy\
copy crisis-data.js legacy\
copy plans-app.js legacy\
copy *.css legacy\
```

---

### SAMM 2: LOO UUS STRUKTUUR (5 min)

**Automaatselt BAT failiga:**
```bash
create-structure.bat
```

Või käsitsi:
```bash
mkdir src
mkdir src\pages
mkdir src\components
mkdir src\data
mkdir src\utils
mkdir src\styles
```

---

### SAMM 3: ASENDA INDEX.HTML (2 min)

1. **Nimeta vana ümber:**
```bash
rename index.html index-old.html
```

2. **Kopeeri uus:**
```bash
copy index-new.html index.html
```

---

### SAMM 4: ASETA MOODULID ÕIGETESSE KOHTADESSE (10 min)

**1. Utils:**
```bash
copy navigation.js src\utils\
copy storage.js src\utils\
copy logger.js src\utils\
```

**2. Components:**
```bash
copy ContactCard.js src\components\
copy ScenarioCard.js src\components\
copy ChecklistItem.js src\components\
```

**3. Pages:**
```bash
copy HomePage.js src\pages\
copy ContactsPage.js src\pages\
```

**4. Data:**
```bash
copy crisis-data.js src\data\
copy contacts.js src\data\
```

**5. Styles:**
```bash
copy styles.css src\styles\main.css
copy crisis-styles.css src\styles\crisis.css
copy plans-styles.css src\styles\plans.css
```

**6. Main app:**
```bash
copy app.js src\
```

---

### SAMM 5: PARANDUSED CSS PATHIDES (2 min)

Ava `index.html` ja kontrolli, et CSS pathid on õiged:
```html
<link rel="stylesheet" href="src/styles/main.css">
<link rel="stylesheet" href="src/styles/crisis.css">
<link rel="stylesheet" href="src/styles/plans.css">
```

---

### SAMM 6: TESTIMINE (5 min)

1. **Ava brauseris:**
```
file:///C:/CLAUDE/BCM/index.html
```

2. **Testi funktsioonid:**
   - [ ] Avaleht laeb
   - [ ] Kontaktide leht töötab
   - [ ] Kriisirežiim aktiveerub
   - [ ] Stsenaariumid avanevad
   - [ ] War Room töötab

3. **Vaata konsooli** (F12 → Console):
```
🚀 BCM Application Starting...
Initializing systems...
✅ BCM Application Ready!
```

---

### SAMM 7: GIT COMMIT (3 min)

```bash
git add .
git commit -m "Refactor: Modular architecture v0.2"
git push origin main
```

---

## ⚠️ VÕIMALIKUD PROBLEEMID

### Probleem 1: "Uncaught SyntaxError: Cannot use import statement outside a module"

**Lahendus:** Kontrolli, et `<script>` tag on `type="module"`:
```html
<script type="module" src="src/app.js"></script>
```

### Probleem 2: CORS Error (cross-origin)

**Lahendus:** Kasuta Live Server'it:
```bash
# VS Code: Install "Live Server" extension
# Või käivita Python HTTP server:
python -m http.server 8000
# Siis ava: http://localhost:8000
```

### Probleem 3: Funktsioonid pole defineeritud (`navigateTo is not defined`)

**Lahendus:** Kontrolli, et funktsioonid on exposed globally:
```javascript
window.navigateTo = navigateTo;
```

### Probleem 4: CSS ei laadi

**Lahendus:** Kontrolli pathid:
```html
<!-- ÕIGE -->
<link rel="stylesheet" href="src/styles/main.css">

<!-- VALE -->
<link rel="stylesheet" href="styles/main.css">
```

---

## 🎯 JÄRGMISED SAMMUD

Kui mooduliseerimine töötab:

1. **Refaktoreeri crisis-app.js** → `src/pages/CrisisPage.js`
2. **Refaktoreeri plans-app.js** → `src/pages/PlansPage.js`
3. **Lisa PWA** (Service Worker)
4. **Lisa Supabase** (backend)

---

## ✅ CHECKLIST

Kasuta seda teha kindlaks, et kõik sammud on tehtud:

- [ ] Varukoopia tehtud (`legacy/` kaust)
- [ ] `src/` struktuur loodud
- [ ] Uus `index.html` paigas
- [ ] Kõik moodulid `src/` kaustas
- [ ] CSS pathid korrigeeritud
- [ ] Brauseris testimine OK
- [ ] Konsool ei näita vigu
- [ ] Git commit tehtud
- [ ] GitHub Pages uuendatud

---

## 🆘 ABI

Kui midagi läheb valesti:

1. **Taasta vana versioon:**
```bash
copy legacy\index-old.html index.html
```

2. **Refresh brauserit** (Ctrl+F5)

3. **Vaata konsooli vigu** (F12)

---

**Edu mooduliseerimisega!** 🚀
