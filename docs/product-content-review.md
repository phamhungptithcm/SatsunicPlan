# Product Content Review — HWS-V2-001

Scope: web project/task/knowledge/contract/agent/review/roadmap/report surfaces in `src/app/main.tsx`, `src/components/Fields.tsx`, `src/lib/firebase/client.ts`. Audience: humans authoring/reviewing delivery contracts and external coding clients. Locale: English pilot; Vietnamese/localization/RTL not implemented. Review uses the mandatory repository template without editing its managed source. Apple platform HIG certification is not applicable; repository human-interface principle reference was read as a web quality reference.

Verified: commands persist to Firestore, approved revisions remain immutable, another human must approve/review, eligibility does not claim work, provider evidence is reported, revoking grants cannot retrieve previously exported content. Actual OAuth/client/provider connections are unknown. User-visible literal inventory: `product-content-inventory.csv` (source inventory, not standalone context evidence). In-context evidence: Chrome journey and current desktop/tablet/mobile roadmap screenshots. Detailed pages and failure states do not all have screenshots, so the full language gate is BLOCKED.

| Surface | States / meaning | Evidence |
|---|---|---|
| Auth/project | Sign in, create local account/project; synthetic boundary; loading/errors; scope changes clear unsaved document/title/recommendation/secret/selection | Browser account-switch regression; scope epochs guard delayed results |
| Work/contract | Create work, AC, scheduled/unscheduled, publish new contract, independently approve pinned contract | Browser persisted refresh and independent approval; integration lifecycle guard |
| Knowledge | New immutable draft; approved revision unchanged; independent approval; forbidden/stale error recovery | Source and emulator revision-drift test; unsaved body cleared across accounts |
| Eligible queue | “Eligible · not reserved”; bounded first page; blocked prerequisite labels | Read-only recommendation test; source mapping; complete ranking not implemented |
| Agent connection | Explicit external context consent; write checkbox; once-only masked grant; hide/revoke; actual compatibility unverified | Source; grant hash/revocation tests; no token screenshots |
| Review | Awaiting review / Accepted / Changes requested / Rejected; exact contract/head; reported criteria, provider NOT RUN; human reason | Browser human acceptance; human/agent and independent-review negatives |
| Roadmap | Separate baseline/current/actual; inclusive date-only days; committed baseline persists; local read freshness | Chrome current screenshots; immutable baseline and DST tests |
| Reports/releases | Current bounded metrics, pending denominator; manual deployment outcome, provenance distinct from actual deployment | Source and integration; historical/provider reporting absent |

| State | Coverage | Evidence / gap |
|---|---|---|
| Default/action | PARTIAL PASS | Complete bounded journey on Chrome; other pages source-reviewed |
| Loading/pending/disabled | PARTIAL PASS | Saving/loading live region, disabled writes and missing prerequisites; full state matrix not executed |
| Empty/no result/zero | PARTIAL PASS | Explicit no-items/submissions/connections; unavailable ratio is not zero |
| Success | PASS for tested journey | Persisted readback and accepted roadmap |
| Error/recovery | PARTIAL PASS | Natural messages for conflict, missing rights, lease, connection; backend negatives tested, all browser failures NOT RUN |
| Offline/stale/partial | PARTIAL | Bounded coverage warning, refresh before retry; offline draft persistence absent |
| Unauthorized/forbidden | PASS at emulator boundary | Role and tenant denial; full UI role matrix NOT RUN |
| Consequential choice | PARTIAL | Native revoke confirmation states consequence; no destructive bulk operations implemented |

Data semantics: source of truth is transactional Firestore state. Baseline is immutable schedule commitment, current plan is live task schedule, actual completion is human-accepted timestamp. Schedule units are inclusive calendar dates; timestamps display browser locale. Throughput counts currently accepted tasks, cancelled/reopened excluded; on-time denominator includes pending scheduled work. Current-project report is unavailable if work query truncates. No historical/current-provider certainty is inferred from synthetic evidence. Shared head is reported, not verified. Raw internal review enums were replaced with human labels.

| Principle | Result | Current evidence |
|---|---|---|
| Purpose | PASSED for core | One contract-to-delivery flow, clear page tasks and roadmap consequences |
| Agency | PASSED for core | Human consent, independent decisions, read-only recommendation, editable dates, no automatic acceptance |
| Responsibility | PASSED for core | Explicit context transfer/revoke limitation, reported evidence, scoped grants and safe errors |
| Familiarity | PASSED for core | Native web forms/date inputs/table/dialog/navigation; no Apple-only UI copied |
| Flexibility | NOT_RUN for full scope | Desktop/tablet/mobile tested; keyboard dialog Escape tested; complete keyboard/screen-reader/locales/RTL coverage absent |
| Simplicity | PASSED for core | Work creation and single pinned contract; inspector tabs; prerequisite explanations; full product flow complexity untested |
| Craft | NOT_RUN for full scope | Label/description association corrected; screenshots inspected and mobile overlap fixed; full contrast/zoom/focus/assistive-tech audit absent |
| Delight | NOT_RUN for full scope | Clear saved feedback/current view without unnecessary motion; usability study not performed |

Platform fit: responsive native web controls, accessible field `htmlFor` and separate `aria-describedby`, focus styles, `aria-current` navigation, native modal focus/Escape. Mobile horizontal navigation scrolls independently; assertion checks project selector does not overlap navigation and document has no horizontal overflow. No verified HunpeoLabs asset/color specification was supplied; current blue/white style is provisional, no official brand compliance claim.

Pattern checks: writing/labels and feedback PARTIAL PASS; privacy/accounts PARTIAL PASS; consequential confirmation PARTIAL PASS; onboarding PARTIAL PASS; inclusion/accessibility/localization NOT_RUN beyond the bounded evidence. Product Language Gate BLOCKED for full delivery; this report does not certify isolated strings as in-context evidence.

Editor failure-state correction: changing documents or choosing New invalidates the previous selection; body clears while loading, textarea is disabled for that load. Chrome delayed-response regression proves an older revision does not overwrite a fresh draft. This does not fill the missing full state/accessibility/localization evidence.

## HWS-V2-002 current in-context evidence

Changed roadmap surface now composes adopted Plane layout/store and view algorithms with Firebase data. Human-visible additions: “Human-accepted completion” legend/marker; enum-derived week/month/quarter control; empty “No work in this view. Create a work item to plan its dates.” Current-plan click still opens the same inspector. Dates remain inclusive calendar days; baseline is independent immutable data, acceptance marker is human acceptance (not CI/provider/deployment). No-dates remain Unscheduled. Drag/dependency gestures are disabled and not offered as actions. Attribution is retained in source/legal docs, not exposed as an implementation instruction in the product flow.

Latest desktop/mobile screenshots and Chrome tests cover source-derived roadmap, three view selections, fixed sticky labels and centered visible dates, original acceptance flow and editor/account regressions. Source-provenance/DST tests cover data meaning. Purpose/Agency/Responsibility/Familiarity/Simplicity remain bounded PASSED; Flexibility/Craft/Delight remain NOT_RUN for complete platform/product scope. Gate remains BLOCKED for full content/accessibility/localization evidence; provisional brand tokens are not certified HunpeoLabs/Satsunic assets.

Completion marker/Today in the local adapter use UTC, with explicit “Completion dates use UTC” helper and ISO timestamp marker title. Schedule values remain date-only and use calendar arithmetic; no elapsed-hour conversion. Configurable project timezone/calendar is not yet implemented and remains a full-product gap. Scoped view selection persists across refresh/inspector; changing project starts a separate store.
