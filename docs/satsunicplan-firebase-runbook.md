# SatsunicPlan: incremental Firebase rollout

Cloud project ID: `satsunicplan` (owner supplied; provider not yet verified).
SP-PROD-001 slice 6 implements an opt-in human cloud runtime for local validation. No cloud application release is approved or verified.

## Local development

Use `.env.example` with `VITE_FIREBASE_MODE=emulator`. Existing emulator scripts explicitly use the synthetic project and loopback endpoints. `.firebaserc` has `local` and `cloud` aliases, with no implicit default. Never replace emulator fixture IDs with satsunicplan or seed synthetic fixtures into cloud.

## Prepare one component

```sh
npm run firebase:prepare -- hosting --project satsunicplan
npm run firebase:prepare -- rules --project satsunicplan
npm run firebase:prepare -- indexes --project satsunicplan
npm run firebase:prepare -- storage --project satsunicplan
npm run firebase:prepare -- api --project satsunicplan
npm run firebase:prepare -- mcp --project satsunicplan
```

These commands print component selectors, source hashes, prerequisites and blockers. They do not invoke Firebase, access credentials or deploy. Hashes are preparation evidence, not an executable release receipt; Functions/Hosting must also bind every source/dependency and exact built artifact before a future release. Unknown components, projects or execution flags are rejected. Never use a bare `firebase deploy`.

`firebase.json` stays the local emulator configuration. `firebase.cloud.json` is a separately reviewed future cloud template. It includes exact `/api` and descendant API routing; MCP is deliberately absent from Hosting rewrites. Region us-central1 is inherited from existing code, not owner/provider-confirmed. Verify it before release. Functions remain emulator-only even if accidentally deployed.

## Stage gates

1. **Local preparation:** build/config tests and emulator regression. Current stage.
2. **Read-only provider verification:** authenticated identity/access, satsunicplan project, web app public settings, Hosting site, providers, existing resources, billing state and region. No provisioning or changes.
3. **Hosting preview:** separately approve a dedicated static readiness artifact and preview channel. Do not deploy the current emulator app in dist or imply API functionality. Capture hashes/channel readback. Remove/revert only that preview channel if it fails.
4. **Human API pilot:** reviewed delta for Auth configuration, ADC identity, canonical origins/hosts, ACL/revocation, limits, headers and monitoring. Review/deploy Firestore rules, indexes and Storage separately, preserving the verified prior baseline. Wait for indexes before API. Validate authenticated acceptance/denial paths before Hosting app release.
5. **MCP then public rollout:** separate OAuth/security/client verification; no automatic MCP exposure. Widen traffic only after pilot acceptance and operational checks.

Cloud client settings are prepared by `.env.cloud.example`. Values must come from the verified web app; no guessed app ID/domain/key. Missing settings fail closed. SP-PROD-001 implements explicit `VITE_HUMAN_API_ENABLED=true` and an exact HTTPS `VITE_FIREBASE_APP_ORIGIN`; absent/false activation keeps cloud startup blocked before Firebase initialization. Activation is not evidence that Auth/API resources exist or that deployment is authorized. Local mode keeps the synthetic project and Auth emulator. Cloud mode uses `/api` on the current origin and never attaches emulators. Connect agent shows unavailable in cloud and cannot issue a UI grant.

## Human API runtime settings (not a deployment instruction)

Backend activation requires `HWS_FIREBASE_MODE=cloud`, `HWS_HUMAN_API_ENABLED=true`, platform `GCLOUD_PROJECT=satsunicplan`, and nonempty JSON arrays `HWS_API_HOSTS` and `HWS_API_ORIGINS`. Configure only verified exact ingress hosts and canonical HTTPS application origins. Origins must belong to the host list. No wildcard, loopback, port-bearing, malformed or duplicate allowlist entries. Conflicting `GOOGLE_CLOUD_PROJECT`/`FIREBASE_CONFIG` or any emulator environment causes startup failure. Missing cloud mode defaults to emulator and requires the emulator environment; it never infers production from a project name.

Actual request Host is checked; `X-Forwarded-Host` does not grant access. Platform ingress may present a function/Cloud Run host rather than the app host; capture verified metadata and acceptance before release. Do not broaden the allowlist speculatively. An absent Origin permits native human clients, but bearer authentication and current authorization remain mandatory. A present Origin must exactly match the canonical list. Body size remains bounded at 100,000 bytes. OPTIONS is boundary-checked and read-only.

Cloud MCP is unconditionally rejected before authentication regardless of human API activation, and has no Hosting rewrite. OAuth/client acceptance needs a separately approved plan. Never treat browser Firebase tokens as MCP delegated credentials.

## Isolated local validation

`node tests/runtime-backend.mjs` starts this task's synthetic suite on ports offset by 10,000 from firebase.json and runs Rules/integration/MCP/Auth checks. It uses the demo project, nonexistent ADC path and private CLI config; it does not import, reuse or export other emulator data. Compile Functions before running it. Endpoint overrides in fixtures accept loopback only. Existing services on default ports remain untouched. This backend check does not cover browser journeys or live providers.

`tests/cloud-runtime-browser.mjs` uses the actual build in `tests/.cloud-dist` with fixture public settings and intercepts all Auth/API traffic. It exercises cloud Connect agent, network/invalid-response/disabled-service states, keyboard recovery and responsive text wrapping. This is simulated identity/API evidence only. Never deploy that fixture build or use its public fixture app ID as provider settings.

## Release receipt and rollback

For each later mutation record reviewed plan/human authority, project/site/component, exact source+build+config hashes, validation results, prior resource version and rollback, then post-deployment readback. Hosted artifacts can roll back to the recorded prior release. Rules need the recorded prior rules; indexes require impact analysis rather than blindly deleting them. Functions need the prior known-good artifact/config. Data rollback requires a separately reviewed backup/restore plan. None of these cloud baselines is verified yet.

No credentials belong in VITE variables. VITE values are shipped to browsers. Do not save personal CLI login state in the repo. No new dependencies, schema changes, billing/IAM changes, automatic deployment or cloud seed operations are introduced.
