ROLL: Sa oled Claude Code (täisjuurdepääs repo koodile). Tee alltoodud muudatused BCM äpis. ÄRA lisa uusi “War Room” ekraane. ÄRA küsi täpsustusi; tee parim tehniline otsus olemasoleva struktuuri põhjal.

KONTEKST / EESMÄRK
- Äpis on praegu eraldi “War Room” (küberintsidentide koordineerimine). Reaalses töökorralduses toimub juhtkonna/tiimi koordineerimine WhatsAppis; äpp peab olema “playbook + minimaalne struktureerimine + logi”.
- Seega eemaldame “War Room” kui eraldi ekraani/menüü ja viime vajalikud “juhtimismõõtmed” küberstsenaariumi detailvaatesse.
- Tulemus peab vähendama segadust (mis on war room vs logi vs stsenaarium) ja säilitama küberintsidendi jaoks vajaliku miinimuminfo: t0, S-tase, mõju, teavituste jälg.

KÕRGTASEME MUUDATUSED
1) EEMALDA “WAR ROOM”
   - Eemalda navist/menüüst/route’ist “War Room” (ja kõik seotud UI entrypoint’id).
   - Eemalda “War Room” leht/komponent või jäta see koodi alles ainult siis, kui vajalik (aga mitte kasutajale nähtav; ideaalis kustuta).
   - Kui kuskil on “Aktiveeri War Room” nupp/CTA, siis asenda see “Koordineerimine WhatsAppis” CTA-ga küberstsenaariumi detailvaates (vt allpool).
   - Kui “War Room” lehel oli funktsioone (t0 määramine, S0–S3 valik, CERT-EE teavitus, PDF eksport), siis need tuleb ümber paigutada:
     - t0 + S0–S3 + teavituste staatus -> küberstsenaariumi detaili “Intsidenti mõõtmed” plokki
     - PDF eksport -> Incident log kirje ekspordina (kui eksport oli olemas) või eemalda, kui see pole kuskil mujal kasutusel

2) LISA KÜBERSTSENAARIUMI DETAILI “INTSIDENTI MÕÕTMED” PLOKK (Variant A)
   - See plokk ilmub AINULT küberstsenaariumite detailvaates (stsenaariumid, mille tüüp/tag on “cyber” vms; leia koodist olemasolev eristus 4 küberstsenaariumi jaoks).
   - Ploki eesmärk: struktureerida minimaalne intsidentkirje ilma eraldi “War Room” ekraanita.

3) SEO “INTSIDENTI MÕÕTMED” -> “INCIDENT LOG”
   - Kui kasutaja salvestab “Intsidenti mõõtmed”, peab tekkima (või uuenema) Incident log’i kirje.
   - Iga salvestus:
     - Kui sama intsidentkirje juba olemas (nt currentIncidentId state’is), update
     - Muidu create new log entry, seosta valitud stsenaariumiga.
   - Incident log’is peab olema võimalik näha vähemalt: t0, S-tase, mõjutatud domeen, teenuse seiskus, andmeleke kahtlus, leviku staatus, lühikirjeldus, teavituste staatus.

4) WHATSAPP ON “RUUM”, MITTE EKRAAN
   - Küberstsenaariumi detailvaates “Kommunikatsioon” plokis lisa üks selge rida/CTA:
     - “Koordineerimine WhatsAppis (juhtkond/tuumiktiim)”
     - Kui rakendusel pole võimalik deep linkida gruppi, siis kasuta:
       - WhatsApp avamine (universal link) + tekstiline juhis “Kasuta kriisigruppi X või loo uus vastavalt protseduurile”.
   - Lisa väli “Logija” (valik kontaktidest või vaba tekst), et määrata, kes hoiab ajajoont/otsuseid koos.

VÄLJAD: MVP vs NICE-TO-HAVE + MIKS VAJALIK

A) MVP VÄLJAD (kohustuslikud)
1. t0 (avastamise aeg) [DateTime]
   - UI: nupp “Määra praegune aeg” + võimalus käsitsi muuta
   - MIKS: juhendi ajastused ja teavituste tähtajad lähtuvad t0-st; hiljem on vaja taastada ajajoon.
2. S-tase (S0/S1/S2/S3) [Enum]
   - UI: 4 valikut koos 1-lause kirjeldusega
   - MIKS: klassifitseerimine määrab reageerimisrežiimi ja teavituse prioriteedi; ühtlustab otsuseid.
3. Mõjutatud domeen (IT/OT/Mõlemad/Teadmata) [Enum]
   - MIKS: OT vs IT mõjutus muudab riski/tegevusjärjekorda; juhtkonna jaoks oluline.
4. Teenuse seiskus? (Jah/Ei/Osaline/Teadmata) [Enum]
   - MIKS: mõju ulatus; aitab prioriseerida taastamist ja kommunikatsiooni.
5. Andmeleke kahtlus? (Jah/Ei/Teadmata) [Enum]
   - MIKS: GDPR/DPO kaasamise vajadus; kommunikatsiooniriski marker.
6. Leviku staatus (Käib/Piiratud/Peatatud/Teadmata) [Enum]
   - MIKS: kas kontroll on saavutatud; suunab järgmisi samme ja juhtkonna ootusi.
7. Lühikirjeldus (1–2 lauset) [Text]
   - MIKS: logikirje kokkuvõte; hiljem aruandlus ja järelanalüüs.
8. Teavituste staatus (CERT-EE, DPO/GDPR, Juhtkond) [per-destination + timestamp]
   - Igaüks: Vajalik? (Jah/Ei/Hinnata) + Staatus (Planeeritud/Saadetud/Pole vaja) + aeg
   - MIKS: distsipliin ja jälgitavus; väldib “me arvasime, et keegi teavitas”.

B) NICE-TO-HAVE VÄLJAD (collapsible “Lisaväljad”)
9. Raporteerija / teataja [Text/ContactRef]
10. Süsteem/teenus/asukoht [Text]
11. NIS2 relevants (Jah/Ei/Teadmata) [Enum]
12. Esmased indikaatorid/sümptomid [Text]
13. Tõendid/artefaktid (lingid/ID-d) [Text list]
14. Logija (kes kogub ajajoont) [Text/ContactRef]

UI / KÄITUMISE REEGLID (LIHTSUS)
- “Intsidenti mõõtmed” plokk: MVP väljad alati nähtavad; nice-to-have on collapsible (“Lisaväljad”).
- Eeltäitmise soovitused (mitte sund):
  - Kui S0 või S1 -> “Juhtkond: Vajalik = Jah”
  - Kui Andmeleke kahtlus = Jah -> “DPO/GDPR: Vajalik = Jah”
  - Kui S0 (ja vajadusel S1, kui koodis on vastav reegel) -> “CERT-EE: Vajalik = Jah”
- Salvesta logisse: “Salvesta” (primary) loob/uuendab logikirje. (Autosave ainult siis, kui sul juba on olemasolev muster mujal.)

INCIDENT LOG MUUDATUSED
- Lisa logi kirjele küber-spetsiifiliste väljade kuvamine (S-tase, t0, mõju, teavitused).
- Kui logikirjet avatakse detailiks, näita samu välju read-only või editable vastavalt olemasolevale mustrile.
- Kui “Export PDF” eksisteeris war room’is: koli see logi detaili “Ekspordi PDF” nupuks (valikuline). Kui pole stabiilne, jäta välja.

TEHNILISED NÕUDED
- Ära lõhu teisi stsenaariume: mitteküber stsenaariumite detail jääb samaks.
- Re-use olemasolevaid komponente ja state managementi.
- Lisa/uuenda tüübid: ScenarioType, IncidentLogEntry, NotificationStatus, enums.
- Migratsioon: kui olemasolevates logikirjetes oli war room’i välju, map’i need uutele väljadele või hoia backwards compatibility.

VASTUVÕTUKRITEERIUMID
1. Äpis puudub kasutajale nähtav “War Room” menüü/vaade.
2. Küberstsenaariumi detailvaates on “Intsidenti mõõtmed” plokk (MVP + collapsible lisaväljad).
3. “Salvesta” tekitab Incident log’i kirje ja see on logis nähtav.
4. WhatsApp CTA on küberstsenaariumi kommunikatsiooniosas.
5. Mitteküberstsenaariumid töötavad endiselt nagu enne.
6. Nav/routing ei sisalda katkiseid viiteid war room’ile.

-----------------------------------------------------------------------
LISA ANDMED / SISU: KÜBERSTSENAARIUMITE STANDARD + 4 STSENAARIUMI SISU
-----------------------------------------------------------------------

MINIMAALNE UI JUHIS (KÜBERSTSENAARIUMI DETAILI SEKTSIOONIDE JÄRJEKORD)
1) Kiirtoimingud (0–5 min)  -> quickActions
2) Intsidenti mõõtmed        -> eraldi UI plokk (MVP + collapsible lisaväljad)
3) Esmane triage (5–15 min)  -> actionPlan alguses
4) Piiramine/Kõrvaldamine/Taastamine -> actionPlan keskel
5) Kommunikatsioon           -> communication (siin peab olema WhatsApp CTA)
6) Sulgemine/järeltegevused  -> actionPlan lõpus

STANDARDNE KOMMUNIKATSIOONI CTA (kõigis 4 küberstsenaariumis)
- “Koordineerimine WhatsAppis (juhtkond/tuumiktiim)”
- Juhis: “Kasuta kriisigruppi X või loo ajutine vastavalt protseduurile.”
- Lisa “Logija” väli (Text/ContactRef).

SCENARIO CONTENT: uuenda ainult järgmisi küberstsenaariume (säilita nimed/ikoonid/prioriteedid; muuda tekstisisu)
1) Küberintsident (üldine IT/OT)
2) Ransomware rünnak
3) Kaugjuurdepääsu kompromiteerimine
4) OT/ICS häire

TEHNILINE TEOSTUS (SISU)
- Leia, kus stsenaariumite sammud ja tekstid on (JSON/YAML/TS constants/DB seed).
- Map’i:
  - quickActions -> quickActions/rapidActions/immediateActions (mis iganes olemas)
  - actionPlan -> actionPlan/steps/checklist/tasks
  - communication -> communication/contacts/notify (mis iganes olemas)
- Kui struktuur ei toeta käivituskriteeriume eraldi väljana, lisa need stsenaariumi kirjelduse lõppu (bullets) või esimeste actionPlan sammudena “Kinnita käivitamise kriteeriumid”.

-------------------------
1) KÜBERINTSIDENT (üldine)
-------------------------
KÄIVITAMISE KRITEERIUMID (bullets; lisa description alla või esimeseks actionPlan plokiks)
- EDR/SIEM/AV kõrge usaldusväärsusega alarm + reaalne mõju või levikukahtlus
- Kahtlane admin/privilege sisselogimine, mida ei saa seletada
- Teenuse katkestus, mille põhjuseks võib olla ründetegevus
- OT/ICS anomaalia küberkahtlusega
- Kui pole veel selge, milline alamstsenaarium sobib

quickActions (0–5 min)
1. Täida Intsidenti mõõtmed: t0, S-tase, domeen, seiskus, andmeleke kahtlus, leviku staatus, lühikirjeldus.
2. Vajuta Salvesta (loo/uuenda incident log).
3. Eskaleeri: IT juht/asendaja; OT kahtlusel tootmisjuht/OT vastutaja.
4. Kui levik = “Käib”, alusta piiramisest (host/segment isolatsioon).
5. Käivita koordineerimine WhatsAppis (juhtkond/tuumiktiim), kui S0/S1 või mõju kasvab.

actionPlan (1..n)
1. Kinnita, kas tegemist on turvasündmuse või küberintsidendiga (false positive vs reaalne mõju).
2. Kaardista mõjutatud ulatus: kontod, hostid, serverid, võrgu segmendid, OT komponendid.
3. Kogu esmane tõendus: SIEM/EDR alarmid, logide viited, ajad, kasutajad, IP-d (ära kustuta/üle kirjuta).
4. Uuenda Leviku staatus ja salvesta logi.
5. Piira mõju: eralda mõjutatud host(id) ja/või võrgusegment (võimalusel).
6. Piira identiteediriski: lukusta kahtlased kontod või eemalda privileegid; vajadusel sunni paroolivahetus.
7. Piira ligipääse: ajutised reeglid VPN/RDP/eeliskontode kasutusele (vastavalt olukorrale).
8. OT korral kooskõlasta tootmisega: väldi pimedat katkestamist, mis võib tekitada ohutusriskid.
9. Tuvasta sissetungivektor (phishing/VPN/RDP/haavatavus/konfig).
10. Sulge vektor: patch, konfiguratsioonimuudatus, MFA/CA poliitikad, teenuse piiramine.
11. Eemalda pahatahtlikud komponendid (EDR cleanup/reimage) ja kontrolli püsivust (scheduled tasks, services).
12. Taasta teenused prioriteedi järgi; jälgi taastatud süsteeme (EDR/logid).
13. Kommunikatsioonitsükkel: WhatsApp staatus + juhtkonnale; märgi teavituste staatused (CERT-EE/DPO) logis.
14. Kui stabiliseerub: märgi “Kontrolli all”, fikseeri kokkuvõte ja õppetunnid.
15. Loo parenduste ülesanded (ClickUp) ja lisa viited incident log’ile.

-------------------------
2) RANSOMWARE RÜNNAK
-------------------------
KÄIVITAMISE KRITEERIUMID
- Failid krüpteeruvad / ransom note / massiline failimuutus
- EDR/AV käitumuslik ransomware tuvastus
- Failiserveri/VM/departmendi failid muutuvad korraga kasutamatuks
- Backup/shadow copy’d kaovad kahtlaselt

quickActions (0–5 min)
1. Täida Intsidenti mõõtmed (S-tase tavaliselt S0/S1) ja vajuta Salvesta.
2. KOHE isoleeri mõjutatud host(id) võrgust (NAC/VLAN/füüsiline lahti).
3. Keela/pausi kahtlased kontod (eriti admin/service).
4. Kui krüpteerimine levib jagamiste kaudu, piiritle ajutiselt SMB/jagamiste ligipääsu.
5. Käivita koordineerimine WhatsAppis (juhtkond/tuumiktiim).

actionPlan
1. Kinnita ransomware sümptomid: krüpteeritud failid, ransom note, massiline failimuutus, EDR tuvastus.
2. Kaardista levik: hostid/serverid/shares; kas AD/DC või virtualiseerimine mõjutatud.
3. Salvesta indikaatorid: faililaiend, ransom note ID, protsessinimed, hashid (kui saad).
4. Uuenda Leviku staatus ja salvesta logi.
5. Containment: eralda mõjutatud hostid + kriitilised serverivõrgud kasutajavõrgust; karmista segmentatsiooni.
6. Containment: lukusta privileged kontod; võta ajutiselt maha riskantsed admin-kanalid.
7. Kontrolli backup’e: olemasolu ja tervis (ära tee restore’i enne, kui levik peatatud).
8. Tuvasta algvektor ja sulge see (patch/MFA/poliitikad).
9. Eradication: reimage/puhastus; eemalda püsivus ja kontrolli kõrvalmõjusid.
10. Credential reset plaan: adminid -> teenusekontod -> kasutajad (kontrollitud järjekorras).
11. Recovery: taasta clean backupist etapiti; jälgi, et krüpteerimine ei taastu.
12. Kommunikatsioon: juhtkond + teavitused (CERT-EE/DPO) logis timestampidega.
13. Sulgemine: root cause + parendused (immutability, segmentatsioon, MFA, hardening) + ClickUp.

-------------------------------------
3) KAUGJUURDEPÄÄSU KOMPROMITEERIMINE
-------------------------------------
KÄIVITAMISE KRITEERIUMID
- Ebatavaline VPN login (uus geo/asukohamuster), võimatu reisimine
- Korduvad MFA pushid / uued seadmed / ebatavalised ajad
- Admin-tegevused pärast VPN sessiooni (uued kontod, GPO muutused, logide tühjendamine)

quickActions (0–5 min)
1. Täida Intsidenti mõõtmed ja vajuta Salvesta.
2. KOHE: keela kahtlane konto või sunni paroolivahetus (vastavalt poliitikale).
3. Revoke sessioonid ja tokenid (IdP/VPN/M365 vms).
4. Kontrolli MFA: reset/re-enroll; vaata recovery meetodid üle.
5. Kui privilege kahtlus -> käivita WhatsApp koordineerimine.

actionPlan
1. Kinnita anomaalia: IP/geo/device, aeg, impossible travel, ebatavalised MFA pushid.
2. Kontrolli kasutajalt (kui võimalik), kas ligipääs on legit; kui ei, käsitle kompromissina.
3. Kaardista sessiooni tegevus: mida puudutati, kas tehti admin-muudatusi.
4. Otsi lateraalset liikumist ja privilege eskalatsiooni.
5. Uuenda Leviku staatus ja salvesta logi.
6. Containment: piiritle VPN ligipääsu (riik/device/CA), keela riskantsed remote admin teed.
7. Containment: blokeeri kahtlased IP-d; tõsta monitooringut (SIEM).
8. Eradication: konto taastamine (password + MFA + recovery meetodid).
9. Kontrolli seotud seadmeid (endpoint compromise); vajadusel isoleeri ja puhasta.
10. Kui privilege eskalatsioon: kontrolli AD/DC, GPO, service accounts, scheduled tasks; eemalda pahatahtlikud muudatused.
11. Recovery: taasta ligipääs kontrollitult (tugev MFA, piiratud poliitikad); jälgi kindla perioodi jooksul.
12. Kommunikatsioon: juhtkond + DPO/GDPR (kui andmekahtlus) + CERT-EE (vastavalt klassile); staatused logis.
13. Sulgemine: parendused (MFA/CA, VPN hardening, breakglass) + ClickUp.

-------------------------
4) OT/ICS HÄIRE
-------------------------
KÄIVITAMISE KRITEERIUMID
- SCADA/PLC/HMI anomaalia, mida ei seleta hooldus või rike
- OT võrgus ebatavaline liiklus / uued seadmed / konfiguratsioonimuutused
- Tootmisprotsess häirub ja on küberkahtlus

quickActions (0–5 min)
1. Täida Intsidenti mõõtmed (domeen OT/Mõlemad; S-tase tihti S0/S1 kui ohutus/tootmine) ja vajuta Salvesta.
2. Eskaleeri: tootmisjuht/OT vastutaja + IT juht.
3. Ohutus enne: vajadusel fail-safe / manual override.
4. Kui küberlevis kahtlus: piiritle OT↔IT ühendusi kooskõlastatult (ära tee pimedat katkestust).
5. Käivita WhatsApp koordineerimine, kui tootmine/ohutus mõjutatud.

actionPlan
1. Kinnita häire iseloom: milline liin/seade/segment; kas on planeeritud muudatus/hooldus.
2. Kaardista mõju: PLC/HMI/SCADA komponendid; kas tootmine või ohutus mõjutatud.
3. Kogu tõendus: OT logid, HMI/SCADA alarmid, võrgu jälg, viimaste muudatuste ajalugu.
4. Uuenda Leviku staatus ja salvesta logi.
5. Containment: eralda mõjutatud OT alamsegment (kui võimalik), hoides ohutuse tagatud.
6. Containment: keela mittevajalik remote access OT-sse; piiritle IT->OT liiklus minimaalseks.
7. Säilita tõendid; väldi factory reset’i enne otsust.
8. Eradication: sulge sissepääs (remote access poliitikad, kontod, patch kui ohutu); eemalda pahatahtlik komponent koos OT spetsialistiga.
9. Taasta known-good konfiguratsioon kontrollitult, etapiti.
10. Recovery: taastamine segmendi/liini kaupa; stabiilsuse ja kvaliteedi kontroll; järelmonitooring.
11. Kommunikatsioon: juhtkond (ohutusrisk, tootmise mõju, taastamise järjekord) + CERT-EE (S0/S1 korral tihti vajalik) + DPO ainult andmekahtluse korral; staatused logis.
12. Sulgemine: parendused (segmentatsioon, remote access hardening, logging, taastamisprotseduur) + ClickUp.

TÖÖJÄRK (soovituslik)
1) Leia ja eemalda War Room route + nav + komponendid.
2) Lisa enums/tüübid “Intsidenti mõõtmed” jaoks.
3) Implementeri “Intsidenti mõõtmed” plokk küberstsenaariumi detaili.
4) Seo salvestus Incident log’i create/update’iga.
5) Uuenda Incident log list/detail kuvamist.
6) Uuenda 4 küberstsenaariumi sisu (quickActions/actionPlan/communication) vastavalt ülalolevale.

VÄLJUND:
- Commit summary: milliseid faile muutsid ja mis väljad täitsid (UI, types, routes, scenario data, incident log).

ALUSTA KOHE:
- Skaneeri repo, leia War Room komponendid ja küberstsenaariumite eristus, seejärel tee ülaltoodud muudatused.
