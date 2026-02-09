# BCM — Business Continuity Management App

Lihtne ja usaldusväärne brauseripõhine tööriist intsidentide haldamiseks kriisiolukorras.

---

## Ülevaade

BCM on offline-first, LocalStorage-põhine rakendus, mis võimaldab:
- Avada ja hallata erinevat tüüpi intsidente (küber, füüsiline, evakuatsioon jne)
- Saada kohest ülevaadet kriisiolukorrast
- Dokumenteerida tegevusi ja otsuseid kriisi ajal ja järel
- Eristada pärisintsidente ja õppusi
- Töötada ilma backend'i ja võrguühenduseta

---

## Kiire alustamine

### Nõuded
- Kaasaegne veebilehitseja (Chrome, Edge, Firefox, Safari)
- Lihtne HTTP server (valik):
  - `python -m http.server 8000`
  - `npx serve`
  - VS Code Live Server

### Käivitamine
```bash
# Python HTTP server
python -m http.server 8000

# Ava brauseris
# http://localhost:8000
```

---

## Dokumentatsioon

### 📘 Kanoonilised dokumendid (alati kasutatavad)
Need dokumendid määravad rakenduse käitumise. Kui koodi käitumine ei vasta neile, on tegemist bugi või regressiooniga.

- **[PRD.md](docs/PRD.md)** — tootenõuded, funktsioonid, acceptance criteria
- **[APP_FLOW.md](docs/APP_FLOW.md)** — kasutajavood, ekraanide vaheline liikumine
- **[FRONTEND_GUIDELINES.md](docs/FRONTEND_GUIDELINES.md)** — UI/UX põhimõtted, visuaalne hierarhia
- **[BACKEND_STRUCTURE.md](docs/BACKEND_STRUCTURE.md)** — andmekiht, LocalStorage struktuur
- **[TECH_STACK.md](docs/TECH_STACK.md)** — tehnoloogiline alus ja piirangud
- **[IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)** — arenduse töökord

### 📝 Mittekanoonilised dokumendid (kontekst)
- **[dev-notes.md](docs/dev-notes.md)** — märkmed, skeemid, alternatiivid
- **[progress.txt](docs/progress.txt)** — hetkeolukord, DONE / IN PROGRESS / NEXT

### 🤖 AI kasutamise reeglid
- **[CLAUDE.md](CLAUDE.md)** — Claude ja muude AI-tööriistade käitumusreeglid

---

## Arhitektuur (lühidalt)

- **Runtime:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Andmesalvestus:** LocalStorage (`bcm_incidents` key)
- **UI:** SPA-laadne navigatsioon, page-based
- **Offline-first:** ei vajagi backend'i

---

## Kasutusjuhised

### Avaleht
- Näitab **punast staatuskasti**, kui on ACTIVE intsidente
- Näitab **rohelist "OLUKORD: TAVAPÄRANE"**, kui ACTIVE intsidente ei ole
- **AVA INTSIDENT** kaart viib stsenaariumite valikusse

### Intsidendi avamine
1. Vali stsenaarium
2. Kinnita dialoogis (INTSIDENT / ÕPPUS)
3. Täida vormi, märgi tegevusi tehtud
4. Vajuta **SALVESTA**

### Intsidendi sulgemine
1. Ava intsident logidest
2. Vajuta **SULGE INTSIDENT**
3. Sisesta sulgemise põhjus
4. Kinnita

---

## Testimine

Rakendust testitakse **käsitsi**:
- Acceptance criteria alusel (vt PRD.md)
- Kasutajavood (vt APP_FLOW.md)

---

## Tehnilised piirangud (teadlikud valikud)

Rakendus **EI OLE** mõeldud järgmiseks:
- Reaalajas koostöö mitme kasutaja vahel
- Kasutajate autentimine ja rollimudel
- Push-teavitused
- Backend sünkroniseerimine
- Serveripoolne andmebaas

Need on **teadlikud arhitektuursed otsused**, mitte ajutised puudused.

---

## Arenduse töökord

1. Loe kanoonilised dokumendid (`docs/`)
2. Kontrolli `docs/progress.txt` — mis on DONE, mis NEXT
3. Tee väikeseid, kontrollitud muudatusi
4. Testi käsitsi acceptance criteria vastu
5. Uuenda dokumentatsiooni (kui käitumine muutub)
6. Märgi `progress.txt`-i

**NB:** Dokument juhib koodi, mitte vastupidi.

---

## Litsents

(Määrata)

---

## Kontakt / Küsimused

Vt `docs/dev-notes.md` või ava Issue.

---

**Viimati uuendatud:** 2026-02-07
