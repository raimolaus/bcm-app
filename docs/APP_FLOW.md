# APP_FLOW.md  
## Business Continuity Management (BCM) App — Application Flow (V1, Canonical)

---

## JUHISED

### Milleks see dokument on
APP_FLOW kirjeldab **kuidas kasutaja rakenduses liigub ja otsuseid teeb**.

See dokument:
- seob PRD-s kirjeldatud funktsioonid konkreetseteks voogudeks
- kirjeldab ekraanidevahelist liikumist ja otsuspunkte
- on käsitsi testimise ja regressioonikontrolli alus

APP_FLOW EI OLE:
- tehniline arhitektuur
- UI stiilijuhend
- koodi kirjeldus
- backend’i disain

---

### Kuidas seda dokumenti kasutada
- Kasuta voogude kontrollimiseks arenduse ja testimise ajal
- Kasuta sisendina FRONTEND_GUIDELINES ja BACKEND_STRUCTURE loomisel
- Kui tegelik kasutusvoog erineb APP_FLOW-st, on tegemist:
  - kas bugiga
  - või dokumenteerimata käitumisega

---

### Kohustuslikud osad (kontrollnimekiri)
- Ekraanide loetelu (screen inventory)
- Sisenemispunktid ja väljumised
- Samm-sammulised kasutusvood
- Otsuspunktid (decision points)
- Error- ja empty-state ootused
- Navigeerimise konventsioonid

---

### Out of scope
- URL-routing
- serveripoolne navigatsioon
- deep-linking
- rollipõhised vood

---

## 1. Ekraanide loetelu (Screen Inventory)

| Ekraan | Sisetunnus (kui teada) | Sisenemispunktid | Põhitegevused | Väljumised |
|------|------------------------|------------------|---------------|------------|
| Avaleht | homePage | App start, Home nav | Ülevaade, AVA INTSIDENT | Logid, Plaanid, Kontaktid |
| Stsenaariumite valik | crisisModePage | AVA INTSIDENT | Stsenaariumi valik | Intsidendi detail |
| Intsidentide logi | incidentsPage | Home, nav | Filtreerimine, avamine | Intsidenti detail |
| Intsidendi detail | incidentDetailPage | Logid, stsenaarium | Halda intsidenti | Logid, Home |
| Cyber metrics | incidentMetricsPage | Intsidendi detail | Täitmine, SAVE | Intsidendi detail |
| Plaanid | plansPage | Home nav | Dokumentide vaatamine | Home |
| Kontaktid | contactsPage | Home nav | Kontaktide vaatamine | Home |
| Kommunikatsioon | communicationPage | Home nav | Koordineerimise info | Home |

> NB: Täpsed page-id-d on informatiivsed. APP_FLOW ei sõltu nende nimedest.

---

## 2. Navigeerimise üldpõhimõtted

- Rakendus käitub SPA-laadselt:
  - vaated vahetuvad
  - lehte ei laeta uuesti
- Navigeerimine on alati kasutaja kontrolli all
- Ükski vaade ei lukusta kasutajat (puudub “kriisirežiimi lõks”)

---

## 3. Põhivoog: Avaleht → ülevaade

### Sammud
1. Rakendus avaneb avalehel
2. Rakendus loeb LocalStorage’ist intsidendid
3. Arvutatakse:
   - ACTIVE intsidentide arv
   - mitte-SULETUD intsidentide arv

### Otsuspunktid
- Kui ACTIVE ≥ 1:
  - kuvatakse punane staatuskast
  - kuvatakse aktiivsete intsidentide nimed
- Kui ACTIVE = 0:
  - kuvatakse roheline staatuskast

### Väljumised
- AVA INTSIDENT
- Logid & Intsidendid
- Muud tugivaated

---

## 4. Voog: Uue intsidendi avamine

### Sammud
1. Kasutaja vajutab “AVA INTSIDENT”
2. Kuvatakse kinnitusdialoog
3. Kui kasutaja katkestab:
   - voog lõpeb
   - intsidenti ei looda
4. Kui kasutaja kinnitab:
   - küsitakse režiimi (REAL / TRAINING)
5. Kuvatakse stsenaariumite valik

### Otsuspunktid
- Katkestamine vs kinnitamine
- REAL vs TRAINING

### Vead / erijuhud
- Dialoogi vahelejätmine ei ole lubatud
- Intsident ei tohi tekkida ilma kinnitusteta

---

## 5. Voog: Stsenaarium → intsidendi loomine

### Sammud
1. Kasutaja valib stsenaariumi
2. Rakendus loob uue intsidendi LocalStorage’is
3. Staatus seatakse:
   - ACTIVE
4. Režiim seotakse:
   - REAL või TRAINING
5. Avaneb intsidendi detailvaade

### Otsuspunktid
- Stsenaariumi valik

---

## 6. Voog: Intsidentide logi kasutamine

### Sammud
1. Kasutaja avab Logid & Intsidendid
2. Kuvatakse kõik intsidendid
3. Kasutaja saab:
   - filtreerida
   - avada detailvaate

### Otsuspunktid
- Filtrite rakendamine
- Intsidendi avamine

### Tähelepanek
- Logide kaardil kuvatav badge:
  - sõltub mitte-SULETUD intsidentide arvust
  - ei sõltu ACTIVE arvust

---

## 7. Voog: Intsidendi detailvaade

### Sammud
1. Kasutaja avab intsidendi detaili
2. Kuvatakse:
   - põhiinfo
   - staatus
   - režiim
3. Kasutaja saab:
   - täita triage / tegevusi
   - avada cyber metrics
   - lisada märkmeid
   - muuta staatust käsitsi
4. Muudatused salvestatakse SAVE nupuga

### Otsuspunktid
- SAVE vs vahetu navigeerimine
- Staatusmuudatus vs mitte

---

## 8. Voog: Cyber incident metrics

### Sammud
1. Kasutaja avab Cyber metrics vaate
2. Täidab vormi
3. Vajutab SAVE

### Ootused
- SAVE:
  - salvestab andmed
  - ei sulge vaadet
  - ei muuda intsidendi staatust

### Vead
- Vorm võib olla osaliselt täidetud
- Puuduv validatsioon ei tohi andmeid kustutada

---

## 9. Voog: Intsidendi sulgemine

### Sammud
1. Kasutaja muudab intsidendi staatuse SULETUD
2. Muudatus salvestatakse
3. Intsident jääb logisse alles

### Mõju
- ACTIVE arv võib muutuda 0-ks
- Home staatuskast võib muutuda roheliseks
- Logide badge väheneb

---

## 10. Tugivoogud: Plaanid, Kontaktid, Kommunikatsioon

### Üldine käitumine
- Staatilised või pool-staatilised vaated
- Ei mõjuta intsidendi staatust
- Navigeeritavad Home’i kaudu

---

## 11. Error- ja empty-state ootused

- Kui LocalStorage on tühi:
  - kuvatakse tühjad loendid
  - rakendus ei tohi crash’ida
- Kui andmed on rikutud:
  - rakendus kasutab turvalisi vaikeväärtusi
- Kui intsidendid puuduvad:
  - Home näitab “OLUKORD: TAVAPÄRANE”

---

## 12. Navigeerimise konventsioon

- Navigeerimine toimub loogiliste “page id”-dega
- URL-e ei kasutata canonical tõena
- Navigeerimisfunktsioon peab:
  - lubama alati tagasi minna
  - mitte lukustama kasutajat

---

**APP_FLOW.md (V1) on kanoniline kasutusvoogude kirjeldus.**  
Kõik UI ja andmekäitumine peab olema sellega kooskõlas.
