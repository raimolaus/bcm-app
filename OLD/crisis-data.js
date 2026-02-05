// BCM Crisis Scenarios Data

const scenarios = [
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
        description: "IT/OT küberintsidendi tuvastamine ja käsitlemine",
        icon: "🔒",
        priority: "CRITICAL",
        quickActions: [
            { id: 1, title: "Teavita IT juhti viivitamatult", type: "CALL" },
            { id: 2, title: "Fikseeri t0 (tuvastamise aeg)", type: "ACTION" },
            { id: 3, title: "Aktiveeri War Room (S0/S1 korral)", type: "ACTION" },
            { id: 4, title: "Klassifitseeri intsident (S0-S3)", type: "ACTION" }
        ],
        actionPlan: [
            { id: 1, title: "Hinda ja klassifitseeri", description: "Kinnita faktid, määra tase S0-S3 ja NIS2 lipu esmahinnang. Otsusta war roomi vajadus." },
            { id: 2, title: "Tõkesta levik", description: "Isoleeri mõjutatud süsteemid, keela kompromiteeritud kontod, peata kahtlased juurdepääsud, säilita logid." },
            { id: 3, title: "Kõrvalda põhjus", description: "Eemalda pahavara, sulge haavatavus, rakenda parandused. Kontrolli lateraalset liikumist." },
            { id: 4, title: "Taasta teenus", description: "Taasta teenus turvaliselt (backup/restore), valideeri et intsident ei taastu." },
            { id: 5, title: "Teavita CERT-EE", description: "S0/S1 korral teavita CERT-EE 24h jooksul. Kasuta raport.cert.ee või cert@cert.ee." },
            { id: 6, title: "Sulge ja õpi", description: "Tee järelanalüüs, pane parendused tegevusplaani (omanik + tähtaeg)." }
        ],
        communications: [
            { id: 1, title: "Teavita juhtkonda", channel: "CALL", template: "Küberintsident tuvastatud. War room aktiveeritud." },
            { id: 2, title: "Teavita CERT-EE", channel: "EMAIL", template: "Esmateade küberintsidendist (vt CERT-EE teavituse mall)", subject: "HHLA TK - Küberintsidendi teavitus" },
            { id: 3, title: "Siseteave töötajatele", channel: "EMAIL", template: "Teavitame küberintsidendist. IT teenused võivad olla ajutiselt häiritud. Järgige IT juhi juhiseid." }
        ],
        contacts: ["4", "1", "3", "2", "7"]
    },
    {
        id: "RANSOMWARE",
        name: "Ransomware rünnak",
        description: "Ransomware'i tuvastamine ja käsitlemine",
        icon: "💀",
        priority: "CRITICAL",
        quickActions: [
            { id: 1, title: "Isoleeri kohe nakatunud süsteemid", type: "ACTION" },
            { id: 2, title: "Teavita IT juhti", type: "CALL" },
            { id: 3, title: "ÄRA MAKSA lunaraha ilma juhtkonna otsuseta", type: "ACTION" },
            { id: 4, title: "Peata levik segmentide vahel", type: "ACTION" }
        ],
        actionPlan: [
            { id: 1, title: "Isoleeri segmendid viivitamatult", description: "Katkesta nakatunud võrgusegmentide ühendus. Sulge VPN ja kaugjuurdepääsud." },
            { id: 2, title: "Peata levik", description: "Tuvasta kahtlased protsessid, blokeeri C2 serverid, sulge lateral movement võimalused." },
            { id: 3, title: "Kinnita varukoopia tervis", description: "Kontrolli kas varukoopiaid pole krüpteeritud. Katkesta varukoopia võrgust." },
            { id: 4, title: "Kooskõlasta tootmisjuhiga", description: "Hinda tootmise mõju, korrasta OT süsteemide taastamise prioriteedid." },
            { id: 5, title: "Otsusta taastamisstrateegia", description: "Backup restore vs fresh install. Mitte maksta lunaraha ilma juhatuse nõusolekuta." },
            { id: 6, title: "Teavita CERT-EE ja koguge tõendid", description: "Salvesta logid, IOC'd, malware sample'id. Teavita CERT-EE viivitamatult." }
        ],
        communications: [
            { id: 1, title: "Teavita juhtkonda KOHE", channel: "CALL", template: "KRIITILINE: Ransomware tuvastatud. War room vajalik viivitamatult." },
            { id: 2, title: "Teavita CERT-EE", channel: "CALL", phone: "+372 663 0299" }
        ],
        contacts: ["4", "1", "3", "7"]
    },
    {
        id: "REMOTE_ACCESS_COMPROMISE",
        name: "Kaugjuurdepääsu kompromiteerimine",
        description: "VPN või kaugjuurdepääsu kontode kompromiteerimine",
        icon: "🌐",
        priority: "HIGH",
        quickActions: [
            { id: 1, title: "Sulge VPN/remote gateway", type: "ACTION" },
            { id: 2, title: "Vaheta võtmekontod", type: "ACTION" },
            { id: 3, title: "Teavita IT juhti", type: "CALL" },
            { id: 4, title: "Kontrolli logid", type: "ACTION" }
        ],
        actionPlan: [
            { id: 1, title: "Sulge kompromiteeritud kaugjuurdepääs", description: "Peata VPN/RDP/SSH juurdepääs kohe. Katkesta aktiivsed seansid." },
            { id: 2, title: "Vaheta võtmekontod ja paroolid", description: "Vaheta kõik admin kontod ja teenuskontod. Rakenda MFA kõigile." },
            { id: 3, title: "Vaata logid läbi", description: "VPN logid, autentimise logid, domeenikontrolleri logid - tuvasta lateraalne liikumine." },
            { id: 4, title: "Kontrolli lateraalset liikumist", description: "Kas ründaja jõudis teistesse süsteemidesse? Vaata AD, server logid, failijagamised." },
            { id: 5, title: "Taasta juurdepääs turvaliselt", description: "Rakenda tugev autentimine (MFA, sertifikaadid), piira IP-d, logi kõik." },
            { id: 6, title: "Teavita tarnijaid", description: "Kui tarnija konto oli kompromiteeritud, teavita tarnijat ja nõua nende poolset uurimist." }
        ],
        communications: [
            { id: 1, title: "Teavita juhtkonda", channel: "CALL" },
            { id: 2, title: "Teavita tarnijat (kui asjakohane)", channel: "EMAIL", template: "Tuvastasime kompromiteeritud kaugjuurdepääsu. Palume teie poolset uurimist." }
        ],
        contacts: ["4", "1", "3", "7"]
    },
    {
        id: "OT_DISRUPTION",
        name: "OT/ICS häire",
        description: "Tööstusvõrkude ja automaatika küberintsident",
        icon: "🏭",
        priority: "CRITICAL",
        quickActions: [
            { id: 1, title: "Eralda OT võrk IT võrgust", type: "ACTION" },
            { id: 2, title: "Mine manual mode protseduurile", type: "ACTION" },
            { id: 3, title: "Teavita tootmisjuhti ja IT juhti", type: "CALL" },
            { id: 4, title: "Kaasa seadmetarnija", type: "CALL" }
        ],
        actionPlan: [
            { id: 1, title: "Eralda OT/IT segmendid", description: "Katkesta OT ja IT võrkide vaheline ühendus füüsiliselt kui vajalik." },
            { id: 2, title: "Aktiveeri manual mode", description: "Mine üle käsitsi juhtimisele vastavalt BCP protseduurile. Kaasa tootmisjuht." },
            { id: 3, title: "Kaasa seadmetarnija ja tootmisjuht", description: "OT süsteemide analüüs vajab seadmetarnija ekspertiisi. Kooskõlasta taastamine tootmisjuhiga." },
            { id: 4, title: "Hinda ohutusriski", description: "Kas automaatika seiskumine ohustab inimeste või keskkonna ohutust?" },
            { id: 5, title: "Kontrolli SCADA/TOS süsteeme", description: "Kas süsteemid on nakatunud või ainult ühendus katkenud? Vaata logid, kontrolli firmware." },
            { id: 6, title: "Taasta kontrollitult", description: "Ära taasta OT süsteeme enne täielikku analüüsi ja puhastust. Valideeri kõik sammud." }
        ],
        communications: [
            { id: 1, title: "Teavita juhtkonda ja tootmist", channel: "CALL", template: "OT süsteemid häiritud. Manual mode aktiveeritud." },
            { id: 2, title: "Teavita seadmetarnijat", channel: "CALL" }
        ],
        contacts: ["4", "3", "1", "7"]
    }

];

// Plans - HOLP ja alamplaanid
const plans = [
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
