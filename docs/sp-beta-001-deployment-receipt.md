# SP-BETA-001 first human beta — 2026-10-04

Production URL: https://satsunicplan.web.app. Scoped human beta is deployed; this is not full master/product production-readiness acceptance. Public cloud MCP was not deployed.

## Authority and exact candidate

User requested production beta, commit/push main and tag/release notes; selected billing01428C-358437-2361F8 and FirestoreSingapore; approved public AGPL distribution. Immutable source prerelease v0.1.0-beta.1 points to ac1462446e909f5980b19319a080edb22709235f. Subsequent approved cloud-login correction was committed/pushed as a7174e9a82d40c0cf6343396cd86cf4d8fcfb7ea. Production build tag v0.1.0-beta.1+build.1 points to that exact correction commit. Deployed frontend was built from a clean git archive of that exact correction commit; backend source is byte-identical between those commits. Source prerelease tag was not moved after publication.

## Provider readback

Billing enabled using owner-selected account. Default Firestore FIRESTORE_NATIVE at asia-southeast1 with DELETE_PROTECTION_ENABLED. Email/password Auth enabled; verified domains satsunicplan.web.app and satsunicplan.firebaseapp.com. WEB app registered and verified public SDK settings used only in the ignored cloud build; credentials/session material excluded from Git/evidence. API Node22/us-central1/maxInstances3 deployed; existing source region retained rather than conflating the owner-selected database location with a backend source rewrite. Cloud API human activation uses exact read-back Cloud Functions and Cloud Run hosts plus canonical Hosting origin; backend patch changed environment only, not IAM/source/auth controls.

Firestore Rules/indexes deployed. API initially closed (503 verified), then missing/invalid bearer401 and wrongOrigin403 verified after activation. Rules default-deny remains; agent MCP not deployed. No Storage bucket provisioned or production customer data imported. Synthetic acceptance workspace retained with explicit fixture name; its account was revoked/disabled after every final successful cycle.

## Validation and review cycles

1. Source publication review found nested generated browser results; removed from index, preserved locally and added recursive ignore. Fresh independent source review APPROVED, Node22 staged-source build/25tests PASS, annotated source tag/main/readback and published prerelease verified.
2. Cloud login correction removes emulator credentials only in cloud; build/25tests and three-width rendered fixture regression PASS, scoped content/independent review APPROVED.
3. Initial deployment used functions:api selector and aborted before Functions creation. Correct selector functions:workspace:api deployed API plus Rules/indexes. CLI ended1 after successful create because image cleanup policy absent; provider ACTIVE/source/revision readback confirmed deployment. No automatic image deletion policy enabled.
4. Live API probe first passed missing/invalid bearer, Origin denial, real synthetic signup, signed read, workspace transaction and persistence. Probe then used wrong operation name; Auth admin cleanup lacked quota header. Corrected probe used get_project_status and scoped quota header, passed cross-scope403 and revoked-token401, disabled fixture200. No IAM added and no global auth settings changed to bypass denial. See live-api-results.json (both cycles retained).
5. Scoped pre-Hosting independent review APPROVED. Exact production build has5files. Hosting deploy succeeded; served bytes/hash comparison5/5 PASS. Actual browser through production Hosting, real Firebase Auth and actual /api passed1440/390px, refresh/project-view/agent-unavailable states and no page errors. Same isolated fixture temporarily enabled, then revoked/disabled200. Screenshots and browser-results.json are synthetic-account live evidence; no real customer identities or secrets.

## Gates and remaining work

Final independent readback review APPROVED: scoped deployed human beta PASSED; reviewed exact artifact/provider/live-browser evidence. Full master A01–A64, all lifecycle/knowledge/report features, public MCP OAuth, actual Codex/Claude/Antigravity/Kimi acceptance, CI assurance, operations/restore/performance and full accessibility/localization remain NOT_READY/NOT_TESTED. Existing505.9KBchunk warning retained. Full transitive license audit incomplete; owner accepted AGPL source distribution posture, not a legal audit certificate. Preparation-only helper still has legacy selector/blocker metadata; actual commands/readback in this receipt are authoritative, helper is not a deploy executor.

No previous live Hosting release existed at baseline. Rollback of this new beta closes human API activation and disables the new Hosting release; never deletes Firestore or retained audit/fixture data. Restore/rollback drill NOT_TESTED. Artifact Registry image cleanup remains unset (storage charges possible); no deletion policy was silently introduced. No broad full-production claim.

Token usage: Unavailable. Actual billed model/tool cost: Unavailable. Runtime ledger CLI unavailable; evidence is file/provider-backed, no runtime ledger receipt invented. Memory candidates: None.

## Quality gates and completion

Detected TypeScript5.9/React19/Vite8/Firebase12/Functions7/Admin14, Node22 cloud runtime; relevant universal, TypeScript/JavaScript, web, API, security, database/transaction, infrastructure/operations and product-content profiles applied through source/runtime review. Compilation and strict static checks PASSED; unit/config/provenance25/25 PASSED. Isolated backend12 groups PASSED in preceding unchanged-backend slice; current live Auth/API signed success/denial/revocation and scoped persistence PASSED. Database creation/readback and exact deployed restrictive Rules hash PASSED. API/domain schema compatibility PASSED (unchanged). Scoped architecture/boundary/security/visual/content review PASSED. Public SEO/GEO and new motion changes NOT_APPLICABLE (no such feature changed). Full browser master suite, screen reader and complete local npm run verify remain NOT_RUN/BLOCKED as documented in slice receipt; these are not substituted by beta smoke. Observability/rollback posture reviewed, actual alarm/restore/rollback rehearsal NOT_TESTED. Mandatory runtime ledger recording unavailable; no invented receipts or READY full-production result.

Beta criteria verified: main push, immutable source/build tags, published notes, provider bootstrap, live human security/persistence, exact Hosting artifact/readback, and independent scoped review. Full master progress cannot be derived from these seven scoped criteria; weighted global completion Unavailable. Git final state and release readback are recorded after documentation commit. No known additional blocker was found within the scoped executed beta checks. Token usage/cost remain Unavailable; Memory candidates None.

Final documentation consistency review APPROVED (cycle8). Reviewer sandbox CocoIndex health was DEGRADED; root elevated refreshed gate was READY at deployed source SHA. Bounded native/provider evidence remains the release basis.
