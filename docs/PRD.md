# PRD.md  
## Business Continuity Management (BCM) App — Product Requirements Document (V2, Canonical)

---

## JUHISED

### Milleks see dokument on
See dokument on **BCM rakenduse ainus kanoniline tootenõuete kirjeldus**.

PRD kirjeldab:
- mida rakendus **täna teeb**
- milline käitumine on **kohustuslik**
- millised piirangud on **teadlikult valitud**

PRD EI OLE:
- visioonidokument
- tehniline disain
- UI stiilijuhend
- arendusplaan

Kui rakenduse käitumine ei vasta PRD-le, on tegemist kas:
- bugi,
- regressiooni,
- või dokumenteerimata olemasoleva funktsionaalsusega.

---

### Kuidas seda dokumenti kasutada
- Arenduse ja testimise alusdokumendina
- Sisendina APP_FLOW, TECH_STACK, FRONTEND_GUIDELINES, BACKEND_STRUCTURE loomisel
- AI-le esimese ja kõrgeima prioriteediga sisendina

---

### Kohustuslik sisu (kontrollnimekiri)
- Probleem ja sihtkasutajad
- Eesmärgid ja mõõdetavad edu kriteeriumid
- Non-goals
- Täielik funktsioonide loetelu acceptance criteria’ga
- User stories (Given / When / Then)
- Edge cases ja piirangud
- Definition of Done

---

## 1. Probleemi kirjeldus

Organisatsioonidel on vaja **lihtsat ja usaldusväärset tööriista**, millega:
- avada ja hallata erinevat tüüpi intsidente  
  (nt tulekahju, küberintsident, inimene vees, evakuatsioon)
- saada **kohene ülevaade**, kas kriis on käimas
- dokumenteerida tegevusi ja otsuseid kriisi ajal ja järel
- eristada **pärisintsidente** ja **õppusi**
- töötada ka olukorras, kus puudub backend või võrguühendus

Olemasolevad lahendused on sageli:
- liiga IT- või süsteemikesksed
- üleliia keerukad kriisiolukorras kasutamiseks
- sõltuvad serveritest, kontodest ja integratsioonidest

BCM äpp on teadlikult:
- brauseripõhine
- LocalStorage’ile toetuv
- offline-first
- madala kognitiivse koormusega

---

## 2. Sihtkasutajad

### Peamised kasutajad
- Operatiivjuht / vahetuse juht
- Kriisimeeskonna liige
- Ohutus- või turvajuht
- BCM vastutav isik

### Kasutajate eeldused
- Kasutaja ei ole arendaja ega IT-spetsialist
- Kasutaja võib tegutseda stressiolukorras
- Kasutaja peab kiiresti mõistma:
  - kas kriis on käimas
  - mitu intsidenti on aktiivsed
  - mis vajab hetkel tähelepanu

---

## 3. Eesmärgid ja edu kriteeriumid

### Peamised eesmärgid
1. Tagada **kohene olukorrateadlikkus** avalehel
2. Võimaldada **turvaline ja teadlik** intsidendi avamine
3. Säilitada selge eristus:
   - ACTIVE vs mitte-ACTIVE
   - REAL vs TRAINING
4. Toetada intsidentide **käsitsi dokumenteerimist ja järelanalüüsi**
5. Töötada **ilma backend’i ja kontodeta**

### Mõõdetavad edu kriteeriumid
- Kasutaja näeb avalehel alati:
  - kas ACTIVE intsidente on
  - mitu ACTIVE intsidenti on
- Ükski intsident ei kao enne, kui see on SULETUD
- Õppus ei mõjuta pärisintsidentide ülevaadet
- Rakendus töötab offline-režiimis

---

## 4. Non-goals (teadlikult välistatud)

- Backend ja serveripoolne andmebaas
- Kasutajate autentimine ja rollimudel
- Reaalajas koostöö mitme kasutaja vahel
- Push-teavitused
- Süsteemide tehniline monitooring
- Automaatne intsidentide tuvastus

## Intsidendi avamise kinnitamine ja eelvaade

- Intsident avatakse ainult pärast kasutaja kinnitust (dialoog) ja režiimi valikut (INTSIDENT / ÕPPUS).
- Kui kasutaja valib dialoogis **TÜHISTA**, siis:
  - kasutaja võib näha intsidendi **eelvaadet**
  - eelvaates ei saa andmeid muuta (disabled)
  - kasutaja saab intsidendi avada hiljem nupuga “AVA INTSIDENT”, mis küsib kinnituse uuesti


---

## 5. Funktsioonid ja acceptance criteria

### 5.1 Avaleht (Home Dashboard)

**Kirjeldus**  
Avaleht on rakenduse keskne olukorrateadlikkuse vaade.

**Acceptance criteria**
- Kui ACTIVE intsidente ≥ 1:
  - Ülemine staatuskast on **punane**
  - Tekst: `AKTIIVSED INTSIDENDID: N`
  - Staatuskast ei ole klikitav
  - Kuvatakse ACTIVE intsidentide nimed loeteluna
- Kui ACTIVE intsidente = 0:
  - Staatuskast on **roheline**
  - Tekst: `OLUKORD: TAVAPÄRANE`
- Staatuskast viitab **ainult intsidentidele**, mitte IT-süsteemidele

---

### 5.2 Intsidendi avamine (Scenario activation)

**Kirjeldus**  
Uue intsidendi avamine on teadlik ja kaitstud tegevus.

**Acceptance criteria**
- “AVA INTSIDENT” ei loo intsidenti ühe klikiga
- Enne avamist:
  - küsitakse kinnitust
  - küsitakse režiimi (REAL / TRAINING, default REAL)
- Intsident luuakse alles pärast kinnitust
- Katkestamisel intsidenti ei looda

---

### 5.3 Intsidentide logi (Logid & Intsidendid)

**Kirjeldus**  
Koondvaade kõigist intsidendidest.

**Acceptance criteria**
- Kuvatakse kõik intsidendid sõltumata staatusest
- Iga intsidendi juures on nähtav:
  - staatus
  - režiim (REAL / TRAINING)
- Logide kaardil on badge:
  - näitab intsidende, mis EI OLE SULETUD
  - badge kaob alles siis, kui kõik intsidendid on SULETUD

---

### 5.4 Intsidendi detailvaade

**Kirjeldus**  
Ühe konkreetse intsidendi haldamise vaade.

**Osad**
- Ülevaade
- Triage / tegevuste loetelu
- Incident metrics (küber)
- Märkmed / ajajoon
- Eksport (TXT)

**Acceptance criteria**
- Intsidendi staatus ei muutu ilma kasutaja otsuseta
- Kõik muudatused on salvestatavad (SAVE)
- SULETUD intsident jääb logisse alles

---

### 5.5 Cyber incident metrics

**Kirjeldus**  
Struktureeritud vorm küberintsidendi hindamiseks.

**Acceptance criteria**
- Vorm on täidetav ja salvestatav
- SAVE:
  - ei sulge vaadet
  - ei muuda automaatselt intsidendi staatust
- Andmed säilivad LocalStorage’is

---

### 5.6 Õppus (Exercise mode)

**Kirjeldus**  
Režiim, mis tähistab intsidendi õppuseks.

**Acceptance criteria**
- REAL ja TRAINING on visuaalselt ja loogiliselt eristatavad
- Õppus ei mõjuta pärisintsidentide olekut
- Õppus on logides ja detailvaates selgelt märgistatud

---

### 5.7 Kontaktid, Plaanid, Kommunikatsioon

**Kirjeldus**  
Toetavad vaated kriisihalduse jaoks.

**Acceptance criteria**
- Kontaktid: staatiline loetelu
- Plaanid: ligipääs juhistele
- Kommunikatsioon: WhatsAppi koordineerimise kontseptsioon (mitte integratsioon)

---

## 6. User Stories (valik, canonical)

1. **Given** on vähemalt 1 ACTIVE intsident  
   **When** avan avalehe  
   **Then** näen punast staatuskasti ja aktiivsete intsidentide loetelu

2. **Given** ACTIVE intsidente ei ole  
   **When** avan avalehe  
   **Then** näen rohelist “OLUKORD: TAVAPÄRANE”

3. **Given** soovin avada uue intsidendi  
   **When** vajutan “AVA INTSIDENT”  
   **Then** pean kinnitama tegevuse ja valima REAL/TRAINING

4. **Given** intsident on lahendatud, kuid mitte SULETUD  
   **When** vaatan avalehte  
   **Then** staatus on roheline, kuid Logide badge on endiselt nähtav

5. **Given** täidan küberintsidendi metrics-vormi  
   **When** vajutan SAVE  
   **Then** andmed salvestuvad ja vaade jääb avatuks

---

## 7. Edge cases ja piirangud

- Rakendus töötab ainult brauseris
- Andmed on LocalStorage’is
- LocalStorage võib olla:
  - tühi
  - osaliselt rikutud
  - täis
- Andmed ei sünkroniseeru seadmete vahel
- Rakendus peab käituma ohutult ka vigase andmeolukorra korral

---

## 8. Definition of Done (DoD)

Funktsioon on valmis, kui:
- see on PRD-s kirjeldatud
- acceptance criteria on täidetud
- regressioone ei ole teistes vaadetes
- käitumine on kooskõlas APP_FLOW ja BACKEND_STRUCTURE dokumentidega

---

**PRD.md (V2) on kanoniline alusdokument.**
Kõik järgnevad dokumendid peavad olema sellega kooskõlas.
