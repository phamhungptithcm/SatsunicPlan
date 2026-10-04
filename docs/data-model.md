# Implemented pilot data/access model

Server-owned path: `workspaces/{w}/projects/{p}`. Subcollections: members, work, documents/{id}/revisions, documents/{id}/approvals, contracts, contractApprovals, claims, executions, checkpoints, decisions, submissions, acceptances, baselines, events, requests, deployments. Workspace members at workspaces/{w}/members. users/{uid}/projects is a bounded lookup index, never authority. grants and rateLimits are server-only.

All business mutations use Functions shared command handlers and current workspace/project membership. UI direct reads allowed only project work/document metadata to current project members; all direct writes denied. Storage denied until a safe attachment/export implementation exists. Agent transport resolves an opaque bearer to a hashed verifier; command transaction rechecks current grant, tenant, expiry, capability and project external-context policy. Every agent context read also checks active execution/lease/generation; human historical export remains subject to role/context approval checks.

| Actor | Reads | Writes |
|---|---|---|
| Human admin/manager | current project resources | work/docs, grants, approved contract/baseline/review/deployment transitions; independent revision/submission reviewer required |
| Human contributor | current project resources | work/new document revisions, permitted context export; no approval/grant issuance |
| Human viewer | current project resources | none; context export denied |
| Delegated agent | only granted tools in one project | claim/renew/release/checkpoint/blocker/submit if write grant; never acceptance/approval/policy/membership/deploy |
| Rules/browser client | work/document metadata for active project members | no protected writes |
| Background/GitHub webhook | not implemented | none |

Documents/contracts/revision bodies and baseline snapshots immutable. Approval/acceptance decisions separate from immutable content; current approval pointer/queue state server-controlled. Draft revisions do not change old pins; approval of a replacement currently blocks old-contract implementation. This conservative policy does not yet expose material/nonmaterial impact classification or approved old-version exceptions.

Exclusive task-level conflict scope by default. Durable claim and execution store generation, principal, connection, contract hash, bounded expiry/version. Server-time checks enforce expiry without cleanup. Idempotency principal/connection/operation/execution digest-bound; token issuance replay returns no secret. Mutation+audit+idempotency share a transaction; callbacks enqueue writes after all reads. Per-project aggregateVersion orders delta events. No external calls in transaction callbacks.

Pilot bounds: list page<=50, status work<=100 with coverage flags, documents<=50, baselines<=200 (reject larger), required docs<=8, AC<=32, dependencies<=16, document body<=40,000 characters, context page<=8,000 code units without splitting a surrogate pair at the end. Parts report UTF8 bytes/hashes. Exports additionally hash actual assembled Markdown. Jobs/staged large baselines, per-document visibility, individual scope maps, permission invites, attachments and large dataset indexes remain not implemented.

Collection queries use single-field ordering/filter indexes only; firestore.indexes.json has no composite indexes yet. No whole-project metric claims when bounded work coverage is incomplete. Existing direct-write paths cannot bypass Done/approval/claim gates.
