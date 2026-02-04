# FRONTEND_GUIDELINES — UI disain ja komponendid

## JUHISED

### Miks see dokument on olemas
See dokument määrab BCM rakenduse **visuaalse ja kasutajaliidese standardi**. Tagab järjepidevuse ja aitab vältida juhuslikku UI drift'i.

### Kuidas seda kasutada
- **Arendajad**: Kontrolli design token'eid enne uue komponendi loomist
- **AI/Claude**: Kasuta siin määratud style'e ja komponente, ära invente uusi kui pole vaja
- **Disainerid**: Uuenda token'eid kui disain muutub

### Mis peab siin olema
- ✅ **UI põhimõtted**: clarity, low cognitive load
- ✅ **Design tokens**: värvid, typography, spacing, breakpoints
- ✅ **Komponendid**: cards, buttons, pills, banners, forms
- ✅ **Layout reeglid**: topbar, page structure
- ✅ **Do/Don't list**: vältimaks UI drift'i

### Mida siia ei tohi panna
- ❌ Äriloogikat (kuulub PRD.md-sse ja APP_FLOW.md-sse)
- ❌ Andmemudeleid (kuuluvad BACKEND_STRUCTURE.md-sse)
- ❌ Implementatsiooni samme (kuuluvad IMPLEMENTATION_PLAN.md-sse)

---

## UI põhimõtted

### 1. Selgus (Clarity)
- Üks primaarne tegevus vaates
- Selge hierarhia (title → subtitle → content)
- Tühjad olekud peavad selgitama, mis puudub ja kuidas jätkata

### 2. Madal kognitiivne koormus
- Minimaalsed sammud eesmärgini
- Explicit "Save" tegevused (mitte auto-save)
- Kinnitusdialoogid destructive action'ite puhul

### 3. Järjepidevus
- Sama komponent näeb sama välja kõikjal
- Värvid on semantilised (roheline = OK, punane = error/alert)
- Spacing on ühtlane (kasuta spacing scale)

---

## Design Tokens

### Värvid (TODO: ekstrakteerida src/styles/main.css-ist)

**Semantilised:**
- Success Green: #16a34a (OK status)
- Error/Alert Red: #b91c1c (AKTIIVSED INTSIDENDID)
- Primary Blue: #2563eb (nupud, lingid)
- Warning Amber: #f59e0b (hoiatused)

**Neutral:**
- White: #ffffff
- Gray 200: #e5e7eb
- Gray 500: #6b7280
- Gray 900: #111827

### Typography

**Font Family:** -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

**Sizes:**
- SM: 14px (body, forms)
- MD: 16px (default)
- LG: 18px (card titles)
- XL: 24px (page headers)

### Spacing Scale
- SM: 8px
- MD: 12px
- LG: 16px
- XL: 24px
- 2XL: 32px

---

## Komponendid

### Cards (Home page)
```html
<div class="card" data-card="[key]">
  <div class="icon-circle icon-[color]">
    [SVG]
  </div>
  <h2>[Title]</h2>
  <p>[Description]</p>
</div>
```

### Buttons
- `.btn-primary` - sinine, primary actions
- `.btn-secondary` - hall, secondary actions
- `.btn-critical` - punane, destructive actions

### Status Box (Home)
```html
<div class="home-status is-normal|is-active">
  <div class="home-status-title">[Text]</div>
</div>
```

### Badge
```html
<span class="badge">[Count]</span>
```

---

## Layout reeglid

### Top Bar
- Fixed, height 60px
- White background, border-bottom

### Home Page
- Status kast esimesena
- 4-column cards grid (responsive: 2-col, 1-col)

---

## Do's and Don'ts

### ✅ DO
- Kasuta spacing scale
- Järgi komponente
- Testi mobile'is
- Lisa tühja oleku tekst

### ❌ DON'T
- Ära inventi uusi värve
- Ära kasuta inline style'e (välja arvatud dynamic)
- Ära loo uusi font size'e
- Ära kasuta random spacing

---

**Viimati uuendatud:** 2026-02-04
**Seotud dokumendid:** PRD.md, APP_FLOW.md
