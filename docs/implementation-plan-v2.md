# HWS-V2-001 / version 1 — proposed implementation plan

Approval: APPROVED by human message "approved"; evidence in docs/approval-HWS-V2-001.md. Risk: HIGH (tenant isolation, grants, concurrency, immutable approvals).

## Outcome and verified starting point

Deliver project/task → approved contract → recommend → atomic MCP claim → exact context → checkpoint/submission → human review → truthful persisted roadmap, then M2/M3. Current target has no application execution path. Preserve all supplied uncommitted files and policy. Intelligence refreshed once; both indexes READY before planning. CodeGraph located approval validator; CocoIndex located approval record and workflow. Source evidence and limits are in migration.md.

## Architecture and boundaries

One React/TypeScript/Vite UI; Firebase Auth, Firestore, Storage, Hosting and TypeScript Functions. UI and MCP use shared application handlers; pure domain logic for eligibility, scheduling, metrics and context compilation. MCP uses an official pinned SDK in Functions Streamable HTTP. No standalone backend, embedded model, provider model keys or agent runner. Thin stdio adapter only if verified client interoperability requires it. No global client configuration changes.

Identity comes from verified Firebase human sessions or dedicated scoped grant verifiers. Resource access intersects current membership, project policy, capability, grant and resource ACL. Human-only approval endpoints reject delegated credentials even when principal is admin. Browser direct writes cannot mutate approvals, claims, evidence trust or Done.

Pilot auth: dedicated expiring/revocable opaque bearer grant with hashed verifier, issuance shown once. OAuth remains a separate feasibility/security/public-release gate; PAT is never labeled OAuth. Exact SDK/protocol/package versions must be checked from official sources and locked before use. New dependency exceptions or materially different architecture require delta approval.

## Proposed files and functions (approval scope)

| Paths | Responsibility / planned functions |
|---|---|
| package.json, package-lock.json, tsconfig*.json, vite.config.ts, index.html | pin compatible stable toolchain; dev/build/verify scripts |
| src/app/**, src/components/**, src/styles/** | routes, project context, inspector, accessible responsive primitives and temporary documented tokens |
| src/features/projects/**, src/features/work-items/** | onboarding/membership, create/edit/archive/restore, scoped paging, task AC and version conflicts |
| src/features/knowledge/**, src/features/implementation-context/** | revision editor/review, pinned contract/context preview, protected fallback export |
| src/features/roadmap/** | baseline overlay/forecast/actual, inspector, scheduling form and drag alternative |
| src/features/settings/** | scoped grant consent/issuance/revoke/read-only connection test |
| src/features/executions/**, src/features/reviews/** | checkpoints, blocker/decision inbox, handoff and exact revision human acceptance |
| src/features/reports/**, src/features/releases/** | M3 metrics/drill-down/client dossiers/deployment history |
| src/lib/firebase/**, src/domain/** | emulator-only development wiring and non-sensitive shared types/pure view semantics |
| functions/package.json, functions/package-lock.json, functions/tsconfig.json | pinned Functions/Admin/MCP/validation dependencies |
| functions/src/application/** | resolveProject, listWork, recommendWork, claimWork, renew/release, compile/readContext, checkpoint/resume, submit/review, publishBaseline, recordDeployment |
| functions/src/domain/** | state machines, eligibility/rank, conflict scope map, contract hashes, evidence freshness, calendar rules, metrics |
| functions/src/auth/** | verified RequestContext, current ACL/capabilities, hashed grants, revoke/expiry, limits; OAuth feasibility |
| functions/src/adapters/firebase/** | transaction/idempotency/outbox, bounded queries, durable manifests, private artifacts |
| functions/src/adapters/mcp/** | all 15 required tools, schemas/errors, stateless protocol lifecycle, resources/prompts with repeated ACL |
| functions/src/adapters/github/** | read-only allowlisted repo/SHA binding, raw-body signatures, dedupe/reconcile; provider use separately authorized |
| firebase.json, firestore.rules, firestore.indexes.json, storage.rules, .env.example | demo emulator configuration, deny-default policies, query indexes; no real IDs/secrets |
| tests/** | domain, rules, emulator integration, protocol/auth, browser, fixtures and benchmark evidence |
| docs/**, README.md, THIRD_PARTY_NOTICES.md | authoritative coverage/provenance/operations/current results; generated evidence labeled |

Policy, prompt files, existing Git state, global agent config and other repositories are excluded. Do not edit generated kit assets. Conditional adapter paths need documented evidence before creation. No CI deployment or production import in scope.

## Delivery order

1. M0: finish pinned source traces/license inventory; permission/access/query/threat models; select licensed editor/UI approach; fail-closed emulators; authenticated SDK read and protected mutation; OAuth/PAT feasibility.
2. M1: connect real persisted UI project/work/document/contract flow to shared handlers and MCP; exclusive default claim with server lease/fencing; immutable context parts; checkpoint/submit; independent human review; one baseline/forecast/actual roadmap. Verify refresh and sign-out/read-back. Implement useful export fallback.
3. M2: scopes/handoff recovery, decisions/drift/impact, evidence revision staleness, all client guides and verified available clients; GitHub signed fixtures and authorized real provider checks; full roadmap interactions.
4. M3: full source feature coverage, knowledge/templates, historical KPI/report projections, client approvals/dossiers/releases/deployment records, accessibility/performance/recovery/public OAuth gates.

M1 completion cannot close full product scope. Implement and verify one slice before expanding screens. Unavailable clients/providers remain BLOCKED/NOT RUN.

## Transactions, failure paths and security

Claim transaction reads authoritative task/contract/policy/dependency/membership/grant and conflict generation. Server time enforces expiry independently of TTL cleanup. Every execution mutation rechecks generation/owner/current grant. Digest-bound idempotency scoped by principal/operation/execution prevents divergent replay; external side effects stay outside retry callbacks. Submission only queues review and releases claim transactionally. Human acceptance binds contract/delivery/SHA; no generic update bypass.

Published revisions/contexts/baselines/submissions immutable. New scope makes new contract; drift never repins active execution. Revoke blocks next read/write; cached cursors are no authorization. Unauthorized references cannot leak names/counts. Work-item workflow differs from execution and deployment. Events share transaction/outbox with business change; projections dedupe/rebuild with watermark.

Expected versions detect concurrent document/schedule changes; no last-write-wins. Export stages before finalize and checks ACL on download. Bound page/file/byte/depth/lease/request budgets; sanitize rich text/Mermaid/URLs/ZIP/CSV. No arbitrary network fetch/eval/shell tools. Partial failures return actionable structured errors; bounded retry, no fake saved/verified state.

## Performance, compatibility and rollback

Scoped cursor queries, interval-overlap roadmap queries and unsubscribed listeners; no browser whole-project report computation. Benchmark 5,000 items/200 documents in two synthetic workspaces; record actual cost/read/write/listener measurements. No production capacity/cost assertion from emulator.

No existing app/data migration currently needed. Preserve source mappings and historical revisions if imports later approved. Local rollback removes only new approved implementation artifacts after preserving evidence/WIP; no reset/clean. Production deployment and data migration require separate approval, backup and dry-run reconciliation.

## Validation and review gates

Map each coverage row to atomic assertions and A01–A64 Given/When/Then fixtures with independent expected values. Run typecheck/lint/build, domain tests, positive/negative Rules, transaction concurrency/replay/revocation, official SDK transport/auth tests and browser emulator E2E with read-back. Review desktop/tablet/mobile screenshots, keyboard/focus/timeline alignment and failure states. Real client/provider rows require their own version/surface/transport/auth evidence.

Selected profiles: universal, typescript-javascript, frontend-html-css, web-app, api, database, concurrency, visual-design, product-content, infrastructure. Product strings/states require write-product-content inventory and all eight principles with current UI evidence. Run final-implementation-review after approved implementation, fix in-scope findings and repeat verification/review. Versions/test tooling are not yet installed or verified.

## Approval requested

Approve HWS-V2-001 v1 paths above for local M0–M3 implementation and test/dependency setup, retaining all exclusions. Record human identity/task reference, scope/constraints and approved paths in an approval record; agent cannot self-approve. Legal file reuse, public OAuth security review, real client/provider access and deployment remain separate gates. Source tracing may refine file details within these boundaries; material schema/security/dependency/architecture deviation requires delta approval.
