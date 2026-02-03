# FAAS2_FIXES_NAV_UNLOCK_AND_COPY — eemalda nav-lukustus + korrasta “kriisirežiim” tekstid

**Eesmärk (2 parandust korraga):**
1) Eemalda kõik kohad, kus “KRIIS ON AKTIIVNE” alert/guard blokeerib navigeerimise (edasi/tagasi/home/menüü).
2) Korrasta UI tekstid ja pealkirjad, et need ei kasutaks enam “kriisirežiimi” kontseptsiooni (legacy), vaid FAAS2 sõnastust:
   - “AVA INTSIDENT”
   - “Vali hädaolukorra stsenaarium”
   - “Intsident(ide) kontekst/olek” (mitte “kriisirežiim aktiveeritud”)

> Tee ainult need kaks parandust. Ära muuda intsidendi loomise loogikat ega LocalStorage skeemi (v.a kui peab eemaldama nav-lukustuse kontrolli).

---

## 0) Failid mida muudad (võimalikud)
Muuda ainult neid faile, kust tegelikult leiad vastavad stringid/funktsioonid.

- `index.html`
- `src/app.js` (või fail, kus on `navigateTo()` ja/või `goBack()`)
- `src/pages/*` (kui nav või headerid on seal)
- `src/styles/*` (ainult juhul, kui punane “crisis header” on CSS-is)
- Kõik muud failid: ainult siis, kui neis on otsitavad stringid.

---

# 1) FIX: Eemalda “KRIIS ON AKTIIVNE” navigeerimise lukustus

## 1.1 Otsi projekti ulatuses järgmisi tekste
Kasuta otsingut (ripgrep / IDE search):
- `KRIIS ON AKTIIVNE`
- `Kriisirežiimist ei saa väljuda`
- `Lõpeta kriis`
- `crisis active`
- `end crisis`
- `alert(` koos nende sõnadega

**Eesmärk:** leida *kõik* guard-kohad, mis teevad `alert(...)` + `return` või muul moel katkestavad navigeerimise.

---

## 1.2 Eemalda blokeeriv guard navigateTo/goBack/onclick handleritest

### Tüüpiline mustri näide (eemaldada)
```js
if (isCrisisActive) {
  alert("KRIIS ON AKTIIVNE! ...");
  return;
}
```

### Nõutud tulemus
- ÄRA kuva alerti
- ÄRA returni
- navigeerimine jätkub alati

**Asenda see kas:**
```js
// FAAS2: kriis ei lukusta navigeerimist (legacy guard eemaldatud)
```
või eemalda blokk täielikult.

---

## 1.3 Kontrolli ka erijuhtumeid
Otsi ja eemalda samasugune guard ka:
- `goBack()`
- back-nupu `onclick`
- `window.onbeforeunload` / `beforeunload` (kui takistab lahkumist)
- “Home” nupu handler

**FAAS2 reegel:** kasutaja peab alati saama liikuda (ei mingeid blokeerivaid alerte).

---

## 1.4 Smoke test (nav)
1) Ava vaade, kus varem tuli alert.
2) Vajuta:
   - back
   - home
   - menüü/kaart
3) Alerti ei tule ja nav toimib alati.
4) Ükski vaade ei jää “lukku”.

---

# 2) FIX: Korrasta “kriisirežiim” copy/pealkirjad FAAS2 stiili

## 2.1 Eesmärk
Eemaldada UI-st segadust tekitavad legacy tekstid nagu:
- “KRIISIREŽIIM AKTIVEERITUD”
- “Aktiveeri kriisirežiim”
- “Lõpeta kriis”
- “Kriisirežiim”

Need asendatakse neutraalse FAAS2 sõnastusega.

> NB! See on *ainult tekstiline ja visuaalne korrastus*. Funktsionaalsus (stsenaariumite valik jne) jääb samaks.

---

## 2.2 index.html — kriisirežiimi headeri tekstid
Leia leht (nt `#crisisModePage`), kus on punane header ja tekst “KRIISIREŽIIM AKTIVEERITUD”.

### Asendusnõue
- Pealkiri: **AVA INTSIDENT**
- Alapealkiri: **Vali hädaolukorra stsenaarium**
- Eemalda/ära kasuta sõna “kriisirežiim” UI-s.

### Soovituslik HTML (kui sul on eraldi header blokk)
Asenda olemasolev header selle neutraalsega (kohanda klassinimesid, kui vaja):

```html
<div class="page-header">
  <button class="back-btn" onclick="goBack()">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  </button>
  <div>
    <h1>AVA INTSIDENT</h1>
    <p class="page-subtitle">Vali hädaolukorra stsenaarium</p>
  </div>
</div>
```

Oluline: `#scenariosGrid` (või sinu stsenaariumite konteiner) peab jääma samale lehele alles ja nähtav.

---

## 2.3 Eemalda “Aktiveeri kriisirežiim” tekstid avalehelt
Otsi avalehest:
- “Aktiveeri kriisirežiim”
- “Kriisirežiim”
- “Kriis on aktiivne” (UI copy, mitte guard)

Asenda tekstid vastavalt:
- “AVA INTSIDENT”
- “Vali stsenaarium ja alusta juhtumi haldust”
- Kui on vaja olekuindikaatorit, kasuta “Aktiivsed intsidentid: N” (mitte “kriis”).

---

## 2.4 “Lõpeta kriis” nupp (kui UI-s alles)
Kui UI-s on nupp “Lõpeta kriis”, siis:
- ta ei tohi olla “ainus väljapääs”
- ta ei tohi olla seotud nav-lukustusega

Selles fixis:
- kui nupp on ainult legacy ja segab, siis **peida või eemalda** (UI-st).
- kui nupp on seotud mingi muu loogikaga, jäta loogika alles, aga eemalda sõnastus:
  - “Lõpeta kriis” → “Lõpeta hädaolukorra käsitlus” (või eemalda täielikult, kui pole kasutuses)

Soovitus: kui sa ei ole kindel, **eemalda nupp UI-st**, aga jäta funktsioon alles (surnud kood OK ajutiselt), kuni FAAS2 STEP2/3 lahendab lõplikult.

---

## 2.5 CSS — punane “crisis” taust maha (kui veel alles)
Kui sul on CSS-is klassid nagu:
- `.crisis-mode-header { background: ... red ... }`

Siis:
- kasuta neutraalset `page-header` stiili (nagu teistel lehtedel)
- või muuda `.crisis-mode-header` neutraalseks (valge/helehall taust, tume tekst)

Lisa (kui puudub):
```css
.page-subtitle {
  margin: 0.25rem 0 0;
  color: #6b7280;
  font-size: 0.95rem;
}
```

---

# 3) Lõpp-test (kaks fixi koos)

## 3.1 Nav test
- Ükski “KRIIS ON AKTIIVNE” alert ei tule enam mitte kuskil.
- Saab vabalt liikuda Home ↔ Ava intsident ↔ Logid ↔ Plaanid.

## 3.2 Copy/UX test
- Kusagil UI-s ei ole teksti “KRIISIREŽIIM AKTIVEERITUD” ega “Aktiveeri kriisirežiim”.
- “AVA INTSIDENT” lehel on nähtavad stsenaariumite valikud.
- Punane värv jääb ainult **olekuindikaatorile**, mitte “režiimi nupule/pealkirjale”.

---

# 4) Commit
```bash
git add .
git commit -m "FAAS2 FIX: remove crisis nav lock and replace crisis-mode copy with incident-opening wording"
```
