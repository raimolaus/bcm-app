ROLL: Sa oled Claude Code (täisjuurdepääs repo koodile). Rakenda järgmine iteratsioon BCM äpis. ÄRA küsi täpsustusi; tee parim tehniline otsus olemasoleva struktuuri põhjal. Hoia muudatused väiksed ja järjepidevad.

EESMÄRK (ITERATSIOON 2)
1) Lisa “ÕPPUS” režiim (toggle), et saaks stsenaariume läbi mängida ilma pärisintsidenti tekitamata.
2) Tee “Süsteemi olek” (OK/HOIATUS/HÄIRE) päriselt muutuvaks: reeglid + käsitsi override + kuvareeglid.
3) Vähenda UI müra:
   - “Aktiveeri kriisirežiim” suur punane bänner jääb AINULT Home/Dashboardile.
   - Teistel lehtedel on kriisirežiimi käivitamine väikse nupuna top bar’is (secondary/outline).
   - Navi värvid korrasta nii, et need ei sõltuks lehe punasest taustast.

------------------------------------------------------------
A) ÕPPUS REŽIIM (GLOBAL TOGGLE)
------------------------------------------------------------
NÕUDED
- Lisa globaalne toggle top bar’i paremasse ülanurka: “ÕPPUS: SEES/VÄLJAS”.
- Kui ÕPPUS: SEES
  - Kõik uued incident log kirjed (mis luuakse “Intsidenti mõõtmete” salvestamisel) peavad saama lipu: isExercise=true ja UI-s sildi “[ÕPPUS]”.
  - Kõik teavituste staatuse muutmised (CERT-EE/DPO/Juhtkond) on “simuleeritud”: lubatud UI-s, kuid ei käivita mingeid päris-integratsioone (kui neid on).
  - Incident log’is peab olema filter “ÕPPUS” ja vaikimisi listis õppe- ja pärisintsidendid eristatavad.
- Kui ÕPPUS: VÄLJAS
  - Käitumine jääb nagu enne (pärisintsidendid).

SOOVITUSLIK (kui lihtne)
- Kui ÕPPUS: SEES, lisa stsenaariumi detaili CTA: “Alusta õppust selle stsenaariumiga”
  - avab sama flow mis “päris”, kuid märgib isExercise=true.

------------------------------------------------------------
B) SÜSTEEMI OLEK (STATE MACHINE) + KUVAMISREEGLID
------------------------------------------------------------
OLEKUD
- OK (roheline)
- HOIATUS (kollane)
- HÄIRE (punane)

ANDMEMUDEL
- Loo SystemStatus state (nt app-level store või backend/config, mis juba kasutusel):
  - status: "OK" | "WARNING" | "ALERT"
  - reason: string (optional)
  - source: "AUTO" | "MANUAL"
  - updatedAt: timestamp
  - updatedBy: optional (kui kasutajasüsteem olemas)

AUTOMAATSED REEGLID (MVP)
1) Kui on vähemalt üks AVATUD incident log kirje (status="OPEN") JA see ei ole õppus (isExercise=false):
   - kui severity S0 või S1 -> SystemStatus = HÄIRE (AUTO)
   - kui severity S2 või S3 -> SystemStatus = HOIATUS (AUTO)
2) Kui ÕPPUS: SEES ja puudub avatud S0/S1 pärisintsident:
   - SystemStatus peab olema vähemalt HOIATUS (AUTO) ja UI-s põhjuseks “ÕPPUS”
3) Kui viimane avatud pärisintsident suletakse ja muid avatud pärisintsidente pole:
   - kui ÕPPUS: SEES -> HOIATUS (AUTO)
   - muidu -> OK (AUTO)

KÄSITSI OVERRIDE
- Home/Dashboardi “Süsteemi olek” kaardil lisa tegevus “Määra olek”:
  - valikud OK/HOIATUS/HÄIRE + lühike põhjendus (<=120 tähemärki)
  - salvestab SystemStatus source="MANUAL"
- MANUAL override püsib kuni:
  - kasutaja valib “Eemalda override / Taasta automaatne”
  - VÕI tekib avatud S0/S1 pärisintsident (siis AUTO võib üle sõita punaseks, kuid säilita manual reason auditina kui võimalik)

KUVAMINE
- Home/Dashboard:
  - Näita “Süsteemi olek” kaarti alati.
  - Näita status + 1-lause põhjus:
    - AUTO: “Aktiivne intsident: <nimi> (S1), alates <t0>”
    - MANUAL: “Põhjus: <reason>”
  - Kui HÄIRE: näita link “Vaata aktiivseid intsidendid” (Incident log filtriga OPEN).
- Top bar “pill” indikaator:
  - HÄIRE: alati nähtav kõigil lehtedel
  - HOIATUS: alati nähtav kõigil lehtedel
  - OK: nähtav ainult Home’il (või diskreetselt; vali lihtsam variant)

------------------------------------------------------------
C) UI: “AKTIVEERI KRIISIREŽIIM” BÄNNERI KORRASTAMINE
------------------------------------------------------------
NÕUDED
- Suur punane bänner “Aktiveeri kriisirežiim” jääb AINULT Home/Dashboardile.
- Teistel lehtedel:
  - asenda see top bar’i väikse nupuga “Kriisirežiim” (secondary/outline).
- Kriisirežiimi peab saama käivitada igalt lehelt, aga ilma suure punase plokita.

------------------------------------------------------------
D) NAVI/VÄRVID: HOME NUPU “VALGE” PROBLEEMI LAHENDUS
------------------------------------------------------------
NÕUDED
- Tee naviriba/menüü visuaal lehe taustast sõltumatuks:
  - navil peab olema fikseeritud taust (nt hele/valge) kõigil lehtedel
  - aktiivne menüüpunkt kasutab brand-punast teksti/ikooni või underline’i (mitte “valge, sest taust punane”)
- Eemalda olukord, kus HOME on alati valge ainult seetõttu, et ülemine bänner on punane.
- Kriisirežiimi CTA (Home’i bänner või top bar nupp) võib kasutada punast täistausta; nav mitte.

------------------------------------------------------------
E) TESTID / KONTROLL
------------------------------------------------------------
Acceptance criteria:
1) ÕPPUS toggle olemas ja mõjutab incident log kirjeid (isExercise flag + sildid + filter).
2) SystemStatus muutub automaatselt avatud pärisintsidentide järgi (S0/S1 -> punane; S2/S3 -> kollane).
3) SystemStatus manual override töötab ja on eemaldatav; S0/S1 pärisintsident võib punaseks sundida.
4) Home’il on suur punane “Aktiveeri kriisirežiim” bänner; mujal seda pole.
5) Top bar’il on kriitilise olukorra korral nähtav oleku pill (kollane/punane).
6) Nav värvid on korrektsed igal lehel; HOME ei ole enam “valge kõigil lehtedel” tausta tõttu.
7) Kõik route’id töötavad; build läbib.

VÄLJUND
- Commit summary: milliseid faile muutsid (UI, state/store, types, incident log, styling) ja mida lisasid.
- Lühike kirjeldus: kuidas SystemStatus auto/override töötab.

ALUSTA KOHE:
- Skaneeri repo (nav, header, dashboard, incident log store), lisa ÕPPUS toggle + SystemStatus, seejärel tee UI refactor bänneri ja nav stiilidega.
