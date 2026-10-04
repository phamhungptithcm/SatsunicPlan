# Verification — current local candidate

Evidence applies to the uncommitted working tree, not a release or production deployment. Host Node 25.9 runs Functions locally despite the configured Node 22 target. Demo project only; isolated CLI configuration, deliberately unavailable cloud credentials, loopback ports. Real Chrome is automated headlessly through Playwright; MCP uses the official SDK **test harness**. Synthetic fixture commits and acceptance reports are not provider verification.

## Results

| Check | Result | Evidence / limitation |
|---|---|---|
| Full master prompt integrity | PASS | `evidence/master-prompt.json`, 359 content-block matrix rows, all 64 scenario IDs retained; inventory is not atomic test coverage |
| Plane tag/SHA/root license | PASS | v1.4.2, `5f7d92784c403f76284f0f16718f320221dc7fec`; commercial email helper excluded; full audit BLOCKED for release |
| Implementation approval | PASS | `approval-HWS-V2-001.md`, task-local gate record, protected-target validator |
| Intelligence | PASS at latest refresh | CodeGraph/CocoIndex READY; initial DEGRADED daemon permissions recovered with authorized local refresh; source still authoritative |
| Strict typecheck/build | PASS | Root and Functions; Vite build. `lint` means strict TypeScript only, not ESLint |
| Pure domain tests | PASS | Five groups: DST/date-only schedule, eligibility/rank, throughput/on-time denominator, acyclicity, exact-byte canonical hashing |
| Firestore integration | PASS | Nine groups, including atomic race, idempotency divergence, expiry, stale context, ACL/revocation, immutable baseline, and three review regressions |
| Human/agent HTTP auth | PASS | Firebase human credential vs scoped grant separation, denied origin/spoofed authority |
| MCP HTTP protocol | PASS | Official SDK initialize/list tools + bounded complete execution journey; no actual coding-client assertion |
| Firestore/Storage Rules | PASS | Positive scoped read and denied unauthenticated/cross-project reads/writes/grants/Storage; source review alone does not imply executed pass |
| Chrome journey | PASS | Create/refresh/contract approval → SDK execution → human acceptance; desktop/tablet/mobile evidence. Account-state cleanup and mobile overlap regressions passed in latest rerun |
| Runtime dependency audit | PASS | Zero runtime vulnerabilities after targeted grpc/uuid overrides; no force audit upgrade |
| Full development dependency audit | FAIL | Ten advisories (7 high, 3 moderate) remain in emulator/tooling tree; no production-readiness claim |
| Full source parity / all A01–A64 | NOT RUN | Scenario titles on tests cover subassertions only; all composite requirements remain partial/unverified |
| Actual Codex/Claude/Cursor/VS Code | NOT RUN | See `mcp-clients.md`; harness is not real client evidence |
| GitHub/provider, native OAuth, Node 22, live Firebase | NOT RUN | No integration credentials, deployments or cloud calls attempted |
| Product-content/final release gates | BLOCKED | Full scope, accessibility/localization/platform coverage and production readiness incomplete |

## Failure history and corrections

- Java 17 could not start current Firestore emulator: runner selects an existing Java ≥21 (tested Java 24), no install.
- Default emulator ports and Vite 5173 belonged to other work: isolated dedicated ports, no other process killed.
- Sandbox loopback EPERM reported misleading “port taken”: reran authorized local tests with sandbox escalation; not a port defect.
- Custom fake Admin credential failed Firestore validation: removed it, enforced demo/emulator boundary and disabled CLI/cloud credential discovery through isolated environment.
- Browser label included field hint: corrected `htmlFor`/input ID and `aria-describedby`; preserved exact accessible-name assertion.
- New account-state cleanup initially removed startup deep link: recovered only initial authenticated deep link; continuing identity switches clear selection. Original browser entry point is rerun.
- Independent cycle 1: approval lifecycle, transaction expiry, ordered history coverage and account/project UI state fixes; current-cycle evidence required before any success handoff.

## Reproduce

`npm run verify` builds, runs five domain groups, starts only synthetic Auth/Firestore/Functions/Storage emulators, runs Rules/integration/HTTP auth/SDK protocol suites and real Chrome journey. `npm run emulators`, `npm run seed:emulator`, `npm run dev` support manual local review. See README for ports/accounts. No mock/provider harness result is substituted for real client/provider testing.

Screenshots contain synthetic projects and no bearer grants: `evidence/roadmap-desktop.png`, `roadmap-accepted.png`, `roadmap-tablet.png`, `roadmap-mobile.png`. Candidate file hashes and final summary are recorded under `evidence/` after the current checks finish. Raw local test logs may remain in `/tmp`; retained summary excludes tokens and credentials.

Latest results: `npm run verify` exit 0 (5 domain + 12 emulator groups + 1 Chrome journey), followed by `npm run build` and `npm run test:e2e` exit 0 after mobile layout changes, followed by another build and 2 Chrome tests after the editor selection race fix. `evidence/candidate-files.json` binds runtime/test source bytes; `verification-summary.json` retains bounded outcomes.

Independent cycle 2 found a same-project document selection race. A separate editor-selection epoch now clears the body while loading and rejects obsolete responses. Actual Chrome delayed-response test (switch to New, enter fresh draft, then release old response) PASS. Latest build PASS and 2 Chrome tests PASS.

Final independent cycle 3: no new actionable defect within bounded source review; all five prior fixes confirmed. Overall BLOCKED for incomplete full requirements/content/platform/client/provider/production evidence. Source reviewer did not independently rerun the parent test commands.

## HWS-V2-002 candidate supersedes prior UI evidence

Approved Plane source-reuse delta: build PASS; full verify PASS with eight domain/Plane algorithm groups, twelve emulator/protocol/Rules groups and two Chrome tests, followed by targeted build/browser PASS for responsive centering. A ninth source-provenance unit group subsequently passes in America/Chicago timezone. Chrome exercises upstream layout marker and week/month/quarter controls before the original persisted acceptance journey. Mobile screenshot visibly retains baseline/current/actual and sticky item labels. Prior PASS claims are historical unless included in current candidate manifest/results; final delta review pending.

Initial dependency install FAIL: upstream mobx-react 9.1.1 excludes React 19. Resolved through compatible 9.2.0 peer metadata, no force install. Runtime audit after new dependencies PASS (0); full development advisories remain 10. Entire Plane runtime and full adopted feature parity NOT RUN.

Delta regression history: store view reset found by independent source review; fixed with scoped stable store and observable snapshot updates. Ten unit groups PASS (including per-project view isolation). A targeted browser run timed out at the 5-second heading assertion while project was still loading; readback now awaits the successful persisted API response before the same UI assertion, with no mock/global timeout increase. Latest browser outcome recorded separately below.

Latest targeted build + 10 unit groups PASS; 12 emulator groups from full verify PASS with unchanged backend hashes; latest two Chrome tests PASS, including Quarter→inspector→Refresh, scoped data/readback and mobile bar visibility. Evidence excludes raw grants. Current source bound by plane-candidate-files.json. Independent delta review cycle 2 pending.

HWS-V2-002 independent cycle 2 complete: fresh READY, reviewer independently reran ten unit groups PASS and found no new actionable defect in bounded delta review. Overall full-product/release recommendation BLOCKED. See final-review-HWS-V2-002.json. No full Plane parity or M0–M3 completion is asserted.

## 2026-10-04 Ask Anything / Firebase continuation

Source component/CSS and cancellation/stream contracts read from current HunpeoLabs WIP; exact hashes recorded in evidence/ask-hunpeolabs-source-snapshot.json. HWS-V2-003 proposed source-derived Ask UI/help port is awaiting reviewed-plan approval. No provider/training integration or protected source edits made in this planning step. Source/target browser parity NOT RUN. Repository intelligence READY. Production runtime is source-verified emulator-only; see firebase-readiness-gap.md. Existing approved Plane/M0–M3 scope remains active; full product NOT_READY.

## HWS-V2-003 current verification and failure history

PASS: strict TypeScript/Vite/Functions build and 15 unit groups. PASS: 12 Auth/Firestore/Storage/Functions emulator integration/rules/MCP SDK groups, log `/tmp/hws-ask-emulator-final.log`. MCP uses SDK harness and synthetic commit evidence; this does not certify a real external coding client or provider. Initial emulator suite was interrupted when shared services disappeared during host ENOSPC; later 12/12 rerun passed after the owning chat recovered its services. Root did not delete unrelated files or clear/reseed the shared database.

Browser: earlier six-test suite PASS before final visual edits. Final candidate first rerun had five PASS and one FAIL because the roadmap accessible-label locator was stale after SP-UI-001 design update. Locator corrected against actual source; current rerun is tracked separately. A mistaken `npm run test:e2e` invocation against occupied shared ports was BLOCKED at startup and did not run tests; use direct Playwright with verified existing services. Reference startup cwd, same-project reselection/loading, timeout fixture matching, launcher focus and mobile Privacy bounds were fixed and retested. Adapter fault-injection and source layout reference are explicitly fixtures, never real provider evidence.

NOT RUN: deployed HunpeoLabs site parity, real client/provider, public OAuth, Node22 runtime, production deployment, screen-reader and cross-browser/200% zoom audit. BLOCKED: final production and complete product-language acceptance until required coverage/review evidence exists. No push/merge/deploy/billing/production access.

Continuation after interruption: current shared candidate strict build PASS and unit19/19 PASS, including four new Firebase preparation groups owned by another chat. Independent Ask reviewer after READY independently reran19PASS and found no new actionable Ask correctness/security defect. Review remains BLOCKED for complete accessibility and full current browser evidence. Isolated adapter2/2 PASS after continuation; CDP named dialog/polite log, keyboard native modal containment and200% root text scaling1/1 PASS. Text scaling is not browser zoom; no actual screen-reader claim. Native browser-chrome focus transit is allowed only when document loses focus, never into underlying page controls.

The first recovered seven-test run started before synthetic Auth restoration completed and failed `auth/user-not-found` at initial login; other actual Ask cases passed after accounts recovered. This is retained as FAIL environment/fixture readiness, not hidden. Owner subsequently confirmed recovery and a fresh full suite is tracked in `/tmp/hws-ask-browser-ready.log`. Initial interrupted Chrome run is BLOCKED/incomplete. Runtime review JSON schema was corrected; actual record rejects with “final review requires a readable Git commit and worktree signature”. No commit was created to bypass this gate.

Final local rerun on current shared source snapshot: strict build PASS; unit19/19 PASS; full Chrome7/7 PASS (`/tmp/hws-ask-browser-ready.log`); recovered emulator12/12 PASS (`/tmp/hws-ask-emulator-ready.log`). All test records are synthetic. Accessibility subset PASS; complete accessibility assurance remains NOT RUN/BLOCKED. Source hashes: `evidence/ask-current-candidate.json`. No real provider/client/production or deployment acceptance claimed.

HWS-V2-003 independent cycle2: READY; no new actionable Ask source defect; all16candidate hashes current; browser evidence finding FIXED. Accessibility evidence gate remains BLOCKED. Formal review receipt cannot record on unborn HEAD. Current scoped report: `task-completion-HWS-V2-003.md`; product remains NOT_READY.
