# Backend Structure & Data Layer

## JUHISED

**Mida see dokument teeb:**
This document defines the "backend" of our application - which is actually a LocalStorage-based data layer. It covers entity schemas, CRUD operations, data validation, status transitions, migration strategies, and data integrity rules. This is the "HOW data is stored and manipulated" documentation.

**Kuidas seda kasutada:**
- **Developers**: Reference this when implementing data operations (create, read, update, delete)
- **When adding new entities**: Define schema here first, then implement in code
- **When modifying data structures**: Plan migration strategy here before changing code
- **When debugging data issues**: Check schemas and validation rules here

**Mida see peab sisaldama:**
1. Storage Architecture (LocalStorage structure)
2. Entity Schemas (Incident, Log, Settings, etc.)
3. CRUD Operations (how to create, read, update, delete)
4. Data Validation Rules
5. Status Transitions & State Machine
6. Data Migration Strategy
7. Error Handling & Recovery
8. Data Export/Import Format

**Mida see ei sisalda (see on teistes failides):**
- Business requirements → see PRD.md
- User-facing workflows → see APP_FLOW.md
- UI components → see FRONTEND_GUIDELINES.md
- Technology choices → see TECH_STACK.md

---

## Storage Architecture

### LocalStorage Keys
The application uses three primary LocalStorage keys:

| Key | Purpose | Data Type | Example Size |
|-----|---------|-----------|--------------|
| `bcm_incidents` | All incident records | JSON Array | ~5KB per 10 incidents |
| `bcm_log` | Activity log entries | JSON Array | ~2KB per 100 entries |
| `bcm_settings` | User preferences | JSON Object | < 1KB |

### Data Access Pattern
```javascript
// Read
const incidents = JSON.parse(localStorage.getItem('bcm_incidents') || '[]');

// Write
localStorage.setItem('bcm_incidents', JSON.stringify(incidents));

// Delete
localStorage.removeItem('bcm_incidents');
```

### Storage Limits & Monitoring
- **Quota**: ~5-10MB per origin (browser-dependent)
- **Monitoring**: No automatic monitoring (manual check if needed)
- **Overflow Handling**: Display error to user if quota exceeded
- **Data Cleanup**: No automatic cleanup (user must manually close/delete old incidents)

### SessionStorage Keys
Used for temporary, session-only state:

| Key | Purpose | Cleared When |
|-----|---------|--------------|
| `faas2_incident_flow` | Tracks "new incident" workflow state | Tab closed |
| `faas2_selected_scenario` | Stores selected scenario during creation | Tab closed |
| `faas2_incident_mode` | Stores REAL/TRAINING choice | Tab closed |

---

## Entity Schemas

### Incident Entity
**Primary Entity**: Represents a single business continuity incident.

```javascript
{
  // Unique identifier
  "id": "INC-20260204-0001",              // String, format: INC-YYYYMMDD-NNNN

  // Core metadata
  "type": "IT_INCIDENT",                  // String, scenario type
  "scenarioId": "scenario_1",             // String, reference to scenario
  "scenarioName": "IT Süsteemi Rike",    // String, human-readable name
  "status": "ACTIVE",                     // Enum: ACTIVE | CONTAINED | RESOLVED | CLOSED
  "mode": "REAL",                         // Enum: REAL | TRAINING

  // Timestamps
  "createdAt": "2026-02-04T10:30:00Z",   // ISO 8601 string
  "updatedAt": "2026-02-04T11:45:00Z",   // ISO 8601 string
  "closedAt": null,                       // ISO 8601 string or null

  // Optional metadata
  "title": "Server outage",               // String, optional custom title
  "description": "Production DB down",    // String, optional description

  // Structured data
  "metrics": {                            // Object, triage form data
    "impactLevel": "HIGH",                // HIGH | MEDIUM | LOW
    "affectedUsers": 500,                 // Number
    "estimatedDuration": "4 hours",       // String
    "notes": "Database corruption"        // String
  },

  "checklist": {                          // Object, checklist progress
    "immediate": { "completed": 3, "total": 5 },
    "recovery": { "completed": 0, "total": 7 }
  },

  "timeline": [                           // Array of action objects
    {
      "timestamp": "2026-02-04T10:30:00Z",
      "action": "Incident created",
      "type": "SYSTEM",                   // SYSTEM | ACTION | PROGRESS | STATUS
      "user": null                        // String or null (future: username)
    },
    {
      "timestamp": "2026-02-04T10:35:00Z",
      "action": "Emergency team notified",
      "type": "ACTION",
      "user": null
    }
  ]
}
```

**Schema Rules:**
- `id` is auto-generated, immutable, unique
- `status` must be valid enum value
- `mode` is set at creation, cannot be changed
- `createdAt` is set at creation, immutable
- `updatedAt` is updated on every modification
- `closedAt` is set when status changes to CLOSED
- `timeline` is append-only (never delete entries)

### Log Entity
**Purpose**: System-wide activity log for auditing and debugging.

```javascript
{
  "timestamp": "2026-02-04T10:30:00Z",   // ISO 8601 string
  "type": "SYSTEM_EVENT",                 // Enum: SYSTEM_EVENT | ACTION | ERROR
  "message": "Intsident loodud: INC-20260204-0001 - IT Süsteemi Rike",
  "incidentId": "INC-20260204-0001",     // String or null (if not incident-specific)
  "details": null                         // Object or null (additional context)
}
```

**Log Types:**
- `SYSTEM_EVENT`: Incident creation, status changes, app initialization
- `ACTION`: User actions (checklist updates, form submissions)
- `ERROR`: Runtime errors, validation failures

**Storage:**
- Logs are stored in chronological order (array)
- Maximum size: ~1000 entries (oldest entries may be pruned if needed)
- No log editing or deletion (append-only)

### Settings Entity
**Purpose**: User preferences and application configuration.

```javascript
{
  "version": "0.2",                      // String, app version
  "theme": "light",                      // String, future: "light" | "dark"
  "language": "et",                      // String, "et" | "en"
  "exerciseMode": false,                 // Boolean, deprecated (now per-incident)
  "lastExportDate": "2026-02-04T12:00:00Z", // ISO 8601 string or null
  "preferences": {
    "showClosedIncidents": false,        // Boolean, incidents list filter default
    "confirmBeforeClose": true           // Boolean, show confirmation dialogs
  }
}
```

**Default Settings:**
If `bcm_settings` key doesn't exist, use these defaults:
```javascript
{
  "version": "0.2",
  "theme": "light",
  "language": "et",
  "exerciseMode": false,
  "preferences": {
    "showClosedIncidents": false,
    "confirmBeforeClose": true
  }
}
```

---

## CRUD Operations

### Create Operations

#### Create Incident
**Function**: `createIncident(scenarioId, scenarioData)`
**Location**: `src/data/incidents.js`

**Process:**
1. Generate unique ID (format: `INC-YYYYMMDD-NNNN`)
2. Set status = ACTIVE
3. Set mode from sessionStorage (`faas2_incident_mode`)
4. Set timestamps (createdAt, updatedAt)
5. Initialize empty timeline with creation event
6. Initialize empty metrics and checklist
7. Return incident object

**Code Example:**
```javascript
export function createIncident(scenarioId, scenarioData) {
  const id = generateIncidentId();
  const mode = sessionStorage.getItem('faas2_incident_mode') || 'REAL';

  return {
    id,
    type: scenarioData.type,
    scenarioId,
    scenarioName: scenarioData.name,
    status: 'ACTIVE',
    mode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    closedAt: null,
    title: null,
    description: null,
    metrics: {},
    checklist: {},
    timeline: [{
      timestamp: new Date().toISOString(),
      action: 'Incident created',
      type: 'SYSTEM',
      user: null
    }]
  };
}
```

#### Save Incident
**Function**: `saveIncident(incident)`
**Location**: `src/data/incidents.js`

**Process:**
1. Load existing incidents array from LocalStorage
2. Check if incident ID already exists
3. If exists: update (replace), else: append
4. Save updated array back to LocalStorage
5. Trigger refresh hooks (updateHomeStatusAndList, updateIncidentsBadge)

#### Add Log Entry
**Function**: `addToLog(type, message, incidentId, details)`
**Location**: `src/utils/logger.js`

**Process:**
1. Load existing log array from LocalStorage
2. Create new log entry with timestamp
3. Append to array
4. If array length > 1000, remove oldest entries
5. Save back to LocalStorage

### Read Operations

#### Load Incidents
**Function**: `loadIncidents()`
**Location**: `src/data/incidents.js`

**Process:**
1. Read `bcm_incidents` from LocalStorage
2. Parse JSON (handle parse errors)
3. Validate array type
4. Return array (or empty array if invalid/missing)

**Code Example:**
```javascript
export function loadIncidents() {
  try {
    const raw = localStorage.getItem('bcm_incidents');
    const incidents = JSON.parse(raw || '[]');
    return Array.isArray(incidents) ? incidents : [];
  } catch (error) {
    console.error('Failed to load incidents:', error);
    return [];
  }
}
```

#### Get Incident by ID
**Function**: `getIncidentById(id)`
**Location**: `src/data/incidents.js`

**Process:**
1. Load all incidents
2. Find incident with matching ID
3. Return incident object or null

#### Filter Incidents by Status
**Function**: `filterIncidentsByStatus(statusFilter)`
**Location**: `src/pages/IncidentsPage.js`

**Process:**
1. Load all incidents
2. If filter = "NOT_CLOSED": return incidents where status !== CLOSED
3. If filter = "ALL": return all incidents
4. Sort by createdAt descending (newest first)

### Update Operations

#### Update Incident Status
**Function**: `updateIncidentStatus(incidentId, newStatus)`
**Location**: `src/data/incidents.js`

**Process:**
1. Load all incidents
2. Find incident by ID
3. Validate status transition (see State Machine below)
4. Update incident.status
5. Update incident.updatedAt
6. If newStatus = CLOSED: set incident.closedAt
7. Add timeline entry: "Status changed to {newStatus}"
8. Save incidents array
9. Add log entry
10. Trigger refresh hooks

#### Update Incident Checklist
**Function**: `updateChecklistProgress(incidentId, checklistType, completed, total)`
**Location**: `src/data/incidents.js`

**Process:**
1. Load all incidents
2. Find incident by ID
3. Update incident.checklist[checklistType] = { completed, total }
4. Update incident.updatedAt
5. Add timeline entry: "Checklist updated: {checklistType} ({completed}/{total})"
6. Save incidents array

#### Add Incident Action
**Function**: `addIncidentAction(incidentId, actionText, actionType)`
**Location**: `src/data/incidents.js`

**Process:**
1. Load all incidents
2. Find incident by ID
3. Add timeline entry: { timestamp, action: actionText, type: actionType }
4. Update incident.updatedAt
5. Save incidents array

#### Save Incident Metrics
**Function**: `saveIncidentMetrics(incidentId, metricsData)`
**Location**: `src/data/incidents.js`

**Process:**
1. Load all incidents
2. Find incident by ID
3. Update incident.metrics = metricsData
4. Update incident.updatedAt
5. Add timeline entry: "Metrics saved"
6. Save incidents array
7. Trigger refresh hooks

### Delete Operations

#### Close Incident (Soft Delete)
**Function**: `closeIncident(incidentId)`
**Location**: `src/data/incidents.js`

**Process:**
1. Load all incidents
2. Find incident by ID
3. Update status to CLOSED
4. Set closedAt timestamp
5. Add timeline entry: "Incident closed"
6. Save incidents array
7. Trigger refresh hooks

**Note**: We don't hard-delete incidents (remove from array) to preserve history.

#### Hard Delete Incident (Future)
**Not Implemented**: Currently no way to permanently delete incidents.
**Future Consideration**: Add admin function to delete CLOSED incidents older than X months.

---

## Data Validation Rules

### Incident Validation

**Required Fields:**
- `id`: Must be non-empty string in format INC-YYYYMMDD-NNNN
- `status`: Must be one of: ACTIVE, CONTAINED, RESOLVED, CLOSED
- `mode`: Must be one of: REAL, TRAINING
- `createdAt`: Must be valid ISO 8601 timestamp
- `scenarioId`: Must be non-empty string
- `scenarioName`: Must be non-empty string

**Optional Fields:**
- `title`, `description`: Can be null or string
- `metrics`: Can be empty object or object with any keys
- `checklist`: Can be empty object or object with structure: { type: { completed, total } }
- `timeline`: Can be empty array, must be array if present

**Validation Function:**
```javascript
function validateIncident(incident) {
  if (!incident.id || typeof incident.id !== 'string') {
    throw new Error('Invalid incident ID');
  }

  if (!['ACTIVE', 'CONTAINED', 'RESOLVED', 'CLOSED'].includes(incident.status)) {
    throw new Error('Invalid incident status');
  }

  if (!['REAL', 'TRAINING'].includes(incident.mode)) {
    throw new Error('Invalid incident mode');
  }

  if (!incident.createdAt || isNaN(Date.parse(incident.createdAt))) {
    throw new Error('Invalid createdAt timestamp');
  }

  return true;
}
```

### Log Validation

**Required Fields:**
- `timestamp`: Must be valid ISO 8601 timestamp
- `type`: Must be one of: SYSTEM_EVENT, ACTION, ERROR
- `message`: Must be non-empty string

**Optional Fields:**
- `incidentId`: Can be null or valid incident ID
- `details`: Can be null or object

---

## Status Transitions & State Machine

### Incident Status Flow
```
[START] → ACTIVE → CONTAINED → RESOLVED → CLOSED [END]
            ↓          ↓           ↓
            └──────────┴───────────┘
         (Can revert to earlier states)
```

### Valid Transitions

| From Status | To Status | Allowed | Notes |
|-------------|-----------|---------|-------|
| ACTIVE | CONTAINED | ✅ Yes | Incident is being controlled |
| ACTIVE | RESOLVED | ✅ Yes | Quick resolution, skip CONTAINED |
| ACTIVE | CLOSED | ✅ Yes | False alarm, close immediately |
| CONTAINED | RESOLVED | ✅ Yes | Normal progression |
| CONTAINED | ACTIVE | ✅ Yes | Situation worsened |
| CONTAINED | CLOSED | ✅ Yes | Decision to close without full resolution |
| RESOLVED | CLOSED | ✅ Yes | Normal completion |
| RESOLVED | ACTIVE | ✅ Yes | Issue recurred |
| RESOLVED | CONTAINED | ✅ Yes | Issue recurred but not fully active |
| CLOSED | * | ❌ No | Closed is terminal state |

**Implementation:**
```javascript
function isValidStatusTransition(fromStatus, toStatus) {
  // Closed is terminal - cannot transition from CLOSED
  if (fromStatus === 'CLOSED') {
    return false;
  }

  // All other transitions are allowed (flexible workflow)
  return true;
}
```

### Status Definitions

**ACTIVE:**
- Incident is currently happening
- Immediate response required
- Shows in home status box as "active incident"
- Counts toward active incident count

**CONTAINED:**
- Incident is under control but not resolved
- Monitoring and cleanup in progress
- Shows in home status box as "active incident"
- Counts toward active incident count

**RESOLVED:**
- Incident is resolved, awaiting final closure
- Post-incident review may be pending
- Does NOT show in home status box
- Counts toward badge (NOT CLOSED)

**CLOSED:**
- Incident is permanently closed
- No further action required
- Does NOT show in home status box
- Does NOT count toward badge (excluded from NOT CLOSED)

---

## Data Migration Strategy

### Version Tracking
Each schema change requires a version bump in settings:
```javascript
localStorage.setItem('bcm_settings', JSON.stringify({ version: '0.3' }));
```

### Migration Process
1. Check current version in settings
2. If version < target version, run migration scripts
3. Update version number
4. Save migrated data

### Example Migration: v0.2 → v0.3
**Scenario**: Adding `priority` field to incidents

```javascript
function migrateToV3() {
  const settings = JSON.parse(localStorage.getItem('bcm_settings') || '{}');

  if (settings.version === '0.2') {
    // Load incidents
    const incidents = loadIncidents();

    // Add missing field with default value
    const migrated = incidents.map(inc => ({
      ...inc,
      priority: inc.priority || 'MEDIUM' // Default priority
    }));

    // Save migrated data
    localStorage.setItem('bcm_incidents', JSON.stringify(migrated));

    // Update version
    settings.version = '0.3';
    localStorage.setItem('bcm_settings', JSON.stringify(settings));

    console.log('✅ Migrated to v0.3');
  }
}
```

### Backward Compatibility
- New fields must have default values
- Never remove required fields (deprecate instead)
- Old data must remain readable

---

## Error Handling & Recovery

### LocalStorage Quota Exceeded
**Error**: `QuotaExceededError`
**Handling:**
1. Show error message to user: "Mälu täis - kustuta vanad intsidendid"
2. Prevent new incident creation
3. Allow viewing and closing existing incidents
4. Suggest data export

### Corrupted Data
**Error**: `JSON.parse()` throws error
**Handling:**
1. Log error to console
2. Return empty array/object (safe fallback)
3. Show warning banner: "Andmed kahjustatud - kaaluge lähtestamist"
4. Offer "Reset Data" button (with confirmation)

### Missing Data
**Error**: LocalStorage key doesn't exist
**Handling:**
1. Initialize with empty array/default object
2. No error shown to user (normal first-time use)

### Race Conditions (Multiple Tabs)
**Problem**: Two tabs update same incident simultaneously
**Current Behavior**: Last write wins (no conflict resolution)
**Future Solution**: Add version number to each entity, detect conflicts

---

## Data Export/Import Format

### Export Format
**File Type**: JSON
**Filename**: `bcm-export-YYYYMMDD-HHMMSS.json`

**Structure:**
```json
{
  "exportVersion": "1.0",
  "exportedAt": "2026-02-04T12:00:00Z",
  "application": {
    "name": "BCM Business Continuity Management",
    "version": "0.2"
  },
  "data": {
    "incidents": [
      { /* full incident object */ }
    ],
    "log": [
      { /* log entry */ }
    ],
    "settings": {
      /* settings object */
    }
  }
}
```

### Import Format (Future)
**Not Yet Implemented**: Ability to import JSON file and restore data.

**Future Requirements:**
1. Validate JSON structure
2. Check export version compatibility
3. Merge with existing data (or replace)
4. Handle ID conflicts
5. Update timestamps

---

## Data Integrity Checklist

### On Incident Creation:
- [ ] ID is unique (check existing IDs)
- [ ] All required fields are present
- [ ] Timestamps are valid ISO 8601
- [ ] Status is ACTIVE
- [ ] Mode is REAL or TRAINING
- [ ] Timeline has creation event

### On Incident Update:
- [ ] Incident exists (ID is valid)
- [ ] Status transition is valid
- [ ] updatedAt is updated
- [ ] Timeline entry is added
- [ ] If closing: closedAt is set

### On Data Load:
- [ ] JSON parsing succeeds
- [ ] Data type is correct (array/object)
- [ ] Required fields are present
- [ ] Timestamps are parseable

### On Export:
- [ ] All incidents are included (all statuses)
- [ ] All log entries are included
- [ ] JSON is valid and pretty-printed
- [ ] File downloads successfully

---

**Document Version**: 1.0
**Last Updated**: 2026-02-04
**Status**: Initial version - comprehensive backend structure for BCM v0.2
