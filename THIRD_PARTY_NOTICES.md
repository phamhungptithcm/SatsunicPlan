# Third-party provenance and review boundary

Reference source: makeplane/plane v1.4.2, commit 5f7d92784c403f76284f0f16718f320221dc7fec. Root license is GNU AGPL v3; observed source headers commonly AGPL-3.0-only. The HWS-V2-002 candidate now imports reviewed AGPL-3.0-only Plane Community frontend source into vendor/plane-community. Original notices and vendor/plane-community/LICENSE.txt are retained. docs/plane-reuse-manifest.json records exact original paths/hashes and local adaptations. Firebase domain services remain independently written; no Plane assets/backend or commercial helper were imported. This statement does not waive obligations applicable to adaptation. Owner legal review is required before distribution/network release.

Do not reuse apps/api/plane/utils/email.py at the pinned SHA: commercial header observed. Full file/dependency/asset audit remains incomplete.

Direct dependency licenses read from npm metadata/package manifests: React/ReactDOM/Vite/React plugin/tsx/MCP SDK/Zod/firebase-functions MIT; Firebase/firebase-admin/TypeScript Apache-2.0. Type/test/CLI packages and transitive notices require the full lockfile distribution audit before release. No target MIT/proprietary relicensing assertion.

Runtime grpc-js and gaxios→uuid overrides patch advisories without changing the chosen stack. npm security audit results and remaining tooling advisories are in docs/verification.md. Installing toolchain does not certify license/security/public readiness.

Added slice dependencies: mobx 6.12.0, mobx-utils 6.0.8, lodash-es 4.18.1, clsx 2.1.1, tailwind-merge 3.4.0 use pinned upstream catalog; mobx-react 9.2.0 replaces upstream 9.1.1 only because registry peer metadata requires React 19 support. No --force or legacy-peer-deps used. Exact installed dependency licenses are recorded in docs/evidence/plane-dependency-licenses.json. This is not a full transitive release license audit.

HWS-V2-003 also ports owner-authorized local HunpeoLabs Ask UI source. Its original files are untracked WIP; the sibling repository HEAD is not provenance for those bytes. `docs/evidence/ask-hunpeolabs-source-snapshot.json` and `ask-reuse-manifest.json` bind source and adaptation hashes. Original CSS is byte-identical. Provider implementation, business knowledge, portrait and external API were excluded. This permission does not resolve Plane AGPL obligations or the full distribution audit.
