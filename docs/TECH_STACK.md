# Technical Stack

## JUHISED

**Mida see dokument teeb:**
This document defines the complete technical stack for the BCM application: runtime environment, programming languages, libraries/frameworks, build tools, testing approach, and storage mechanisms. It answers "what technologies are we using and why?"

**Kuidas seda kasutada:**
- **Developers**: Reference this when setting up development environment or making technology decisions
- **New Team Members**: Read this first to understand the technical foundation
- **When adding dependencies**: Check if it aligns with our zero-dependency philosophy before adding
- **When debugging**: Understand which browser APIs and features we rely on

**Mida see peab sisaldama:**
1. Runtime Environment (browser requirements, OS support)
2. Programming Languages & Versions
3. Dependencies & Libraries (should be minimal/zero)
4. Build & Development Tools
5. Storage & State Management
6. Testing Strategy
7. Browser APIs Used
8. Deployment Model

**Mida see ei sisalda (see on teistes failides):**
- Business requirements → see PRD.md
- Data models and schemas → see BACKEND_STRUCTURE.md
- Implementation steps → see IMPLEMENTATION_PLAN.md
- Application architecture → see architecture.md

---

## Runtime Environment

### Browser Requirements
**Target Browsers:**
- **Chrome/Edge**: Version 90+ (Chromium-based)
- **Firefox**: Version 88+
- **Safari**: Version 14+
- **Mobile Safari (iOS)**: Version 14+
- **Mobile Chrome (Android)**: Version 90+

**Key Browser Features Required:**
- ES6+ JavaScript support (modules, arrow functions, async/await, destructuring)
- LocalStorage API (5MB+ quota)
- CSS Grid and Flexbox
- Service Worker API (future PWA support)
- Web Crypto API (future data encryption)

**No Server Runtime:**
- No Node.js backend
- No PHP, Python, or server-side rendering
- Pure static file serving (can be served via `file://` protocol or any HTTP server)

### Operating System Support
**Desktop:**
- Windows 10/11
- macOS 10.15+
- Linux (any modern distribution with supported browser)

**Mobile:**
- iOS 14+
- Android 10+

**Offline Capability:**
- Full offline operation after initial page load
- No internet connection required for any functionality
- LocalStorage provides persistent storage without network

---

## Programming Languages

### JavaScript (ES6+)
**Version**: ECMAScript 2015 (ES6) and later features
**Usage**: 100% of application logic

**Features Used:**
- ES6 Modules (`import`/`export`)
- Arrow functions
- Template literals
- Destructuring assignment
- Spread operator
- `async`/`await` for asynchronous operations
- `const`/`let` (no `var`)
- Array methods: `map`, `filter`, `reduce`, `find`, `forEach`
- Object methods: `Object.assign`, `Object.entries`, `Object.keys`

**No TypeScript:**
- We use vanilla JavaScript for simplicity
- No build step required for type checking
- JSDoc comments can be used for type hints if needed

### HTML5
**Version**: HTML5 (living standard)
**Usage**: Structure and semantic markup

**Key Elements:**
- Semantic tags: `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>`
- Form elements: `<input>`, `<select>`, `<textarea>`, `<button>`
- Data attributes: `data-*` for storing metadata
- `<template>` tags (potential future use for client-side rendering)

### CSS3
**Version**: CSS3 (living standard)
**Usage**: All styling and layout

**Key Features:**
- CSS Grid for complex layouts
- Flexbox for component alignment
- CSS Custom Properties (variables) for theming
- Media queries for responsive design
- CSS transitions and animations
- Modern selectors: `:not()`, `:is()`, `:where()`

**No CSS Preprocessors:**
- No SASS, LESS, or PostCSS
- Plain CSS files for simplicity
- No build step for CSS

---

## Dependencies & Libraries

### Core Principle: Zero Dependencies
**Philosophy**: Minimize external dependencies to reduce attack surface, eliminate supply chain risks, and ensure long-term maintainability.

### Current Dependencies: NONE
- No npm packages
- No CDN-hosted libraries
- No jQuery, React, Vue, Angular, or any framework
- No UI component libraries
- No utility libraries (lodash, moment.js, etc.)

### Why Zero Dependencies?
1. **Security**: No third-party code vulnerabilities
2. **Reliability**: No broken CDN links or supply chain attacks
3. **Offline First**: No external resources to fetch
4. **Longevity**: Code will work indefinitely without dependency updates
5. **Simplicity**: Easy to understand and audit entire codebase
6. **Performance**: No framework overhead

### Potential Future Dependencies (Carefully Considered)
If we ever need to add a dependency, it must meet these criteria:
- **Essential**: Cannot be reasonably implemented in-house
- **Small**: < 10KB minified and gzipped
- **Maintained**: Active maintenance and security updates
- **Vendored**: Must be copied into our repo, not loaded from CDN
- **Audited**: Code must be reviewed before inclusion

Examples of acceptable future dependencies:
- Chart.js (if we add data visualization)
- date-fns (if we need complex date manipulation)

---

## Build & Development Tools

### No Build Process (Current State)
**Development:**
- Write code directly in text editor / IDE
- Open `index.html` in browser to test
- Use browser DevTools for debugging
- No compilation, bundling, or transpilation

**Deployment:**
- Copy files to web server or GitHub Pages
- No build artifacts to generate

### Development Tools (Recommended)
**Code Editor:**
- VS Code (recommended)
- Any text editor with JavaScript syntax highlighting

**Browser DevTools:**
- Chrome DevTools / Firefox Developer Tools
- Use Console for debugging
- Use Application tab to inspect LocalStorage
- Use Network tab to verify no external requests

**Version Control:**
- Git for source control
- GitHub for repository hosting

**Local Server (Optional):**
For testing `file://` protocol limitations:
```bash
# Python 3
python -m http.server 8000

# Node.js (if installed)
npx http-server -p 8000
```

### Potential Future Build Tools
If the project grows, we may add:
- **Vite**: Fast dev server with hot module replacement
- **esbuild**: Minimal bundler for production optimization
- **Terser**: JavaScript minification for production
- **ESLint**: Linting for code quality

**Constraint**: Any build tool must be optional, not required for basic development.

---

## Storage & State Management

### LocalStorage (Primary Storage)
**API**: `window.localStorage`
**Quota**: ~5-10MB (varies by browser)
**Persistence**: Data persists indefinitely until explicitly cleared

**Usage:**
- Store all application data (incidents, logs, settings)
- Key-value store with string values (JSON serialization required)
- Synchronous API (blocking, but fast enough for our use case)

**Data Schema:**
```javascript
// LocalStorage keys
localStorage.setItem('bcm_incidents', JSON.stringify(incidents));
localStorage.setItem('bcm_log', JSON.stringify(logEntries));
localStorage.setItem('bcm_settings', JSON.stringify(settings));
```

**Limitations:**
- No transactions or ACID guarantees
- No complex queries (must load and filter in JavaScript)
- Data is not encrypted (visible to any JavaScript on the page)
- Synchronous API can block UI (but operations are fast)

### SessionStorage (Temporary State)
**API**: `window.sessionStorage`
**Persistence**: Data cleared when tab/window is closed

**Usage:**
- Store temporary workflow state (e.g., FAAS2 incident flow flags)
- Store REAL/TRAINING mode choice during incident creation
- Store UI state that shouldn't persist (e.g., which tab is open)

**Example:**
```javascript
sessionStorage.setItem('faas2_incident_flow', 'true');
sessionStorage.setItem('faas2_incident_mode', 'REAL');
```

### In-Memory State (JavaScript Variables)
**Usage:**
- Runtime application state (current page, navigation history)
- Cached data (scenarios, plans, contacts loaded from modules)

**Limitations:**
- Lost on page refresh
- Not shared across tabs/windows

### No Backend Database
- No SQL database (PostgreSQL, MySQL, SQLite)
- No NoSQL database (MongoDB, Firebase)
- No IndexedDB (more complex than needed for our use case)

---

## Testing Strategy

### Current: Manual Testing
**Approach:**
- Manual testing in multiple browsers
- Test on desktop and mobile viewports
- Test offline capability (disable network in DevTools)
- Test LocalStorage persistence (refresh page, close/reopen browser)

**Test Checklist:**
- [ ] Create incident: REAL and TRAINING modes
- [ ] Update incident status through all transitions
- [ ] Close incident and verify badge/status box updates
- [ ] Filter incidents list (NOT CLOSED vs ALL)
- [ ] Export data and verify JSON structure
- [ ] Navigate between all pages
- [ ] Test on mobile (responsive design)
- [ ] Test offline (no network)

### Future: Automated Testing (Optional)
If project complexity grows, consider:

**Unit Testing:**
- Framework: Vitest or Mocha
- Mock LocalStorage for isolated tests
- Test utility functions and data transformations

**Integration Testing:**
- Framework: Playwright or Cypress
- Test full user workflows
- Test LocalStorage persistence

**Visual Regression Testing:**
- Tool: Percy or BackstopJS
- Catch unintended UI changes

**Constraint**: Testing must remain optional for development. The app should be simple enough that manual testing is sufficient.

---

## Browser APIs Used

### Core APIs (Always Required)
1. **DOM API**: `document.querySelector`, `createElement`, `addEventListener`, etc.
2. **LocalStorage API**: `localStorage.getItem`, `localStorage.setItem`, `localStorage.removeItem`
3. **SessionStorage API**: `sessionStorage.getItem`, `sessionStorage.setItem`
4. **History API**: `window.history.pushState`, `window.history.back` (for SPA navigation)
5. **Location API**: `window.location.hash` (for page routing)
6. **Console API**: `console.log`, `console.error`, `console.warn` (for debugging)

### Event APIs
7. **Event Listeners**: `addEventListener`, `removeEventListener`
8. **Event Types**: `click`, `submit`, `change`, `input`, `DOMContentLoaded`, `popstate`

### Data & Encoding APIs
9. **JSON API**: `JSON.parse`, `JSON.stringify`
10. **Date API**: `new Date()`, `Date.now()`, `toISOString`, `toLocaleString`

### UI Interaction APIs
11. **Dialog API**: `window.alert`, `window.confirm` (for simple confirmations)
12. **Download API**: Creating `<a>` elements with `download` attribute and `Blob` URLs for export

### Optional/Future APIs
13. **Service Worker API**: For PWA and offline caching (future)
14. **Web Crypto API**: For encrypting exported data (future)
15. **Clipboard API**: For copy-to-clipboard functionality (future)
16. **Notification API**: For crisis alerts (future)

---

## Deployment Model

### Static File Hosting
**Deployment**: Copy files to any static file server

**Supported Hosting:**
- GitHub Pages (free, HTTPS, custom domain support)
- Netlify (free tier, auto-deploy from Git)
- Vercel (free tier, auto-deploy from Git)
- AWS S3 + CloudFront (static hosting)
- Azure Static Web Apps
- Any web server (Apache, Nginx)
- File system (`file://` protocol works but has limitations)

**Deployment Steps:**
1. Copy all files to hosting provider
2. Ensure `index.html` is the entry point
3. No server configuration required
4. No environment variables needed
5. No build step required

### File Structure for Deployment
```
/
├── index.html          (entry point)
├── crisis-app.js       (legacy crisis logic)
├── src/
│   ├── app.js          (main application)
│   ├── pages/          (page modules)
│   ├── utils/          (utility modules)
│   ├── data/           (data modules)
│   └── styles/         (CSS files)
└── docs/               (documentation - not deployed)
```

**What NOT to Deploy:**
- `docs/` folder (documentation only)
- `.git/` folder (version control)
- `node_modules/` (if future build tools are added)
- `README.md`, `LICENSE`, etc. (optional)

### URL Structure
**Root**: `https://your-domain.com/`
**SPA Routing**: Hash-based navigation (`#homePage`, `#incidentsPage`, etc.)
**No Backend Routes**: All routing is client-side

### Performance Considerations
- **Initial Load**: < 3 seconds on 3G connection
- **Page Transitions**: < 100ms (instant, no network requests)
- **LocalStorage Operations**: < 10ms (synchronous)
- **File Size**: Aim for < 500KB total (HTML + CSS + JS)

### Security Considerations
- **HTTPS Required**: Always serve over HTTPS (except for local development)
- **CSP Headers**: Consider adding Content-Security-Policy headers to prevent XSS
- **No Sensitive Data**: Do not store passwords or API keys in code
- **LocalStorage Encryption**: Consider encrypting sensitive incident data (future)

---

## Version Requirements Summary

| Technology | Minimum Version | Recommended | Notes |
|-----------|----------------|-------------|-------|
| Chrome/Edge | 90+ | Latest | Chromium-based |
| Firefox | 88+ | Latest | ES6 modules support |
| Safari | 14+ | Latest | LocalStorage 10MB+ |
| Node.js | N/A | 18+ LTS | Only for optional dev tools |
| Git | 2.0+ | Latest | Version control |

---

## Technology Decisions Rationale

### Why Vanilla JavaScript?
- **Simplicity**: No framework learning curve
- **Longevity**: Code will work indefinitely
- **Performance**: No framework overhead
- **Transparency**: Easy to audit and understand

### Why LocalStorage over IndexedDB?
- **Simplicity**: Synchronous API is easier to use
- **Sufficient**: 5-10MB is enough for 100+ incidents
- **Compatibility**: Better browser support
- **No Transactions Needed**: Our data model is simple

### Why No Build Process?
- **Developer Experience**: Edit and refresh workflow
- **Simplicity**: No npm, webpack, babel complexity
- **Maintainability**: Future developers can easily understand
- **Deployment**: Copy files, done

### Why Hash-based Routing?
- **No Server Config**: Works with any static host
- **File Protocol**: Works with `file://` for offline use
- **Simplicity**: No history API fallback handling needed

---

**Document Version**: 1.0
**Last Updated**: 2026-02-04
**Status**: Initial version - comprehensive tech stack documentation for BCM v0.2
