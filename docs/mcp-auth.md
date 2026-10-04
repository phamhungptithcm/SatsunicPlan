# Auth mode and public-release boundary

Implemented: local pilot dedicated bearer/PAT grant, 24-hour expiry, 15-minute claim lease, SHA256 verifier lookup, one-project allowlist/tool capabilities, explicit human consent, revoke on next call. No plaintext grant persisted in Firestore/idempotency/audit. Issuance secret returned once; replay cannot recover it. No token passthrough to GitHub or model provider. Browser Firebase ID token accepted only human API; PAT only MCP.

Browser identity is Firebase Authentication; it is not claimed to be a full MCP OAuth authorization server. Native OAuth discovery/PKCE/redirect/state/issuer/audience/resource/refresh/registration interoperability has NOT RUN and is not implemented. Feasibility remains M0 BLOCKED for public release pending maintained Firebase-compatible authorization-server integration/security review. No toy crypto, fake OAuth login or unauthed public server introduced.

All runtime endpoints reject non-emulator execution. Host/origin checks, no-store responses, bounded payload, principal/grant per-minute rate enforcement complement current authorization; CORS alone is not authorization. Human approval endpoints reject delegated grants even for admin principal. Context can leave the selected client/device/provider; revocation cannot recall bytes already transferred or stop external local shell edits.

Remaining: consent history/step-up, rotate/recovery lifecycle, revocation restore reconciliation, OAuth feasibility implementation, operational cleanup/retention, negative security cases beyond executed suite and independent public-service review.
