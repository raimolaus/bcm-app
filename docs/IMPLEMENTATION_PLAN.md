# Implementation Plan

## JUHISED

**Mida see dokument teeb:**
This document provides the step-by-step implementation guide for building or extending the BCM application. It defines the build sequence, acceptance checkpoints, change workflow, testing procedures, and best practices for working with Claude Code.

**Kuidas seda kasutada:**
- **New Developers**: Read this to understand how to approach implementation tasks
- **When starting a new feature**: Follow the build sequence and checkpoints
- **When making changes**: Follow the change workflow to ensure quality
- **When working with Claude Code**: Reference the tips section for effective prompts and workflows

**Mida see peab sisaldama:**
1. Development Environment Setup
2. Build Sequence (order of implementation)
3. Acceptance Checkpoints (definition of done per phase)
4. Change Workflow (how to make changes safely)
5. Testing Procedures
6. Claude Code Usage Tips
7. Common Pitfalls & Solutions
8. Rollback Procedures

**Mida see ei sisalda (see on teistes failides):**
- Business requirements → see PRD.md
- Technical specifications → see BACKEND_STRUCTURE.md, FRONTEND_GUIDELINES.md
- Application flows → see APP_FLOW.md
- Technology choices → see TECH_STACK.md

---

## Development Environment Setup

### Prerequisites
**Required:**
- Modern web browser (Chrome, Firefox, Safari, or Edge - latest version)
- Text editor or IDE (VS Code recommended)
- Git for version control

**Optional:**
- Node.js (for optional local server, not required for development)
- Browser extensions: React DevTools (not needed, but useful for debugging)

### Initial Setup Steps

1. **Clone Repository:**
```bash
git clone https://github.com/your-org/bcm-app.git
cd bcm-app
```

2. **Open in Browser:**
```bash
# Option 1: Direct file protocol (works but has limitations)
# Open index.html in browser directly

# Option 2: Local HTTP server (recommended)
# If you have Python:
python -m http.server 8000

# If you have Node.js:
npx http-server -p 8000

# Then open: http://localhost:8000
```

3. **Open DevTools:**
- Press F12 or Cmd+Option+I (Mac) to open browser DevTools
- Check Console for any errors
- Go to Application tab → Local Storage to inspect data

4. **Verify Installation:**
- App should load and show home page
- No console errors
- LocalStorage keys should be visible (empty initially)

### Development Workflow
```
Edit Code → Save File → Refresh Browser → Test → Repeat
```

**No build step required!** Just edit and refresh.

---

## Build Sequence

### Phase 0: Foundation (Completed)
**Status**: ✅ Complete
**Components:**
- Static HTML structure (`index.html`)
- CSS styling (`src/styles/main.css`, `src/styles/crisis.css`)
- Navigation system (`src/utils/navigation.js`)
- LocalStorage utilities (`src/utils/storage.js`)

**Acceptance:**
- [ ] App loads without errors
- [ ] All pages are accessible via navigation
- [ ] Browser back button works
- [ ] No CSS layout issues on desktop/mobile

---

### Phase 1: Core Data Layer (Completed)
**Status**: ✅ Complete
**Components:**
- Incident entity and CRUD (`src/data/incidents.js`)
- Crisis scenarios and plans (`src/data/crisis-data.js`)
- Contacts data (`src/data/contacts.js`)
- Logger utility (`src/utils/logger.js`)

**Acceptance:**
- [ ] Can create incident and save to LocalStorage
- [ ] Can load incidents from LocalStorage
- [ ] Can update incident status
- [ ] Can add timeline entries
- [ ] Incidents persist after page refresh

---

### Phase 2: Incident Lifecycle (Completed)
**Status**: ✅ Complete
**Components:**
- Incident creation flow with confirmation dialogs (`src/pages/HomePage.js`)
- REAL/TRAINING mode selection
- Incident detail page (`src/pages/IncidentDetailPage.js`)
- Status transitions (ACTIVE → CONTAINED → RESOLVED → CLOSED)
- Incident closure with confirmation

**Acceptance:**
- [ ] "AVA INTSIDENT" shows confirmation dialog
- [ ] User can choose REAL or TRAINING mode
- [ ] Scenario selection creates incident
- [ ] Incident detail page shows all data
- [ ] Status can be changed via dropdown
- [ ] Close button sets status to CLOSED
- [ ] All changes persist in LocalStorage

---

### Phase 3: Home Status & UI Updates (Completed)
**Status**: ✅ Complete
**Components:**
- Large home status box (green/red) (`index.html`, `src/styles/main.css`)
- Active incidents list display
- Dynamic card reordering based on incident state
- "Logid & Intsidendid" badge with NOT CLOSED count
- Unified refresh hooks (`updateHomeStatusAndList`, `updateIncidentsBadge`)

**Acceptance:**
- [ ] Status box shows green "OLUKORD: TAVAPÄRANE" when no active incidents
- [ ] Status box shows red "AKTIIVSED INTSIDENDID: N" when incidents active
- [ ] Active incident names are listed below status box
- [ ] Cards reorder: normal state vs active incident state
- [ ] Badge shows count of NOT CLOSED incidents
- [ ] Badge hides when all incidents are CLOSED
- [ ] All updates happen automatically after incident changes

---

### Phase 4: Incidents List & Filtering (Completed)
**Status**: ✅ Complete
**Components:**
- Incidents list page (`src/pages/IncidentsPage.js`)
- NOT CLOSED vs ALL filter toggle
- Incident cards with status, mode, and timestamp
- Click to navigate to detail page

**Acceptance:**
- [ ] Default view shows NOT CLOSED incidents (excludes CLOSED)
- [ ] Toggle button switches to ALL view (includes CLOSED)
- [ ] Each card shows: ID, name, status, timestamp, mode (REAL/TRAINING)
- [ ] Clicking card navigates to incident detail page
- [ ] Empty state message when no incidents match filter
- [ ] Count of displayed incidents is shown

---

### Phase 5: Triage & Metrics (Completed)
**Status**: ✅ Complete
**Components:**
- Triage form (impact assessment) in crisis mode
- Metrics saving to incident object
- Save confirmation before allowing navigation
- Metrics display on incident detail page

**Acceptance:**
- [ ] Triage form appears after scenario selection
- [ ] User can fill in impact level, affected users, duration, notes
- [ ] "SALVESTA" button saves metrics to incident
- [ ] Save confirmation prevents data loss
- [ ] Metrics are visible on incident detail page
- [ ] Data persists after page refresh

---

### Phase 6: Checklist Integration (Completed)
**Status**: ✅ Complete
**Components:**
- Checklist progress tracking
- Update checklist from scenario page
- Display checklist status on incident detail
- Timeline entries for checklist updates

**Acceptance:**
- [ ] Checklist items can be checked/unchecked
- [ ] Progress is saved to incident (e.g., "3/5 completed")
- [ ] Timeline shows "Checklist updated: immediate (3/5)"
- [ ] Incident detail page shows checklist progress
- [ ] Changes persist after refresh

---

### Phase 7: Data Export (Completed)
**Status**: ✅ Complete
**Components:**
- Export button in UI
- Generate JSON with all incidents and logs
- Download file with timestamp

**Acceptance:**
- [ ] Export button is accessible from settings/menu
- [ ] Clicking export generates JSON file
- [ ] Filename includes timestamp (e.g., `bcm-export-20260204-120000.json`)
- [ ] JSON includes all incidents (all statuses)
- [ ] JSON includes activity log
- [ ] File downloads immediately
- [ ] JSON is valid and pretty-printed

---

### Phase 8: FAAS2 Refinements (Completed)
**Status**: ✅ Complete
**Components:**
- Removed ÕPPUS toggle from top bar
- Changed crisis mode terminology from "kriisirežiim" to incident handling
- Removed navigation blocking (FAAS2 principle: navigation is never blocked)
- Neutral crisis mode header styling (white background, not red)

**Acceptance:**
- [ ] No ÕPPUS toggle in top bar
- [ ] Crisis mode header shows "AVA INTSIDENT" (neutral styling)
- [ ] Users can navigate freely at any time (no blocking alerts)
- [ ] Terminology updated: "Intsident" instead of "Kriis"
- [ ] Confirmation dialogs use correct wording

---

### Phase 9: Documentation (Current)
**Status**: 🚧 In Progress
**Components:**
- Create canonical docs with JUHISED sections
- Rename existing docs
- Comprehensive content for all docs

**Acceptance:**
- [ ] PRD.md: Business requirements and user stories
- [ ] TECH_STACK.md: Technology choices and versions
- [ ] BACKEND_STRUCTURE.md: Data schemas and CRUD operations
- [ ] IMPLEMENTATION_PLAN.md: Build sequence and workflows
- [ ] APP_FLOW.md: Application flows and navigation
- [ ] FRONTEND_GUIDELINES.md: UI design standards
- [ ] All docs have JUHISED sections
- [ ] All docs are committed to repository

---

### Phase 10: Future Enhancements (Planned)
**Status**: 📋 Not Started
**Components:**
- Data import functionality
- PWA support (Service Worker, offline caching)
- Dark mode theme
- Advanced search and filtering
- Data encryption for exports
- Automated testing (Playwright/Cypress)

**Priority**: Low (post-v1.0)

---

## Acceptance Checkpoints

### Per-Feature Checklist
Before marking any feature as "done", verify:

1. **Functionality:**
   - [ ] Feature works as specified in PRD.md
   - [ ] All acceptance criteria are met
   - [ ] Edge cases are handled (empty state, invalid input, etc.)

2. **Data Persistence:**
   - [ ] Changes are saved to LocalStorage
   - [ ] Data survives page refresh
   - [ ] Data survives browser close/reopen

3. **UI/UX:**
   - [ ] UI matches FRONTEND_GUIDELINES.md specifications
   - [ ] Responsive design works on mobile (375px width)
   - [ ] No layout breaks on desktop (1280px+ width)
   - [ ] Loading states are handled (if applicable)
   - [ ] Error states are handled with user-friendly messages

4. **Integration:**
   - [ ] Feature integrates with existing workflows (see APP_FLOW.md)
   - [ ] No regressions (existing features still work)
   - [ ] Refresh hooks are called (`updateHomeStatusAndList`, `updateIncidentsBadge`)

5. **Code Quality:**
   - [ ] No console errors or warnings
   - [ ] Code follows existing patterns and conventions
   - [ ] Comments explain complex logic
   - [ ] No hardcoded values (use constants or data files)

6. **Testing:**
   - [ ] Manual testing completed on Chrome and Firefox
   - [ ] Mobile testing completed (DevTools responsive mode or real device)
   - [ ] Offline testing completed (DevTools → Network → Offline)

7. **Documentation:**
   - [ ] If new workflow: update APP_FLOW.md
   - [ ] If new data structure: update BACKEND_STRUCTURE.md
   - [ ] If new UI component: update FRONTEND_GUIDELINES.md

---

## Change Workflow

### Making Changes Safely

1. **Understand the Requirement:**
   - Read PRD.md to understand business context
   - Check APP_FLOW.md to understand user workflows
   - Review existing code to understand current implementation

2. **Plan the Change:**
   - Identify which files need to be modified
   - List data structures that will be affected
   - Consider migration strategy if schema changes
   - Identify potential breaking changes

3. **Make the Change:**
   - Edit relevant files
   - Follow existing code patterns and naming conventions
   - Add comments for complex logic
   - Update `updatedAt` timestamps when modifying data

4. **Test the Change:**
   - Refresh browser and test new functionality
   - Test existing features (regression testing)
   - Test on mobile viewport (DevTools responsive mode)
   - Test with different data states (no incidents, 1 incident, multiple incidents)
   - Test offline (DevTools → Network → Offline)

5. **Update Documentation:**
   - If workflow changed: update APP_FLOW.md
   - If data structure changed: update BACKEND_STRUCTURE.md
   - If UI changed: update FRONTEND_GUIDELINES.md
   - Update version number if significant change

6. **Commit the Change:**
   - Write clear commit message (see Commit Message Guidelines below)
   - Include issue/ticket number if applicable
   - Push to Git repository

---

## Testing Procedures

### Manual Testing Checklist

**Smoke Test (Run after every change):**
- [ ] App loads without console errors
- [ ] Home page displays correctly
- [ ] Can navigate to all pages
- [ ] Can create new incident (REAL and TRAINING modes)
- [ ] Can view incident detail page
- [ ] Can update incident status
- [ ] Can close incident
- [ ] Can view incidents list
- [ ] Can toggle NOT CLOSED / ALL filter

**Full Regression Test (Run before commits):**
- [ ] All smoke tests pass
- [ ] Home status box updates correctly (green → red)
- [ ] Active incidents list displays names
- [ ] Badge count is accurate (NOT CLOSED)
- [ ] Badge hides when all incidents CLOSED
- [ ] Cards reorder based on incident state
- [ ] Incident timeline shows all actions
- [ ] Checklist progress updates and persists
- [ ] Metrics form saves and displays
- [ ] Export generates valid JSON
- [ ] Data persists after page refresh
- [ ] Data persists after browser close/reopen

**Cross-Browser Testing (Before major releases):**
- [ ] Chrome/Edge: All tests pass
- [ ] Firefox: All tests pass
- [ ] Safari: All tests pass (if available)

**Mobile Testing (Before releases):**
- [ ] Responsive design works (375px width)
- [ ] Touch interactions work (tap, scroll)
- [ ] No horizontal scroll
- [ ] Text is readable (font size, contrast)

**Offline Testing:**
- [ ] Disable network in DevTools
- [ ] All functionality still works
- [ ] No network errors in console

---

## Claude Code Usage Tips

### Effective Prompting

**Good Prompts:**
- "Read FAAS2_FIXES_STEP1.md and implement all changes"
- "Fix the incident status update bug in IncidentDetailPage.js"
- "Add a new field 'priority' to incident schema and update all relevant files"

**Bad Prompts:**
- "Fix it" (too vague, no context)
- "Make it better" (subjective, no clear goal)
- "Change everything" (too broad, risky)

### Working with Documentation

**When implementing features:**
1. Ask Claude to read PRD.md first to understand requirements
2. Ask Claude to read APP_FLOW.md to understand workflows
3. Ask Claude to read relevant code files
4. Ask Claude to implement with step-by-step plan

**Example:**
```
1. Read PRD.md and understand Feature F8 (Data Export)
2. Read BACKEND_STRUCTURE.md to understand export format
3. Implement export function in src/data/incidents.js
4. Add export button to settings page
5. Test and verify JSON structure
```

### Change Management

**Small Changes:**
- Edit one file at a time
- Test immediately after each change
- Commit frequently

**Large Changes:**
- Create todo list with Claude
- Break into small steps
- Test after each step
- Commit after each completed step

### Code Review

**Before committing:**
- Ask Claude to review changes: "Review the changes in IncidentDetailPage.js for bugs"
- Ask Claude to check for regressions: "Will these changes break existing features?"
- Ask Claude to verify documentation: "Do these changes require docs updates?"

---

## Common Pitfalls & Solutions

### Pitfall 1: LocalStorage Race Conditions
**Problem**: Multiple rapid updates can overwrite each other.
**Solution**:
- Always load fresh data before updating
- Use atomic operations (load → modify → save)
- Don't cache LocalStorage data in variables for long periods

```javascript
// ❌ Bad: Stale data
const incidents = loadIncidents(); // Load once
// ... some time passes ...
incidents.push(newIncident); // Might be stale!
saveIncidents(incidents);

// ✅ Good: Fresh data
function addIncident(newIncident) {
  const incidents = loadIncidents(); // Load fresh
  incidents.push(newIncident);
  saveIncidents(incidents); // Save immediately
}
```

### Pitfall 2: Forgetting to Update Timestamps
**Problem**: `updatedAt` timestamp not updated when modifying incidents.
**Solution**: Always update `updatedAt` in every update function.

```javascript
// ✅ Good
incident.status = newStatus;
incident.updatedAt = new Date().toISOString(); // Always update!
```

### Pitfall 3: Forgetting to Trigger Refresh Hooks
**Problem**: UI doesn't update after incident changes.
**Solution**: Always call refresh hooks after modifying incidents.

```javascript
// ✅ Good
saveIncident(incident);
window.updateHomeStatusAndList();
window.updateIncidentsBadge();
```

### Pitfall 4: Breaking Existing Features
**Problem**: New code breaks existing functionality.
**Solution**:
- Test existing features after every change
- Use browser search to find all references before renaming
- Check APP_FLOW.md to understand dependencies

### Pitfall 5: Inconsistent Status Logic
**Problem**: Different parts of code use different status definitions.
**Solution**: Always use status enums and helper functions.

```javascript
// ❌ Bad: Hardcoded strings
if (incident.status === 'ACTIVE') { ... }

// ✅ Good: Use enums
import { IncidentStatus } from './data/incidents.js';
if (incident.status === IncidentStatus.ACTIVE) { ... }
```

### Pitfall 6: Not Handling Empty States
**Problem**: UI breaks when no data exists.
**Solution**: Always check for empty arrays/null values.

```javascript
// ✅ Good: Handle empty state
const incidents = loadIncidents();
if (incidents.length === 0) {
  showEmptyState();
  return;
}
```

---

## Rollback Procedures

### Reverting Recent Changes

**If last commit broke something:**
```bash
# See recent commits
git log --oneline -5

# Revert last commit (creates new commit)
git revert HEAD

# Or reset to previous commit (destructive!)
git reset --hard HEAD~1
```

**If changes not yet committed:**
```bash
# Discard changes to specific file
git checkout -- src/pages/HomePage.js

# Discard all changes
git checkout -- .
```

### Recovering LocalStorage Data

**If LocalStorage corrupted:**
1. Open DevTools → Application → Local Storage
2. Manually inspect `bcm_incidents` key
3. Copy value to text editor
4. Fix JSON syntax if corrupted
5. Copy fixed JSON back to LocalStorage

**If data lost:**
1. Check if user has recent export file
2. Implement import function (if not yet available)
3. Or manually reconstruct in LocalStorage:
```javascript
localStorage.setItem('bcm_incidents', JSON.stringify([...]));
```

### Testing Rollback

After rolling back:
- [ ] Run smoke tests
- [ ] Verify all features work
- [ ] Check LocalStorage data is intact
- [ ] No console errors

---

## Commit Message Guidelines

### Format
```
<type>: <short description>

<optional detailed description>

<optional footer>
```

### Types
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` CSS/UI changes (no logic changes)
- `refactor:` Code refactoring (no behavior change)
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Examples
```
feat: add data export functionality

Implement JSON export for all incidents and logs.
Export button in settings page generates timestamped file.

Closes #42

---

fix: incident badge count incorrect after closure

Fixed updateIncidentsBadge() to exclude CLOSED status.
Badge now correctly shows NOT CLOSED count.

---

docs: create canonical documentation structure

Add JUHISED sections to all docs.
Create PRD.md, TECH_STACK.md, BACKEND_STRUCTURE.md, IMPLEMENTATION_PLAN.md.
Rename flows.md → APP_FLOW.md, ui-guidelines.md → FRONTEND_GUIDELINES.md.
```

---

## Development Checklist

### Before Starting Work
- [ ] Git repo is up to date (`git pull`)
- [ ] Dev environment is set up
- [ ] Browser DevTools are open
- [ ] I understand the requirements (read PRD.md)

### During Development
- [ ] Making small, incremental changes
- [ ] Testing after each change
- [ ] Checking console for errors
- [ ] Following existing code patterns

### Before Committing
- [ ] All tests pass (smoke + regression)
- [ ] No console errors or warnings
- [ ] Data persists after refresh
- [ ] Documentation is updated
- [ ] Commit message is clear

### After Committing
- [ ] Push to remote repository
- [ ] Verify on another device/browser (if possible)
- [ ] Update project board or issue tracker

---

**Document Version**: 1.0
**Last Updated**: 2026-02-04
**Status**: Initial version - comprehensive implementation plan for BCM v0.2
