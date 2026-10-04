# SATSUNICPLAN-FIREBASE-001 coordination

This chat owns approved local Firebase phase 1 preparation: .firebaserc, .env.cloud.example, the appended VITE_FIREBASE_MODE setting in .env.example, firebase.cloud.json, scripts/firebase-release.mjs, src/lib/firebase/config.ts, targeted client.ts edits, package.json test/preparation scripts, focused Firebase tests, and uniquely named satsunicplan-firebase-* evidence/runbook documents.

No edits to src/styles/app.css, PlaneRoadmap.tsx, index.html, main.tsx or shell/login branding. .env.example retains VITE_PRODUCT_NAME=SatsunicPlan. Existing files were edited narrowly; no wholesale replacement of shared UI/config.

Cloud alias targets owner-supplied satsunicplan, but no cloud provider is selected/accessed for execution. Test runtime explicitly remains demo-hunpeolabs-workspace. No deployment, provisioning, billing/IAM, data migration, commit/push or emulator shutdown.

Existing emulator hub on 127.0.0.1:14400 and API on 127.0.0.1:15001 were preserved. Starting a second suite via npm run test:auth fails because ports are occupied; direct Auth regression passed against existing loopback emulators with isolated randomly named synthetic fixtures. No seed reset performed.

Shared-file overlap: .env.example and package.json require narrow merges by other sessions. UI owners must retain VITE_FIREBASE_MODE=emulator and the added Firebase test/preparation scripts. Local-only displayed text remains accurate because cloud startup is guarded. Config/API/MCP cloud enablement requires the separate reviewed rollout plan.

Evidence is bound to hashes in satsunicplan-firebase-candidate.json; changes by another session invalidate affected hashes and require renewed verification before claiming exact-candidate readiness. Current review approves local preparation only; production remains NOT_READY.
