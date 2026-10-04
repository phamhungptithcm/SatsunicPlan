# SatsunicPlan incremental Firebase plan

Plan ID: SATSUNICPLAN-FIREBASE-001 v1
Date: 2026-10-04
Status: PHASE 1 APPROVED AND IMPLEMENTED; cloud phases pending separate release approval

## Verified baseline and intelligence brief

Repository Intelligence Gate: DEGRADED; CodeGraph and CocoIndex health checks pass but both indexes are stale. Bounded source searches and reads verify the findings below. Git checkout has an unborn HEAD and extensive untracked existing work; preserve it and do not stage all files.

The user specifies product name SatsunicPlan and cloud project ID satsunicplan. Cloud existence, access, web app configuration, Hosting site, enabled Auth providers and billing are not yet verified.

The React 19 / Vite 8 / TypeScript 5.9 client initializes demo-hunpeolabs-workspace and connects to loopback Auth and API. Node 22 Firebase Functions initializes the same demo project and rejects non-emulator requests. Tests explicitly require demo project and loopback endpoints. firebase.json combines Hosting, Functions, Firestore and Storage configuration; no cloud project alias exists. README still uses the old product name. VITE_PRODUCT_NAME already defaults to SatsunicPlan.

Risk: medium for local configuration; high for deployed auth/API or rules. Project naming alone does not make the current runtime deployable.

## Phase 1: local preparation (scope requested for approval)

- Add .firebaserc with an explicit cloud alias targeting satsunicplan; retain an explicit demo alias. Do not make a real project the implicit emulator target.
- Add separate, explicitly targeted deployment configuration and scripts so Hosting, rules, indexes and individual Functions are independent operations. Require explicit project/component selection, successful validation and a reviewed release receipt; no bare all-component deploy or automatic deployment.
- Add src/lib/firebase/config.ts and update client.ts to validate explicit emulator versus deployed settings. Emulator remains the default; cloud mode requires public Firebase web app configuration for satsunicplan and uses same-origin /api. No guessed API key, app ID, bucket or domain.
- Update .env.example and add a non-secret cloud template with unset required values. Keep credentials and personal CLI state out of source control.
- Keep backend cloud access fail-closed in this phase. Do not remove boundary checks in functions/src/adapters/firebase/http.ts.
- Update README.md and deployment runbook for SatsunicPlan, prerequisites, per-component steps and rollback. Preserve historical artifacts rather than rewriting them.
- Update src/app/main.tsx only where runtime-specific connection text/endpoint must remain accurate; inventory those strings and complete the Product Language review with in-context evidence.
- Add focused configuration tests for missing values, incorrect cloud project, loopback-only emulator mode and endpoint selection. Existing emulator tests keep their synthetic project and isolation.

Validate typecheck/build, focused configuration tests, existing unit tests and affected emulator/auth/browser checks. Run required final implementation review and record quality/completion evidence. Generated output is regenerated through build. No dependency, schema, domain, membership or authorization changes.

## Phase 2: authenticated read-only cloud verification

Verify satsunicplan project identity/access, web app public settings, Hosting sites, providers, deployed resources and runtime support. Record only non-secret metadata. Report missing prerequisites; do not create resources, enable billing or change IAM in this phase. Confirm the region before any backend rollout.

## Phase 3: Hosting preview

Use an explicitly approved preview-channel deployment with a static SatsunicPlan readiness page until the backend/auth release gates pass. Do not publish a working-app claim while the API remains local-only. Verify the exact built candidate, headers and channel readback. Rollback/delete only the approved preview channel.

## Phase 4: Auth, data rules and human API pilot

Prepare a separate delta plan after cloud readback: configure approved Auth providers, validate deployed server identity through ADC, enforce canonical Host/Origin allowlists, revocation and authorization, limits and monitoring. Deploy rules and indexes separately; wait for indexes. Release only the human API to an approved pilot. Never seed cloud data with emulator fixtures. Verify denial paths and authenticated end-to-end behavior. Backup/rollback details depend on the verified resource baseline; do not invent them.

## Phase 5: MCP and public release

Keep MCP disabled until independent OAuth/security and actual client compatibility evidence passes. Release MCP separately, then widen Hosting access only after exact-candidate acceptance. No scheduled publishing or blanket deployment.

## Constraints and rollback

Phase 1 approval covers local preparation only. Each cloud mutation requires its own concrete, reviewable release scope. Existing Auth/ACL/grant rules remain enforced. Fail closed on missing cloud settings. No production data changes, secrets, billing/IAM changes, Git commit/push or automatic release. Revert only scoped local edits for phase 1; later releases must record the prior resource version before mutation.

Memory candidates: None. Cloud readiness: NOT_READY. Phase 1 implementation and validation are recorded in docs/satsunicplan-firebase-completion.md; human approval is recorded in docs/satsunicplan-firebase-approval.md.
