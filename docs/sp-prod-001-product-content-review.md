# Product content review — SP-PROD-001 slice 6

Target: web app, existing English workspace shell. Ask EN/VI content unchanged. No Apple platform compliance claim. Skill: `.ai/skills-src/write-product-content/SKILL.md`; integrity/profile/principle/surface contracts read.

Context: authenticated human inspecting cloud connection availability or refreshing project data. Source of truth: validated runtime config and HTTP outcome. An interrupted response cannot establish whether a mutation committed. Refresh reads the current scope; it does not automatically replay a write. Local pilot messages remain local-specific where relevant.

## Changed string/state inventory

| Surface/state | Exact new text | Meaning and recovery |
|---|---|---|
| Cloud Connect agent | Agent connections are not available in this cloud workspace yet. | Cloud MCP is disabled before auth. No grant button or local endpoint appears. Other workspace navigation remains available. |
| Cloud service disabled error | This service is not enabled for this workspace. | Maps LOCAL_ONLY to availability, not fake network or permission success. |
| Temporary error | The service is unavailable. Refresh to check whether your changes were saved. | Does not assert an interrupted operation was rolled back. |
| Network failure | Could not reach the service. Check your connection, then refresh to check your changes. | Keeps displayed scope and input, directs to the existing read-only Refresh. |
| Invalid response | Could not confirm the result. Refresh to check your changes. | HTML/proxy failure is not exposed as a raw JSON exception. |

Existing local `The local services are not available.` is retained for emulator mode. No metric definition, stored workflow status, timestamp or grant capability changed. Build configuration errors remain fail-closed startup diagnostics; a rendered startup recovery surface is not implemented or certified by this scope.

## Current in-context evidence

Command: `node tests/cloud-runtime-browser.mjs`. Actual cloud build in `tests/.cloud-dist`, served only by browser request interception with synthetic public settings, Auth user lookup and project snapshots. All unhandled external requests blocked. This is a disclosed simulated Auth/API proxy; no live provider acceptance.

PASS: 1440/390/320px; Connect agent state; all four error responses in the same page; Refresh keyboard Enter recovery; error disappears after successful readback; no cloud grant issuance; no emulator requests; no page exceptions or page-level overflow. Role alert/status remain the shell's existing accessible announcement surfaces. A screen reader was not run; no screen-reader compatibility certificate. At 320px the fixture doubles actual computed element type sizes and verifies the changed empty-state font is 26px (normal 13px). This is a text-expansion proxy, not native browser zoom. Changed messages wrap and remain readable. Existing sidebar horizontal navigation/Ask launcher truncation under doubled type is outside changed content and not a full-app accessibility pass.

Evidence: `docs/evidence/sp-prod-001-browser/results.json`, cloud-agent/offline screenshots for all three widths, `cloud-agent-320-text-200.png`. Parent visually inspected mobile offline and doubled-type screenshots. Desktop screenshots are retained; final reviewer must inspect current evidence. No secrets or real personal data captured.

## Eight principles

| Principle | Status | Evidence |
|---|---|---|
| Purpose | PASSED | Connect state accurately identifies unavailable action; errors identify refresh result uncertainty. |
| Agency | PASSED | Read-only Refresh and workspace navigation remain available; no automatic write replay. |
| Responsibility | PASSED | No false saved/unsaved guarantee; unavailable MCP cannot imply live provider access. |
| Familiarity | PASSED | Existing web navigation/button/error conventions retained; no Apple-only language or controls. |
| Flexibility | PASSED | Changed content wraps at mobile/doubled type; keyboard Refresh works; English shell locale preserved. |
| Simplicity | PASSED | One cloud availability sentence, no inactive connection form or local URL. |
| Craft | PASSED | Specific network/response/disabled states, accessible alert/status roles, current rendered fixture checks. |
| Delight | NOT_APPLICABLE | Serious availability/security messages need clarity; no decorative animation or surprise added. |

Scoped language review PASSED for changed English content. Full master Product Language Gate remains incomplete; no claim about unchanged screens, VI shell localization, live cloud states, assistive technology combinations or full product readiness.
