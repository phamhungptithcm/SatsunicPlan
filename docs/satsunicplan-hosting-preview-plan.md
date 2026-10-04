# SatsunicPlan static Hosting preview plan

Plan ID/version: SATSUNICPLAN-FIREBASE-002 v1
Status: DEPLOYED AND VERIFIED; approval in satsunicplan-preview-approval.md, completion in satsunicplan-preview-completion.md
Prerequisite evidence: satsunicplan-firebase-provider-verification.md

## Small next step

Create a dedicated static readiness page for SatsunicPlan, then deploy only that page to the existing satsunicplan Hosting site's new preview channel `satsunicplan-readiness` with 7-day expiry. The live channel and backend remain untouched. No Auth flow, Firebase SDK, API/MCP rewrites, trackers, external scripts, web-app creation, billing or API activation.

Page content (Vietnamese): title SatsunicPlan; heading "SatsunicPlan"; status "Đang chuẩn bị triển khai"; explanation "Bản xem trước này chưa mở đăng nhập hoặc dữ liệu dự án." No disabled fake controls or unsupported capabilities. Semantic HTML, responsive layout, visible text, keyboard-readable content and natural Vietnamese; follow current SatsunicPlan visual tokens rather than changing shared UI.

## Exact change boundary

- Add isolated preview HTML/CSS under `preview/satsunicplan-readiness/`.
- Add `firebase.preview.json` containing only Hosting, explicit site satsunicplan, isolated public directory, no backend rewrites, cache and security headers.
- Add focused local preview validation and document component hashes, local narrow/wide rendered evidence, Product Language review and final review before deployment approval.
- Deploy only the static preview channel using explicit project satsunicplan and config firebase.preview.json; expire in 7 days. First re-read channels to ensure the chosen channel does not contain another session's release; choose a new scoped identifier if a collision exists and document it.
- Read back channel URL/expiry/version; verify served HTML/CSS and headers against hashes. Existing live-channel metadata must remain unchanged.

This is a new deployment configuration/remote mutation and therefore requires reviewed-plan approval under .ai/workflows/plan-existing-system-change.md before protected implementation. Approval must explicitly cover this preview-only scope. No production app readiness claim follows from a static preview.

## Rollback and validation

Delete only the newly created task-owned preview channel if verification fails and approved rollback permits it; never remove an existing shared channel or alter live releases. Retain the local source/evidence. If Hosting permission or platform requirements block preview creation, report the failure without enabling billing/services or broadening release scope.

Risk: low for static content; remote Hosting mutation remains gated. Existing source, tests and emulator services are preserved. Full Auth/API/MCP rollout stays deferred to a separate plan after web app/provider/data/runtime configuration is verified.
