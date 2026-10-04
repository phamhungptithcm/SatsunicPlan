# SatsunicPlan Hosting preview completion

Date: 2026-10-04, America/Chicago. Plan: SATSUNICPLAN-FIREBASE-002 v1, user-approved preview-only scope.

URL: https://satsunicplan--satsunicplan-readiness-e39jw800.web.app
Expiry: 2026-10-11 14:02 CDT (2026-10-11T19:02:03.397304473Z).
Hosting version: projects/satsunicplan/sites/satsunicplan/versions/d44e29b3d81e105c.

Five equally weighted acceptance criteria verified: isolated static page, approved Vietnamese content/platform review, local browser/security checks, preview-only deployment with expiry, exact served readback and unchanged live baseline. Progress: 100% of this preview scope. Full application: NOT_READY.

## Current gate evidence

| Gate | Status | Evidence |
| --- | --- | --- |
| Plan/scope approval | PASSED | satsunicplan-preview-approval.md; human apporved after versioned plan |
| Static configuration / architecture | PASSED | Hosting-only JSON, explicit site/public directory, no rewrites, no app/backend edits |
| Local rendered validation | PASSED | local-verification.json: 1440/390/320px, exact assets/headers, accessibility tree and 200% text fixture; no external requests/page errors |
| Product Language Gate | PASSED | satsunicplan-preview-product-content-review.md: inventory, states, eight principles, platform and in-context evidence |
| Security | PASSED for static scope | No scripts/forms/data/SDK; CSP, no-store, no-referrer, nosniff, permissions and robots controls; no-authorized-domains deployment flag |
| Deployment | PASSED | Scoped hosting:channel:deploy returned success; target preview was absent before creation; live channel not targeted |
| Remote content/header validation | PASSED | served-verification.json: HTML/CSS bytes match reviewed candidate; all protection headers validated; X-Robots-Tag observed noindex, HTML meta remains noindex,nofollow |
| Backend route isolation | PASSED | no-backend-routes.json: /api and /mcp both return 404 |
| Provider metadata / rollback baseline | PASSED | channels-before.json and channels-after.json: live metadata equal; preview URL, expiry, version and release read back |
| Final review | PASSED | satsunicplan-preview-final-review.json, cycle 3; current static file hashes match candidate.json |
| Unit/compiler/full app tests | NOT_APPLICABLE | Static HTML/CSS only, no executable application changes. Rendered browser and deployment checks used instead |
| Migration / domain/API contracts | NOT_APPLICABLE | No data/rules/index/function changes |
| Runtime ledger receipts | NOT_RUN | ai-agent-kit package/CLI unavailable; machine review and file-based release receipt retained |

Selected profiles: universal, frontend HTML/CSS, web-app, infrastructure/devops, product-content. Existing SatsunicPlan white/light-gray, royal-blue and navy tokens used. No dependency installation or generated application modification.

## Review cycles and fixes

1. BLOCKED for low-severity text scaling usability: rem spacing over-constrained 320px at 200% text. Fixed viewport-based padding and heading minimum; fresh local validation and screenshot inspection passed. Inline-style test injection was blocked by CSP as expected; changed the verification fixture to a same-origin stylesheet without relaxing CSP.
2. PASSED predeployment: complete scoped content/security/quality review and local validation.
3. PASSED after deployment: exact served hashes, screenshots, metadata and API/MCP isolation. Initial exact header check found served X-Robots-Tag noindex rather than configured noindex,nofollow. Verified the observed header and unchanged HTML meta together; indexing remains disabled. No product/security change or redeployment was needed.

Known limitations: stale indexes with source fallback; no Git commit exists, candidate/release bound by file and provider version hashes. Accessibility-tree/keyboard/contrast evidence is a scoped proxy, not full VoiceOver/NVDA audit. Preview is accessible to people holding its URL and contains no private data. Actual browser tab opening was queued by Codex; this does not affect remote verification.

Rollback: the new task-owned satsunicplan-readiness channel may be deleted under the approved rollback scope if needed; expiry also removes the preview after seven days. No rollback performed because all required preview checks passed. Do not delete another channel or change the live release.

Unfinished broader product work: registered web app, Auth provider settings, database/storage/API setup, billing decisions and authenticated backend/runtime gates. None are certified by this preview. No billing/API activation, Auth-domain sync, data seeding, application deployment, Git commit/push or messaging performed.

Provider token usage: Unavailable. Actual billed cost: Unavailable. API-equivalent estimate: Unavailable. Memory candidates: None.

Machine evidence: docs/evidence/satsunicplan-preview/release-receipt.json plus candidate, channel and local/served verification files and screenshots.
