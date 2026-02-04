# Product Requirements Document (PRD)

## JUHISED

**Mida see dokument teeb:**
This document defines WHAT we are building and WHY, from a business and user perspective. It explains the problem, target users, goals, features, acceptance criteria, and user stories without prescribing HOW to implement them technically.

**Kuidas seda kasutada:**
- **Product Owners / Stakeholders**: Use this to understand the vision, scope, and success criteria
- **Developers**: Use this to understand feature requirements and acceptance criteria before designing solutions
- **QA / Testers**: Use acceptance criteria and user stories as basis for test cases
- **When planning new features**: Update this document first, then design technical approach in other docs

**Mida see peab sisaldama:**
1. Problem Description - what pain point are we solving?
2. Target Users - who is this for?
3. Goals & Success Criteria - how do we measure success?
4. Non-Goals - what are we explicitly NOT doing?
5. Feature List with Acceptance Criteria
6. User Stories (Given/When/Then format)
7. Edge Cases & Constraints
8. Definition of Done

**Mida see ei sisalda (see on teistes failides):**
- Technical implementation details → see TECH_STACK.md, BACKEND_STRUCTURE.md
- UI component specs → see FRONTEND_GUIDELINES.md
- Step-by-step implementation plan → see IMPLEMENTATION_PLAN.md
- Application flows and navigation → see APP_FLOW.md

---

## Problem Description

**Problem:**
Estonian organizations need a lightweight, immediately usable Business Continuity Management (BCM) application that can be operated during crisis situations when internet connectivity, complex systems, or external dependencies may be unavailable.

**Current Situation:**
- Traditional BCM tools require server infrastructure, accounts, and internet connectivity
- During actual crises, these dependencies become liabilities
- Teams need instant access to crisis response procedures, contact lists, and incident logging
- Training exercises (TRAINING mode) need to be clearly separated from real incidents (REAL mode)

**Solution:**
A zero-dependency, single-page web application that runs entirely in the browser, stores data locally, and provides instant access to crisis management workflows without requiring authentication, servers, or internet connectivity.

---

## Target Users

**Primary Users:**
1. **Crisis Response Team Members** - Need quick access to procedures and contacts during incidents
2. **Crisis Managers** - Need to log incidents, track actions, and maintain situational awareness
3. **Training Coordinators** - Need to run exercises without contaminating real incident data

**User Environment:**
- May be under stress during actual crises
- May have limited or no internet connectivity
- May need to access app from any device (desktop, tablet, mobile)
- May need to export data for reporting or archival purposes

---

## Goals & Success Criteria

**Primary Goals:**
1. **Zero Friction Access** - Users can open the app and start using it immediately without setup
2. **Offline First** - All functionality works without internet or backend
3. **Clear Incident State** - At any moment, users know if there are active incidents and can access them
4. **Exercise Safety** - Training exercises never contaminate real incident data
5. **Data Portability** - Users can export their data at any time

**Success Criteria:**
- App loads and is fully functional within 3 seconds on modern browsers
- All incident workflows (create, update, close) work without network requests
- Active incident count is always visible on home screen
- REAL vs TRAINING mode is clearly indicated and never confused
- Export generates valid JSON that can be imported elsewhere

**Key Metrics:**
- Time to open new incident: < 30 seconds
- Time to update incident status: < 10 seconds
- Data loss events: 0 (LocalStorage persistence)
- User confusion between REAL/TRAINING: 0 incidents

---

## Non-Goals

**What we are NOT building:**
- Multi-user collaboration or real-time sync
- Backend server or database
- User authentication or access control
- Mobile native apps (web-only)
- Advanced analytics or reporting dashboards
- Integration with external systems (SIEM, ticketing, etc.)
- Version control or audit trail beyond basic action log
- File attachments or media uploads

**Future Considerations (out of scope for v1):**
- Data export to external formats (PDF, Excel)
- Encrypted backup/restore
- Custom crisis scenario templates
- Advanced search and filtering

---

## Feature List with Acceptance Criteria

### F1: Home Screen with Incident Status
**Description:** Landing page shows current system state and provides quick access to all major functions.

**Acceptance Criteria:**
- [ ] Large status box shows "OLUKORD: TAVAPÄRANE" (green) when no active incidents
- [ ] Status box shows "AKTIIVSED INTSIDENDID: N" (red) when N active incidents exist
- [ ] Active incident names are listed below status box when incidents are active
- [ ] "AVA INTSIDENT" card is always first in card order
- [ ] Card order changes dynamically: normal = [openIncident, plans, contacts, communication, logs], active = [openIncident, logs, communication, contacts, plans]
- [ ] "Logid & Intsidendid" card shows badge with count of NOT CLOSED incidents
- [ ] Badge is hidden when all incidents are CLOSED

### F2: New Incident Creation (FAAS2 Flow)
**Description:** Users can create a new incident by selecting a crisis scenario with confirmation dialogs and REAL/TRAINING choice.

**Acceptance Criteria:**
- [ ] Clicking "AVA INTSIDENT" card shows confirmation dialog: "Kas oled kindel, et soovid avada uue intsidendi?"
- [ ] If confirmed, shows second dialog: "Kas soovid avada uue intsidendi REAL režiimis?" (OK = REAL, Cancel = TRAINING)
- [ ] Displays full list of crisis scenarios with descriptions
- [ ] Selecting scenario creates incident with unique ID, timestamp, and chosen mode
- [ ] New incident is saved to LocalStorage immediately
- [ ] Home screen updates to show active incident
- [ ] User is navigated to scenario detail page (not incident detail)

### F3: Incident Lifecycle Management
**Description:** Track incidents through standard lifecycle: ACTIVE → CONTAINED → RESOLVED → CLOSED.

**Acceptance Criteria:**
- [ ] New incidents start with status = ACTIVE
- [ ] Status can be changed from incident detail page
- [ ] Status transitions are logged in incident timeline
- [ ] ACTIVE and CONTAINED incidents count as "active" for home status box
- [ ] Only CLOSED incidents are excluded from badge count
- [ ] Status change triggers UI refresh (home status box, badge, incident list)

### F4: Incident Detail View
**Description:** Full detail page for each incident showing all metadata, timeline, checklists, and actions.

**Acceptance Criteria:**
- [ ] Shows incident ID, scenario name, creation timestamp, status
- [ ] Shows mode (REAL or TRAINING) with distinct visual indicator
- [ ] Timeline shows all actions with timestamps
- [ ] Checklist progress is displayed and updatable
- [ ] Status change dropdown is available
- [ ] "Close incident" button requires confirmation
- [ ] Closing incident navigates back to incidents list

### F5: Incidents List with Filtering
**Description:** View all incidents with ability to filter by status (NOT CLOSED vs ALL).

**Acceptance Criteria:**
- [ ] Default view shows NOT CLOSED incidents (excludes CLOSED)
- [ ] Toggle button switches to "ALL" view (includes CLOSED)
- [ ] Each incident card shows: ID, name, status, timestamp, mode
- [ ] Clicking incident card navigates to detail page
- [ ] Empty state message when no incidents match filter
- [ ] Count of displayed incidents is shown

### F6: Crisis Response Resources
**Description:** Quick access to crisis plans, emergency contacts, and communication templates.

**Acceptance Criteria:**
- [ ] Plans page shows all crisis response plans with descriptions
- [ ] Contacts page shows emergency contacts with phone/email (click-to-call/email)
- [ ] Communication page shows message templates
- [ ] All resources are accessible regardless of incident state
- [ ] Navigation is never blocked (FAAS2 principle)

### F7: Activity Log
**Description:** Chronological log of all system events, user actions, and incident changes.

**Acceptance Criteria:**
- [ ] Log entries have timestamps and type indicators (SYSTEM, ACTION, ERROR)
- [ ] Recent entries are shown in reverse chronological order
- [ ] Log persists across sessions (LocalStorage)
- [ ] Log is updated when incidents are created, updated, or closed
- [ ] Export function includes log data

### F8: Data Export
**Description:** Export all application data (incidents, log) to JSON file.

**Acceptance Criteria:**
- [ ] Export button is accessible from menu/settings
- [ ] Generates JSON file with timestamp in filename
- [ ] Includes all incidents (all statuses) with complete data
- [ ] Includes activity log
- [ ] File downloads immediately (no server upload)
- [ ] JSON is valid and human-readable

---

## User Stories

### US1: Opening First Incident
**Given** I am a crisis manager and no incidents are currently active
**When** I open the BCM app home screen
**Then** I see a large green status box saying "OLUKORD: TAVAPÄRANE"
**And** I see the "AVA INTSIDENT" card as the first card
**When** I click "AVA INTSIDENT"
**Then** I am asked to confirm if I want to open a new incident
**When** I confirm
**Then** I am asked to choose REAL or TRAINING mode
**When** I choose REAL
**Then** I see a list of crisis scenarios
**When** I select a scenario
**Then** a new incident is created with status ACTIVE
**And** I am navigated to the scenario detail page
**And** the home screen status box turns red and shows "AKTIIVSED INTSIDENDID: 1"

### US2: Monitoring Active Incident
**Given** I have one active incident (status = ACTIVE)
**When** I return to the home screen
**Then** I see a large red status box saying "AKTIIVSED INTSIDENDID: 1"
**And** I see the incident name listed below the status box
**And** the cards are reordered with "Logid & Intsidendid" appearing before "Plaanid"
**And** the "Logid & Intsidendid" card shows a red badge with "1"

### US3: Updating Incident Status
**Given** I have an active incident (status = ACTIVE)
**When** I navigate to the incident detail page
**Then** I see a status dropdown with options: ACTIVE, CONTAINED, RESOLVED, CLOSED
**When** I change the status to CONTAINED
**Then** the status is saved immediately
**And** a timeline entry is added: "Status changed to CONTAINED"
**And** the incident list refreshes to show the new status
**And** the home status box still shows the incident as active (CONTAINED counts as active)

### US4: Closing an Incident
**Given** I have an incident with status = RESOLVED
**When** I navigate to the incident detail page
**And** I click "Close Incident"
**Then** I am asked to confirm closure
**When** I confirm
**Then** the incident status changes to CLOSED
**And** I am navigated back to the incidents list
**And** the home status box updates (if this was the last active incident, it turns green)
**And** the badge count decreases by 1 (CLOSED incidents don't count)

### US5: Filtering Incidents List
**Given** I have 3 incidents: 1 ACTIVE, 1 RESOLVED, 1 CLOSED
**When** I navigate to the incidents list page
**Then** I see 2 incidents by default (NOT CLOSED filter)
**And** the toggle button says "Näita KÕIKI"
**When** I click the toggle button
**Then** I see all 3 incidents (including CLOSED)
**And** the toggle button says "Näita AVATUD"
**When** I click the toggle button again
**Then** I see only 2 incidents again (CLOSED is hidden)

### US6: Running Training Exercise
**Given** I am a training coordinator preparing for a drill
**When** I click "AVA INTSIDENT" and confirm
**Then** I am asked to choose REAL or TRAINING mode
**When** I choose TRAINING (click Cancel)
**Then** the incident is created with mode = TRAINING
**And** the incident detail page shows a distinct TRAINING indicator
**And** the incident appears in the list with TRAINING badge
**When** the exercise is complete and I close the incident
**Then** the incident is marked CLOSED but remains in history with TRAINING label

### US7: Accessing Emergency Contacts During Crisis
**Given** I am responding to an active incident
**When** I need to call an emergency contact
**Then** I can navigate to the "Kontaktid" page freely (navigation is never blocked)
**And** I see a list of emergency contacts with phone numbers
**When** I click a phone number
**Then** my device initiates a call (tel: link)

### US8: Exporting Incident Data
**Given** I have multiple incidents in various states
**When** I navigate to the export function
**And** I click "Export Data"
**Then** a JSON file is immediately downloaded
**And** the filename includes the current date/time
**When** I open the JSON file
**Then** I see all incidents with complete metadata
**And** I see the activity log with all entries

### US9: Viewing Activity Log
**Given** I have created and updated several incidents
**When** I navigate to the "Logid & Intsidendid" page
**And** I view the activity log section
**Then** I see a chronological list of all system events
**And** I see entries for: incident creation, status changes, actions completed, errors
**And** each entry has a timestamp and type indicator
**And** the most recent entries appear first

### US10: Returning User with Existing Data
**Given** I used the app yesterday and created 2 incidents
**When** I close the browser and reopen the app today
**Then** all my incident data is still present (LocalStorage persistence)
**And** the home status box reflects the correct state
**And** the badge count is accurate
**And** I can continue working with existing incidents

---

## Edge Cases & Constraints

### Edge Cases:
1. **LocalStorage full**: If LocalStorage quota is exceeded (rare), show error message and prevent new incident creation
2. **Corrupted data**: If LocalStorage data is corrupted, show warning and offer to reset (data loss)
3. **Multiple browser tabs**: Changes in one tab should NOT automatically sync to other tabs (no cross-tab communication)
4. **Browser back button**: Should work correctly with SPA navigation history
5. **No incidents exist**: Empty states should guide users to create first incident
6. **All incidents closed**: Badge should be hidden, status box should show green normal state
7. **Rapid status changes**: Debounce or queue updates to prevent race conditions
8. **Export with no data**: Export should still work and generate valid empty JSON

### Constraints:
1. **Browser Compatibility**: Must support modern evergreen browsers (Chrome, Firefox, Safari, Edge) - last 2 versions
2. **LocalStorage Limits**: Assume ~5-10MB available (sufficient for 100+ incidents with logs)
3. **No Backend**: All functionality must work without server; no API calls except for future export formats
4. **Estonian Language**: Primary UI language is Estonian; some technical terms may be English
5. **No User Auth**: No login, no user management, no access control (single-user assumption)
6. **No File Uploads**: No ability to attach documents, images, or files to incidents
7. **Session-Only Exercise Mode**: REAL/TRAINING choice is stored per-incident, not globally

---

## Definition of Done

A feature or user story is considered DONE when:

1. **Implemented**: Code is written and merged to main branch
2. **Tested**: Acceptance criteria are verified manually (no automated tests required for v1)
3. **UI Complete**: All UI elements match FRONTEND_GUIDELINES.md specifications
4. **Data Persists**: Changes are saved to LocalStorage and survive page refresh
5. **No Console Errors**: No JavaScript errors in browser console during normal use
6. **Responsive**: Works on desktop and mobile viewports (tested at 375px and 1280px widths)
7. **Documented**: If new workflows are added, APP_FLOW.md is updated
8. **Performance**: No perceptible lag (< 100ms) for user interactions
9. **Regression Free**: Existing features still work after changes
10. **Reviewed**: Code has been reviewed by at least one other developer (if team size > 1)

---

**Document Version**: 1.0
**Last Updated**: 2026-02-04
**Status**: Initial version - comprehensive PRD for BCM v0.2
