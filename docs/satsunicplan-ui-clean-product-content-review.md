# SP-UI-002 product content review

Scope: English web product shell/sidebar/login, 2026-10-04, Codex. No Apple-platform compliance claim. Current source hashes: clean-coordination.json. Audience: people managing project work. Remove setup diagnostics from daily navigation; setup environment/provenance remains documented in README local setup. Existing auth/data behavior unchanged.

## Inventory and semantics

Removed: Local synthetic workspace, Local emulator/synthetic data badge, seed-account hint, Read from local Firestore/time/role footer, PROJECT DELIVERY eyebrow. Create local account → Create account; same Firebase operation and error mapping. Added Product by HunpeoLabs as plain text (no invented link). Account name uses actual displayName, then email local part with separators normalized, then Account for missing metadata. Avatar initials are decorative. Icon button accessible name and tooltip: Sign out; original signOut(auth) callback. No fixture data renamed/deleted, no environment guard removed. Brand remains SatsunicPlan.

## States

Unauthenticated: simpler login, fields and actions preserved. Authenticated default: account name, initials and sign-out. Missing profile: five fallback cases PASS, including whitespace and no metadata. Long name: CSS ellipsis plus title; narrow widths defined but rendered overflow NOT_RUN. Hover/focus: source-defined hover and shared keyboard outline; rendered keyboard and screen-reader NOT_RUN. Pending/error/unauthorized/offline: original messages and cleanup retained, not rewritten; fresh UI failure path NOT_RUN. Sign-out confirmation/destructive: not applicable; existing reversible session exit.

## Principles

| Principle | Status | Evidence |
| --- | --- | --- |
| Purpose | PASSED | Removed setup noise; meaningful name and sign-out only in account row |
| Agency | PASSED | Existing exit callback, accessible button and tooltip retained |
| Responsibility | PASSED | Actual profile identity; provenance remains in setup docs |
| Familiarity | PASSED | Avatar/name/exit convention; native button semantics |
| Flexibility | NOT_RUN | Responsive CSS and Unicode fallback checked; current rendered widths unavailable |
| Simplicity | PASSED | Removed duplicate labels and exposed datastore implementation |
| Craft | NOT_RUN | Source spacing/contrast corrected; current in-context rendering unavailable |
| Delight | NOT_RUN | Restrained visual intent cannot be certified without current rendering |

## Platform patterns and gates

Web native controls, preserved focus-visible and reduced-motion CSS, no external avatar downloads. Inclusion: Unicode initials and missing-name fallback checked; localization/RTL and text scaling NOT_RUN. Auth/privacy controls unchanged. Sign-out target36px and source-defined focus retained, no full WCAG certification. Exact account/server permissions remain backend-owned.

Product Language Gate: BLOCKED. Changed strings/normal states inventoried; required in-context desktop/mobile and assistive-tool evidence is unavailable due previously returned browser policy rejection. No old screenshots presented as this candidate. No further browser workaround attempted.
