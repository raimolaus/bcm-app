# FAAS2_FIXES_STEP1 — UI & NAV parandused (ainult parandused)

**Eesmärk:** parandada 4 konkreetset viga pärast viimast testimist:
1) `AVA INTSIDENT` peab olema **kandiline kaart** (nagu Plaanid/Kontaktid/Kommunikatsioon), mitte lai riba/bänner.
2) Ülemisest ribast tuleb **eemaldada** `ÕPPUS` toggle (kolime selle “intsidendi avamise” flow’sse).
3) `AVA INTSIDENT` peab viima **stsenaariumite valikule** (kõik kriisi-variandi nupud nähtaval), mitte “tühjale” lehele.
4) Avalehe alumine **Süsteemi olek** blokk tuleb **ära eemaldada** (praegu ei kasuta).

> Tee **ainult** need parandused. Ära muuda muid varasemalt tehtud funktsioone (intsidentide list, detail, logimine, jne).

---

## 0) Failid mida muudad

- `index.html`
- `src/styles/main.css` (vajadusel väike lisastiil uuele kaardile)
- `src/styles/crisis.css` (kui vajalik — tühja lehe põhjustab mõnikord `display:none`/layout)
- `src/app.js` või vastav JS fail, kus on `activateCrisisMode()` ja `renderScenarios()` / stsenaariumite renderdamine  
  (täpne failinimi sõltub projektist — **otsi funktsioone** ja muuda seal)

---

## 1) index.html — AVA INTSIDENT kaardiks + ÕPPUS toggle eemaldus + süsteemi oleku eemaldus

### 1.1 Eemalda top-bar’ist ÕPPUS toggle

**Leia:**
```html
<!-- Exercise Mode Toggle -->
<div class="exercise-toggle">
  ...
</div>
```

**Eemalda see blokk täielikult** (jätad alles ainult Home nupu).

---

### 1.2 Lisa avalehe kaart “AVA INTSIDENT” samasse grid’i

**Fail:** `index.html`  
**Leia:** avalehel `#homePage` sees `<div class="cards-grid cards-grid-4"> ... </div>`

**Lisa uue kaardi HTML** kohe pärast “Kommunikatsioon” kaarti (enne “Logid & Intsidendid” kaarti), et “AVA INTSIDENT” oleks nähtav ja loogiline.

**LISA:**
```html
<div class="card card-action" onclick="activateCrisisMode()">
  <div class="icon-circle icon-red">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  </div>
  <h2>AVA INTSIDENT</h2>
  <p>Vali stsenaarium ja alusta juhtumi haldust</p>
</div>
```

> NB! `onclick="activateCrisisMode()"` peab viima kriisistsenaariumite valikule (fix #3 on JS pool).

---

### 1.3 Eemalda avalehe “Süsteemi olek” kaart

**Fail:** `index.html`  
**Leia:** kohe pärast cards-grid’i on:

```html
<div class="system-status-card" id="systemStatusCard">
  ...
</div>
```

**Eemalda see blokk täielikult.**

> Top-bar’i `status-pill` jääb alles.

---

### 1.4 (Valikuline, kuid soovitatav) Kriisibänneri käitumine

Praegu on `#crisisBanner` (punane bänner) endiselt olemas ja klikitav.  
Kuna kasutaja nõue praegu on “ainult parandused”, siis **ära eemalda** bännerit — kuid veendu, et see **ei dubleeri** UI-d segavalt.

Kui bänner tekitab segadust, tee minimaalne: bänneri `p` (subtitle) võib jääda, aga funktsionaalselt ta teeb sama mis “AVA INTSIDENT” kaart.

---

## 2) CSS — et “AVA INTSIDENT” näeks välja nagu teised kaardid

Tegelikult kasutame sama `.card` stiili, seega **uusi stiile pole vaja**.

Aga kui soovid väikest rõhutust, lisa `src/styles/main.css` lõppu:

```css
/* Optional emphasis for the "AVA INTSIDENT" action card */
.card.card-action h2 { letter-spacing: 0.2px; }
```

Ära tee sellest “punast bännerit” — peab jääma sama kandiline kaart nagu teised.

---

## 3) Kriisirežiimi leht on tühi — paranda JS: activateCrisisMode() peab alati renderdama stsenaariumid

Sinu HTML-s on `#crisisModePage` olemas ja selle sees `#scenariosGrid` olemas.
Kui leht jääb tühjaks, siis **JS ei täida `#scenariosGrid` elementi**.

### 3.1 Leia activateCrisisMode()

**Otsi projektist** funktsioon:
- `function activateCrisisMode()` või `export function activateCrisisMode()`
- võib asuda `src/app.js` või mõnes `src/pages/...` failis

### 3.2 Parandus: activateCrisisMode() peab tegema 3 asja alati

**Nõue:**
1) `navigateTo('crisisModePage')`
2) `renderScenarios()` (või analoogne funktsioon, mis täidab `#scenariosGrid`)
3) kui render-funktsiooni pole, siis loo minimaalne render nii, et kasutaja näeb kõiki stsenaariumi nuppe/kaarte nagu “varem”.

**Rakenda järgmine loogika (kohanda nimed vastavalt sinu projektile):**
```js
function activateCrisisMode() {
  // 1) navigeeri
  if (typeof window.navigateTo === 'function') {
    window.navigateTo('crisisModePage');
  } else if (typeof navigateTo === 'function') {
    navigateTo('crisisModePage');
  }

  // 2) renderda stsenaariumid
  // otsi olemasolev renderer (näited):
  // - window.renderCrisisScenarios()
  // - renderScenarios()
  // - initCrisisModePage()
  if (typeof window.renderCrisisScenarios === 'function') {
    window.renderCrisisScenarios();
    return;
  }
  if (typeof renderCrisisScenarios === 'function') {
    renderCrisisScenarios();
    return;
  }
  if (typeof renderScenarios === 'function') {
    renderScenarios();
    return;
  }

  // 3) fallback (kui mingil põhjusel render-funktsiooni pole)
  // -> minimaalne: ära jäta lehte tühjaks
  const grid = document.getElementById('scenariosGrid');
  if (grid) {
    grid.innerHTML = '<p style="padding:16px;color:#6b7280">Stsenaariumite loogika pole laetud. Kontrolli JS-i init järjekorda.</p>';
  }
}
```

### 3.3 Veendu, et render-funktsioon täidab #scenariosGrid

**Renderi minimaalne vorm (kui sul varem oli):**
- iga stsenaarium on klikitav kaart/nupp
- klikiga avaneb scenario detail (või triage) nagu enne

**Põhinõue:** pärast “AVA INTSIDENT” klikki peab kasutaja nägema stsenaariumite valikut (grid ei tohi olla tühi).

---

## 4) Smoke test (pärast parandusi)

1) Ava avaleht:
   - Üleval EI ole `ÕPPUS` toggle’it.
   - “Süsteemi olek” kaart avalehe all EI ole enam.
   - Cards grid’is on nüüd lisaks “AVA INTSIDENT” kandiline kaart.

2) Kliki “AVA INTSIDENT”:
   - Avaneb `KRIISIREŽIIM AKTIVEERITUD` leht
   - Stsenaariumite grid on täidetud (nähtavad valikud)

3) Kliki mõnda stsenaariumi:
   - avaneb sama flow nagu varem (scenario detail)
   - intsidendi loomine ja logimine jääb toimima (ära muuda seda loogikat)

---

## 5) Commit / kokkuvõte (lühike)

Kirjelda commit summary’s:
- Eemaldasid top bar’ist ÕPPUS toggle
- Lisad avalehele “AVA INTSIDENT” kaardi
- Eemaldasid avalehe “Süsteemi olek” kaardi
- Parandasid activateCrisisMode() nii, et stsenaariumid alati renderduvad
