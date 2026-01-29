// BCM Crisis Scenarios Data

export const scenarios = [
    {
        id: "FIRE",
        name: "Tulekahju",
        description: "Tulekahju ettevõtte territooriumil",
        icon: "🔥",
        priority: "CRITICAL",
        quickActions: [
            { id: 1, title: "Helista 112", type: "CALL", phone: "112" },
            { id: 2, title: "Teavita vahetuse juhti", type: "CALL" },
            { id: 3, title: "Käivita sireen", type: "ACTION" },
            { id: 4, title: "Alusta evakuatsiooni", type: "EVACUATION" }
        ],
        actionPlan: [
            { id: 1, title: "Helista 112 ja anna üle info", description: "Anna häirekeskusele teada tulekahju asukoht, mis põleb, kas on vigastatuid" },
            { id: 2, title: "Teavita vahetuse juhti / juhatust", description: "Helista vahetuse juhile ja anna teada olukorrast" },
            { id: 3, title: "Käivita turvatöötaja kaudu sireen", description: "Helista G4S 1911 ja palud käivitada sireeni" },
            { id: 4, title: "Korralda evakuatsioon", description: "Suuna inimesed kogunemiskohtadesse" },
            { id: 5, title: "Juhata päästjad sündmuskohale", description: "Oota päästjaid väraval ja juhi sündmuskohale" },
            { id: 6, title: "Dokumenteeri sündmus", description: "Tee fotod, kirjelda olukorda" }
        ],
        communications: [
            { id: 1, title: "Teavita töötajaid", channel: "SMS", template: "Ettevõttes on tulekahju. Evakuatsioon käivitatud. Liikuge kohe kogunemiskohtadesse (Veose 16 / Töökoda M2). Järgige piirkonna juhtide korraldusi." },
            { id: 2, title: "Teavita juhtkonnaEmail", channel: "EMAIL", template: "Kriis: Tulekahju", subject: "KRIIS - Tulekahju" },
            { id: 3, title: "Teavita Muuga sadamat", channel: "CALL", phone: "6311600" }
        ],
        contacts: ["1", "2", "3", "4", "5"]
    },
    {
        id: "TOXIC",
        name: "Mürgiste ainete õhku paiskumine",
        description: "Ohtlike kemikaalide õhku sattumine",
        icon: "☠️",
        priority: "CRITICAL",
        quickActions: [
            { id: 1, title: "Helista 112", type: "CALL", phone: "112" },
            { id: 2, title: "Teavita vahetuse juhti", type: "CALL" },
            { id: 3, title: "Evakueeri piirkond", type: "EVACUATION" }
        ],
        actionPlan: [
            { id: 1, title: "Helista 112", description: "Teavita häirekeskust ja anna üle info aine kohta" },
            { id: 2, title: "Teavita juhtkonda", description: "Helista kohe juhatusele" },
            { id: 3, title: "Sulge õhkventil", description: "Kui võimalik ja ohutu, sule ruumi ventilatsioon" },
            { id: 4, title: "Evakueeri piirkond", description: "Evakueeri kõik inimesed ohualast" },
            { id: 5, title: "Oota spetsialistide saabumist", description: "Ära liigu ohualasse enne spetsialistide saabumist" }
        ],
        communications: [
            { id: 1, title: "Teavita töötajaid", channel: "SMS", template: "OHUTEADE: Mürgiste ainete leke. Lahku piirkonnast viivitamatult. Järgi evakuatsioonikorraldust." }
        ],
        contacts: ["1", "2", "3", "4"]
    },
    {
        id: "TRANSPORT_ACCIDENT",
        name: "Transpordivahendi või laeva avarii",
        description: "Õnnetus transpordivahendiga või laevaga",
        icon: "🚢",
        priority: "HIGH",
        quickActions: [
            { id: 1, title: "Helista 112", type: "CALL", phone: "112" },
            { id: 2, title: "Teavita vahetuse juhti", type: "CALL" },
            { id: 3, title: "Osuta esmaabi", type: "ACTION" }
        ],
        actionPlan: [
            { id: 1, title: "Helista 112", description: "Anna üle info avariikoha, vigastatud isikute ja olukorra kohta" },
            { id: 2, title: "Teavita vahetuse juhti", description: "Teavita koheselt vahetuse juhti" },
            { id: 3, title: "Osuta esmaabi", description: "Kui oled koolitatud, osuta esmaabi vigastatutele" },
            { id: 4, title: "Juhi päästjad kohale", description: "Oota päästjaid ja juhi kohale" },
            { id: 5, title: "Dokumenteeri", description: "Tee fotod, kirjelda olukorda" }
        ],
        communications: [
            { id: 1, title: "Teavita juhatust", channel: "CALL" }
        ],
        contacts: ["1", "2", "5"]
    },
    {
        id: "INFECTIOUS_DISEASE",
        name: "Eriti ohtlik nakkushaigus",
        description: "Ohtliku nakkushaiguse puhang",
        icon: "🦠",
        priority: "HIGH",
        quickActions: [
            { id: 1, title: "Isoleeriteavita haiglaabi", type: "CALL", phone: "112" },
            { id: 2, title: "Teavita juhtkonda", type: "CALL" },
            { id: 3, title: "Alusta isoleerimist", type: "ACTION" }
        ],
        actionPlan: [
            { id: 1, title: "Teavita haigla/tervishoiuasutust", description: "Helista 112 või Terviseametile" },
            { id: 2, title: "Isoleeripindevastane isik", description: "Eralda nakatunu teistest töötajatest" },
            { id: 3, title: "Teavita juhtkonda", description: "Informeeri koheselt juhatust" },
            { id: 4, title: "Alusta desinfitseerimist", description: "Desinfitseeri puutunud pinnad" },
            { id: 5, title: "Jälgi kontaktseid", description: "Tuvasta ja jälgi kõiki, kes olid nakatunuga kontaktis" }
        ],
        communications: [
            { id: 1, title: "Teavita töötajaid", channel: "EMAIL", template: "Teavitus nakkushaigusest ettevõttes. Jälgige hügieeni ja võtke ühendust kui tekivad sümptomid." }
        ],
        contacts: ["1", "2", "6"]
    },
    {
        id: "STORM",
        name: "Torm",
        description: "Tugev torm ja tormihoiatus",
        icon: "🌪️",
        priority: "MEDIUM",
        quickActions: [
            { id: 1, title: "Teavita vahetuse juhti", type: "CALL" },
            { id: 2, title: "Kinnita lahtised esemed", type: "ACTION" },
            { id: 3, title: "Varu inimesed siseruumidesse", type: "ACTION" }
        ],
        actionPlan: [
            { id: 1, title: "Jälgi ilmateadet", description: "Jälgi Keskkonnaameti tormihoiatusi" },
            { id: 2, title: "Teavita vahetuse juhti", description: "Anna teada tormist vahetuse juhile" },
            { id: 3, title: "Kinnita lahtised esemed", description: "Kinnita või too siseruumidesse kõik lahtised esemed" },
            { id: 4, title: "Valmista ette varustus", description: "Kontrolli generaatorite ja varustuse olemasolu" },
            { id: 5, title: "Varu inimesed siseruumidesse", description: "Tormi ajal hoiduge siseruumides" }
        ],
        communications: [
            { id: 1, title: "Teavita töötajaid", channel: "SMS", template: "Tormihoiatus. Jääge siseruumidesse. Välitöid peatatud kuni edasijuhise saamiseni." }
        ],
        contacts: ["1", "2", "3"]
    },
    {
        id: "OVERBOARD",
        name: "Inimene üle parda",
        description: "Isik on vette kukkunud",
        icon: "🆘",
        priority: "CRITICAL",
        quickActions: [
            { id: 1, title: "Helista 112", type: "CALL", phone: "112" },
            { id: 2, title: "Viska päästevahend", type: "ACTION" },
            { id: 3, title: "Jälgi silmaga ohvrit", type: "ACTION" }
        ],
        actionPlan: [
            { id: 1, title: "Helista 112 viivitamatult", description: "Teavita häirekeskust, anna täpne asukoht" },
            { id: 2, title: "Viska päästevahend (päästering)", description: "Viska vette päästering või muu ujuvvahend" },
            { id: 3, title: "Ära mine ise vette", description: "Oota päästjate saabumist" },
            { id: 4, title: "Jälgi ohvrit", description: "Hoia ohvrit kogu aeg silma peal" },
            { id: 5, title: "Teavita juhtkonda", description: "Teavita vahetuse juhti ja juhatust" }
        ],
        communications: [
            { id: 1, title: "Teavita juhatust", channel: "CALL" }
        ],
        contacts: ["1", "2"]
    },
    {
        id: "POLLUTION",
        name: "Reostus",
        description: "Keskkonnareostus (õli, kütus vms)",
        icon: "🛢️",
        priority: "HIGH",
        quickActions: [
            { id: 1, title: "Peata leke allikas", type: "ACTION" },
            { id: 2, title: "Teavita vahetuse juhti", type: "CALL" },
            { id: 3, title: "Alusta koristust", type: "ACTION" }
        ],
        actionPlan: [
            { id: 1, title: "Peata leke", description: "Kui võimalik ja ohutu, peata leke allikas" },
            { id: 2, title: "Teavita vahetuse juhti", description: "Anna teada reostusest" },
            { id: 3, title: "Teavita Keskkonnainspektsiooni", description: "Helista 1313 (suured reostused)" },
            { id: 4, title: "Alusta lokaliseerimist", description: "Kasuta absorbente ja tõkkepiirdeid" },
            { id: 5, title: "Dokumenteeri", description: "Tee fotod ja kirjelda olukorda" },
            { id: 6, title: "Korista reostus", description: "Eemalda reostunud pinnas/materjalid vastavalt juhistele" }
        ],
        communications: [
            { id: 1, title: "Teavita Keskkonnainspektsiooni", channel: "CALL", phone: "1313" }
        ],
        contacts: ["1", "2", "3"]
    },
    {
        id: "BOMB_THREAT",
        name: "Pommioht",
        description: "Pommiähvarduse teade",
        icon: "💣",
        priority: "CRITICAL",
        quickActions: [
            { id: 1, title: "Helista 112", type: "CALL", phone: "112" },
            { id: 2, title: "Teavita juhtkonda", type: "CALL" },
            { id: 3, title: "Evakueeri hoone", type: "EVACUATION" }
        ],
        actionPlan: [
            { id: 1, title: "Helista 112 viivitamatult", description: "Anna üle kogu info ähvarduse kohta" },
            { id: 2, title: "Teavita juhtkonda", description: "Teavita koheselt juhatust" },
            { id: 3, title: "Ära puutu kahtlaseid esemeid", description: "Ära liigu objekti lähedale" },
            { id: 4, title: "Evakueeri hoone", description: "Evakueeri kõik inimesed hoonestest" },
            { id: 5, title: "Oota politsei saabumist", description: "Jää oma kohale ja oota politseid" },
            { id: 6, title: "Dokumenteeri", description: "Kirjuta üles ähvarduse detailid" }
        ],
        communications: [
            { id: 1, title: "Teavita töötajaid", channel: "SMS", template: "EVAKUATSIOON - Pommiähvardus. Lahku koheselt hoonest. Liikuge kogunemiskohtadesse. Ärge võtke kaasa isiklikke asju." }
        ],
        contacts: ["1", "2"]
    },
    {
        id: "MAJOR_ACCIDENT_NEARBY",
        name: "Suurõnnetus lähedalasuvas ettevõttes",
        description: "Suur õnnetus naaberüksustes",
        icon: "⚠️",
        priority: "HIGH",
        quickActions: [
            { id: 1, title: "Jälgi olukorda", type: "ACTION" },
            { id: 2, title: "Teavita vahetuse juhti", type: "CALL" },
            { id: 3, title: "Valmista ette evakuatsioon", type: "ACTION" }
        ],
        actionPlan: [
            { id: 1, title: "Jälgi infokanaleid", description: "Jälgi Päästeameti/politsei teateid" },
            { id: 2, title: "Teavita vahetuse juhti", description: "Anna teada olukorrast" },
            { id: 3, title: "Valmista evakuatsioon ette", description: "Ole valmis evakuatsiooniks" },
            { id: 4, title: "Sulge uksed ja aknad", description: "Sulge hoone hermeetiliselt kui vajalik" },
            { id: 5, title: "Jää siseruumidesse", description: "Ära lahku hoonest enne korraldust" }
        ],
        communications: [
            { id: 1, title: "Teavita töötajaid", channel: "SMS", template: "Kriis naaberüksuses. Jääge siseruumidesse ja oodake edasijuhatusi." }
        ],
        contacts: ["1", "2"]
    }
    ,
    {
        id: "CYBER_INCIDENT",
        name: "Küberintsident",
        description: "IT/OT küberintsidendi tuvastamine ja käsitlemine. KÄIVITAMINE: EDR/SIEM alarm + reaalne mõju või levikukahtlus; admin/privilege sisselogimine; teenuse katkestus küberkahtlusega; OT/ICS anomaalia.",
        icon: "🔒",
        priority: "CRITICAL",
        quickActions: [
            { id: 1, title: "Täida Intsidenti mõõtmed: t0, S-tase, domeen, seiskus, andmeleke kahtlus, leviku staatus, lühikirjeldus", type: "ACTION" },
            { id: 2, title: "Vajuta Salvesta (loo/uuenda incident log)", type: "ACTION" },
            { id: 3, title: "Eskaleeri: IT juht/asendaja; OT kahtlusel tootmisjuht/OT vastutaja", type: "CALL" },
            { id: 4, title: "Kui levik = 'Käib', alusta piiramisest (host/segment isolatsioon)", type: "ACTION" },
            { id: 5, title: "Käivita koordineerimine WhatsAppis (juhtkond/tuumiktiim), kui S0/S1 või mõju kasvab", type: "ACTION" }
        ],
        actionPlan: [
            { id: 1, title: "Kinnita, kas tegemist on turvasündmuse või küberintsidendiga", description: "False positive vs reaalne mõju" },
            { id: 2, title: "Kaardista mõjutatud ulatus", description: "Kontod, hostid, serverid, võrgu segmendid, OT komponendid" },
            { id: 3, title: "Kogu esmane tõendus", description: "SIEM/EDR alarmid, logide viited, ajad, kasutajad, IP-d (ära kustuta/üle kirjuta)" },
            { id: 4, title: "Uuenda Leviku staatus ja salvesta logi", description: "Värskenda intsidenti mõõtmeid" },
            { id: 5, title: "Piira mõju", description: "Eralda mõjutatud host(id) ja/või võrgusegment (võimalusel)" },
            { id: 6, title: "Piira identiteediriski", description: "Lukusta kahtlased kontod või eemalda privileegid; vajadusel sunni paroolivahetus" },
            { id: 7, title: "Piira ligipääse", description: "Ajutised reeglid VPN/RDP/eeliskontode kasutusele (vastavalt olukorrale)" },
            { id: 8, title: "OT korral kooskõlasta tootmisega", description: "Väldi pimedat katkestamist, mis võib tekitada ohutusriskid" },
            { id: 9, title: "Tuvasta sissetungivektor", description: "Phishing/VPN/RDP/haavatavus/konfig" },
            { id: 10, title: "Sulge vektor", description: "Patch, konfiguratsioonimuudatus, MFA/CA poliitikad, teenuse piiramine" },
            { id: 11, title: "Eemalda pahatahtlikud komponendid", description: "EDR cleanup/reimage ja kontrolli püsivust (scheduled tasks, services)" },
            { id: 12, title: "Taasta teenused prioriteedi järgi", description: "Jälgi taastatud süsteeme (EDR/logid)" },
            { id: 13, title: "Kommunikatsioonitsükkel", description: "WhatsApp staatus + juhtkonnale; märgi teavituste staatused (CERT-EE/DPO) logis" },
            { id: 14, title: "Kui stabiliseerub: märgi 'Kontrolli all'", description: "Fikseeri kokkuvõte ja õppetunnid" },
            { id: 15, title: "Loo parenduste ülesanded", description: "ClickUp + lisa viited incident log'ile" }
        ],
        communications: [
            { id: 1, title: "Koordineerimine WhatsAppis (juhtkond/tuumiktiim)", channel: "CALL", template: "Kasuta kriisigruppi X või loo ajutine vastavalt protseduurile. Määra Logija, kes hoiab ajajoont/otsuseid koos." },
            { id: 2, title: "Teavita CERT-EE (S0/S1 korral)", channel: "EMAIL", template: "S0/S1 korral teavita CERT-EE 24h jooksul. Kasuta raport.cert.ee või cert@cert.ee", subject: "HHLA TK - Küberintsidendi teavitus" },
            { id: 3, title: "Siseteave töötajatele", channel: "EMAIL", template: "Teavitame küberintsidendist. IT teenused võivad olla ajutiselt häiritud. Järgige IT juhi juhiseid." }
        ],
        contacts: ["4", "1", "3", "2", "7"]
    },
    {
        id: "RANSOMWARE",
        name: "Ransomware rünnak",
        description: "Ransomware'i tuvastamine ja käsitlemine. KÄIVITAMINE: Failid krüpteeruvad / ransom note / massiline failimuutus; EDR/AV ransomware tuvastus; failiserveri/VM failid kasutamatud; backup/shadow copy'd kaovad kahtlaselt.",
        icon: "💀",
        priority: "CRITICAL",
        quickActions: [
            { id: 1, title: "Täida Intsidenti mõõtmed (S-tase tavaliselt S0/S1) ja vajuta Salvesta", type: "ACTION" },
            { id: 2, title: "KOHE isoleeri mõjutatud host(id) võrgust (NAC/VLAN/füüsiline lahti)", type: "ACTION" },
            { id: 3, title: "Keela/pausi kahtlased kontod (eriti admin/service)", type: "ACTION" },
            { id: 4, title: "Kui krüpteerimine levib jagamiste kaudu, piiritle ajutiselt SMB/jagamiste ligipääsu", type: "ACTION" },
            { id: 5, title: "Käivita koordineerimine WhatsAppis (juhtkond/tuumiktiim)", type: "ACTION" }
        ],
        actionPlan: [
            { id: 1, title: "Kinnita ransomware sümptomid", description: "Krüpteeritud failid, ransom note, massiline failimuutus, EDR tuvastus" },
            { id: 2, title: "Kaardista levik", description: "Hostid/serverid/shares; kas AD/DC või virtualiseerimine mõjutatud" },
            { id: 3, title: "Salvesta indikaatorid", description: "Faililaiend, ransom note ID, protsessinimed, hashid (kui saad)" },
            { id: 4, title: "Uuenda Leviku staatus ja salvesta logi", description: "Värskenda intsidenti mõõtmeid" },
            { id: 5, title: "Containment: eralda mõjutatud hostid", description: "Eralda mõjutatud hostid + kriitilised serverivõrgud kasutajavõrgust; karmista segmentatsiooni" },
            { id: 6, title: "Containment: lukusta privileged kontod", description: "Võta ajutiselt maha riskantsed admin-kanalid" },
            { id: 7, title: "Kontrolli backup'e", description: "Olemasolu ja tervis (ära tee restore'i enne, kui levik peatatud)" },
            { id: 8, title: "Tuvasta algvektor ja sulge see", description: "Patch/MFA/poliitikad" },
            { id: 9, title: "Eradication: reimage/puhastus", description: "Eemalda püsivus ja kontrolli kõrvalmõjusid" },
            { id: 10, title: "Credential reset plaan", description: "Adminid -> teenusekontod -> kasutajad (kontrollitud järjekorras)" },
            { id: 11, title: "Recovery: taasta clean backupist etapiti", description: "Jälgi, et krüpteerimine ei taastu" },
            { id: 12, title: "Kommunikatsioon", description: "Juhtkond + teavitused (CERT-EE/DPO) logis timestampidega" },
            { id: 13, title: "Sulgemine: root cause + parendused", description: "Immutability, segmentatsioon, MFA, hardening + ClickUp" }
        ],
        communications: [
            { id: 1, title: "Koordineerimine WhatsAppis (juhtkond/tuumiktiim)", channel: "CALL", template: "KRIITILINE: Ransomware tuvastatud. Kasuta kriisigruppi X või loo ajutine. Määra Logija." },
            { id: 2, title: "Teavita CERT-EE", channel: "CALL", phone: "+372 663 0299", template: "Teavita CERT-EE viivitamatult: cert@cert.ee või +372 663 0299" },
            { id: 3, title: "Siseteave töötajatele", channel: "EMAIL", template: "Ransomware intsident. IT teenused häiritud. Järgige IT juhi juhiseid. ÄRA ava kahtlaseid faile või linke." }
        ],
        contacts: ["4", "1", "3", "7"]
    },
    {
        id: "REMOTE_ACCESS_COMPROMISE",
        name: "Kaugjuurdepääsu kompromiteerimine",
        description: "VPN või kaugjuurdepääsu kontode kompromiteerimine. KÄIVITAMINE: Ebatavaline VPN login (uus geo/asukohamuster), võimatu reisimine; korduvad MFA pushid / uued seadmed / ebatavalised ajad; admin-tegevused pärast VPN sessiooni.",
        icon: "🌐",
        priority: "HIGH",
        quickActions: [
            { id: 1, title: "Täida Intsidenti mõõtmed ja vajuta Salvesta", type: "ACTION" },
            { id: 2, title: "KOHE: keela kahtlane konto või sunni paroolivahetus (vastavalt poliitikale)", type: "ACTION" },
            { id: 3, title: "Revoke sessioonid ja tokenid (IdP/VPN/M365 vms)", type: "ACTION" },
            { id: 4, title: "Kontrolli MFA: reset/re-enroll; vaata recovery meetodid üle", type: "ACTION" },
            { id: 5, title: "Kui privilege kahtlus -> käivita WhatsApp koordineerimine", type: "ACTION" }
        ],
        actionPlan: [
            { id: 1, title: "Kinnita anomaalia", description: "IP/geo/device, aeg, impossible travel, ebatavalised MFA pushid" },
            { id: 2, title: "Kontrolli kasutajalt (kui võimalik), kas ligipääs on legit", description: "Kui ei, käsitle kompromissina" },
            { id: 3, title: "Kaardista sessiooni tegevus", description: "Mida puudutati, kas tehti admin-muudatusi" },
            { id: 4, title: "Otsi lateraalset liikumist ja privilege eskalatsiooni", description: "Kontrolli AD/DC, GPO, service accounts" },
            { id: 5, title: "Uuenda Leviku staatus ja salvesta logi", description: "Värskenda intsidenti mõõtmeid" },
            { id: 6, title: "Containment: piiritle VPN ligipääsu", description: "Riik/device/CA, keela riskantsed remote admin teed" },
            { id: 7, title: "Containment: blokeeri kahtlased IP-d", description: "Tõsta monitooringut (SIEM)" },
            { id: 8, title: "Eradication: konto taastamine", description: "Password + MFA + recovery meetodid" },
            { id: 9, title: "Kontrolli seotud seadmeid (endpoint compromise)", description: "Vajadusel isoleeri ja puhasta" },
            { id: 10, title: "Kui privilege eskalatsioon: kontrolli AD/DC, GPO, scheduled tasks", description: "Eemalda pahatahtlikud muudatused" },
            { id: 11, title: "Recovery: taasta ligipääs kontrollitult", description: "Tugev MFA, piiratud poliitikad; jälgi kindla perioodi jooksul" },
            { id: 12, title: "Kommunikatsioon", description: "Juhtkond + DPO/GDPR (kui andmekahtlus) + CERT-EE (vastavalt klassile); staatused logis" },
            { id: 13, title: "Sulgemine: parendused", description: "MFA/CA, VPN hardening, breakglass + ClickUp" }
        ],
        communications: [
            { id: 1, title: "Koordineerimine WhatsAppis (juhtkond/tuumiktiim)", channel: "CALL", template: "Kaugjuurdepääsu kompromiteerimine. Kasuta kriisigruppi X või loo ajutine. Määra Logija." },
            { id: 2, title: "Teavita CERT-EE (vastavalt klassile)", channel: "EMAIL", template: "S0/S1 korral teavita CERT-EE: cert@cert.ee", subject: "HHLA TK - Kaugjuurdepääsu kompromiteerimine" },
            { id: 3, title: "Teavita tarnijat (kui asjakohane)", channel: "EMAIL", template: "Tuvastasime kompromiteeritud kaugjuurdepääsu. Palume teie poolset uurimist." }
        ],
        contacts: ["4", "1", "3", "7"]
    },
    {
        id: "OT_DISRUPTION",
        name: "OT/ICS häire",
        description: "Tööstusvõrkude ja automaatika küberintsident. KÄIVITAMINE: SCADA/PLC/HMI anomaalia, mida ei seleta hooldus või rike; OT võrgus ebatavaline liiklus / uued seadmed / konfiguratsioonimuutused; tootmisprotsess häirub ja on küberkahtlus.",
        icon: "🏭",
        priority: "CRITICAL",
        quickActions: [
            { id: 1, title: "Täida Intsidenti mõõtmed (domeen OT/Mõlemad; S-tase tihti S0/S1 kui ohutus/tootmine) ja vajuta Salvesta", type: "ACTION" },
            { id: 2, title: "Eskaleeri: tootmisjuht/OT vastutaja + IT juht", type: "CALL" },
            { id: 3, title: "Ohutus enne: vajadusel fail-safe / manual override", type: "ACTION" },
            { id: 4, title: "Kui küberlevis kahtlus: piiritle OT↔IT ühendusi kooskõlastatult (ära tee pimedat katkestust)", type: "ACTION" },
            { id: 5, title: "Käivita WhatsApp koordineerimine, kui tootmine/ohutus mõjutatud", type: "ACTION" }
        ],
        actionPlan: [
            { id: 1, title: "Kinnita häire iseloom", description: "Milline liin/seade/segment; kas on planeeritud muudatus/hooldus" },
            { id: 2, title: "Kaardista mõju", description: "PLC/HMI/SCADA komponendid; kas tootmine või ohutus mõjutatud" },
            { id: 3, title: "Kogu tõendus", description: "OT logid, HMI/SCADA alarmid, võrgu jälg, viimaste muudatuste ajalugu" },
            { id: 4, title: "Uuenda Leviku staatus ja salvesta logi", description: "Värskenda intsidenti mõõtmeid" },
            { id: 5, title: "Containment: eralda mõjutatud OT alamsegment", description: "Kui võimalik, hoides ohutuse tagatud" },
            { id: 6, title: "Containment: keela mittevajalik remote access OT-sse", description: "Piiritle IT->OT liiklus minimaalseks" },
            { id: 7, title: "Säilita tõendid", description: "Väldi factory reset'i enne otsust" },
            { id: 8, title: "Eradication: sulge sissepääs", description: "Remote access poliitikad, kontod, patch kui ohutu; eemalda pahatahtlik komponent koos OT spetsialistiga" },
            { id: 9, title: "Taasta known-good konfiguratsioon kontrollitult, etapiti", description: "Vastavalt tootmisplaanile" },
            { id: 10, title: "Recovery: taastamine segmendi/liini kaupa", description: "Stabiilsuse ja kvaliteedi kontroll; järelmonitooring" },
            { id: 11, title: "Kommunikatsioon", description: "Juhtkond (ohutusrisk, tootmise mõju, taastamise järjekord) + CERT-EE (S0/S1 korral tihti vajalik) + DPO ainult andmekahtluse korral; staatused logis" },
            { id: 12, title: "Sulgemine: parendused", description: "Segmentatsioon, remote access hardening, logging, taastamisprotseduur + ClickUp" }
        ],
        communications: [
            { id: 1, title: "Koordineerimine WhatsAppis (juhtkond/tuumiktiim)", channel: "CALL", template: "OT süsteemid häiritud. Kasuta kriisigruppi X või loo ajutine. Määra Logija." },
            { id: 2, title: "Teavita seadmetarnijat", channel: "CALL", template: "OT häire. Vajame seadmetarnija ekspertiisi SCADA/TOS süsteemide analüüsiks." },
            { id: 3, title: "Teavita CERT-EE (S0/S1 korral)", channel: "EMAIL", template: "OT/ICS küberintsident. S0/S1 korral teavita CERT-EE: cert@cert.ee", subject: "HHLA TK - OT/ICS häire" }
        ],
        contacts: ["4", "3", "1", "7"]
    }

];

// Plans - HOLP ja alamplaanid
export const plans = [
    {
        id: "PLAN_HOLP_MAIN",
        code: "HOLP_MAIN",
        title: "HHLA TK hädaolukorra lahendamise plaan (HOLP)",
        description: "Peamine hädaolukorra lahendamise plaan, mis hõlmab kõiki kriitilisi stsenaariume ja tegevuskavu.",
        scope: "HHLA TK terminali territoorium, laod, kai, töötajad, külastajad",
        documentNumber: "HOLP-2025-v1",
        version: "v1.0",
        ownerContactId: "1",
        approvedByContactId: "2",
        approvedDate: "2025-01-15",
        validFrom: "2025-01-15",
        validUntil: "2026-01-15",
        lastReviewedDate: "2025-01-10",
        annexes: [
            "Lisa 1 - Territooriumi üldskeem",
            "Lisa 2 - Evakuatsiooni skeem",
            "Lisa 3 - Kriisi juhtimise struktuur",
            "Lisa 4 - Tulekahju korral tegutsemise plaan",
            "Lisa 5 - Kommunikatsiooniplaanid"
        ],
        relatedScenarioIds: ["FIRE", "TOXIC", "TRANSPORT_ACCIDENT", "INFECTIOUS_DISEASE", "STORM", "OVERBOARD", "POLLUTION", "BOMB_THREAT", "MAJOR_ACCIDENT_NEARBY"],
        isActive: true,
        tags: ["holp", "peaplaan", "kriis"]
    },
    {
        id: "PLAN_FIRE",
        code: "FIRE_PLAN",
        title: "Tulekahju korral tegutsemise plaan",
        description: "Detailne tegevusplaan tulekahju korral - sammud, ressursid, kontaktid.",
        scope: "Kõik HHLA TK hooned, laod, väliterritoorium",
        version: "v2.1",
        ownerContactId: "3",
        approvedByContactId: "2",
        approvedDate: "2024-12-01",
        validFrom: "2024-12-01",
        validUntil: "2025-12-01",
        lastReviewedDate: "2024-11-25",
        annexes: [
            "Lisa 1 - Tulekustutite asukohad",
            "Lisa 2 - Evakuatsioonimarsruudid",
            "Lisa 3 - Päästeteenistuse kontaktid"
        ],
        relatedScenarioIds: ["FIRE"],
        isActive: true,
        tags: ["tulekahju", "evakuatsioon", "päästeteenistus"]
    },
    {
        id: "PLAN_EVACUATION",
        code: "EVACUATION_PLAN",
        title: "Evakuatsiooniplaan",
        description: "Üldine evakuatsiooniplaan kõigile hädaolukordadele.",
        scope: "Kogu HHLA TK territoorium",
        version: "v3.0",
        ownerContactId: "1",
        approvedByContactId: "2",
        approvedDate: "2025-01-05",
        validFrom: "2025-01-05",
        validUntil: "2026-01-05",
        lastReviewedDate: "2024-12-20",
        annexes: [
            "Lisa 1 - Kogunemiskohad (Veose 16, Töökoda M2)",
            "Lisa 2 - Evakuatsiooni marsruudid",
            "Lisa 3 - Erivajadustega isikute evakuatsioon"
        ],
        relatedScenarioIds: ["FIRE", "TOXIC", "BOMB_THREAT", "MAJOR_ACCIDENT_NEARBY"],
        isActive: true,
        tags: ["evakuatsioon", "kogunemiskohad", "ohutus"]
    },
    {
        id: "PLAN_IT_CYBER",
        code: "IT_CYBER_PLAN",
        title: "IT küberintsidendi taasteplaan",
        description: "Plaan IT süsteemide taastamiseks küberrünnaku või IT intsidendi korral.",
        scope: "Kõik HHLA TK IT süsteemid (ATS, TOS, kommunikatsioonisüsteemid)",
        version: "v4.2",
        ownerContactId: "4",
        approvedByContactId: "2",
        approvedDate: "2024-11-01",
        validFrom: "2024-11-01",
        validUntil: "2025-11-01",
        lastReviewedDate: "2024-10-15",
        annexes: [
            "Lisa 1 - Kriitiliste süsteemide loetelu",
            "Lisa 2 - Backup'i protseduurid",
            "Lisa 3 - IT turvaintsidentide klassifikatsioon"
        ],
        relatedScenarioIds: [],
        isActive: true,
        tags: ["IT", "küberturvalisus", "taasteplaan"]
    },
    {
        id: "PLAN_COMMUNICATION",
        code: "COMM_PLAN",
        title: "Kriisikommunikatsiooni plaan",
        description: "Sisemise ja välise kommunikatsiooni korraldus kriisi ajal.",
        scope: "Kõik sidusrühmad (töötajad, juhtkond, meedia, ametid)",
        version: "v1.5",
        ownerContactId: "1",
        approvedByContactId: "2",
        approvedDate: "2025-01-10",
        validFrom: "2025-01-10",
        validUntil: "2026-01-10",
        lastReviewedDate: "2025-01-05",
        annexes: [
            "Lisa 1 - SMS mallid",
            "Lisa 2 - E-posti mallid",
            "Lisa 3 - Pressiteadete mallid"
        ],
        relatedScenarioIds: ["FIRE", "TOXIC", "TRANSPORT_ACCIDENT", "BOMB_THREAT"],
        isActive: true,
        tags: ["kommunikatsioon", "meedia", "teavitused"]
    }
    ,
    {
        id: "PLAN_CYBER_INCIDENT",
        code: "CYBER_INCIDENT",
        title: "HHLA TK küberintsidentide tuvastamise ja käsitlemise plaan",
        description: "IT ja OT süsteemide küberintsidentide tuvastus, klassifitseerimine (S0-S3), war room aktiveerimine, CERT-EE teavitamine ja taastamine. Hõlmab ransomware, kaugjuurdepääsu kompromisse ja OT häireid.",
        scope: "IT-süsteemid (kontorivõrk, serverid, pilveteenused), OT/IACS/ICS (kraanad, väravad, TOS/SCADA), kolmandad osapooled ja kaugjuurdepääs",
        documentNumber: "CYBER-2026-v0.5",
        version: "v0.5",
        ownerContactId: "4",
        approvedByContactId: "1",
        approvedDate: "2026-01-15",
        validFrom: "2026-01-15",
        validUntil: "2027-01-15",
        lastReviewedDate: "2026-01-10",
        annexes: [
            "Lisa A - CERT-EE teavituse mallid (esmateade, täiendav teade, lõppkokkuvõte)",
            "Lisa B - Esmased playbookid (Ransomware, Kaugjuurdepääs, OT häire)",
            "Lisa C - Esmase hindamise vorm (war room)",
            "Lisa D - Rollid ja vastutused",
            "Lisa E - Klassifitseerimise tabel (S0-S3 + NIS2)",
            "Lisa F - Logide säilitamine ja tõendite kogumine",
            "Lisa G - Kommunikatsiooni protokoll"
        ],
        relatedScenarioIds: ["CYBER_INCIDENT", "RANSOMWARE", "REMOTE_ACCESS_COMPROMISE", "OT_DISRUPTION"],
        isActive: true,
        tags: ["küberturvalisus", "IT", "OT", "NIS2", "CERT-EE", "war room", "ransomware"]
    }

];

// Contacts are defined in app.js - using those
console.log('crisis-data.js loaded - scenarios:', scenarios.length, 'plans:', plans.length);
