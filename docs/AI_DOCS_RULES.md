# AI_DOCS_RULES.md  
## Canonical Documentation Writing Rules for BCM App

---

## JUHISED

### Milleks see dokument on
See dokument määratleb **reeglid ja tööviisi**, mille järgi AI peab looma, täiendama ja hooldama BCM rakenduse dokumentatsiooni.

See EI OLE:
- tootenõuete dokument (PRD)
- arhitektuurikirjeldus
- tehniline spetsifikatsioon

See ON:
- **kirjutamis- ja mõtlemisreeglite alus**
- **AI käitumisleping** dokumentatsiooni loomisel
- kaitse hallutsinatsioonide, oletuste ja scope creep’i vastu

---

### Kuidas seda dokumenti kasutada
- See dokument antakse AI-le **alati enne** ühegi dokumendi loomist või muutmist.
- AI peab seda käsitlema kui **kõrgema prioriteediga reeglistikku** kui üksik ülesanne.
- Kui tekib konflikt ülesande ja selle dokumendi vahel, **kehtib AI_DOCS_RULES.md**.

---

### Kohustuslikud põhimõtted (AI PEAB)

#### 1. Lähtumine ainult olemasolevast rakendusest
AI tohib dokumenteerida **ainult seda, mis BCM äpis reaalselt eksisteerib**.

Lubatud allikad:
- olemasolev kood (HTML / CSS / JS)
- varasemad kinnitatud dokumendid
- kasutaja selgesõnalised otsused ja lukustused

Keelatud:
- uute funktsioonide väljamõtlemine
- tulevikuvisioonide lisamine
- “oleks hea kui” ideed

Kui detail pole kindel:
- märgi see **TODO-na**
- lisa juhis, **kust see tuleb koodist välja võtta**

---

#### 2. Dokumentatsioon on operatiivne, mitte kirjeldav
Kõik dokumendid peavad olema:
- praktilised
- testitavad
- kasutatavad arenduse ja kontrolli alusena

Vältida:
- üldsõnalist juttu
- turunduskeelt
- ebamääraseid termineid

Eelistada:
- konkreetseid reegleid
- acceptance criteria’d
- kontrollnimekirju (checklists)

---

#### 3. Acceptance-criteria-põhine kirjutamine
Iga oluline funktsionaalsus peab olema kirjeldatud viisil, mida saab **käsitsi testida**.

Soovitatav vorm:
- Given / When / Then
- või selged punktid stiilis:
  - Kui X
  - Ja Y
  - Siis Z

Kui midagi ei ole testitav, on see liiga ebamäärane ja tuleb ümber kirjutada.

---

#### 4. Selged piirid ja non-goals on kohustuslikud
Igas dokumendis peab olema selgelt kirjas:
- mis kuulub selle dokumendi scope’i
- mis EI kuulu selle dokumendi scope’i

Eriti oluline:
- backend’i puudumise selge rõhutamine
- LocalStorage kui teadlik arhitektuurne valik
- auth’i, rollide, serveri ja API-de puudumine

---

#### 5. Üks dokument korraga (V1 lähenemine)
AI:
- loob **ainult ühe dokumendi korraga**
- eeldab, et see on **V1**
- ootab kasutaja kinnitust enne järgmise dokumendi alustamist

AI EI TOHI:
- paralleelselt täita mitut dokumenti
- “ennetavalt” kirjutada järgmisi faile
- muuta juba kinnitatud dokumente ilma selge käsuta

---

#### 6. Dokumentide rollide eristamine
AI peab austama dokumentide rolle:

- **PRD** – mida süsteem teeb ja ei tee
- **APP_FLOW** – kuidas kasutaja liigub ja otsustab
- **FRONTEND_GUIDELINES** – visuaalsed ja UX reeglid
- **TECH_STACK** – tehnoloogilised piirangud
- **BACKEND_STRUCTURE** – LocalStorage kui andmekiht
- **IMPLEMENTATION_PLAN** – kuidas muudatusi ellu viia

Sisu ei tohi dubleerida üle dokumentide.
Dokumendid viitavad üksteisele, mitte ei korda sisu.

---

#### 7. TODO-d on lubatud ja soovitatavad
Kui detail:
- sõltub koodist
- pole veel lukus
- vajab väljavõtet olemasolevast failist

Siis:
- kasuta `TODO:` märget
- lisa **konkreetne juhis**, kust info tuleb võtta  
  (nt “extract from plans-styles.css”)

TODO ≠ puudulik dokument  
TODO = aus dokumentatsioon.

---

#### 8. Keel ja toon
- Keel: **eesti keel**
- Toon: rahulik, insenerlik, täpne
- Ei ropenda dokumentides
- Ei kasuta slängi
- Ei “õpeta AI-d”, vaid kirjeldab süsteemi

---

#### 9. Näited vs kanonilised reeglid
Näited, user stories ja flow diagrammid on **illustratiivsed**, kui neid ei ole märgitud kanonilisteks.

Põhimõtted:
- Näited on **arusaamise abi**, mitte nõuded
- Näide ei tohi vaikimisi muutuda nõudeks
- Kanonilised reeglid defineeritakse **ainult acceptance criteria kaudu**

Kui tekib konflikt näite ja acceptance criteria vahel:
- kehtib acceptance criteria
- näide tuleb kas parandada või eemaldada

---

#### 10. User Stories kasutamise reeglid
User Stories on lubatud **ainult arusaamise abivahendina**.

Põhimõtted:
- User Story EI OLE nõue, kui seda ei toeta acceptance criteria
- User Story ei tohi lisada uut funktsionaalsust
- Konfliktide korral kehtib acceptance criteria, mitte story

Õige kasutus:
- Given / When / Then kirjeldab **olemasolevat** käitumist
- Story aitab mõista, miks reegel on selline

Vale kasutus:
- story kirjeldab midagi, mida kood ei tee
- story "soovitab" uusi funktsioone

---

#### 11. Edu kriteeriumid ja arhitektuursed piirangud
Edu kriteeriumid tohtivad kirjeldada **ainult olemasoleva funktsionaalsusega** saavutatavaid tulemusi.

Keelatud:
- edu kriteeriumid, mis eeldavad uut automaatikat
- edu kriteeriumid, mis eeldavad elutsükli loogika muutmist
- edu kriteeriumid, mis eeldavad backend'i või sünkronisatsiooni

Selgitused:
- **"Offline-first"** on arhitektuurne piirang, mitte toote funktsioon
- **"Local-first"** on arhitektuurne valik, mitte kasutaja feature
- Edu kriteeriumid peavad olema **testitavad ilma koodilisandita**

---

### Mis EI TOHI dokumentidesse sattuda
- backend’i disain
- API skeemid
- kasutajarollid
- autentimine
- serveri infrastruktuur
- pilveteenused
- välised sõltuvused, mida pole olemas

Kui midagi neist mainitakse, peab see olema **explicit non-goal**.

---

## Kokkuvõte
AI_DOCS_RULES.md on:
- dokumentatsiooni **konstitutsioon**
- alus kõikidele järgmistele dokumentidele
- vahend, mis tagab järjepidevuse eri sessioonide ja AI-de vahel

Kõik järgnevad dokumendid peavad olema sellega kooskõlas.

---

**AI_DOCS_RULES.md — V2 (täpsustused lisatud, algne loogika muutmata)**
