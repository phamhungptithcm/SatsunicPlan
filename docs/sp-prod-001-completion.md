# SP-PROD-001 v1 slice 6 — current implementation report

Date: 2026-10-04, America/Chicago. Local code recommendation: APPROVED after two independent cycles. Formal completion/production gate: BLOCKED; full product NOT_READY. This is an implementation progress report, not a release certificate.

## Outcome and rationale

Human cloud API/client now support explicit opt-in with validated project identity and exact HTTPS host/origin configuration. Unknown/missing/mixed config fails before data access. Cloud browser Auth never attaches the emulator, and commands use same-origin `/api`. Cloud MCP is rejected independently before authentication; cloud Connect agent does not show a grant form/local endpoint. Default local behavior and shared transactional authorization remain intact. No provider resources, billing, IAM, cloud data, deployment, commit/push or external communications were changed.

Authority: `approval-SP-PROD-001.md` references the human `apporved` message and reviewed slice 6 plan. Local harness/UI/package/documentation work also retains HWS-V2-001 authority. Initial indexes DEGRADED; bounded source evidence used as AGENTS.md allows. Final refresh/check returned READY with both indexes Current/health PASS. CodeGraph linked runtime boundary/frontend consumer, and CocoIndex retrieved current config/docs; source and executable checks verified critical conclusions. Index results also contain compiled/baseline copies, so graph evidence is bounded rather than whole-product assurance.

Stack/profiles: TypeScript5.9, React19, Vite8, Firebase Admin14.5/Functions7.4, npm, target Node22. Profiles: universal, typescript-javascript, API, web-app, infrastructure, product-content; existing database/concurrency authorization retained and regression-tested. No dependency, collection/schema or migration change.

## Changed files

- `functions/src/adapters/firebase/runtime-config.ts`: explicit emulator/cloud resolution, identity/mixed-env validation, bounded canonical allowlists and body checks.
- `functions/src/adapters/firebase/http.ts`: per-invocation boundary, credential-free SDK discovery, Admin initialization only after boundary checks, independent MCP lock, safe method/size/unavailability statuses.
- `functions/src/auth/identity.ts`: missing credentials consistently return UNAUTHENTICATED/401; revoked-token verification preserved.
- `src/lib/firebase/config.ts`, `client.ts`: explicit cloud activation/exact application origin, conditional Auth emulator, same-origin API and safe result-uncertainty errors.
- `src/app/main.tsx`: cloud agent availability state replaces local connection controls; local UI unchanged.
- `tests/firebase-config.test.ts`, `firebase-runtime.test.ts`, `firebase-handler.test.ts`: configuration, malformed/mixed trust, Host/Origin/forwarded-header/MCP/bodyless-request and credential-free-discovery regressions.
- `tests/auth.test.ts`: real loopback negative Host, missing credential, method/origin, wrong audience, cross-project, removed membership, disabled user and timestamp-revoked token assertions.
- `tests/fixtures.ts`, `rules.test.ts`, `mcp.test.ts`, `runtime-backend.mjs`: separately owned synthetic suite with validated loopback endpoints; no imported/reused/seeded shared services.
- `tests/cloud-runtime-browser.mjs`: actual cloud build with fully intercepted synthetic Auth/API and current UI failure/recovery evidence.
- `package.json`: includes new pure runtime/handler tests; lockfile dependencies unchanged.
- `firebase.cloud.json`, `.env.cloud.example`: API no-store header and explicit inactive configuration template; no release execution.
- Runbook/readiness/README/approval/product-review/completion documents: distinguish implementation, local tests, simulated browser and untested production layers.

Build regenerated dist/Functions output. Fixture cloud build is in `tests/.cloud-dist` and must never be deployed. Temporary suite config under `tests/.cli-config` contains synthetic ports only. Source hashes are in `.ai/local/sp-prod-001-candidate.json`; unborn HEAD prevents commit binding. All original unrelated untracked WIP preserved.

## Current validation

| Gate | Status | Evidence |
|---|---|---|
| Build / strict static analysis | PASSED | Cached Node22.23.3: `npm run build`; frontend and Functions compile |
| Unit/config/HTTP/provenance tests | PASSED | Same Node22: `npm test`, 25/25 |
| Rules/integration/MCP/Auth | PASSED locally | Same Node22: `node tests/runtime-backend.mjs`, 12/12; `evidence/sp-prod-001-backend-node22.log` |
| Node runtime compatibility | PASSED locally | Suite Functions worker Node22; no Node25 mismatch warning in final Node22 log. Deployment runtime remains NOT_TESTED |
| Cloud UI / product strings | PASSED for fixture scope | Three viewports (1440/390/320), four errors, keyboard recovery, no grant/emulator request, actual type doubled at320; `evidence/sp-prod-001-browser/results.json` |
| Product Language Gate | PASSED for changed EN content | `sp-prod-001-product-content-review.md`; current rendered proxy evidence, all eight principles with stated limits |
| Full original browser/emulator E2E entry point | NOT_RUN on final candidate | Default suite ports occupied. Separate backend and cloud UI evidence do not replace the full original browser journey |
| Architecture / API compatibility | PASSED for reviewed scope | Shared services/transaction ACL retained, local MCP harness passes. Error codes stable; missing auth now401 and unexpected dependency errors503 |
| Security/failure-path regression | PASSED locally | Current Host/Origin/method/body/project/channel/role/revoke checks; no real secrets or real provider calls in fixtures |
| Schema/migration | NOT_APPLICABLE | No data model or persisted schema change |
| Observability / rollback review | PASSED for preparation | No telemetry changes or sensitive logging; default activation disabled, exact ingress/rollback prerequisites documented. Production alarms/restore NOT_TESTED |
| SEO / motion | NOT_APPLICABLE | Internal workspace runtime/availability changes; no public marketing/search or animation change |
| Automated approval path validation | FAILED mechanically for dotfile | 17/18 PASS; `.env.cloud.example` normalizes to `env.cloud.example` due `.ai/scripts/validate_implementation_approval.py` using `lstrip("./")`. Explicit human approval includes the actual dotfile. No policy/validator modification or fake pass |
| Independent review | Current; BLOCKED for formal production completion | Cycle2 local code APPROVED, no unresolved code finding in reviewed slice; full production evidence missing |
| Runtime review/check receipts | NOT_RUN | `ai-agent-kit` CLI unavailable. No receipt invented |
| Commit-bound release provenance | NOT_RUN | `git rev-parse --verify HEAD` fails; repository has unborn HEAD and untracked WIP. No blanket staging/commit |
| Provider/live-production/full master | NOT_RUN / NOT_READY | No authenticated cloud/runtime/client acceptance, rollout or full A01–A64 certification in this task |

Node22 came from an existing cached runtime; no installation/dependency change. Final backend fixture includes `revokeRefreshTokens` then old-token401. Tokens are unsigned emulator tokens; real signature/issuer/production revocation acceptance remains untested. Actual Firebase ingress Host must be verified before cloud configuration/release; a fixture Host is not that evidence.

## Findings and review cycles

Validation found and corrected: eager runtime initialization prevented Firebase SDK discovery; use lazy boundary validation before Admin/data access. Official Storage emulator's `http://127.0.0.1:port` variable needed its own safe parser; cloud still rejects all emulator env. Bodyless GET caused503; optional rawBody now yields correct400, with handler/integration regressions. Test-harness fixes: relative Functions source path, raw HTTP for a Host spoof that Fetch normalized, synthetic Auth lookup, and real element-font doubling rather than ineffective root font change. Earlier failures are not counted as passing evidence.

Independent cycle1: APPROVED WITH MINOR COMMENTS locally, formal production BLOCKED. Low evidence finding: disabled-user test did not establish timestamp token revocation. Fix: re-enable fixture user, call `revokeRefreshTokens`, assert old token401; rerun complete Node22 suite12/12 PASS.

Independent cycle2: complete candidate hashes independently matched; no unresolved local code finding. Requirement/security/code/failure/error/trade-off/product-language dimensions PASSED within approved local scope. Production dimension BLOCKED. Reviewer independently reran eight pure tests on Node22 in cycle1 and inspected current final backend log/screenshots; parent owns browser/provider test provenance. Structured review: `sp-prod-001-final-review.json`.

## Remaining work and progress

Local runtime/config/authorization/UI/test scope is implemented with the evidence above. Formal completion stays blocked by release/ledger/provenance gates, the recorded validator defect and unfinished full-product requirements. Weighted full-master progress is Unavailable: no agreed atomic weights/current complete A01–A64 matrix; unit-test count is not product progress.

Next required work: remaining local M0–M3 onboarding/work lifecycle, conflict/handoff/knowledge/roadmap/report/release features and atomic acceptance mapping; complete browser journeys; reviewed public MCP OAuth; actual Codex/Claude/Antigravity/Kimi surfaces; real GitHub/CI evidence; authorized provider prerequisites, signed-token/ingress acceptance, operations/restore/performance and exact-artifact rollout/rollback. These require the authority/evidence boundaries described in the continuation plan; this slice does not waive them.

Residual scoped risks: approximately506kB main chunk warning; native browser zoom/full-app screen-reader assurance not run; raw startup diagnostics remain without a rendered recovery surface; strict ingress allowlist may deny traffic until actual host is verified (intentional fail-closed). No known unresolved code defect found within the executed local checks and independent slice review; no whole-product clean-code claim.

Provider token usage: Unavailable. Actual billed cost: Unavailable. API-equivalent cost: Unavailable. Memory candidates: None.
