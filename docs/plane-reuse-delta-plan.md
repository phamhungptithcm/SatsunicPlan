# HWS-V2-002 v1 — reuse Plane Community source

Status: APPROVED by latest human message "approved"; evidence docs/approval-HWS-V2-002.md. User direction: use Plane code and customize directly rather than independently rebuilding UI. This supersedes the earlier reference-only implementation strategy; it does not remove the v2 Firebase/MCP/security requirements. No upstream code copied by this planning change.

## Verified baseline and impact

Target is an unborn, untracked working tree; retain supplied WIP and existing tested Firebase/MCP implementation. Intelligence gate READY; CodeGraph locates WorkspaceService, CocoIndex locates current reference-only migration boundaries. Source critical conclusions were checked directly.

Plane Community v1.4.2 HEAD remains `5f7d92784c403f76284f0f16718f320221dc7fec`. `apps/web` uses React Router and workspace packages. `packages/ui` declares AGPL-3.0; checked Button and Gantt layout/store/service files carry AGPL-3.0-only headers. Button has local helper imports; Gantt depends on MobX, @plane/types/utils and chart contexts/root. IssueService depends on the original APIService/API_BASE_URL. These are real dependencies: copying whole UI folders does not produce a functioning Firebase application automatically. Source runtime/parity NOT RUN.

The prior approval explicitly leaves legal source reuse separate and requires delta approval for material architecture/dependency deviations. New upstream module boundaries and dependencies exceed HWS-V2-001. Preserve notices and AGPL license; no proprietary/MIT relicensing. Commercial email helper and any commercial/enterprise/unknown-license file are excluded from import until separately cleared. Release legal clearance remains required; this plan makes no legal-certification claim.

## Concrete implementation direction

Adopt a source-derived Community frontend, progressively porting upstream components/stores instead of writing equivalent widgets. Maintain React/TypeScript/Vite/Firebase. Plane backend is Python/Django and cannot be retained unchanged while satisfying the Firebase target. Retain tested authoritative Functions/Rules/MCP services; replace Plane REST data bindings with adapters to those services. Preserve upstream interaction semantics when compatible, with explicit changes for immutable contracts, human acceptance, claims and evidence.

1. Add a controlled upstream source area `vendor/plane-community/` containing only reviewed Community frontend files and needed license/notices. Record original relative path, SHA, license header, upstream hash, import dependencies and local modifications in a reuse manifest. Vendor source remains distinguishable from custom adapters; no bulk overwrite/reset.
2. First vertical slice: reuse `packages/ui/src/button/{button.tsx,helper.ts,index.ts}` and required local utilities; then `apps/web/core/components/base-layouts/gantt/{layout.tsx,sidebar.tsx,index.ts}`, `apps/web/core/components/gantt-chart/**`, and required `packages/types`, `utils`, `hooks`, `constants` source dependencies. Trace and allowlist each transitive file before copying. Import manifest/catalog versions are exact at pinned SHA; install only the resolved slice, not the entire upstream toolchain.
3. Replace current handcrafted roadmap rendering with upstream BaseGanttLayout/GanttChartRoot through a Firebase view adapter. Preserve date-edit alternatives, optimistic versions, immutable baseline and independent human-completion meaning. Do not connect inherited drag handlers to generic/unrestricted CRUD. Upstream issue list/board/detail and knowledge/editor reuse follow the same manifest/adaptation process after the Gantt slice works.
4. Customize scoped HunpeoLabs/Satsunic theme tokens, navigation and product language in local wrappers/theme. Verify authoritative brand sources before claiming brand compliance. Preserve AGPL notices independently of product logo/title.
5. Maintain source-derived characterization tests, existing core/rules/protocol regressions, exact data readback, keyboard/mobile/drag-date and timezone coverage. Report Plane reference runtime, local adopted components, actual coding clients and provider evidence separately. Continue M0–M3; importing UI does not complete product parity.

## File/module ownership and approved delta requested

| Path | Change |
|---|---|
| `vendor/plane-community/**` | Reviewed source/license import and provenance; no enterprise/commercial/unknown-license code |
| `src/lib/plane/**` | Adapters for upstream types/stores/services to authoritative Firebase command/query responses |
| `src/features/roadmap/**`, `src/features/work-items/**`, `src/features/knowledge/**` | Source-derived feature composition with original trace mapping |
| `src/app/**`, `src/components/**`, `src/styles/**` | Integrate source-derived UI, scoped theme and language; preserve existing tested routes during migration |
| `package.json`, `package-lock.json`, `tsconfig*.json`, `vite.config.ts` | Exact slice dependencies/workspace aliases/styles and build wiring; no force upgrades |
| `tests/**` | Source characterization, adapter and original workflow/browser regressions |
| `docs/**`, `README.md`, `THIRD_PARTY_NOTICES.md` | Reuse manifest, license/provenance, migration classifications and honest coverage |

Backend contract/schema/permission changes are not part of this frontend-reuse delta; any necessary deviation gets its own impact review. Existing Functions/Rules/MCP remain authoritative. Other repositories, generated kit policy, master prompts, production, billing, push/merge/deploy and global client config remain excluded.

## Risks, validation and rollback

Risks: React Router versus Vite module assumptions; broad transitive MobX/editor/style dependencies; inherited permissions and API semantics; licensed file mix; timezone/drag behavior; CSS collisions and accidental lifecycle bypass. Characterize each adopted slice and constrain mutations through existing validated commands. Build/typecheck, original 5 domain/12 emulator groups, current two Chrome regressions, and new adopted UI parity checks must pass. Full accessibility/product language review and independent final review remain mandatory.

Rollback restores previous local composition only after preserving candidate files/evidence; no Git reset/clean, no deleting supplied WIP. No source runtime, parity, style compliance or product completion claim until verified.

Approval requested: approve HWS-V2-002 v1 local frontend source reuse/adaptation and dependencies within the paths above, with AGPL provenance/notices retained and separate release legal/production gates. Implementation waits for explicit human approval of this concrete delta under repository policy.
