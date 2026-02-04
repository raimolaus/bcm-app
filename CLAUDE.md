# claude.md
## AI Working Rules for BCM App Repository (FINAL)

---

## PURPOSE

This file defines **how Claude (and other AI tools)** must behave when working in this repository.

This is:
- an AI behavior contract
- an execution rulebook
- a safeguard against regressions, scope creep, and hallucinations

This is NOT:
- product documentation
- architecture documentation
- a roadmap
- a prompt library
- instructions for humans

If there is any conflict:
👉 **Canonical documents always win.**
Precedence:
- If multiple AI instruction files exist, this claude.md is the highest-priority instruction for this repository.

---

## CANONICAL DOCUMENTS (SOURCE OF TRUTH)

Claude MUST treat the following documents as authoritative and binding:

- docs/PRD.md
- docs/APP_FLOW.md
- docs/FRONTEND_GUIDELINES.md
- docs/BACKEND_STRUCTURE.md
- docs/TECH_STACK.md
- docs/IMPLEMENTATION_PLAN.md

Rules:
- If code behavior conflicts with canonical docs → **code is wrong**
- Canonical documents must never be silently modified

---

## NON-CANONICAL DOCUMENTS (CONTEXT ONLY)

These documents provide context but do NOT define truth:

- docs/dev-notes.md
- docs/changes/*
- README.md
- progress.txt

Claude must NOT treat these as requirements.

---

## SESSION START RULE (MANDATORY)

At the beginning of EVERY session, Claude MUST:

1. Read `progress.txt`
2. Understand:
   - what is DONE
   - what is IN PROGRESS
   - what is NEXT
3. Ask for clarification if the task is ambiguous

Claude must NOT assume context from previous chats.

If progress.txt is missing or empty:
- Assume an initial/unknown state and ask the user what to do next.

---

## IMPLICIT CONSENT RULE (IMPORTANT)

If the user prompt:
- clearly states WHAT to do
- clearly defines SCOPE (files, folders, features)

👉 **Consent is implicitly granted.**

Claude MUST:
- proceed without asking for permission
- execute directly within the defined scope

Claude MUST ask for confirmation ONLY if:
- the change exceeds the stated scope
- the change conflicts with canonical documents
- the change introduces new behavior or features
- the change affects files not mentioned

---

## CHANGE SCOPE RULE

Claude MUST work ONLY on files explicitly named or clearly implied by the prompt.

Claude MUST NOT:
- refactor unrelated code
- clean up opportunistically
- touch files outside scope
- improve things “just in case”

If a file is not mentioned:
👉 **do not touch it**

---

## ASSUMPTIONS SURFACING (MANDATORY WHEN NON-TRIVIAL)

Before implementing non-trivial changes, Claude MUST explicitly list:

ASSUMPTIONS I AM MAKING:
- ...

Especially regarding:
- incident lifecycle and status semantics
- LocalStorage usage
- SAVE vs auto-save behavior
- UI hierarchy and color meaning
- ACTIVE vs CLOSED interpretation

Notes:
- This is an OUTPUT REQUIREMENT (informational), not a request for permission.
- If scope is clear, proceed after listing assumptions (do NOT wait for confirmation).
- If there are no meaningful assumptions, write: "ASSUMPTIONS I AM MAKING: None".

Non-trivial heuristic:
- Treat changes as non-trivial if they affect: state, persistence (LocalStorage),
  navigation/flow, or any user-visible behavior.

If assumptions cannot be verified:
👉 STOP and ask.

---

## CONFUSION MANAGEMENT (STOP RULE)

If Claude encounters:
- conflicting information between documents
- ambiguity in expected behavior
- unclear intent

Claude MUST:
1. STOP
2. Clearly name the confusion
3. Ask a targeted clarification question

Claude must NEVER guess.

---

## DOCUMENTATION IMPACT ANALYSIS (MANDATORY)

After proposing or completing any change, Claude MUST include a section titled exactly:

DOCUMENTATION IMPACT ANALYSIS

All canonical documents MUST be listed:

PRD.md → YES / NO (reason)

APP_FLOW.md → YES / NO (reason)

FRONTEND_GUIDELINES.md → YES / NO (reason)

BACKEND_STRUCTURE.md → YES / NO (reason)

TECH_STACK.md → YES / NO (reason)

IMPLEMENTATION_PLAN.md → YES / NO (reason)


Rules:
- Claude may ONLY analyze and recommend
- Claude must NOT update documentation without explicit instruction
- Final decision ALWAYS belongs to the human
Format rule:
- The exact formatting is flexible, but ALL 6 canonical docs must be listed with YES/NO and a short reason.
- Required whenever proposing or implementing changes.
- If NO changes are proposed/implemented in the response, this section may be omitted.

---

## DOCUMENTATION UPDATE RULE

Logic:
1. Determine whether the change is:
   - bugfix
   - refactor
   - behavior change

2. If behavior changes:
   - documentation review is REQUIRED
   - documentation update is OPTIONAL and requires approval

Claude must NEVER:
- auto-update canonical documentation
- silently modify documentation
- assume documentation “must be updated”

---

## FEATURE INVENTION RULE (STRICT)

Claude MUST NOT:
- invent new features
- extend scope beyond PRD
- implement ideas from dev-notes
- add “nice-to-have” improvements

If a requested change implies new behavior:
👉 STOP and ask for confirmation.

---

## REFACTORING RULE

Refactoring is allowed ONLY if:
- explicitly requested
- scoped and minimal
- behavior-preserving

If refactoring risks behavior change:
👉 treat as feature change and STOP.

---

## BCM-SPECIFIC LOCKED BEHAVIORS

Claude MUST respect the following:

- No backend
- LocalStorage only
- Offline-first
- No auto-save (explicit SAVE only)
- Status is derived, not stored separately
- No automatic status transitions
- Incidents are never deleted, only CLOSED

Violations are bugs, not feature requests.

---

## OUTPUT FORMAT EXPECTATIONS

Responses should be:
- concise
- explicit
- scoped
- actionable

Preferred structure:
- brief explanation (if needed)
- patch / code
- required analysis sections

Avoid:
- long narratives
- architectural redesigns
- speculative improvements

---

## CHANGE SUMMARY (MANDATORY OUTPUT SECTION)

Every response that includes changes MUST end with:

CHANGE SUMMARY
- What I changed:
- What I did NOT touch:
- Risks / things to double-check:

---
## ERROR RECOVERY RULE (WITHIN SCOPE)

If a change causes an error or breakage:
1) Identify the most likely cause related to the scoped changes.
2) Propose a fix strictly within the original scope.
3) Do NOT expand scope to "prevent future errors" unless explicitly requested.
4) If fixing would require scope expansion or behavior change → STOP and ask.


## FAILURE MODE

If unsure:
- STOP
- ASK
- DO NOT GUESS

Guessing causes regressions.

---

## FINAL RULE

Claude is a **tool**, not an architect.

- The human decides:
  - what to change
  - whether documentation updates happen
  - when work is complete

Claude executes carefully, transparently, and conservatively.

---

END OF FILE
