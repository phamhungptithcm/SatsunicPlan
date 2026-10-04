# SatsunicPlan

Cloud target: **satsunicplan**. Local tests retain an isolated demo project.
See [incremental Firebase deployment](docs/satsunicplan-firebase-runbook.md).

React + TypeScript + Vite + Firebase replatform based on a pinned Plane Community source reference. The local agent pilot uses MCP; no embedded LLM or coding runtime. A scoped human beta is deployed at [satsunicplan.web.app](https://satsunicplan.web.app). Cloud MCP is unavailable; full M1/master/product production readiness remains incomplete. See [deployment receipt](docs/sp-beta-001-deployment-receipt.md).

## Local setup

Requirements: Node >=22.12, npm, Java >=21, installed Google Chrome for browser tests. Lockfile pins dependencies. SP-PROD-001 local build/unit/backend checks ran cached Node22.23.3/Java24; deployed Node22 API and real Hosting Auth/API acceptance now have scoped beta evidence in docs/evidence/sp-beta-production. Earlier evidence used Node25.

```sh
npm ci --ignore-scripts
npm run build
npm test
npm run emulators
```

In a second terminal:

```sh
npm run seed:emulator
npm run dev
```

Open http://127.0.0.1:15173. Emulator ports: Auth19099, Firestore18080, Functions15001, Storage19199, hub14400. Existing emulators on default ports are untouched. `emulators` imports its own synthetic snapshot when present and exports on normal exit into `tests/.emulator-data`. Tests start their own ephemeral suite; stop this candidate’s manually started suite before tests to avoid port conflicts.

Synthetic accounts: `author@example.test` and `reviewer@example.test`, both password `Synthetic-only-2026!`. The seed uses domain commands for documents/contracts/work, plus emulator-only membership setup for the independent reviewer. This does not prove invite/membership onboarding implementation. Do not use these credentials for real services.

`seed:emulator` verifies this suite’s inventory and refuses missing/mismatched endpoints. Test fixtures require exact loopback emulator env and `demo-hunpeolabs-workspace`. CLI config is isolated; ADC env points to a nonexistent task-local path. Never set real production IDs or credentials. Nonlocal UI/runtime is fail-closed.

## Verified workflow and limitations

Create work with AC → save/refresh → publish contract against approved document revision → another authorized human approves → external SDK client recommends/claims → reads all required exact context parts → checkpoints → submits reported evidence → independent human reviews → current roadmap/read-back reflects acceptance. Claim does not change assignee or start implementation. Submission is not acceptance; Done is not deployment.

The SDK harness is **not** Codex/Claude/Antigravity/Kimi client verification. PAT pilot is not OAuth. Source runtime parity, full Plane inventory, OAuth, GitHub provider verification and large-scale performance remain unverified. Knowledge is currently plain text/Markdown revision editing, not the full rich editor experience. Reports are a bounded current cohort; historical KPI/projections are not implemented. Full scope is retained in docs/requirements-v2.csv.

## Verification

```sh
npm run typecheck
npm run lint
npm run test:rules
npm run test:integration
npm run test:mcp
npm run test:auth
npm run test:e2e
npm run verify
```

`lint` currently runs strict TypeScript static checks; no standalone stylistic ESLint gate is claimed. `verify` is nonzero on failed mandatory local checks, starts/checks Emulator Suite, and never opts into real providers. Browser screenshots and structured result: docs/evidence. Dependency audit must be reviewed separately: runtime tree patched; tooling advisories remain tracked. No automatic audit-fix-force or dependency downgrades.

## MCP pilot

Local endpoint: `http://127.0.0.1:15001/demo-hunpeolabs-workspace/us-central1/mcp`. Create a project-scoped grant with consent in Connect agent. Store the displayed secret securely outside the repo; do not capture token UI in screenshots. Every call rechecks current membership/project/grant. Human-only capabilities cannot be delegated. Read-only connection tests use initialize/list tools/resolve; grant issuance does not claim work.

See docs/mcp-api.md, docs/mcp-auth.md and docs/mcp-clients.md. Do not configure global clients blindly. Transport/SDK evidence and actual-client evidence are separate.

## Release boundary

The first human beta was deployed with explicit owner authority, selected billing and Singapore Firestore. Production frontend source is tagged `v0.1.0-beta.1+build.1`; the earlier immutable `v0.1.0-beta.1` source prerelease is retained. Read [release notes](docs/releases/v0.1.0-beta.1.md) and [exact-candidate receipt](docs/sp-beta-001-deployment-receipt.md). Cloud activation requires verified public settings and exact API Host/Origin allowlists; missing or mixed configuration is rejected. MCP stays disabled in cloud. Full master coverage, actual agent clients, operations/restore/performance and full transitive license audit remain incomplete. Root AGPL LICENSE and retained third-party notices apply to the owner-approved public source distribution. Future deployment requires fresh authorization/readback/rollback evidence; do not deploy local or synthetic browser builds. The preparation helper retains legacy selector/blocker metadata and is not a deployment executor. No Plane backend or commercial email helper was copied.

## Plane Community source reuse

The approved HWS-V2-002 candidate adopts reviewed Community frontend source from v1.4.2 into `vendor/plane-community`, with AGPL notices/license and exact source/adaptation hashes in `docs/plane-reuse-manifest.json`. The live roadmap uses BaseGanttLayout/GanttChartRoot, view store and upstream calendar/view helpers through a project-scoped Firebase adapter. Chart UI/sidebar are adapted; full upstream app runtime and parity are not certified. Issue/editor ports and disabled drag/reorder/dependency/pagination capabilities remain future work. See THIRD_PARTY_NOTICES.md and docs/migration.md before distribution.

Ask UI now reuses HunpeoLabs source motion and stylesheet with a bounded local usage-help adapter. AI is not connected. See `docs/ask-product-content-review.md` and `docs/firebase-readiness-gap.md` for evidence and remaining gates. Source-reference and delayed-response fixtures are test-only and do not demonstrate provider integration. Reusing an already-owned local emulator session requires explicit `HWS_REUSE_LOCAL_SERVICES=1` and direct Playwright invocation; `npm run test:e2e` owns and starts a separate emulator lifecycle and must not be run against occupied ports.
