ÜLESANNE: Analüüsi SPA navigeerimise history käitumist ja kinnita, miks browser Back hüppab “üleeelmisele” lehele.

OLULINE REEGEL
- ÄRA muuda ühtegi faili.
- ÄRA refactor’i.
- ÄRA tee ühtegi parandust.
- See on PUHAS ANALÜÜS / DIAGNOSTIKA.

SÜMPTOM
- Home → Incident detail → Back → Home (OK)
- Home → Kommunikatsioon → Back → läheb Incident detaili (VALE)
- Sama tüüpi segased hüpped mujal.

MIDA TULEB ANALÜÜSIDA
1) Leia kõik navigeerimise kohad:
   - navigateTo(...)
   - showPage(...)
   - click handlerid kaartidel / menüüdes
   - history.pushState / history.replaceState / location.hash

2) Kaardista:
   - millised nav-sammud kasutavad pushState
   - millised kasutavad replaceState
   - millised EI kasuta history’t üldse (ainult DOM vahetus)

3) Eriti vaata:
   - Home → Kommunikatsioon
   - Home → Incident detail
   - Incident detail → Kommunikatsioon
   - Appi enda back-nupp vs browser back

4) Kirjelda, milline on PRAEGUNE history stack loogika nende sammude ajal
   (nt: Home asendatakse replaceState’iga, Kommunikatsioon ei push’i jne).

OUTPUT (kohustuslik vorm)
- A) Loetelu nav-funktsioonidest ja kuidas nad history’t kasutavad
- B) Konkreetne selgitus, miks Back hüppab üleeelmisele
- C) Kas probleem on:
     - replaceState vale kasutus
     - pushState puudumine
     - mitu konkureerivat nav-funktsiooni
     - kombinatsioon
- D) Milline oleks minimaalne parandus (ainult kirjeldus, mitte kood)

DOKUMENTATSIOON
- Ära muuda docs.
- Ära paku refactor’it.
- Ära tee PR-i.

EESMÄRK
- Kinnitada või ümber lükata hüpotees:
  “Browser Back bug on põhjustatud valest history kirje käsitlusest (push vs replace).”
