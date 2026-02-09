# BACKEND_STRUCTURE.md  
## Business Continuity Management (BCM) App — Storage & Data Blueprint (V1, Canonical)

---

## JUHISED

### Milleks see dokument on
See dokument kirjeldab **BCM rakenduse andmekihti**, arvestades fakti, et:
- rakendusel **ei ole backend’i**
- kogu püsiv andmehoid toimub **LocalStorage’i kaudu**

BACKEND_STRUCTURE:
- selgitab andmete struktuuri ja elutsüklit
- määratleb reeglid, kuidas andmeid luuakse, uuendatakse ja säilitatakse
- on alus andmete käsitlemisele ja migratsioonidele

See dokument EI OLE:
- serveriarhitektuur
- API spetsifikatsioon
- andmebaasi skeem
- turvadokument

---

### Kuidas seda dokumenti kasutada
- Arendamisel ja refactorite tegemisel
- Regressioonide ja andmevigade analüüsimisel
- Sisendina IMPLEMENTATION_PLAN.md-le

Kui rakenduse andmekäitumine ei vasta sellele dokumendile, on tegemist:
- bugi
- regressiooni
- või dokumenteerimata käitumisega

---

### Kohustuslikud osad (kontrollnimekiri)
- Selge väide backend’i puudumise kohta
- LocalStorage’i roll ja piirangud
- Andmeüksuste (entity) kirjeldused
- CRUD reeglid
- Staatused ja üleminekud
- Migratsioonistrateegia
- Edge case’ide käsitlus
- Ekspordi reeglid

---

### Out of scope
- Serveripoolne andmebaas
- API-d
- Kasutajate autentimine
- Andmete krüpteerimine serveris
- Mitme kasutaja sünkroniseerimine

---

## 1. Põhimõtteline arhitektuur

### 1.1 Backend puudub (teadlik otsus)
BCM rakendusel **ei ole backend’i**.

Kõik andmed:
- elavad brauseris
- salvestatakse LocalStorage’i
- on seadme- ja brauseripõhised

See on:
- teadlik arhitektuurne piirang
- mitte ajutine lahendus
- mitte “hiljem teeme DB” placeholder

---

### 1.2 LocalStorage kui andmekiht
LocalStorage toimib:
- püsiva andmehoidlana
- lihtsa JSON-andmebaasina
- offline-first lahendusena

Piirangud:
- max maht (~5–10 MB)
- sünkroniseerimine puudub
- andmed võivad kasutaja poolt kustuda

---

## 2. Andmete omandi ja elutsükli põhimõtted

- Andmete omanik on **kasutaja seade**
- Rakendus:
  - ei eelda, et andmed on alati olemas
  - ei eelda, et andmed on alati korrektsed
- Rakendus peab:
  - käituma turvaliselt tühjade andmete korral
  - taastuma osaliselt rikutud andmetest

---

## 3. Andmeüksused (Entities)

### 3.1 Incident (põhiüksus)

**Kirjeldus**  
Incident on BCM rakenduse keskne andmeüksus.

**Kohustuslikud väljad (kontseptuaalsed)**
- `id` – unikaalne identifikaator (string)
- `title` / `name` – inimesele loetav nimetus
- `scenarioType` – stsenaariumi tüüp
- `status` – intsidendi olek
- `mode` – REAL või TRAINING
- `createdAt` – loomise aeg
- `updatedAt` – viimase muudatuse aeg

**Valikulised väljad**
- `metrics` – küberintsidendi vormi andmed
- `notes` – vabatekst
- `actions` / `triage` – tegevuste märgised

> TODO: täpne väli- ja nimekirjeldus tuleb võtta `data-model.md` failist ja koodist.

---

### 3.2 Scenario (viide, mitte eraldi entiteet)
- Stsenaarium EI OLE eraldi andmeüksus
- Intsidendis salvestatakse ainult:
  - stsenaariumi tüüp või identifikaator
- Stsenaariumite loetelu on:
  - staatiline
  - defineeritud frontendis

---

### 3.3 SystemStatus (tuletatud)
- SystemStatus EI OLE salvestatud eraldi
- See arvutatakse jooksvalt:
  - ACTIVE intsidentide olemasolu põhjal
- Puudub:
  - käsitsi override
  - püsiv salvestus

---

### 3.4 ExerciseMode (per-incident)
- Õppus ei ole globaalne olek
- Igal intsidendil on oma `mode`:
  - REAL
  - TRAINING

---

## 4. LocalStorage struktuur

### 4.1 Võtmete üldpõhimõtted
- Kasutatakse **ühte primaarset võtmekogumit**
- Võtmed peavad:
  - olema versioonitavad
  - olema loetavad

### 4.2 Põhivõti
- Kasutatav võti:
  `bcm_incidents`

> NB: See on praegu kasutusel olev võti koodis (kinnitatud 2026-02-07).
> Varasemad võtmed (`incidents`, `incidentLog` jms) võivad eksisteerida vanadest sessioonidest.
> Migratsioon nendest võtmetest peab olema toetatud (kui implementeeritakse).

---

## 5. CRUD reeglid

### 5.1 Create
- Intsident luuakse:
  - alles pärast kasutaja kinnitust
  - pärast stsenaariumi valikut
- Vaikimisi:
  - `status = ACTIVE`
  - `mode = REAL` (kui pole valitud teisiti)

---

### 5.2 Read
- Kõik vaated loevad:
  - sama andmeallikat
- Vaated ei tohi:
  - hoida oma “varjatud koopiat” andmetest

---

### 5.3 Update
- Muudatused toimuvad:
  - ainult kasutaja tegevuse kaudu
  - ainult SAVE või selge tegevuse kaudu
- Automaatne staatuse muutus:
  - EI OLE lubatud

---

### 5.4 Delete
- Intsidente EI kustutata
- Kustutamise asemel:
  - kasutatakse staatust `SULETUD`
- Ajalooline info peab säilima

---

## 6. Staatused ja üleminekud

### 6.1 Lubatud staatused
- `ACTIVE`
- `CONTAINED` / `RESOLVED` (mitte-ACTIVE)
- `CLOSED`

> Täpne nomenklatuur sõltub koodist, kuid loogika peab säilima.

---

### 6.2 Staatuseloogika
- Home staatuskast:
  - sõltub ainult `ACTIVE` olemasolust
- Logide badge:
  - sõltub kõigist, mis ei ole `CLOSED`

---

## 7. Migratsioonistrateegia

- Rakendus peab:
  - kontrollima olemasolevaid võtmeid
  - migreerima need uude vormingusse
- Migratsioon peab olema:
  - idempotentne
  - vaikne
  - kasutajale nähtamatu

---

## 8. Ekspordi reeglid

- Ekspordi formaat:
  - TXT
- Eksporditakse:
  - intsidendi põhiväli
  - märkmed
  - metrics (kui olemas)
- Eksport:
  - ei muuda andmeid
  - ei kustuta andmeid

---

## 9. Edge cases ja veakäsitlus

- Tühi LocalStorage:
  - rakendus töötab
- Rikutud JSON:
  - kasutatakse vaikimisi väärtusi
- Puuduvad väljad:
  - käsitletakse kui null / undefined
- Täis LocalStorage:
  - kasutajale ei näidata tehnilist viga
  - salvestus võib ebaõnnestuda vaikselt

---

## 10. Turvakaalutlused (piiratud)

- LocalStorage ei ole turvaline salvestuskoht
- Sinna EI TOHI panna:
  - paroole
  - API võtmeid
  - isikuandmeid
- Rakendus eeldab:
  - piiratud kasutusala
  - usaldatud seadet

---

**BACKEND_STRUCTURE.md (V1) on kanoniline andmekihi kirjeldus.**  
Kõik andmekäitlus peab olema sellega kooskõlas.
