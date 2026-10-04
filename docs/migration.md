# Migration inventory — master prompt v2

Status: M0–M3 PARTIAL; a persisted local implementation now exists. Full product INCOMPLETE; production NOT_READY. Target is this repository.
The v2 master prompt is the product authority; policy remains authoritative.

## Provenance

- Source: https://github.com/makeplane/plane
- Release: v1.4.2; published 2026-08-23; GitHub API reports draft=false, prerelease=false.
- Checked-out SHA: `5f7d92784c403f76284f0f16718f320221dc7fec`.
- Reference checkout: `/tmp/hunpeolabs-plane-v1.4.2-reference`, separate from target/build.
- Evidence: release API read and `git rev-parse HEAD` matched. Source runtime NOT RUN.
- Root `LICENSE.txt`: GNU AGPL v3. Source file/asset/dependency audit remains incomplete.
- `apps/api/plane/utils/email.py:2` has `LicenseRef-Plane-Commercial` at this SHA. Do not reuse this file. Root license alone is insufficient to authorize every file.
- HWS-V2-002 now imports reviewed Community frontend source into `vendor/plane-community`; no Plane assets/backend/commercial helper were copied. Distribution/source-availability obligations need owner legal review before release; no proprietary/MIT relicensing conclusion.

## Current target

Starting baseline: unborn `master`; all supplied files untracked. No previous application implementation was found. Current candidate adds React/TypeScript/Vite, Firebase Functions/domain services, emulator configuration, Rules, official SDK MCP transport and meaningful tests. No commit was made; this is an untracked working-tree candidate. Existing prompts/policy retained. No v1 application data or API/Rules entry points exist to migrate. The platform-specific prompts are separate inputs, not replacements for web v2.

## Initial source observations (source-read, not runtime verified)

All paths below are relative to the pinned reference SHA.

| Feature | File/symbol | Observed behavior | Classification | Target plan | Acceptance | Status/difference |
|---|---|---|---|---|---|---|
| Work items | apps/api/plane/db/models/issue.py / Issue | parent, state, priority, date-only start/target, assignees, sequence, estimates, archive | REIMPLEMENT | typed work items + scoped Firestore commands | A01,A09,A20 | PARTIAL; persisted work items/contract gates exist; no full Plane parity |
| Scoped issue reads | apps/api/plane/app/views/issue/base.py / IssueListEndpoint.get | permission decorator, workspace/project query; guest created-by filtering | REIMPLEMENT | current membership + project ACL on every read | A06,A23,A53 | PARTIAL; live workspace/project membership enforced; private document ACL remains absent |
| Project permissions | apps/api/plane/utils/permissions/project.py / ProjectBasePermission,ProjectMemberPermission | active membership and method/role checks | REIMPLEMENT | explicit capabilities and independent human review | A39,A40,A48 | PARTIAL; agent grants separate; native OAuth not implemented |
| UI issue transport | apps/web/core/services/issue/issue.service.ts / IssueService | create/read through project-scoped API, error propagation | REIMPLEMENT | Firebase UI and shared Functions command handlers | A01,A19 | PARTIAL; local Functions transport replaces Plane backend |
| Gantt view state | apps/web/core/store/issue/issue_gantt_view.store.ts / GanttStore | month default, active block and view state | REIMPLEMENT | live roadmap with separate baseline/forecast/actual | A07,A08,A18 | PARTIAL; immutable small-project baselines and live roadmap implemented; virtualization/drag scheduling absent |
| Ready/claim/contracts/handoff | master prompt §§7–12 | required target product semantics | NEW | shared domain services, durable claims, official MCP SDK | A22–A45 | PARTIAL; target domain services/MCP exist; not claimed as Plane behavior |
| Commercial email helper | apps/api/plane/utils/email.py | commercial header observed | BLOCKED | independent authorized implementation if needed | license gate | No reuse |

## Coverage matrix

`requirements-v2.csv` retains every nonblank content block with prompt line ranges, IDs, milestone, actor/entry point, owner, feature/test status and evidence. It is a lossless initial inventory, not proof of implementation or atomic test coverage. Compound blocks still need individual assertions; UNMAPPED acceptance relationships and unassigned owners remain explicit. M0–M3 scope is retained. Source behavior classification is UNASSESSED until traced; these rows must not be casually marked NEW or EXCLUDED.

Full source inventory still needs routes/editor, schema migrations, serializers, jobs, notifications, integrations, import/export, settings, tests, dependencies and asset rights. Characterization fixtures must follow traced source behavior. No parity or full feature inventory claim is made.

## Replatform boundaries

Source behavior is traced as reference, not executed Plane characterization. `source-inventory.csv` records 35 model metadata entries; it is not a complete source/license audit. The original candidate used source as reference only. The approved HWS-V2-002 delta now imports reviewed AGPL-3.0-only frontend source; original snapshots/hashes and adaptations are tracked in `plane-reuse-manifest.json`. No upstream assets/backend/commercial helper were imported. React UI and Firebase transactional commands replace the original transport/persistence for the bounded workflow; this is not a logo-only change. Public Functions fail closed outside the emulator until deployment/authentication/security gates are implemented and reviewed. Existing supplied WIP has not been deleted or rewritten.

See `data-model.md`, `mcp-api.md`, `mcp-auth.md`, `mcp-clients.md` and `verification.md` for implemented boundaries and evidence limitations. Public API/schema/permission approval is HWS-V2-001 v1, not inferred from the product prompt.

## Approved source reuse — HWS-V2-002

Human approved the concrete delta; 21 source entries from exact v1.4.2 SHA are now adopted: 14 byte-identical and 7 adapted. Imported Button/helper, Gantt layout/root, view store, data, week/month/quarter generators, calendar positioning helpers and Gantt/base types are live dependencies of the roadmap. A Firebase adapter supplies project-scoped work items and baseline; original API/root-store bindings are not retained. LICENSE.txt and original copyright/SPDX headers remain.

This is source reuse with adaptation, not a full unmodified Plane application fork. ChartViewRoot and sidebar are substantially adapted; their original source path/hash remains explicit. Actual Plane reference app runtime/parity NOT RUN. Issue board/detail and rich editor source port are still pending; drag/resize, inherited reordering/dependency gestures and paging are disabled, not claimed implemented. Current source reused for roadmap replaces the previous handwritten Roadmap function. Backend gates/transactions remain unchanged.

Dependency compatibility exception: Plane catalog mobx-react 9.1.1 excludes React 19; registry verified 9.2.0 supports it. Other slice dependencies match pinned catalog. See plane-dependency-licenses.json; audit runtime zero, ten development-tool advisories remain. No force/legacy-peer-deps install.

Current source classification for adopted files: PRESERVE for byte-identical layout/root/store/view/type/helper modules, REIMPLEMENT for the Firebase-bound chart/sidebar rendering and date correctness patches; NEW for baseline/contract/human-acceptance overlays. These classifications apply to the traced slice only, not unassessed whole-source inventory.

## 2026-10-04 Ask Anything / Firebase continuation

Source component/CSS and cancellation/stream contracts read from current HunpeoLabs WIP; exact hashes recorded in evidence/ask-hunpeolabs-source-snapshot.json. HWS-V2-003 proposed source-derived Ask UI/help port is awaiting reviewed-plan approval. No provider/training integration or protected source edits made in this planning step. Source/target browser parity NOT RUN. Repository intelligence READY. Production runtime is source-verified emulator-only; see firebase-readiness-gap.md. Existing approved Plane/M0–M3 scope remains active; full product NOT_READY.

## HWS-V2-003 implemented Ask source port (2026-10-04)

Approval evidence: `approval-HWS-V2-003.md`. Ported original HunpeoLabs component lifecycle, byte-identical CSS and cancellation helper, adapting Next bindings to Vite and local typed usage guidance. Source is hash-bound owner WIP, not the sibling HEAD. Provider/Genkit/Gemini/API/portrait/business answers excluded. Separate integration CSS isolates inherited app styles. Scope is privacy-bound to current user/workspace/project and suspended during Create modal. Main command wrapper tears down scope on observed denial; this is not continuous membership monitoring. Current-project reselection no longer clears data without triggering reload. Original MCP/domain backend and rules unchanged. Parallel SP-UI-001 shell/roadmap changes remain owned by the other chat and preserved.

AI/training remains owner setup later. This is a UI/help implementation, not M0–M3 completion or production enablement. Firebase runtime changes need the concrete security/runtime plan described in `firebase-readiness-gap.md`; no guards were relaxed and no deployment occurred.

Preserved the other chat's SATSUNICPLAN-FIREBASE-001 phase1 configuration/preparation files. Their cloud startup guard and emulator/backend boundary stay fail closed. No backend domain/rules or provider behavior was changed by the Ask delta. Unit19 PASS includes those preparation cases, separately from the15 domain/Plane/Ask groups. Ask accessibility subset uses Chrome's AX tree and keyboard/text-scaling fixture; further actual assistive-tech/contrast evidence remains needed.

HWS-V2-003 independent cycle2: READY; no new actionable Ask source defect; all16candidate hashes current; browser evidence finding FIXED. Accessibility evidence gate remains BLOCKED. Formal review receipt cannot record on unborn HEAD. Current scoped report: `task-completion-HWS-V2-003.md`; product remains NOT_READY.
