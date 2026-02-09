/**
 * Estonian (ET) translations
 * BCM App - Business Continuity Management
 */

export const et = {
  common: {
    select: "Vali...",
    yes: "Jah",
    no: "Ei",
    name: "Nimi",
    save: "Salvesta",
    saved: "✓ Salvestatud!",
    cancel: "Tühista",
    undefined: "Määramata"
  },

  home: {
    status: {
      normal: "OLUKORD: TAVAPÄRANE",
      active: "AKTIIVSED INTSIDENDID: {count}"
    },
    card: {
      openIncident: {
        title: "AVA INTSIDENT",
        description: "Vali hädaolukorra stsenaarium"
      },
      plans: {
        title: "Plaanid",
        description: "Business Continuity plaanide vaatamine ja otsing"
      },
      contacts: {
        title: "Kriitilised kontaktid",
        description: "Kriitilised kontaktid ja kommunikatsioon"
      },
      communication: {
        title: "Kommunikatsioon",
        description: "Kommunikatsiooni plaanid ja kanalid"
      },
      incidents: {
        title: "Logid & Intsidendid",
        description: "Intsidentide jälgimine ja raporteerimine"
      }
    }
  },

  contacts: {
    title: "Kriitilised kontaktid",
    filter: {
      all: "Kõik",
      port: "Sadam"
    },
    count: {
      found: "{count} kontakti leitud"
    }
  },

  contact: {
    action: {
      call: "Helista",
      sms: "SMS",
      email: "E-post",
      callMessage: "Helistatakse numbrile: {phone}",
      smsMessage: "Saadetakse SMS numbrile: {phone}",
      emailMessage: "Saadetakse e-post aadressile: {email}"
    }
  },

  plans: {
    title: "Business Continuity Plaanid",
    empty: "Plaane pole veel lisatud",
    version: "Versioon {version}",
    validUntil: "Kehtib kuni {date}",
    annexes: {
      count: "{count} lisa(t)"
    }
  },

  plan: {
    detail: {
      description: "Kirjeldus",
      scope: "Ulatus",
      documentNumber: "Dokumendi number:",
      validFrom: "Kehtiv alates:",
      validUntil: "Kehtiv kuni:",
      lastReviewed: "Viimati üle vaadatud:",
      annexes: "Lisad",
      relatedScenarios: "Seotud stsenaariumid"
    },
    action: {
      downloadPdf: "Laadi alla PDF",
      close: "Sulge",
      downloadPdfMessage: "PDF allalaadimine: {title}"
    }
  },

  communication: {
    title: "Kommunikatsioon",
    channels: {
      title: "Kommunikatsiooni kanalid",
      description: "Erinevad kommunikatsiooni meetodid kriisiolukorras kasutamiseks.",
      templatesAvailable: "Mallid ja kontroll-nimekirjad saadaval"
    },
    channel: {
      sms: "Massiteavitus (SMS)",
      smsDescription: "SMS kõigile töötajatele",
      phonechain: "Kõnekett",
      phonechainDescription: "Järjestikused telefonikõned",
      email: "E-post",
      emailDescription: "E-posti grupid ja mallid",
      radiosat: "Raadio/Sat",
      radiosatDescription: "Alternatiivsed kanalid",
      teams: "Teams/Chat",
      teamsDescription: "Digitaalsed suhtluskanalid"
    }
  },

  crisis: {
    header: {
      title: "AVA INTSIDENT",
      description: "Vali hädaolukorra stsenaarium"
    },
    button: {
      active: "INTSIDENT AKTIIVNE",
      open: "Ava intsident"
    },
    banner: {
      active: "INTSIDENT KÄSITLEMISEL - KLIKKA LÕPETAMISEKS"
    },
    log: {
      opened: "Intsidendi halduse vaade avatud",
      closed: "Intsidendi halduse vaade suletud",
      created: "Intsident loodud: {scenario} ({mode})",
      openedScenario: "Avatud stsenaarium: {scenario}",
      checked: "✔ {title}",
      unchecked: "Eemaldatud linnuke: {title}"
    },
    confirm: {
      close: "Kas oled kindel, et soovid intsidendi halduse vaate sulgeda?"
    },
    warning: {
      notOpen: "⚠️ Intsident pole avatud!",
      checklistSave: "Checklistid salvestuvad ainult siis, kui intsident on aktiivne.",
      saveFirst: "Andmete salvestamiseks ava esmalt intsident."
    }
  },

  incident: {
    status: {
      active: "AKTIIVNE",
      contained: "OHJELDATUD",
      resolved: "LAHENDATUD",
      closed: "SULETUD"
    },
    severity: {
      critical: "KRIITILINE",
      high: "KÕRGE",
      medium: "KESKMINE",
      low: "MADAL"
    },
    type: {
      exercise: "ÕPPUS",
      real: "PÄRIS",
      cyber: "KÜBER",
      cyberFull: "Küberintsident",
      physical: "FÜÜSILINE",
      physicalFull: "Füüsiline"
    },
    notification: {
      certee: "CERT-EE ✓"
    },
    progress: "{progress}% valmis",
    progressSteps: "{completed}/{total} sammud",
    tab: {
      overview: "📊 Ülevaade",
      timeline: "⏰ Timeline",
      actions: "☑️ Tegevused",
      notifications: "📢 Teavitused",
      coming: "Tab sisu tuleb varsti..."
    },
    export: "📄 Eksport",
    updateStatus: "✏️ Uuenda staatus",
    close: "🔒 Sulge intsident",
    notFound: "Intsidenti ei leitud!",
    save: "💾 SALVESTA",
    closed: "Intsident suletud",
    opened: "Intsident avatud",
    overview: {
      basicInfo: "📊 Põhiinfo",
      t0: "t0 (Tuvastamine):",
      commander: "Incident Commander:",
      type: "Tüüp:",
      exercise: "Õppus:",
      impact: "💻 Mõju",
      affectedSystems: "Mõjutatud süsteemid:",
      affectedSystemsPlaceholder: "Iga süsteem eraldi real",
      disruption: "Teenuse katkestus",
      dataBreach: "Andmeleke kahtlus"
    },
    metrics: {
      title: "📊 Intsidenti mõõtmed",
      t0: {
        label: "t0 (avastamise aeg)",
        now: "Määra praegune aeg"
      },
      slevel: {
        label: "S-tase (klassifikatsioon)"
      },
      domain: {
        label: "Mõjutatud domeen",
        both: "Mõlemad",
        unknown: "Teadmata"
      },
      disruption: {
        label: "Teenuse seiskus?",
        partial: "Osaline"
      },
      dataBreach: {
        label: "Andmeleke kahtlus?"
      },
      spread: {
        label: "Leviku staatus",
        ongoing: "Käib",
        limited: "Piiratud",
        stopped: "Peatatud"
      },
      description: {
        label: "Lühikirjeldus (1-2 lauset)",
        placeholder: "Kirjelda intsidenti lühidalt..."
      },
      notifications: {
        title: "Teavituste staatus"
      },
      notification: {
        required: "Vajalik?",
        assess: "Hinnata",
        requiredYes: "Vajalik",
        requiredNo: "Pole vaja",
        status: "Staatus",
        statusPlanned: "Planeeritud",
        statusSent: "Saadetud",
        timestamp: "Aeg"
      },
      toggle: {
        show: "▶ Näita lisaväljad",
        hide: "▼ Peida lisaväljad"
      },
      reporter: {
        label: "Raporteerija / teataja",
        placeholder: "Nimi või kontakt"
      },
      systemLocation: {
        label: "Süsteem/teenus/asukoht",
        placeholder: "Näiteks: Server-01, TOS süsteem"
      },
      nis2: {
        label: "NIS2 relevants"
      },
      indicators: {
        label: "Esmased indikaatorid/sümptomid",
        placeholder: "Kirjelda esmased sümptomid..."
      },
      evidence: {
        label: "Tõendid/artefaktid (lingid/ID-d)",
        placeholder: "Näiteks: SIEM alert ID, log faili nimi..."
      },
      logger: {
        label: "Logija (kes kogub ajajoont)"
      },
      save: "💾 Salvesta",
      clear: "🗑️ Tühjenda",
      saved: "Intsidendi mõõtmed salvestatud!",
      cleared: "Intsidendi mõõtmed tühjendatud",
      errorNoScenario: "Palun vali esmalt stsenaarium",
      errorNoSlevel: "Palun vali S-tase"
    },
    actionPlan: {
      title: "📋 Tegevuskava"
    },
    communication: {
      title: "📢 Kommunikatsioon"
    },
    contacts: {
      title: "📞 Kontaktid"
    }
  },

  incidents: {
    title: "Logid & Intsidendid",
    filter: {
      all: "Kõik",
      active: "🔴 Aktiivsed",
      exercise: "🎓 Õppused",
      closed: "✔️ Suletud"
    },
    sort: {
      label: "Sorteeri:",
      dateDesc: "Uusim enne",
      dateAsc: "Vanim enne",
      severity: "Tõsiduse järgi",
      status: "Staatuse järgi"
    },
    exportAll: "📄 Ekspordi kõik",
    empty: "Intsidente pole veel"
  },

  log: {
    title: "Sündmuste Logi",
    export: "Ekspordi",
    empty: "Logis pole veel kirjeid",
    badgeExercise: "[ÕPPUS]",
    metricsTitle: "📊 Intsidenti mõõtmed",
    notificationsTitle: "Teavituste staatus:",
    reporter: "Raporteerija:",
    system: "Süsteem:",
    logger: "Logija:",
    notificationRequired: "⚠️ Vajalik",
    action: {
      view: "🕐️ Vaata",
      close: "✔ Sulge intsident",
      reopen: "↻ Ava uuesti",
      delete: "🗑️ Kustuta"
    },
    notFound: "Logikirjet ei leitud",
    details: "Logikirje detailid:",
    deleted: "Logikirje kustutatud",
    event: {
      deleted: "Logikirje kustutatud: {id}",
      closed: "Intsident suletud: {id}",
      reopened: "Intsident avatud uuesti: {id}"
    },
    filenameTitle: "BCM Sündmuste Logi",
    exported: "Eksporditud: {date}",
    scenario: "Stsenaarium: {name}",
    notSelected: "Pole valitud"
  },

  report: {
    incidentsTitle: "BCM INTSIDENTIDE KOONDRAPORT",
    header: {
      exported: "Eksporditud: {date}",
      total: "Kokku intsidente: {count}"
    },
    incident: {
      status: "Staatus: {status}",
      time: "Aeg: {time}",
      type: "Tüüp: {type}",
      exercise: "Õppus: {value}"
    },
    type: {
      cyber: "Küber",
      physical: "Füüsiline"
    }
  },

  gate: {
    title: "Kas avada intsident?",
    scenario: "Stsenaarium:",
    mode: {
      label: "Vali režiim:",
      incident: "INTSIDENT",
      incidentIcon: "🔴",
      exercise: "ÕPPUS",
      exerciseIcon: "🎓"
    },
    action: {
      cancel: "TÜHISTA",
      open: "AVA"
    }
  },

  faas2: {
    dialogTitle: "Ava uus intsident",
    dialogScenario: "Stsenaarium:",
    dialogMode: "Režiim:",
    mode: {
      real: "REAL",
      training: "TRAINING",
      realDescription: "Päris intsident - kajastub süsteemis reaalsena",
      realMessage: "Päris intsident - kajastub süsteemis reaalsena",
      trainingDescription: "Õppus/Treening - märgitud õppusena",
      trainingMessage: "Õppus/Treening - märgitud õppusena"
    },
    confirmCreate: "Kas oled kindel, et soovid luua uue intsidendi?",
    actionConfirm: "Kinnita ja loo intsident"
  },

  system: {
    modalTitle: "Määra süsteemi olek",
    status: {
      ok: "OK",
      okDescription: "Süsteemid töötavad tavapäraselt",
      warning: "HOIATUS",
      warningDescription: "Väike häire või õppus",
      alert: "HÄIRE",
      alertDescription: "Kriitiline olukord"
    },
    manual: {
      reason: "Põhjus (max 120 tähemärki):",
      reasonPlaceholder: "Kirjelda lühidalt olukorda...",
      note: "Märkus:",
      noteText: "Käsitsi määratud olek kehtib kuni taastamiseni või kuni tekib S0/S1 pärisintsident.",
      reset: "Taasta automaatne olek"
    }
  },

  confirm: {
    deleteLog: "Kas oled kindel, et soovid selle logikirje kustutada?",
    closeIncident: "Kas oled kindel, et soovid selle intsidendi sulgeda?",
    reopenIncident: "Kas oled kindel, et soovid selle intsidendi uuesti avada?"
  },

  error: {
    scenarioNotFound: "Stsenaariumi ei leitud"
  },

  comm: {
    channel: {
      sms: "SMS teavitus",
      call: "Telefoni kõne",
      email: "E-posti teavitus"
    }
  },

  priority: {
    critical: "Kriitiline",
    high: "Kõrge",
    medium: "Keskmine",
    low: "Madal"
  },

  slevel: {
    s0: {
      name: "KRIITILINE",
      description: "OT/terminali põhiprotsess seiskub; ransomware",
      response: "≤15 min",
      containment: "≤1 h",
      nis2: "TÕENÄOLINE"
    },
    s1: {
      name: "KÕRGE",
      description: "Oluline teenusehäire; kinnitatud pahavara",
      response: "≤30 min",
      containment: "≤4 h",
      nis2: "VÕIMALIK"
    },
    s2: {
      name: "KESKMINE",
      description: "Piiratud intsident ühes süsteemis",
      response: "≤2 h",
      containment: "≤24 h",
      nis2: "EBAUSUTAV"
    },
    s3: {
      name: "MADAL",
      description: "Turvasündmus/hoiatus, false positive",
      response: "≤24 h",
      containment: "≤48 h",
      nis2: "EI"
    }
  }
};
