/**
 * English (EN) translations
 * BCM App - Business Continuity Management
 */

export const en = {
  common: {
    select: "Select...",
    yes: "Yes",
    no: "No",
    name: "Name",
    save: "Save",
    saved: "✓ Saved!",
    cancel: "Cancel",
    undefined: "Undefined"
  },

  home: {
    status: {
      normal: "STATUS: NORMAL",
      active: "ACTIVE INCIDENTS: {count}"
    },
    card: {
      openIncident: {
        title: "OPEN INCIDENT",
        description: "Select emergency scenario"
      },
      plans: {
        title: "Plans",
        description: "View and search Business Continuity plans"
      },
      contacts: {
        title: "Critical Contacts",
        description: "Critical contacts and communication"
      },
      communication: {
        title: "Communication",
        description: "Communication plans and channels"
      },
      incidents: {
        title: "Logs & Incidents",
        description: "Incident tracking and reporting"
      }
    },
    confirm: {
      open: "Are you sure you want to open a new incident?",
      mode: "Do you want to open the new incident in REAL mode?\n\nOK = REAL\nCancel = TRAINING"
    }
  },

  contacts: {
    title: "Critical Contacts",
    filter: {
      all: "All",
      port: "Port"
    },
    count: {
      found: "{count} contacts found"
    }
  },

  contact: {
    action: {
      call: "Call",
      sms: "SMS",
      email: "Email",
      callMessage: "Calling: {phone}",
      smsMessage: "Sending SMS to: {phone}",
      emailMessage: "Sending email to: {email}"
    }
  },

  plans: {
    title: "Business Continuity Plans",
    empty: "No plans added yet",
    version: "Version {version}",
    validUntil: "Valid until {date}",
    annexes: {
      count: "{count} annex(es)"
    }
  },

  plan: {
    detail: {
      description: "Description",
      scope: "Scope",
      documentNumber: "Document number:",
      validFrom: "Valid from:",
      validUntil: "Valid until:",
      lastReviewed: "Last reviewed:",
      annexes: "Annexes",
      relatedScenarios: "Related scenarios"
    },
    action: {
      downloadPdf: "Download PDF",
      close: "Close",
      downloadPdfMessage: "PDF download: {title}"
    }
  },

  communication: {
    title: "Communication",
    channels: {
      title: "Communication Channels",
      description: "Different communication methods for use in crisis situations.",
      templatesAvailable: "Templates and checklists available"
    },
    channel: {
      sms: "Mass Notification (SMS)",
      smsDescription: "SMS to all employees",
      phonechain: "Phone Chain",
      phonechainDescription: "Sequential phone calls",
      email: "Email",
      emailDescription: "Email groups and templates",
      radiosat: "Radio/Sat",
      radiosatDescription: "Alternative channels",
      teams: "Teams/Chat",
      teamsDescription: "Digital communication channels"
    }
  },

  crisis: {
    header: {
      title: "OPEN INCIDENT",
      description: "Select emergency scenario"
    },
    button: {
      active: "INCIDENT ACTIVE",
      open: "Open incident"
    },
    banner: {
      active: "INCIDENT IN PROGRESS - CLICK TO FINISH"
    },
    log: {
      opened: "Incident management view opened",
      closed: "Incident management view closed",
      created: "Incident created: {scenario} ({mode})",
      openedScenario: "Opened scenario: {scenario}",
      checked: "✔ {title}",
      unchecked: "Unchecked: {title}"
    },
    confirm: {
      close: "Are you sure you want to close the incident management view?"
    },
    warning: {
      notOpen: "⚠️ Incident not open!",
      checklistSave: "Checklists are saved only when incident is active.",
      saveFirst: "Open incident first to save data."
    }
  },

  incident: {
    status: {
      active: "ACTIVE",
      contained: "CONTAINED",
      resolved: "RESOLVED",
      closed: "CLOSED"
    },
    severity: {
      critical: "CRITICAL",
      high: "HIGH",
      medium: "MEDIUM",
      low: "LOW"
    },
    type: {
      exercise: "EXERCISE",
      real: "REAL",
      cyber: "CYBER",
      cyberFull: "Cyber Incident",
      physical: "PHYSICAL",
      physicalFull: "Physical"
    },
    notification: {
      certee: "CERT-EE ✓"
    },
    progress: "{progress}% complete",
    progressSteps: "{completed}/{total} steps",
    tab: {
      overview: "📊 Overview",
      timeline: "⏰ Timeline",
      actions: "☑️ Actions",
      notifications: "📢 Notifications",
      coming: "Tab content coming soon..."
    },
    export: "📄 Export",
    updateStatus: "✏️ Update status",
    close: "🔒 Close incident",
    notFound: "Incident not found!",
    save: "💾 SAVE",
    closed: "Incident closed",
    opened: "Incident opened",
    overview: {
      basicInfo: "📊 Basic Information",
      t0: "t0 (Discovery):",
      commander: "Incident Commander:",
      type: "Type:",
      exercise: "Exercise:",
      impact: "💻 Impact",
      affectedSystems: "Affected systems:",
      affectedSystemsPlaceholder: "Each system on separate line",
      disruption: "Service disruption",
      dataBreach: "Data breach suspected"
    },
    metrics: {
      title: "📊 Incident Metrics",
      t0: {
        label: "t0 (discovery time)",
        now: "Set current time"
      },
      slevel: {
        label: "S-level (classification)"
      },
      domain: {
        label: "Affected domain",
        both: "Both",
        unknown: "Unknown"
      },
      disruption: {
        label: "Service disruption?",
        partial: "Partial"
      },
      dataBreach: {
        label: "Data breach suspected?"
      },
      spread: {
        label: "Spread status",
        ongoing: "Ongoing",
        limited: "Limited",
        stopped: "Stopped"
      },
      description: {
        label: "Short description (1-2 sentences)",
        placeholder: "Describe incident briefly..."
      },
      notifications: {
        title: "Notification Status"
      },
      notification: {
        required: "Required?",
        assess: "Assess",
        requiredYes: "Required",
        requiredNo: "Not required",
        status: "Status",
        statusPlanned: "Planned",
        statusSent: "Sent",
        statusNotNeeded: "Not needed",
        management: "Management",
        timestamp: "Time"
      },
      toggle: {
        show: "▶ Show additional fields",
        hide: "▼ Hide additional fields"
      },
      reporter: {
        label: "Reporter / informant",
        placeholder: "Name or contact"
      },
      systemLocation: {
        label: "System/service/location",
        placeholder: "E.g.: Server-01, TOS system"
      },
      nis2: {
        label: "NIS2 relevance"
      },
      indicators: {
        label: "Initial indicators/symptoms",
        placeholder: "Describe initial symptoms..."
      },
      evidence: {
        label: "Evidence/artifacts (links/IDs)",
        placeholder: "E.g.: SIEM alert ID, log filename..."
      },
      logger: {
        label: "Logger (who maintains timeline)"
      },
      save: "💾 Save",
      clear: "🗑️ Clear",
      saved: "Incident metrics saved!",
      cleared: "Incident metrics cleared",
      errorNoScenario: "Please select scenario first",
      errorNoSlevel: "Please select S-level",
      clearConfirm: "Are you sure you want to clear the form?"
    },
    quickActions: {
      title: "⚡ Quick Actions"
    },
    actionPlan: {
      title: "📋 Action Plan"
    },
    communication: {
      title: "📢 Communication"
    },
    contacts: {
      title: "📞 Contacts"
    },
    detail: {
      team: "👥 Team",
      teamMembers: "Team members:",
      teamPlaceholder: "Each member on separate line",
      summary: "📝 Summary",
      summaryPlaceholder: "Incident summary",
      done: "{completed} / {total} done",
      previewWarning: "⚠️ PREVIEW — Incident not open. Fields are locked.",
      closedInfo: "🔒 Incident is CLOSED. Fields are not editable.",
      timelineEmpty: "Timeline is empty",
      notifiedStatus: "✅ Notified",
      pendingStatus: "⏳ Pending",
      notRequiredStatus: "➖ Not required",
      dpo: "Data Protection Officer (DPO)",
      notifTime: "Time:",
      notifMethod: "Method:",
      statusDialogTitle: "Change incident status",
      currentStatus: "Current status:",
      newStatus: "New status:",
      statusReason: "Reason (required, min 5 characters):",
      statusReasonPlaceholder: "Describe why you are changing the status...",
      reasonError: "Reason must be at least 5 characters long",
      sameStatus: "New status is the same as current!",
      closeDialogTitle: "Close incident",
      incidentLabel: "Incident:",
      idLabel: "ID:",
      closeReason: "Reason for closing (required, min 5 characters):",
      closeReasonPlaceholder: "Describe why you are closing the incident...",
      closeConfirm: "Are you sure you want to close this incident?",
      alertNotFound: "Error: Incident not found!",
      alertCannotEditClosed: "❌ A CLOSED incident cannot be edited!",
      alertNotOpen: "⚠️ Incident not open! Open the incident before making changes.",
      alertSaved: "✅ Changes saved!",
      alertExported: "Incident exported!",
      alertClosed: "Incident closed!",
      user: "User",
      actionDetailUpdated: "Incident details updated",
      actionStatusChanged: "Status changed: {status} - {reason}",
      actionClosed: "Incident closed: {reason}"
    }
  },

  incidents: {
    title: "Logs & Incidents",
    filter: {
      all: "All",
      active: "🔴 Active",
      exercise: "🎓 Exercises",
      closed: "✔️ Closed"
    },
    sort: {
      label: "Sort:",
      dateDesc: "Newest first",
      dateAsc: "Oldest first",
      severity: "By severity",
      status: "By status"
    },
    exportAll: "📄 Export all",
    empty: "No incidents yet"
  },

  log: {
    title: "Event Log",
    export: "Export",
    empty: "No entries in log yet",
    badgeExercise: "[EXERCISE]",
    metricsTitle: "📊 Incident Metrics",
    notificationsTitle: "Notification status:",
    reporter: "Reporter:",
    system: "System:",
    logger: "Logger:",
    notificationRequired: "⚠️ Required",
    action: {
      view: "🕐️ View",
      close: "✔ Close incident",
      reopen: "↻ Reopen",
      delete: "🗑️ Delete"
    },
    notFound: "Log entry not found",
    details: "Log entry details:",
    deleted: "Log entry deleted",
    event: {
      deleted: "Log entry deleted: {id}",
      closed: "Incident closed: {id}",
      reopened: "Incident reopened: {id}"
    },
    filenameTitle: "BCM Event Log",
    exported: "Exported: {date}",
    scenario: "Scenario: {name}",
    notSelected: "Not selected",
    createdLabel: "Created:",
    updatedLabel: "Updated:",
    exportEvent: "Log exported",
    callMade: "Called: {phone}",
    slevelSelected: "S-level selected: {level}",
    t0Set: "t0 set to current time"
  },

  report: {
    incidentsTitle: "BCM INCIDENTS SUMMARY REPORT",
    header: {
      exported: "Exported: {date}",
      total: "Total incidents: {count}"
    },
    incident: {
      status: "Status: {status}",
      time: "Time: {time}",
      type: "Type: {type}",
      exercise: "Exercise: {value}"
    },
    type: {
      cyber: "Cyber",
      physical: "Physical"
    }
  },

  gate: {
    title: "Open incident?",
    scenario: "Scenario:",
    mode: {
      label: "Select mode:",
      incident: "INCIDENT",
      incidentIcon: "🔴",
      exercise: "EXERCISE",
      exerciseIcon: "🎓"
    },
    action: {
      cancel: "CANCEL",
      open: "OPEN"
    },
    banner: {
      active: "ACTIVE INCIDENT",
      startedAt: "Started:",
      preview: "PREVIEW — INCIDENT NOT OPEN",
      openAction: "OPEN INCIDENT"
    }
  },

  faas2: {
    dialogTitle: "Open new incident",
    dialogScenario: "Scenario:",
    dialogMode: "Mode:",
    mode: {
      real: "REAL",
      training: "TRAINING",
      realDescription: "Real incident - appears as real in system",
      realMessage: "Real incident - appears as real in system",
      trainingDescription: "Exercise/Training - marked as exercise",
      trainingMessage: "Exercise/Training - marked as exercise"
    },
    confirmCreate: "Are you sure you want to create a new incident?",
    actionConfirm: "Confirm and create incident"
  },

  system: {
    modalTitle: "Set system status",
    selectStatus: "Please select a status",
    reasonRequired: "Please enter a reason",
    status: {
      ok: "OK",
      okDescription: "Systems operating normally",
      warning: "WARNING",
      warningDescription: "Minor disruption or exercise",
      alert: "ALERT",
      alertDescription: "Critical situation"
    },
    manual: {
      reason: "Reason (max 120 characters):",
      reasonPlaceholder: "Describe situation briefly...",
      note: "Note:",
      noteText: "Manually set status remains until reset or until S0/S1 real incident occurs.",
      reset: "Restore automatic status"
    }
  },

  confirm: {
    deleteLog: "Are you sure you want to delete this log entry?",
    closeIncident: "Are you sure you want to close this incident?",
    reopenIncident: "Are you sure you want to reopen this incident?"
  },

  error: {
    scenarioNotFound: "Scenario not found"
  },

  comm: {
    channel: {
      sms: "SMS notification",
      call: "Phone call",
      email: "Email notification"
    },
    sendSms: "SMS will be sent:\n\n{template}",
    sendEmail: "Email will be sent:\n\nSubject: {subject}\n\n{body}",
    emailTemplateFallback: "Template will be sent..."
  },

  priority: {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low"
  },

  slevel: {
    s0: {
      name: "CRITICAL",
      description: "OT/terminal main process halts; ransomware",
      response: "≤15 min",
      containment: "≤1 h",
      nis2: "LIKELY"
    },
    s1: {
      name: "HIGH",
      description: "Critical service disruption; confirmed malware",
      response: "≤30 min",
      containment: "≤4 h",
      nis2: "POSSIBLE"
    },
    s2: {
      name: "MEDIUM",
      description: "Limited incident in one system",
      response: "≤2 h",
      containment: "≤24 h",
      nis2: "UNLIKELY"
    },
    s3: {
      name: "LOW",
      description: "Security event/alert, false positive",
      response: "≤24 h",
      containment: "≤48 h",
      nis2: "NO"
    }
  }
};
