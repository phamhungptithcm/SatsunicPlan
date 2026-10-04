# SP-UI-002 v1 — Clean product shell

Status: APPROVED by human message “apporved” after SP-UI-002 plan in this chat. Supersedes presentation portions of SP-UI-001 only for this delta.

## Evidence

Repository Intelligence Gate 2026-10-04: DEGRADED (stale CodeGraph, unhealthy/stale CocoIndex). Bounded source verified main.tsx lines66/68/79 and app.css sidebar/mobile rules. Login shows emulator badge and seed-account hints; sidebar shows synthetic badge, email and text sign-out; content footer exposes local Firestore/time/role. Auth is Firebase User; displayName/photoURL may be absent. Other session owns Ask/backend/config; shared main.tsx handoff requested before edits.

## Design

White/light-gray sidebar, quieter spacing and active blue navigation. Bottom account row: circular initials avatar, one truncated user name, adjacent icon-only Sign out with accessible name, tooltip and visible keyboard focus. Prefer actual displayName; otherwise use readable email local part, never invent a personal name. No external avatar fetch needed. Below row: “Product by HunpeoLabs” as quiet plain text, no invented URL.

Remove Local synthetic workspace, login Local emulator/synthetic data badge, seed-account hint, and Read from local Firestore footer. Change Create local account to Create account without changing its operation. Remove generic PROJECT DELIVERY eyebrow if it adds visual noise. Keep project identity and useful state/error messages, dates, status, baseline, permissions and evidence meaning. Do not rename or delete synthetic fixture records; user data is separate from chrome copy. Technical diagnostics that are necessary in agent workflows remain intact pending separately scoped review.

## Files and impact

src/app/main.tsx: narrow shell/login copy and account-row presentation, preserve auth/signOut, scope clearing, Ask wiring and data flows. src/styles/app.css: scoped account/footer/nav styles and responsive treatment. No backend, vendor, dependencies, configuration, API, schema or deployment changes. Low-risk presentation change; regressions may affect overflow, keyboard targets, missing-profile fallbacks and mobile layout.

## Validation and handoff

Approval record before protected edits; reread current source hashes after peer handoff. Typecheck/build; targeted source validation for unchanged auth callback and missing-name fallback. Browser desktop/mobile, narrow width, keyboard focus, login and sidebar screenshot if browser policy permits; otherwise explicitly BLOCKED. Complete product content review and final implementation review, preserving existing missing-HEAD limitation. Rollback uses source snapshots of owned narrow edits, never reset shared WIP.
