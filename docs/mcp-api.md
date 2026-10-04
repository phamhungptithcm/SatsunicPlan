# MCP pilot API

SDK @modelcontextprotocol/sdk1.32.0, stateless Streamable HTTP in Cloud Functions HTTP handler, JSON response mode. Protocol is negotiated by this official SDK, not a homegrown JSON-RPC server. Integration tests use official SDK Client; real clients NOT RUN.

All 15 required tools implemented: resolve_project, get_project_status, list_work, recommend_work, claim_work, renew_claim, release_claim, get_work_context, read_context_part, get_work_state, report_blocker, checkpoint_work, resume_work, submit_delivery, get_changes_since. Strict Zod input definitions are authoritative in functions/src/application/schemas.ts. Mutations require expectedVersion/requestKey where relevant, plus executionId/generation for owned execution. Verified actor/channel comes from auth, never body. Default scope is exclusive task implementation; no configured non-overlap scope map yet.

resolve_project currently requires exact explicit workspace/project IDs. Repository/name ambiguity resolution is not implemented. Read list limit<=50/cursor; recommend evaluates first<=50 items and discloses truncation; it does not claim/start. get_project_status bounds collections and shows coverage. No generic DB/query/shell/fetch/merge/deploy/approval tools exist.

Context manifest hashes exact contract and document part bytes; pages preserve those pinned revisions and recheck lease/ACL/grant/current approval each time. Resource template `workspace://context/{workspaceId}/{projectId}/{taskId}/{executionId}/{partId}/{offset}` calls the same read_context_part service. URI carries no credential. Prompts: implement_next_ready_work, resume_work_from_checkpoint, summarize_project_delivery. Tools-only workflow remains supported.

Domain failures return isError with schemaVersion/outcome/error/actionable nextStep; HTTP auth failures use401, forbidden403, validation400, conflict409, rate429. No private object details in errors. Cancellation cannot undo a committed transaction. Retry uses same requestKey/payload; divergent replay rejected; replay never extends expiry.

Implemented errors include UNAUTHENTICATED, FORBIDDEN_OR_NOT_FOUND, INVALID_INPUT, CONTRACT_NOT_READY, CONTEXT_CHANGED, VERSION_CONFLICT, CLAIM_CONFLICT, CLAIM_EXPIRED, CLAIM_REVOKED, IDEMPOTENCY_CONFLICT, RATE_LIMITED, TEMPORARILY_UNAVAILABLE, INDEPENDENT_REVIEW_REQUIRED. NO_ELIGIBLE_WORK is a successful normal result. PROJECT_AMBIGUOUS/EVIDENCE_STALE richer resolution/provider handling remain not implemented.
