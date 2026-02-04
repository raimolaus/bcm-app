# dev-notes.md  
## BCM App — Development Notes, Experiments & Rationale (V1.1)

---

## MIS SEE DOKUMENT ON (JA EI OLE)

### On
- arendaja ja AI ühine mõttepaber
- otsuste põhjenduste ja alternatiivide logi
- koht, kuhu panna:
  - state machine mõttekäigud
  - praktilised “gotchas”
  - katsetatud, aga hüljatud ideed
  - tehnilised märkused, mis ei sobi canonical dokumentidesse

### Ei ole
- canonical tõeallikas
- PRD
- arhitektuurikirjeldus
- nõuete dokument

Kui dev-notes on vastuolus canonical dokumentidega:
👉 **canonical dokumendid võidavad alati**.

---

## 1. Miks BACKEND = LocalStorage (ja miks see on okei)

### Mõttearendus
- Backend lisaks:
  - autentimise
  - rollimudeli
  - serveri hoolduse
  - deploy-kompleksuse
- BCM äpi eesmärk on:
  - kriisi ajal *töötada*, mitte *sünkroniseerida*

### Järeldus
- LocalStorage:
  - on piisav
  - on offline
  - on audititav (TXT export)
- Puudused on teadlik kompromiss, mitte viga

---

## 2. Incident lifecycle — mõtteline state machine

> NB: See EI OLE lukustatud loogika.  
> See on mõtteharjutus.

### Tüüpiline voog (kontseptuaalne)
