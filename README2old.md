# BCM - Business Continuity Management

Eestikeelne Business Continuity Management veebilehe prototüüp.

## Omadused

### 📱 Neli põhivaadet:

1. **Esileht**
   - Kriisirežiimi aktiveerimise banner
   - Kiire juurdepääs kolmele põhisektsioonile:
     - Plaanid
     - Kriitilised kontaktid
     - Kommunikatsioon
   - Süsteemi oleku info

2. **Kommunikatsiooni leht**
   - 5 kommunikatsioonikanalit:
     - Massiteavitus (SMS)
     - Kõnekett
     - E-post
     - Raadio/Sat
     - Teams/Chat
   - Igal kanalil mallid ja kontroll-nimekirjad

3. **Kontaktide leht**
   - Grupifiltrid (Kõik, HTK, HHLA, CERT.EE, SADAM, MUUD)
   - Kontaktikaardid koos:
     - Nimi ja ametikoht
     - Grupi märgistus
     - Telefon ja e-post
     - Kriitiline kontakt märgistus
     - Tegevusnupud: Helista, SMS, E-post

4. **Plaanide leht**
   - Taasteplaan kaardid kategooriate kaupa:
     - IT (küberturvalisus, elekter)
     - HSE (evakuatsioon)
     - Comms (kommunikatsioon)
     - Ops (operatsioonid)
   - Iga plaani info:
     - Versioon ja kuupäev
     - Kategooria märgistus
     - Kriitiline plaan märgistus

## Tehnoloogiad

- **HTML5** - struktuur
- **CSS3** - kujundus (responsive design)
- **Vanilla JavaScript** - funktsionaalsus

## Kasutamine

1. Ava `index.html` veebibrauseris
2. Navigeeri erinevate vaadete vahel klikkides kaartidele
3. Filtreeri kontakte gruppide kaupa
4. Vaata plaane ja nende versioone

## Failide struktuur

```
BCM/
├── index.html          # Peamine HTML fail
├── styles.css          # CSS kujundus
├── app.js              # JavaScript funktsionaalsus
├── README.md           # See fail
├── esileht.jpg         # Kujunduskavandid
├── komm leht.jpg
├── kontaktide leht.jpg
└── plaanide leht.jpg
```

## Täiustused tulevikus

- [ ] Andmebaasi integratsioon
- [ ] Kasutajate autentimine
- [ ] Kriisirežiimi aktiveerimine funktsionaalsus
- [ ] PDF eksport plaanidest
- [ ] Otsingufunktsionaalsus
- [ ] Push-teavitused
- [ ] Mobiilirakendus (iOS/Android)

## Märkused

See on prototüüp, mis on loodud kujunduskavandite põhjal. Tegelik andmete haldamine ja turvaline kommunikatsioon vajavad backend'i lahendust.

---

Loodud: 2025-11-27
Versioon: 1.0
