# SatsunicPlan

Cloud target: **satsunicplan**. Local tests retain an isolated demo project.
See [incremental Firebase deployment](docs/satsunicplan-firebase-runbook.md).

React + TypeScript + Vite + Firebase replatform based on a pinned Plane Community source reference. MCP is the primary external-agent workflow; no embedded LLM or coding runtime. This is an **incomplete local candidate**, not a completed M1/full product or production release.

## Local setup

Requirements: Node >=22.12, npm, Java >=21, installed Google Chrome for browser tests. Lockfile pins dependencies. SP-PROD-001 local build/unit/backend checks ran cached Node22.23.3/Java24; deployed Functions Node22 compatibility and live acceptance remain NOT RUN. Earlier evidence used Node25.

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

Do not deploy this candidate. SP-PROD-001 adds explicit human cloud-runtime opt-in for local validation; missing or mixed configuration is rejected, and MCP cloud stays disabled. Live Auth/API/security/operations acceptance is still required before release. See docs/satsunicplan-firebase-runbook.md. Application Hosting config is preparation only; the separately approved static preview does not serve a working backend. No billing, production access, push, merge or package publish is authorized. The reference checkout stays separate; reviewed Community frontend source is now included in the target build. No Plane backend or commercial email helper was copied. See THIRD_PARTY_NOTICES.md and docs/migration.md.

## Plane Community source reuse

The approved HWS-V2-002 candidate adopts reviewed Community frontend source from v1.4.2 into `vendor/plane-community`, with AGPL notices/license and exact source/adaptation hashes in `docs/plane-reuse-manifest.json`. The live roadmap uses BaseGanttLayout/GanttChartRoot, view store and upstream calendar/view helpers through a project-scoped Firebase adapter. Chart UI/sidebar are adapted; full upstream app runtime and parity are not certified. Issue/editor ports and disabled drag/reorder/dependency/pagination capabilities remain future work. See THIRD_PARTY_NOTICES.md and docs/migration.md before distribution.

Ask UI now reuses HunpeoLabs source motion and stylesheet with a bounded local usage-help adapter. AI is not connected. See `docs/ask-product-content-review.md` and `docs/firebase-readiness-gap.md` for evidence and remaining gates. Source-reference and delayed-response fixtures are test-only and do not demonstrate provider integration. Reusing an already-owned local emulator session requires explicit `HWS_REUSE_LOCAL_SERVICES=1` and direct Playwright invocation; `npm run test:e2e` owns and starts a separate emulator lifecycle and must not be run against occupied ports.
