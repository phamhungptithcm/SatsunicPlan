# HWS-V2-003 v1 — HunpeoLabs Ask Anything source port

Status: APPROVED by human message "apporved" following presentation of HWS-V2-003 v1; 2026-10-04. Human request 2026-10-04: continue production readiness, reproduce HunpeoLabs Ask Anything UI/UX/motion/behavior; owner configures AI/training later. Prior HWS-V2-001/002 approvals remain valid for existing M0–M3 and Plane work. This newly requested Ask surface is an additional module and material product delta, not agent-approved scope.

## Verified evidence and intended result

Repository intelligence gate READY on this turn, CodeGraph application/service flow and CocoIndex approval/release evidence queried. Critical runtime boundaries verified directly. Target unborn/untracked working tree is preserved. Source is the current local HunpeoLabs component and CSS, not a presumed deployed version. Both component/CSS and supporting Ask files are untracked there; base commit does not certify these bytes. Exact SHA256 snapshot: docs/evidence/ask-hunpeolabs-source-snapshot.json. Read-only access to sibling repository; no writes there.

Use original CSS and component motion/lifecycle as the source of truth. Match the existing capsule, circular blue launcher, finite letter hint, blur backdrop, modal panel, question/answer styling, suggestions, resume, Stop/Retry, keyboard/IME, reading position, mobile safe area, reduced motion and cancellation behavior. CSS unchanged where possible; every necessary adaptation explicitly logged. Vite replaces Next.js Link/Image with safe browser equivalents. Source knowledge content/company answers, founder portrait, contact/privacy routes and provider contracts cannot be silently copied as project facts or invented destinations.

The original motion uses 360ms panel reveal, 320ms reversal/hide/backdrop, 180ms launcher entrance after 140ms, 300ms bounded question scroll, hint at 5s then 22s. Preserve finite animations and cleanup, rapid-close reversal, native dialog focus, inside-to-outside drag ignored, outside collapse only, close/reopen retains mounted conversation and reload clears it. Verify rather than declaring 100% from source similarity.

## Provider and data boundary

No LLM runtime, Genkit, Gemini, provider keys, paid calls, training ingestion or hosted coding agent is added. MCP remains the primary external coding-agent workflow. AI/training deferred by owner; later activation requires its own security/product delta. Ask is initially a deterministic workspace-help surface with actual approved project-independent help and navigational actions. Unknown requests truthfully report unavailable AI, never simulate a generated answer. Project context is not sent to the HunpeoLabs website/API or a third party. No automatic mutation or work claiming through chat.

Introduce a typed cancellable answer adapter for later owner integration without enabling a provider. Preserve bounded question/history/turns and input during failures. Local source-backed help must remain useful without transport. Async adapter behavior is characterized with explicitly labeled tests, never provider evidence. Never reproduce HunpeoLabs company/pricing answers as workspace truth. Scope conversation by authenticated user/workspace/project and clear it on identity/project changes, revocation and sign-out. In-memory conversation only; no localStorage/chat DB/question telemetry. Mount only within authenticated project scope. One instance; unique dialog IDs and focus restoration.

## File/function plan

| File | Planned change |
|---|---|
| src/features/ask/AskWorkspace.tsx | Port source component; preserve showModal/open/close/hide/interrupt/ask lifecycle; isolate component IDs; replace Next dependencies and business answer view |
| src/features/ask/ask-workspace.module.css | Copy source stylesheet; annotate and record necessary integration overrides; preserve sizes/motion/tokens |
| src/features/ask/contracts.ts | Bounded typed help answers and adapter status; verified local action allowlist; no arbitrary HTML/URL/model mode |
| src/features/ask/help.ts | Approved workspace-help content mapped to real implemented actions; explicit unavailable state for unsupported queries |
| src/features/ask/deadline.ts | Attributed cancellation helper if needed; no paid adapter imports |
| src/app/main.tsx | Mount scoped Ask, connect actual navigation, reserve space without blocking current work/dialogs; account/project reset |
| tests/ask.test.ts, tests/browser.spec.ts or current browser test files | Lifecycle/date-independent unit checks and actual browser interaction/motion/security regressions |
| package.json | Add tests to existing script; no new runtime dependency planned |
| docs/**, THIRD_PARTY_NOTICES.md | Source/adaptation provenance, string/state inventory, eight-principle review, verification/coverage updates |

Functions, Rules, IAM, production credentials, other repositories, generated policy, global client config and deployment are excluded from this Ask delta. Backend endpoint needed later is a separate review, not an invented working route.

## Validation and acceptance

1. Original source and target rendered at same desktop/tablet/mobile viewports; compare each visible state and motion parameters. Source local browser baseline NOT RUN at plan time, screenshots NOT RUN; do not claim deployed-site parity.
2. Actual browser: capsule focus/suggestions, send/IME, hint finite timing, expand/collapse/resume/hide/reopen, Escape/backdrop, rapid reversal, Stop/Retry and late-result rejection, new question scroll versus incoming answer preservation, reduced motion, keyboard focus restoration, narrow viewport/zoom, app overlay coexistence.
3. Identity/project transitions never reveal prior context; unknown answers and absent provider explicit, no requests to external host, storage or analytics. Failure controls keep input; published help links point only to implemented destinations.
4. Existing build/typecheck/domain/emulator/MCP/browser checks regressions; dependency/secret/license controls. Product Language Gate has current in-context evidence for Purpose, Agency, Responsibility, Familiarity, Flexibility, Simplicity, Craft, Delight. Source business strings are inventoried and adapted deliberately.
5. Fresh independent review after fixes; PASS/FAIL/BLOCKED/NOT RUN differentiated. Full app production readiness cannot be inferred from Ask passing.

Risks: modal focus collisions, global CSS, privacy of tenant data, mismatched destinations, fake AI capabilities, source WIP drift and viewport-dependent motion. Mitigation: isolated CSS module, scoped mount/cancel, hash binding, verified local actions, actual source/target browser comparison. Rollback only reverts this scoped composition after preserving files/evidence; no reset/clean/delete app.

Approval requested: HWS-V2-003 v1 local source-derived Ask UI/help port and validation in the files above. Approval does not enable an AI/provider or authorize deployment.

## Independent plan clarifications (within approved scope)

Source browser baseline runs only from an isolated hash-bound temporary copy; external/provider calls denied; substituted content labeled visual/behavior fixtures. Observed forbidden/unauthenticated API responses clear scoped project data and unmount Ask; identity/workspace/project epochs guard stale requests. This is observed-response cleanup, not proactive revocation polling.
