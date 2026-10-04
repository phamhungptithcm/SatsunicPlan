# SP-BETA-001 cloud login correction review

Scope: web/English login form; src/app/main.tsx, tests/cloud-runtime-browser.mjs. Existing SP-PROD-001 approved cloud UI scope; user now requests production beta. Read write-product-content integrity/profile/principle/surface contracts. Apple platform compliance is not applicable.

Inventory: Email value author@example.test → empty in cloud; Password value Synthetic-only-2026! → empty in cloud. Emulator defaults remain identical. Labels Email/Password, Sign in/Create account, autocomplete=username/current-password, required constraints and error/status behavior unchanged. Blank means user input required, not a test identity, unknown persisted data or successful authentication. No other user-facing string/data mapping changed.

Context: person signing into an actual cloud workspace should provide their own credentials. Entered data stays available across the existing recoverable errors; no new credential persistence, transfer, logging or backend permission introduced. Login still uses the existing Firebase email/password provider; browser evidence is synthetic, not actual provider acceptance.

Evidence: Node22 build PASS,25 tests PASS; regenerated actual cloud build rendered with fully intercepted synthetic Auth/API. Browser assertions verify both input values blank at1440/390/320px before fill; successful fixture signin and four existing failure/recovery states pass. Current screenshots cloud-login-1440/390/320.png under docs/evidence/sp-prod-001-browser. Parent visually inspected320px: persistent labels and both empty inputs readable without page overflow. Keyboard Refresh and doubled type regression retained. Screen reader/real user credential interaction NOT_TESTED; no broad accessibility certificate.

State coverage: default and empty form verified; native required form constraints retained; pending/disabled, success, error/recovery, offline/stale/partial and unauthorized feedback unchanged, existing fixture coverage retained. Destructive confirmation and displayed metrics NOT_APPLICABLE: no such surface change.

| Principle | Status | Current evidence |
| --- | --- | --- |
| Purpose | PASSED | Form requests the person's actual email/password, no suggested emulator account. |
| Agency | PASSED | Both editable controls start empty; Sign in/Create account remain explicit choices. |
| Responsibility | PASSED | Public cloud form does not promote known fixture credentials. No new data collection. |
| Familiarity | PASSED | Existing web labels/autocomplete/button conventions preserved. |
| Flexibility | PASSED | Blank-state and subsequent fixture signin verified at three widths; keyboard recovery/doubled-type regression retained. |
| Simplicity | PASSED | Removed irrelevant defaults with no extra setup text/control. |
| Craft | PASSED | Mode-specific defaults plus actual rendered assertions; emulator behavior preserved. |
| Delight | NOT_APPLICABLE | Credential correctness requires calm clarity, no decorative change. |

Scoped content decision PASSED. Full-product language/accessibility/localization acceptance remains incomplete.
