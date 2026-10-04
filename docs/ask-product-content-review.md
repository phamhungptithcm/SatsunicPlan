# Ask product content review — HWS-V2-003

Scope: source-derived Ask UI and local usage help, desktop web, English/Vietnamese. Root review, 2026-10-04. Source UI/CSS comes from owner-authorized HunpeoLabs WIP; no Apple platform contract applies. Separate integration styles preserve the original stylesheet. SatsunicPlan shell branding belongs to SP-UI-001; this approved Ask port retains the HunpeoLabs header.

Verified facts: help is deterministic local guidance, not inference. Navigation uses an allowlist of actual pages. Questions are not fetched or persisted. Conversation retains at most 12 turns in page memory and clears on account/project/reload. Contracts and roadmap truth remain server-authoritative. Cancellation prevents late results from updating a superseded session. This review does not certify future AI integration.

Inventory: `ask-product-content-inventory.csv` contains source-positioned literals and JSX text for all Ask component/help files. Technical identifiers are included conservatively; states and meaning are mapped below. No string-file-only approval is claimed.

| State | Content / behavior | In-context evidence |
| --- | --- | --- |
| Default/action | Ask anything; suggestions; send; hide; continue; real help destinations | Actual app browser test, three viewports |
| Pending/disabled | Pending turn, Stop response, submit lock | Explicit adapter fixture, never described as a real AI provider |
| Empty/no result | AI not connected; no answer for this request yet | Actual app unknown question |
| Success | Bounded plain-text usage guidance, page action | Actual app MCP/roadmap navigation |
| Error/recovery | Error alert, Try again, input retained | Controlled failure/timeout fixture |
| Offline/stale/partial | No network required for local guidance; unsupported analysis disclosed | Pure adapter source and unknown actual query; offline browser NOT RUN |
| Unauthorized/forbidden | Ask unmounted after observed denied refresh; no real-time revocation polling claim | Actual auth emulator membership revocation and restoration |
| Confirmation/destructive | No destructive action in Ask; page changes navigate, create modal suspends Ask | Actual app modal coexistence |

Data semantics: no project metrics or inferred completion. Approved revision, current plan, baseline and human acceptance are explained according to backend behavior. No fabricated zero, percentage, estimate or live provider verification. History is bounded to six answered pairs and a 12 KB request payload; this payload stays local in the current adapter. AI/training configuration is a future owner decision.

| Human Interface principle | Status | Current evidence |
| --- | --- | --- |
| Purpose | PASSED | Guidance describes actual contract/MCP/review work and unavailable analysis explicitly |
| Agency | PASSED | Stop/Retry/close/hide/Escape and real navigation; no automatic external send |
| Responsibility | PASSED | Privacy notice states memory lifecycle; denied scope teardown; no provider secrets |
| Familiarity | PASSED | Native dialog, visible input, accessible button names; source-derived familiar chat layout |
| Flexibility | PASSED | Keyboard, IME, English/Vietnamese, reduced motion; responsive 1440/768/390 |
| Simplicity | PASSED | One composer, three suggestions, direct page actions; no setup or fake AI loading |
| Craft | PASSED | Byte-identical source CSS; matched geometry/timings; focus restoration and mobile notice edge fixed |
| Delight | PASSED | Source capsule/modal/launcher transition; bounded hint and reduced-motion suppression verified |

Platform fit: browser-native dialog and keyboard handling; no Apple-only copy. Actual Chrome checks cover Escape, focus restoration, backdrop pointer origin and reduced motion. No forced mobile fullscreen redesign. Dialog help is separate from persisted business CRUD. All displayed answers are escaped React text, not model HTML.

| Pattern / gate dimension | Status | Evidence / limitation |
| --- | --- | --- |
| Writing / concise respectful tone / terminology | PASSED | English/Vietnamese help checked against actual page names, localized prose retains exact UI labels |
| Feedback / alerts / consequential choices | PASSED | Local unavailable disclosure; fixture failure/retry and timeout; user controls interruption |
| Contextual help / audience / meaning | PASSED | Source UI reused with Workspace-specific real workflows |
| Permission / privacy / data semantics | PASSED | Actual project/account isolation and denied refresh; no automatic provider calls |
| Actions / state coverage | PASSED | Actual success/navigation/modal plus explicitly isolated pending/failure fixtures |
| Localization / text expansion | PASSED | Actual Vietnamese mobile screenshot and Privacy edge assertion |
| In-context verification | PASSED | Actual browser screenshots and assertion suite; source baseline explicitly isolated |
| Accessibility / inclusion | NOT_RUN | Keyboard, CDP accessibility tree and 200% root text scaling subset passed; actual screen reader, browser zoom, contrast audit and RTL not yet validated |

Verification: `docs/evidence/ask-idle-{1440,768,390}.png`, expanded desktop/mobile Vietnamese, launcher hint; isolated source screenshots are fixtures. Actual deployed HunpeoLabs comparison, Safari/Firefox, screen reader, offline and future AI behavior NOT RUN. Source fixture knowledge is synthetic and cannot establish answer/provider parity.

Decision: Product Language Gate BLOCKED until accessibility coverage and independent review are current. Fixed findings: hidden launcher focus, mobile Privacy label bounds, unstable navigation callback. Remaining whole-product runtime/legal/OAuth/Node22/provider readiness is outside this UI approval.

Continuation evidence: isolated real-component CDP AX tree exposes named dialog and polite live log;16 Tab steps stay in modal or legitimate browser-chrome transit (document loses focus), never underlying page controls. At200% root font size and720×500 viewport dialog remains bounded and Privacy visible; Escape restores composer focus. `/tmp/hws-ask-a11y-rerun.log` PASS. This is text scaling, not an actual browser200% zoom or human screen-reader session. Initial overly strict focus assertion rejected native browser-chrome transit; corrected test does not permit body focus while document retains focus. Overall gate remains BLOCKED for unverified coverage.
