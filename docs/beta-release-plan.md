# SP-BETA-001 — first beta publication and deployment

User authority: `release lên production bản beta đầu tiên`, followed by `commit and push to main create tag, release note` in this chat, 2026-10-04. Target repository verified empty: phamhungptithcm/SatsunicPlan. Target Firebase project: satsunicplan. Tag: v0.1.0-beta.1; GitHub prerelease, not full production-readiness certification.

## Source publication

Track product source, lockfiles, configuration templates, required vendor/license/provenance, tests and repository documentation/policy. Exclude credentials/env overrides, dependencies, emulator/user stores, local agent/index/ledger state, build output, logs and stale source backup snapshots. Preserve unrelated local WIP; no git clean/reset/force push. Create main because local branch is unborn master and remote is empty. Conventional initial beta commit; annotated tag on exact commit; GitHub prerelease notes describe known boundaries. Recheck remote emptiness before push. A clean isolated export must build/test before publication. Existing AGPL notices/source attribution retained.

## Production beta scope and current blocker

Candidate has explicit human cloud API runtime and cloud UI; MCP/OAuth remains disabled. No master/full product completion assertion. Deployment must first establish verified web app public settings, configured Auth provider/domains, Firestore database/region, Rules/indexes, required enabled APIs, authorized runtime identity and actual ingress host; build with verified public settings only. Deploy and read back each scoped component before application Hosting. Verify authenticated successful/denied/revoked access, signed tokens, persistence/readback and rollback before beta traffic. Never upload emulator dist or the synthetic cloud fixture build.

Fresh live read-only checks: billingEnabled False; enabled-service filter returned identitytoolkit only; Firebase WEB app list empty. Therefore a working Functions/Firestore production beta cannot presently be deployed. This release request does not select a billing account or Firestore data location. Do not attach billing or guess a persistent region automatically. Request owner selection/authority for those prerequisites while completing the already authorized Git publication.

No automatic public MCP exposure. No production data import or destructive baseline replacement. Record prior provider resource versions before any future mutation. If application rollout fails, restore the recorded prior component versions; for a new installation keep application traffic closed rather than deleting persistent data. Git tag remains the truthful source-beta record regardless of deployment status.

## Release checks

Node22 build and25 tests, isolated backend12 groups, simulated cloud browser3 viewports are current prior evidence. Repeat build/unit tests from an isolated staged-source export. Inspect staged paths/secrets without printing values. Confirm main/tag remotely and GitHub release tag/body. Independent release review must distinguish source publication from blocked production acceptance. Source is currently unborn/untracked; publication provides commit provenance but does not retroactively certify prior tests as deployed.

## Owner decisions (2026-10-04)

Owner selected Firestore Singapore (asia-southeast1) and billing account 01428C-358437-2361F8 for project satsunicplan. Owner confirmed: “Đã duyệt, công bố source beta theo AGPL”. This is owner approval for public source-beta distribution under AGPL, not an automated legal audit certificate; the complete transitive audit remains incomplete. Root LICENSE includes GNU AGPL v3; existing upstream notices are retained.
