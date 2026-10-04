# SP-UI-001 v1 — SatsunicPlan visual polish and branding

Status: APPROVED — human message "approved" in owning chat after SP-UI-001 v1 presentation. Owner: Run project locally, 01a1080f-686d-71d0-8067-3e1d40d32505. User request: polish UI following supplied Plane roadmap image; product name SatsunicPlan; coordinate sessions to prevent overwrite.

## Evidence and intelligence brief
Gate rerun: DEGRADED, both indexes stale, health passed. Bounded source inspection used; no whole-repository impact claim. React19/TypeScript5/Vite8. Current main.tsx contains hardcoded HunpeoLabs sidebar and fallback product name; index.html and .env.example retain old product name. Roadmap uses Plane BaseGanttLayout through TimelineProvider, with a blue plan bar and baseline/completion overlays. Existing stylesheet combines app shell and scoped Plane adaptations. All repository contents are untracked; preserve existing bytes, no reset/clean/stage-all. Runtime local Vite and synthetic Firebase suite started by this chat.

## Concrete visual direction
User screenshot is primary reference: white working surface, thin neutral dividers, compact breadcrumb and toolbar, aligned work list and timeline, generous usable chart area. Use white/light-gray surfaces, navy text, royal-blue primary action; status pastel fills with dark readable labels. Maintain baseline/current-plan/human-accepted meaning separately; never imply bar color is acceptance. Sidebar about 216px, compact navigation with consistent inline SVG icons, product mark and SatsunicPlan name. Page title about 22px, body13–14px, controls32–36px, rows56–64px. Simplify oversized headings and explanatory text placement; retain operationally necessary notices. Gantt bars show useful item titles where space permits; stable left column, sticky date header, aligned row heights. Restyle login, tables, forms, inspector, empty/error/loading states with the same tokens. Mobile preserves horizontal timeline scrolling and usable detail panel. No decorative screenshot frame added to working UI.

## File/function implementation scope
- src/app/main.tsx: productName fallback, login/sidebar mark and brand; shell/page-header markup only where needed for hierarchy. Preserve auth, request epochs, scope cleanup, mutations, permissions and Ask composition. Serialized handoff with implementation chat required before any edit.
- src/styles/app.css: coherent tokens, shell/sidebar/toolbar/forms/table/inspector/login styling, scoped timeline styles and responsive/focus/reduced-motion treatment. Do not reach into Ask CSS modules.
- src/features/roadmap/PlaneRoadmap.tsx: presentation of sidebar rows, title/key and plan labels; preserve item dates, callback, baseline/provider and completion semantics.
- index.html: browser title SatsunicPlan.
- .env.example: default product name SatsunicPlan; no credentials/config endpoints changed.
- docs/satsunicplan-ui-*: scoped plan, string/state review, screenshot evidence, verification and completion report.

Backend, API/schema, emulator project ID, domain rules, dependencies, vendor sources, licenses, Ask module, deployment and synthetic project records excluded. Product name does not rename user-created projects. No fake filters/view buttons or invented working features.

## Impact, validation and rollback
Shared CSS can affect every current page and modal; visually inspect those surfaces, keyboard focus and320/390/768/1440px layouts. Existing TypeScript/build and relevant browser smoke checks verify login, navigation, roadmap item opening and date display. Run scoped product-content review covering changed name, labels and all changed states; Purpose/Agency/Responsibility/Familiarity/Flexibility/Simplicity/Craft/Delight grounded in actual screenshots and behavior. Mandatory fresh final implementation review after approved work. Production remains NOT_READY; local visual evidence only. Rollback restores this chat's scoped changes from pre-edit byte snapshots after checking intervening hashes; never revert another session's changes.

## Session coordination
Implementation chat Triển khai HunpeoLabs Workspace M0–M owns Ask module and its current validation. Requested reservation of visual files above; src/app/main.tsx serialized, reread and hash before narrow patches. Index chat notified to remain in indexing scope. Messages delivered; acknowledgment pending. Shared docs/progress.md, docs/verification.md and .ai/local/implementation-approval.md are not edited by this planning turn. Reuse running local servers; no restart/reseed during another session's tests.

Approval requested: SP-UI-001 v1 visual/branding scope above after coordination resolves conflicts.

Gate refreshed successfully before implementation: READY; CodeGraph structural and CocoIndex semantic queries verified against current source. Visual ownership acknowledged in docs/session-coordination-implementation.md; main.tsx handoff pending.
