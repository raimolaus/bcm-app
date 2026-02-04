# FRONTEND_GUIDELINES.md  
## Business Continuity Management (BCM) App — Frontend & UI Guidelines (V1, Canonical)

---

## JUHISED

### Milleks see dokument on
See dokument määratleb **frontend’i ja UI reeglid**, mille järgi BCM rakendust:
- kujundatakse
- muudetakse
- täiendatakse

FRONTEND_GUIDELINES:
- tagab visuaalse ja käitumusliku järjepidevuse
- vähendab regressioone
- hoiab kognitiivse koormuse madalana kriisiolukorras

See dokument EI OLE:
- disainimockup
- CSS referents
- komponentide koodiraamat

---

### Kuidas seda dokumenti kasutada
- Kasuta enne UI muudatuste tegemist
- Kasuta regressioonide hindamisel
- AI peab seda käsitlema kui **kõrgema prioriteediga** kui esteetilised eelistused

Kui UI käitumine või välimus ei vasta sellele dokumendile, on tegemist:
- kas bugi
- või dokumenteerimata UI muudatusega

---

### Kohustuslikud osad (kontrollnimekiri)
- UI põhimõtted
- Visuaalne hierarhia
- Komponentide reeglid
- Lehe struktuurireeglid
- Värvid, tekst, spacing (koos TODO-dega)
- Do / Don’t reeglid

---

### Out of scope
- Brändingu juhised
- Täielik disainisüsteem
- Animatsioonide disain
- Kolmandate osapoolte UI komponendid

---

## 1. Üldised UI põhimõtted

### 1.1 Selgus enne ilu
- UI peab olema **üheselt mõistetav**, mitte “ilus”
- Kriisiolukorras ei tohi kasutaja:
  - mõelda, mida vajutada
  - otsida infot
  - tõlgendada värvide tähendust

### 1.2 Madal kognitiivne koormus
- Ühel vaatel:
  - üks peamine tegevus
  - piiratud arv visuaalseid aktsente
- Väldi:
  - liigseid värve
  - paralleelseid CTA-sid
  - dekoratiivseid elemente

---

## 2. Visuaalne hierarhia (väga oluline)

### 2.1 Globaalne hierarhia
1. **Olek / kontekst** (nt avalehe staatuskast)
2. **Peamine tegevus** (nt AVA INTSIDENT)
3. Sekundaarsed tegevused
4. Informatiivne sisu

See järjekord peab olema tajutav:
- suuruse
- värvi
- asukoha

---

### 2.2 Olekupõhine hierarhia
- Olek (nt ACTIVE intsident) peab:
  - olema alati nähtav
  - olema visuaalselt domineeriv
- Olek EI OLE:
  - klikitav
  - navigeeriv element

---

## 3. Värvide kasutamise reeglid

### 3.1 Semantiline värvikasutus
Värvidel on **fikseeritud tähendus**:

- **Punane**
  - ACTIVE intsident
  - kohene tähelepanu
- **Roheline**
  - tavapärane olukord
  - puuduvad ACTIVE intsidentid
- **Hall / neutraalne**
  - informatiivne sisu
  - mitteaktiivsed elemendid

Punast EI TOHI kasutada:
- dekoratsioonina
- nupul, mis ei loo ega halda intsidenti
- informatiivse rõhutuse jaoks

---

### 3.2 TODO: täpsed värvikoodid
- TODO: extract exact hex values from olemasolevatest CSS failidest  
  (nt `plans-styles.css`, `main.css`, `index.html`)

---

## 4. Tüpograafia

### 4.1 Teksti rollid
- Pealkirjad:
  - tähistavad sektsioone
  - EI sisalda tegevusi
- Nupud:
  - kirjeldavad tegevust
  - kasutavad verbi (“AVA”, “SALVESTA”)

---

### 4.2 TODO: font ja suurused
- TODO: dokumenteerida:
  - põhifont
  - pealkirjade suurused
  - nuputeksti suurus  
  olemasoleva CSS põhjal

---

## 5. Spacing ja paigutus

### 5.1 Paigutuse põhimõtted
- Kasuta järjepidevat vertikaalset rütmi
- Ära “pressi” elemente kokku
- Tühjus on lubatud ja soovitatav

### 5.2 TODO: spacing scale
- TODO: defineeri lihtne skaala (nt 4 / 8 / 16 / 24 px)
- TODO: kinnita skaala olemasoleva CSS järgi

---

## 6. Põhikomponendid ja nende reeglid

### 6.1 Kaardid (Cards)
- Kasutatakse:
  - navigeerimiseks
  - ülevaatlikuks info esituseks
- Kaart:
  - EI sisalda kriitilist olekuteksti
  - EI muutu punaseks ilma põhjuseta

---

### 6.2 Nupud (Buttons)

#### Primaarne nupp
- Kasutatakse:
  - peamise tegevuse jaoks vaates
- Nt: AVA INTSIDENT, SAVE

#### Sekundaarne nupp
- Vähem rõhutatud
- Ei konkureeri primaarsega

---

### 6.3 Badged ja sildid
- Badge:
  - näitab kogust või olekut
  - EI ole klikitav
- Badge’i tähendus peab olema üheselt mõistetav
  - nt Logide badge = mitte-SULETUD intsidentide arv

---

### 6.4 Staatuskast (Home)
- Suur, domineeriv
- Mitte klikitav
- Värv sõltub ainult intsidendi olekust
- Ei tohi sisaldada tegevusnuppe

---

## 7. Lehe struktuurireeglid

### 7.1 Püsivad elemendid
- Ülemine nav / struktuur:
  - püsiv
  - ei muutu olekupõhiselt

### 7.2 Kontekstuaalsed elemendid
- Staatuskast:
  - kuvatakse ainult avalehel
- Intsidendi spetsiifilised tegevused:
  - ainult detailvaates

---

## 8. Vormid ja salvestamine

### 8.1 SAVE käitumine
- SAVE:
  - salvestab
  - EI sulge vaadet
  - EI muuda staatust automaatselt

### 8.2 Vormide ootused
- Vormid võivad olla:
  - osaliselt täidetud
- Puuduv validatsioon:
  - ei tohi andmeid kustutada

---

## 9. Otsuspunktide nähtavus (õppetund Claude’i APP_FLOW-st)

- Kriitilised otsused:
  - peavad olema selgelt nähtavad
  - ei tohi olla peidetud
- Katkestamise võimalus:
  - peab olema alati olemas
- Kinnitused:
  - peavad eelnema pöördumatutele tegevustele

---

## 10. Accessibility (baastase)

- Tekst ja taust:
  - piisav kontrast
- Nupud:
  - selge klikiala
- Värv EI OLE ainus info kandja

---

## 11. Do / Don’t

### DO
- Kasuta värve semantiliselt
- Hoia üks peamine tegevus vaates
- Kasuta kinnitusi kriitiliste tegevuste puhul
- Hoia olek alati nähtavana

### DON’T
- Ära kasuta punast dekoratsioonina
- Ära muuda olekut klikitavaks
- Ära lisa uusi UI mustreid ilma juhendit uuendamata
- Ära “ilususta” kriisiinfot

---

**FRONTEND_GUIDELINES.md (V1) on kanoniline UI reeglite dokument.**  
Kõik UI muudatused peavad olema sellega kooskõlas.
