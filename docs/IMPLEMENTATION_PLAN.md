# IMPLEMENTATION_PLAN.md  
## Business Continuity Management (BCM) App — Implementation & Change Workflow (V1, Canonical)

---

## JUHISED

### Milleks see dokument on
See dokument kirjeldab **kuidas BCM rakendust edasi arendada ja muuta ilma süsteemi lõhkumata**.

IMPLEMENTATION_PLAN:
- ei defineeri uusi funktsioone
- ei muuda kanonilisi nõudeid
- annab **praktilise töökorra** arenduseks, refactor’iks ja AI kasutamiseks

See dokument EI OLE:
- PRD
- arhitektuurikirjeldus
- backlog
- roadmap

---

### Kuidas seda dokumenti kasutada
- Loe **enne iga arendussessiooni alustamist**
- Loe **enne AI-le koodi muutmise ülesande andmist**
- Kasuta regressioonide ja bugide analüüsimisel

Kui tööviis ei järgi seda dokumenti:
- regressioonide risk on **kõrge**
- dokumentatsioon ja kood triivivad lahku

---

### Kohustuslikud osad (kontrollnimekiri)
- Arendusfaaside järjestus
- Muudatuste tegemise reeglid
- Kontrollnimekirjad (checklists)
- Migratsioonimõtlemine
- AI / Claude Code kasutamise juhised
- Dokumentatsiooni uuendamise kord

---

## 1. Üldine arendusstrateegia

### 1.1 Canonical-first põhimõte
Enne koodi muutmist peab olema selge:
- milline canonical dokument seda muudatust puudutab
- kas muudatus:
  - on juba dokumenteeritud
  - või nõuab dokumendi täiendamist

Reegel:
- **dokument juhib koodi, mitte vastupidi**

---

### 1.2 Väikesed, kontrollitud sammud
- Eelistatud on:
  - väikesed muudatused
  - üks eesmärk korraga
- Väldi:
  - “suuri refactor’eid”
  - mitme osa korraga muutmist

---

## 2. Tööfaaside järjestus

### Soovituslik järjekord iga uue muudatuse puhul

1. Mõista nõuet (PRD / APP_FLOW)
2. Kontrolli UI reegleid (FRONTEND_GUIDELINES)
3. Kontrolli andmemõju (BACKEND_STRUCTURE)
4. Tee minimaalne koodimuudatus
5. Testi käsitsi
6. Uuenda dokumentatsiooni
7. Märgi edenemine `progress.txt`-i

---

## 3. Kontrollnimekirjad (Claude’ilt õpitu)

### 3.1 Enne koodi muutmist
- [ ] Millist canonical dokumenti see puudutab?
- [ ] Kas see on olemasoleva funktsiooni muudatus või uus?
- [ ] Kas see muudab:
  - andmeid?
  - olekuloogikat?
  - UI hierarhiat?
- [ ] Kas see vajab dokumentatsiooni muudatust?

---

### 3.2 Enne andmemudeli muutmist
- [ ] Kas LocalStorage võtmed muutuvad?
- [ ] Kas olemasolevad andmed jäävad alles?
- [ ] Kas default väärtused on defineeritud?
- [ ] Kas migratsioon on vaikne ja idempotentne?

---

### 3.3 Enne UI muudatust
- [ ] Kas muudatus on kooskõlas FRONTEND_GUIDELINES.md-ga?
- [ ] Kas olek (ACTIVE / CLOSED) jääb visuaalselt selgeks?
- [ ] Kas kriitiline info ei muutu klikitavaks?
- [ ] Kas punast värvi kasutatakse ainult semantilises tähenduses?

---

### 3.4 Pärast muudatuse tegemist
- [ ] Kas PRD nõuded on endiselt täidetud?
- [ ] Kas APP_FLOW vood on katkematud?
- [ ] Kas regressioone ei tekkinud?
- [ ] Kas dokumentatsioon on ajakohane?

---

## 4. Migratsioonide mõtteviis (mitte skript)

Migratsioon:
- EI OLE eraldi projekt
- ON osa igast andmemuudatusest

Põhimõtted:
- Migratsioon peab olema:
  - vaikne
  - idempotentne
  - tagurpidi ühilduv
- Rakendus peab:
  - eeldama, et andmed võivad olla vanas vormis
  - kasutama turvalisi vaikeväärtusi

---

## 5. Testimise kord

### 5.1 Testimise tüüp
- Automatiseeritud testid: **puuduvad**
- Testimine toimub:
  - käsitsi
  - canonical dokumentide alusel

---

### 5.2 Miinimum testid pärast igat muudatust
- Ava avaleht:
  - staatuskast on korrektne
- Ava Logid:
  - badge on korrektne
- Ava intsidendi detail:
  - SAVE töötab
- Sulge intsident:
  - see jääb logisse alles

---

## 6. AI ja Claude Code kasutamine

### 6.1 AI roll
AI:
- teeb **minimaalseid muudatusi**
- ei tohi:
  - leiutada uusi funktsioone
  - refactor’ida ilma käsuta
  - muuta canonical dokumente omal algatusel

---

### 6.2 Soovituslik töövoog Claude Code’iga
1. Anna AI-le:
   - konkreetne MD-fail
   - selge eesmärk
2. Lase AI-l muuta ainult:
   - nimetatud faile
3. Kontrolli tulemus käsitsi
4. Commit
5. Uuenda `progress.txt`

---

## 7. Dokumentatsiooni uuendamise kord

### 7.1 Canonical dokumendid
- Muutuvad ainult:
  - teadliku otsuse alusel
  - enne või koos koodimuudatusega

---

### 7.2 dev-notes.md
- Kasutatakse:
  - mõtete
  - skeemide
  - alternatiivide
  - katsete jaoks
- Ei ole normatiivne

---

### 7.3 progress.txt
- Peab alati kajastama:
  - mis on valmis
  - mis on pooleli
  - mis on järgmine samm
- AI peab seda lugema sessiooni alguses

---

## 8. Regressioonide käsitlemine

Kui regressioon tekib:
1. Peata arendus
2. Kontrolli:
   - millist reeglit rikuti
   - millist dokumenti eirati
3. Paranda esmalt loogika, siis UI

---

**IMPLEMENTATION_PLAN.md (V1) määratleb töökorra, mitte toote.**  
Kõik arendus peab olema sellega kooskõlas.
