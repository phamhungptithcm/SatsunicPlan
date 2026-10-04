# SP-PROD-001 v1 — end-to-end production continuation

Date: 2026-10-04, America/Chicago. Status: PROPOSED; no approval inferred.
Goal: complete the master v2 requirements, rather than release the existing bounded pilot.

## Verified baseline and authority

HWS-V2-001 v1 already approves local M0–M3 implementation. HWS-V2-002/003 and the Firebase/preview approvals preserve their narrower boundaries. Those approvals explicitly reserve public-runtime security changes, real provider activity and deployment. This delta requests **local human cloud-runtime implementation and its isolated validation only**. It does not authorize provisioning, billing, IAM, deployment, production data, global client configuration, commits or pushes. Public MCP OAuth requires its own reviewed design before implementation/exposure.

Repository intelligence currently DEGRADED: CodeGraph stale with health PASS; CocoIndex stale with health FAIL. Findings below use source reads. No complete graph-impact claim. Git worktree is unborn/untracked; preserve all WIP. Existing coverage CSV contains historical placeholder statuses and cannot certify current coverage.

Current commands: `npm run build` PASS (frontend and Functions); `npm test` PASS, 19 tests. `npm run verify` FAIL at emulator startup: ports 14400/14500/19099/18080/19151/19199 occupied. Integration, Rules, MCP, Auth and browser stages did not execute. Existing services were not stopped or reseeded. Main frontend chunk 504.67 kB; no production performance inference.

Source facts:

- `functions/src/adapters/firebase/http.ts` initializes the demo Admin project and rejects non-emulator requests before authentication. API/MCP cannot currently serve cloud traffic.
- `src/lib/firebase/client.ts` blocks cloud initialization and always attaches the Auth emulator. Public configuration validation exists separately in `config.ts`.
- `functions/src/application/workspace.ts` shares transactional authorization with UI/MCP. Project summary is bounded at 100 tasks/50 documents; baseline at 200 tasks. These limits are not the required 5,000-item performance evidence.
- `schemas.ts` exposes neither invite/member-management nor public OAuth/GitHub/release/report reconstruction commands. `resume_work` returns reported checkpoint/SHA, not verified shared code.
- Provider discovery in `satsunicplan-firebase-provider-verification.md` is historical evidence: no registered web app, billing disabled, Firestore API disabled at that observation. Refresh metadata before relying on it for release; no live provider refresh performed in this task.

## Execution order and acceptance

| Slice | Required outcome | Acceptance and evidence | Authority |
|---|---|---|---|
| 1 | Isolated verification ownership, current atomic requirements mapping | Map every A01–A64 to actual Given/When/Then, fixture, assertion, command and result; distinguish partial/mock/local/client/provider. Fresh full suite without disturbing another chat's emulator | Existing local plan; runner changes must preserve synthetic-only guards |
| 2 | Project/member/work lifecycle | Real onboarding, role removal, dependency/parent editing, archive/restore and explicit scope changes; independent permissions and concurrent-update denial. A01/A06/A10–12/A20/A53–55 | Existing local plan; material new schema/ACL design gets delta review |
| 3 | Complete execution/context/handoff | Conflict scopes, generation fencing, cancellation/recovery, exact immutable context, semantic decisions and impact review. A22–40/A48/A51–53/A63–64 | Existing local plan; no external agent execution |
| 4 | Useful knowledge and roadmap | Reviewed Plane source ports, safe rich content/attachments/templates, immutable baselines, schedule interactions and overlap pagination. A02–08/A13/A16/A18–21 | Existing plan; license/dependency exceptions separately reviewed |
| 5 | Evidence/release/reports | GitHub raw-body signature fixtures, trusted repo/head/check binding, replay/reconcile; release dossier, immutable deployment history, reconstructable historical reports. A09/A14–17/A41–45/A54–58 | Local adapters/fixtures within original plan; real GitHub access separate |
| 6 | Human cloud API candidate | Explicit verified runtime identity, canonical origin/host, same-origin API, Auth revocation and fail-closed settings; local regression and Node22 execution | SP-PROD-001 approval required |
| 7 | Public MCP and actual clients | Reviewed OAuth discovery/PKCE/audience/resource/issuer/redirect/replay design; Codex/Claude/Antigravity/Kimi matrix by version and surface, A22/A46–50/A59/A62 | Separate security design and actual-client/provider authority |
| 8 | Release acceptance | Full A60 journey, platform language/accessibility evidence, 5,000-item/200-document benchmark, restore rehearsal, exact artifacts and provider readback | Separate provisioning/deployment approval after reviewable candidate |

Every slice closes with affected tests, Product Language Gate where applicable, and fresh independent final review. No slice completion substitutes for full master completion. No percentage inferred from the 19 unit tests.

## Delta file/function plan: slice 6

1. Add `functions/src/adapters/firebase/runtime-config.ts`: resolve explicit emulator versus human cloud API configuration. Validate mode/project/canonical hosts/origins; reject unknown/missing values, mixed cloud and emulator endpoints, wildcard or malformed origins. Do not guess provider settings.
2. Update `http.ts` initialization and `boundary`: emulator retains the demo project and loopback constraints; cloud Admin uses verified platform project identity. Human API can opt in only with validated configuration. Keep MCP independently disabled outside emulator until its separate OAuth review. No permissive Host/Origin fallback, forwarded-header trust or automatic CORS wildcard.
3. Update `src/lib/firebase/config.ts` and `client.ts`: validated human cloud mode initializes the public Firebase app, uses same-origin `/api`, and never attaches emulators. Local mode retains current behavior. Startup fails before initialization for incomplete configuration. Identify current readiness messages that must change and review their EN/VI states in context.
4. Review `identity.ts`: retain `verifyIdToken(token,true)`, current memberships, grant/capability intersection and independent review. Add configuration/revocation failure regressions; do not enable Firebase browser tokens as delegated MCP tokens.
5. Extend `tests/firebase-config.test.ts`, add pure backend runtime-config tests, extend `tests/auth.test.ts` for wrong origin/host/method/audience, revoked identity, forged channel and cross-project denial. Cloud-boundary tests use isolated fixtures; label them simulated, not live Auth acceptance. No real network calls from fixtures.
6. Update `.env.cloud.example`, `firebase.cloud.json`, runbook and readiness report with exact optional activation settings, independent MCP lock, startup failure states and rollout/rollback prerequisites. No secret in VITE settings, no deploy command execution or new dependencies.

Security/data impact: runtime boundary and identity are HIGH risk. No collection/schema change in slice 6. Authorization stays in shared service transactions; no direct browser writes to protected workflow data. Existing clients retain emulator paths. A cloud API candidate is not deployable until provider, Rules/indexes, Node22, authentication, operations and exact-artifact gates pass.

Alternatives: deploying current dist fails because it points at local services; removing LOCAL_ONLY without validated identity exposes an invalid trust boundary. Recommended approach is human API first with public MCP separately locked, then reviewed OAuth/client acceptance.

Rollback: preserve original local path; cloud remains disabled until explicit validated activation. Future remote rollout must capture known-good component versions first, deploy Rules/indexes before the API, wait for index readiness, then verify human success/denial before application Hosting. No automatic index deletion or data rollback.

## Approval requested

Approve SP-PROD-001 v1 **slice 6 local implementation and validation** in the exact paths above. Existing authorized local M0–M3 work does not require reapproval. Public MCP/OAuth design, provider mutation, billing/IAM and deployment remain separately gated. If slice 6 needs a new dependency, schema, broader ACL or architectural change, present a delta before that edit.

## Current task report / review cycle 1

Production: NOT_READY. Full requirement match: BLOCKED by unfinished master requirements. Security boundary: verified fail-closed in source; live cloud security NOT_TESTED. Code checks: build/19 tests PASS. Failure-path/full-suite assurance: BLOCKED by occupied emulator ports. Product language: no product strings changed in this planning task; future runtime string changes require in-context review. Operations/restore/client/provider acceptance: NOT_TESTED in this task.

Changes: this plan only; build regenerated existing dist/Functions output. No protected source implementation, remote mutation or release. Documentation review: plan cites source, differentiates authority and evidence, preserves original scope and enumerates exact delta paths. Independent implementation review not run because implementation has not begun; no PASSED handoff asserted. Runtime ledger CLI unavailable (`command -v ai-agent-kit` returned no executable); no receipt fabricated. Current Git has no commit to bind a release certificate.

Remaining work: slices 1–8 and each unresolved atomic master requirement. Token usage, actual billed cost and API-equivalent cost: Unavailable. Memory candidates: None.
