# MASTER PROMPT — WINDOWS DESKTOP APP
## HunpeoLabs Workspace · Platform extension FINAL v1.0

**Ngày soạn:** 2026-10-03. **Parent:** Master Prompt FINAL v2.0.
**Loại nhiệm vụ:** TRIỂN KHAI CLIENT THẬT trong repository, không chỉ tư vấn.
**Phạm vi phiên:** windows. Không chạy cả ba prompt đồng thời trong cùng checkout.

Parent reference SHA-256 (đối chiếu nguồn, không phải cơ chế cấp quyền):
`cf8015e13fc42be5dbcd5607921b8e2c1fe91dbcc2659ffe31b2524c84507ea5`

Nếu parent thực tế đã có revision mới được chủ dự án chấp thuận, ghi hash mới và
diff yêu cầu; không hạ về file cũ để làm tests dễ hơn. “Final” mô tả brief, không
phải chứng nhận code, bảo mật hoặc store readiness.

## 0. QUYẾT ĐỊNH CHO WINDOWS

Xây **HunpeoLabs Workspace desktop cho Windows bằng Tauri 2 + React + TypeScript**,
dùng chung desktop core với macOS và cùng Firebase backend/MCP của v2.
Rust chỉ làm native shell/adapters. Không tự chuyển sang Electron, .NET/WinUI,
Flutter desktop hoặc dựng backend/SQL database riêng trên máy người dùng.

Đây là app cài đặt với bundled React UI trong system WebView, không phải app thuần
WinUI hoặc shortcut/PWA trỏ website. Mục tiêu reuse core mà vẫn có native window,
notifications, file dialogs, credential storage và installer/update đúng Windows.
Không hứa browser APIs/Firebase desktop SDK đều support giống web; phải spike.

Path mặc định khi chưa có desktop: `apps/desktop/`; adapter Windows ở
`src-tauri/src/platform/windows/`. Nếu core macOS đã có, mở rộng nó; không copy
thành một app desktop thứ hai. Prompt macOS không bắt buộc chạy trước.

Target mặc định Windows x64; chọn minimum supported OS theo dependencies/policy
hiện hành. ARM64 có capability/build/test track riêng, không gọi supported chỉ
vì x64 chạy qua emulation. NSIS setup .exe là direct-distribution route mặc định;
MSI là lựa chọn enterprise khi được chốt. Microsoft Store là conditional channel.
Không tự đăng ký app identity, code-sign account hoặc publish installer.

## 1. ĐỌC NGUỒN, KẾ THỪA V2 VÀ GIỮ NGUYÊN SẢN PHẨM

Đọc TOÀN BỘ `HunpeoLabs-Workspace-Codex-Master-Prompt-FINAL-v2.md`, không chỉ đoạn
khởi động hoặc một bản tóm tắt. Sau đó đọc AGENTS.md, README, docs, contracts,
source, tests, Git status và implementation hiện có. Bản v2 là yêu cầu, KHÔNG
phải bằng chứng code/backend đã được triển khai.

Nguồn phát triển client mới là repository HunpeoLabs thực tế. Plane Community
là upstream tham chiếu của migration; không clone Plane lần nữa rồi tự tạo một
backend/schema/tenant system khác. Ghi source commit, parent prompt revision/hash,
những API đã tồn tại, API còn thiếu và file/symbol chứng minh từng nhận định.

Quy tắc áp dụng tài liệu:
- Policy bảo mật và approval gates có thẩm quyền vẫn được giữ.
- V2 quyết định nghiệp vụ, quyền, dữ liệu, MCP và evidence semantics.
- Prompt nền tảng này mở rộng client/runtime/OS/distribution; không thay v2 cho web.
- Ngoại lệ rõ ràng: được thêm app client và native OS adapters cần thiết bên cạnh
  React web; “một frontend React” trong v2 không cấm các app vừa được yêu cầu.
- Không thay Firebase bằng backend khác; native process/cache không phải database
  nghiệp vụ thứ hai, không phải server có Admin quyền trên máy người dùng.
- Với code đã có trên nền tảng này: inventory, giữ thay đổi và mở rộng có kiểm soát.
  Không xóa/re-scaffold vô điều kiện để khớp cấu trúc gợi ý.
- Thiếu file v2 hoặc contract/backend: ghi exact missing input. Làm được phần
  độc lập bằng fixtures có nhãn, nhưng integration/full parity vẫn BLOCKED.
  Không tự bịa routes, collections, auth audience, claim rules hoặc field names.

### 1.1. Invariant không được thay đổi ở client nào

| Nhóm | Điều phải giữ từ v2 |
|---|---|
| Work | Project → Epic/Feature → Story → Task/Subtask/Bug; stable IDs, AC IDs, human owner, workflow, audit. |
| Roadmap | Baseline bất biến; current plan/forecast riêng; actual từ lifecycle events; date-only khác timestamp. |
| Knowledge | PRD, System Design, ADR, Spec, API/Data Contract, Test Plan, Deployment Guide, Runbook; exact revisions. |
| Contract | Published implementation contract/manifest bất biến; không tự repin khi spec thay đổi. |
| Ready work | Eligibility/ranking do chung backend; recommend là read-only; không đủ điều kiện thì không đoán. |
| Claim | Atomic, finite lease, fencing generation, idempotency; GUI không tự giữ lease cho agent. |
| Handoff | Checkpoint + shared commit/PR + context; local dirty code không tự đồng bộ sang máy khác. |
| Decisions | Câu hỏi có owner; thay scope cần revision/approval; comment không tự vượt gate. |
| Evidence | Reported ≠ provider-verified ≠ human-accepted; exact contract/submission/SHA. |
| Completion | Submitted không phải Done; accepted không phải merged/deployed. |
| Reports | Cùng metric definitions/cohorts/as-of; N/A khác zero; không chấm người bằng commits/tokens. |
| Releases | Release, deployment guide, deployment record tách biệt; giữ failed/retry/rollback history. |
| Security | Current membership ∩ grant ∩ capabilities ∩ resource ACL; không client tự cấp role. |
| Agent | Codex/Claude Code/Antigravity/Kimi Code chạy bên ngoài; không embedded LLM/model keys/agent runtime. |

Human app có thể thực hiện approval khi server cho phép đúng người/phiên và
policy. MCP delegated grant vẫn KHÔNG được approve_spec, approve_contract,
accept_delivery, publish_baseline, đổi membership/policy hoặc deploy.
Biometric/local app lock hay chuỗi `actorType=human` không tự chứng minh
interactive human authorization ở backend.

### 1.2. Full feature mapping, không làm ứng dụng chỉ xem dữ liệu

Lập matrix: v2 requirement/Axx → client screen/action → API/domain handler →
platform capability → test → milestone → status. Bao phủ cả:
projects/membership/invites, stories/tasks/backlog/Kanban/cycles, roadmap,
knowledge/templates/editor/revisions, context/contract, ready work/connections,
execution/handoff, decisions/impact, evidence/reviews, KPI/workload/worklogs,
release/deployment docs, client-visible approvals/dossiers và settings.

Phân loại UI implementation thành NATIVE_ADAPTED, SHARED_COMPONENT, BLOCKED hoặc
CONDITIONAL có lý do. Đổi drag thành form trên màn hình nhỏ là adaptation;
xóa baseline, chỉ mở website, hoặc giấu một chức năng khó không phải parity.
Nếu một nghiệp vụ v2 chưa có ở backend, nó vẫn là dependency, không được biến
thành tính năng giả chỉ trong client. Những phần chưa làm còn nguyên trong matrix.

## 2. MỘT BACKEND, MỘT MCP, HỢP ĐỒNG API DÙNG CHUNG

Tất cả clients của CÙNG environment dùng cùng Firebase project, auth identity,
workspace/project IDs, Storage ACL, Cloud Functions/application services và MCP
resource server. Dev/staging/prod tách riêng; không dùng chung dữ liệu giữa các env.
Không tạo Firebase project riêng cho mobile/macOS/Windows như ba sản phẩm độc lập.
Platform app registrations khác nhau không đồng nghĩa database/backend khác nhau.

Sensitive commands luôn qua handlers của v2: approvals, baseline publication,
readiness/claim, context, checkpoint/submission, evidence verification, membership.
Client validation chỉ hỗ trợ UX; server là nơi quyết định quyền và invariants.
Không ghi trực tiếp Firestore để bypass gates vì app native “đáng tin hơn”.
Không ship Firebase Admin SDK, service-account key, signing private keys,
GitHub App secret hoặc credential có quyền server trong bất kỳ app nào.

### 2.1. Contract-first và backward compatibility

Ưu tiên schemas/SDK hiện có. Chỉ tạo shared contract package khi thiếu; không
ép di chuyển toàn bộ repo vào monorepo tooling nặng. Hợp đồng phải có:
- Stable DTO/schema versions; error taxonomy; exact null/missing semantics.
- UTC timestamps, date-only strings, timezone/calendar IDs; precision/rounding rõ.
- Cursor pagination, bounded payload/parts, expectedVersion, idempotency key.
- Identity suy ra từ credentials, không nhận role/tenant tin cậy từ request body.
- Contract/delivery revisions, hashes, evidence source/freshness và server asOf.
- Capability negotiation/minimum client compatibility khi backend thay đổi.

Dùng JSON Schema/OpenAPI hoặc schema nguồn tương đương để sinh TS/Dart models
khi có lợi. Không copy ba bộ validator rồi để drift. Golden JSON fixtures dùng
chung cho dates, errors, contract parts, AC evidence, N/A và permissions.
Flutter không chạy trực tiếp TypeScript; desktop không tự reimplement luật bằng Rust.
Client preview có thể tính phụ trợ nhưng không trở thành server authority.
Unknown enums/fields phải render an toàn; client cũ không được ghi đè field mới.
Cùng idempotency key nhưng payload khác phải bị server từ chối.

Nếu app version cũ không còn tương thích, hiển thị update-required/read-only rõ;
không mất bản nháp hoặc silent fallback sang API không bảo vệ.
Không ép backend downgrade để giữ một client chưa nâng cấp.

### 2.2. Làm song song nhưng không giẫm lên shared code

Ghi file ownership và API-change log trước khi làm nhiều nền tảng.
Backend/shared contracts có một integration owner. Thay đổi additive phải có
tests trên web/MCP và client còn lại; breaking changes cần kế hoạch migration.
Không chạy nhiều Codex sessions ghi cùng checkout. Dùng branch/worktree riêng
khi được phép; không đổi nhánh/reset phần user đang làm. Chỉ merge bằng quy trình
được cấp quyền, không tự push/merge từ prompt này.

Thiếu API có thể bổ sung nhỏ trong cùng Cloud Functions theo boundaries v2,
với backward compatibility, Rules tests và migration notes. Không tự viết một
“mobile backend” hoặc “desktop MCP server” song song cùng nghiệp vụ.

## 3. DANH TÍNH, AUTHORIZATION VÀ PHIÊN LÀM VIỆC

Tái sử dụng human account/provider linking của sản phẩm; sign-in cùng người
phải tới cùng UID. Không tự merge accounts chỉ vì email hiển thị giống nhau.
Tách native-human session, browser session và MCP delegated connection;
không dùng một MCP access token để duyệt công việc trong app.

Native auth dùng SDK/provider flow được hỗ trợ hoặc system-browser flow đã
được threat-model và kiểm thử. Không nhúng trang đăng nhập provider trong
WebView của tài liệu, không lấy password từ trang bên ngoài.
Khi dùng OAuth/public native clients: external user-agent, PKCE, state/nonce
phù hợp, exact redirect/client binding, issuer/audience/expiry và replay defense.
Không có client secret bí mật bên trong binary. Không thiết kế crypto/OAuth đồ chơi.

Nếu cần sign-in bridge do platform không hỗ trợ luồng web hiện có:
- Làm feasibility spike sớm; reuse auth services trong Firebase.
- Login request gắn platform client ID, exact allowed redirect, challenge,
  initiating session/installation và expiry; server không tin UID do app gửi.
- Callback chỉ mang authorization code dùng một lần và state, không bearer/
  refresh/Firebase custom token trong URL, clipboard hoặc QR.
- Exchange qua TLS, kiểm tra PKCE và one-time consumption ở server.
- Credential nhận lại có issuer/audience/grant semantics được validate ở API;
  không token passthrough, không nâng MCP token thành human approval token.
- Preserve assurance/authentication time: exchange/custom-token mint không được
  biến một lần đăng nhập cũ thành recent MFA. Sensitive action cần fresh proof
  và confirmation gắn đúng resource/revision theo policy.
- Revoke/expiry/logout/account switching phải test thực tế. Thiếu cơ chế auth
  an toàn là release blocker, không lý do tắt validation hoặc mở anonymous API.

Permissions được kiểm tra lại khi mở resource, nhận download, và trước mutation.
Phát hiện revoke/logout: hủy listeners/jobs client, xóa memory, drafts/cache theo
policy, unregister device notification binding. Queued operation gắn immutable
user/workspace/env; tuyệt đối không replay dưới người vừa đăng nhập khác.

Credentials dùng OS-protected storage hoặc SDK native storage đã được đánh giá;
không log token, lưu plaintext config, nhét vào URL/analytics/crash report.
Local unlock/Face ID/Touch ID/Windows Hello chỉ là bảo vệ local trừ khi backend
thực sự xác minh một proof được hỗ trợ. Không gọi toggle biometric là MFA server.

## 4. OFFLINE, SYNC VÀ TÍNH ĐÚNG ĐẮN

Không quảng cáo “full offline” khi authority vẫn ở server.
Mặc định offline hỗ trợ đọc cache được phép và viết LOCAL DRAFT.
Không queue approve/accept/repin/publish-baseline/claim/renew/release/takeover,
role changes, deployment commands hoặc sensitive state transitions.

| Thao tác | Offline policy mặc định |
|---|---|
| Xem cached work/knowledge/reports | Cho phép theo classification/cache policy, có stale/asOf và app lock. |
| Sửa bản nháp/comment chưa gửi | Lưu local theo user/workspace, hiển thị chưa đồng bộ. |
| Gửi comment/cập nhật low-risk | Chỉ queue nếu có explicit allowlist, idempotency, expectedVersion và revalidation. |
| Duyệt spec/submission/scope change | Online-only, re-fetch exact revisions và confirm lại. |
| Nhận/gia hạn/tiếp quản claim | Online-only; server time/generation quyết định. |
| Roadmap edit | Có thể lưu draft proposal; commit online sau conflict/permission check. |
| Export/download | Chỉ với nội dung đã có quyền và policy cho phép; không fetch private data khi offline. |

Operation lifecycle: LOCAL_DRAFT → PENDING (nếu được hỗ trợ) → SENDING →
CONFIRMED hoặc CONFLICT/REJECTED. “Saved locally” không phải “Saved to workspace”.
Timeout sau mutation không đồng nghĩa thất bại: retry/query với cùng operation ID,
không tự tạo operation mới. Có cancel/edit/retry/discard và giới hạn queue.

Reconnection/sleep/wake/network switch: refresh identity, memberships, server
versions và resume cursor; không replay dữ liệu stale mù quáng. Client clock chỉ
phục vụ display; không có quyền kéo dài lease hoặc quyết định on-time metrics.
Realtime notifications chỉ invalidation hints; read-back từ authoritative source.
Không tạo listener cho từng cell/từng task hoặc tải hết workspace để tính reports.

Cache tenant/user/env-scoped, có size/age/classification budget, encryption theo
threat model và cleanup. Kiểm tra thực tế SDK database có được mã hóa hay không;
không mặc định Firestore persistence/SQLite/IndexedDB đã encrypted bởi app.
Tài liệu restricted mặc định không persist nếu chưa có kiểm soát phù hợp.
Không hứa revoke từ server xóa bytes trên thiết bị đang offline hoặc bản đã export.
Nếu chưa đánh giá được cache an toàn, dùng memory-only và local draft giới hạn,
ghi persistent-offline BLOCKED chứ không báo “secure offline ready”.

## 5. MCP VÀ AI WORKFLOW — CLIENT APP KHÔNG PHẢI AGENT RUNTIME

App này là bề mặt làm việc của con người. External coding clients tiếp tục dùng
MCP endpoint của v2, không phải bắt buộc đi qua mobile/desktop app.
App đóng không được làm server MCP mất khả năng phục vụ agent đang chạy riêng.
App mở không tự gia hạn claim, khởi chạy agent, đọc repo hoặc gọi model.

Cần màn Connect Agent/Connections và task inspector có:
client/surface/version, granted project/capabilities, test read-only, revoke,
contract/context status, eligibility reason, attempts, checkpoints, claim expiry,
blockers/decisions, evidence freshness và human review actions.
Không fake client online từ app heartbeat; lastSeen không chứng minh đang code.

Tái sử dụng tool semantics của v2, không tạo protocol fork theo OS:
resolve_project, get_project_status, list_work, recommend_work, claim_work,
renew_claim, release_claim, get_work_context, read_context_part, get_work_state,
report_blocker, checkpoint_work, resume_work, submit_delivery, get_changes_since.
UI gọi chung application services qua human API khi cần; không dùng agent tools
làm cổng approval. Tools-only workflow vẫn phải dùng được bên ngoài ứng dụng.

Nếu có nút Open in coding tool: chỉ mở ứng dụng/link/resource được đăng ký và
đã kiểm chứng theo client. Không có documented deep link thì cung cấp hướng dẫn
hoặc mở project context; không bịa URI hoặc nhét lệnh shell từ spec vào terminal.
Việc chọn app không đồng nghĩa cấp file-system access, OAuth consent hay merge quyền.
Compatibility matrix có từng OS/client/version/surface/transport/auth mode và evidence.
Không tuyên bố app mobile chạy Codex CLI hoặc mọi client đều có bản native Windows.

Review thực tế: load submission/contract/SHA → xem changes/evidence → explicit
human action → server revalidate → read-back. Stale submission khi màn review còn
mở phải yêu cầu refresh; không nghiệm thu một bản khác vì người dùng bấm chậm.
Notification/deep link không trực tiếp approve, claim, run command hoặc deploy.

## 6. BẢO MẬT, LICENSE VÀ PHẠM VI QUYỀN CỦA CODEX

Deny-by-default, current ACL, server-owned fields, sanitized rich text/Markdown/
Mermaid/SVG/URLs, bounded inputs/files và audit giữ nguyên v2.
Remote content là dữ liệu không tin cậy, không được gọi native privileged bridge.
Không arbitrary shell/HTTP proxy/file read từ editor, README, PR body hoặc deep link.
Không index/upload home folder, credentials, SSH keys, .env hoặc repo user chưa chọn.

Native permission chỉ xin khi dùng tính năng, có giải thích và graceful denial.
Không xin screen recording, Accessibility automation, contacts, location,
microphone hay camera chỉ để app task management có vẻ nhiều tính năng.
Diagnostics default redacted; full docs/context/chat/source không gửi analytics.
Cho người dùng xem trước diagnostic bundle; crash telemetry không chứa secrets.

Giữ LICENSE/NOTICE/copyright/asset provenance từ nguồn được reuse. Packaging
binary, đổi sang Flutter/Rust hoặc app store không tự xóa nghĩa vụ mã kế thừa.
Kiểm tra license của editors, icons, native plugins và compatibility với kênh
phân phối; ghi pháp lý chưa rõ là release blocker, không tự đổi toàn bộ sang MIT.
Không lấy branding/trademark của Plane hoặc client AI làm logo HunpeoLabs.

Prompt này cho phép xây code/config/tests local trong quyền, KHÔNG tự:
- Đăng ký cloud app/account, bật billing, đổi DNS hoặc cấu hình production.
- Tạo/ký/phát hành certificate bằng tài khoản thật chưa được cấp quyền.
- Publish store, notarize/upload binary, push tag, release artifact hoặc auto-deploy.
- Cài/sửa global agent settings, credential stores hoặc permissions của user.
- Reset/clean Git, xóa dữ liệu, bypass tests, tắt SSL validation/OS security.

Chuẩn bị hướng dẫn và scripts có guard cho những bước cần owner thao tác.
Không có OS/SDK/account/provider/device thì tiếp tục phần độc lập và ghi
BLOCKED/NOT RUN chính xác; không bịa đã ký/đã lên store/đã chạy device thật.

## 7. SHARED DESKTOP CORE — TAURI 2 + REACT + TYPESCRIPT

Dùng cùng React/TypeScript UI và shared API/domain contracts ở mức phù hợp;
Tauri 2/Rust làm desktop shell/native adapters. Đây là app cài đặt có bundled UI
chạy trong system WebView, KHÔNG phải toàn bộ UI native SwiftUI/WinUI.
Không đưa Node.js/Electron runtime/embedded localhost backend vào mặc định.
Không giữ một URL website trong wrapper rồi gọi là app desktop hoàn chỉnh.

Cả macOS và Windows dùng **một desktop codebase**. Prompt OS chạy sau phải
inventory và mở rộng core đã có; không copy thành apps/macos và apps/windows
với business logic giống nhau. Trước thay đổi shared core, đọc trạng thái platform
kia, dùng capability flags/typed adapters và chạy regression tests phù hợp.

Cấu trúc gợi ý, không bắt chuyển nguyên repo:
```text
apps/desktop/
  src/app/
  src/features/              # reuse shared React modules where safe
  src/platform/              # typed bridge abstractions; no raw credentials
  src-tauri/
    src/platform/macos/
    src/platform/windows/
    src/security/
    capabilities/
    Cargo.toml
    Cargo.lock
    tauri.conf.json
  tests/
packages/contracts/          # only if appropriate for existing repo
packages/ui/                 # only meaningful reusable modules
functions/                   # existing shared Firebase backend, not a copy
docs/desktop/                # shared design/contract/ownership
```

Một default config và platform-specific overlays đã validate theo Tauri version
thật. Rust platform imports dùng compile-time cfg đúng, không làm macOS build
đòi Windows SDK hay ngược lại. Shared React dùng PlatformCapabilities, không
rải user-agent string checks. Không extract quá nhiều packages để “đẹp monorepo”.

Reuse roadmap/editor/task modules có license, tests và phụ thuộc web được tách
qua adapter. Auth/URLs/download/window/local filesystem không giả là giống browser.
Bundled assets phải chạy khi server web hosting không sẵn, nhưng live data vẫn
phụ thuộc backend. Không tải remote JS làm app logic hoặc mở dev server ở release.

## 8. DESKTOP API, AUTH SPIKE VÀ SECURE NATIVE BRIDGE

Không mặc định Firebase JS popup/redirect auth chạy trong Tauri, hoặc mọi Firebase
SDK desktop hỗ trợ production như browser. Làm spike trên **packaged app**, gồm
origin, system-browser login, callbacks, identity, token refresh, API read/write,
relaunch/logout và revoke. Browser dev success không thay packaged validation.

Default cho protected desktop operations: thin typed native transport gọi các
business/read endpoints trong **cùng Cloud Functions backend**. Nếu web chưa có
endpoint cần thiết, thêm adapter nhỏ gọi shared application services, không
làm generic database proxy hoặc duplicate domain. CORS không phải authorization.

Native Rust adapter giữ credential lâu dài trong OS store, dùng credential đúng
audience cho endpoint và chỉ trả DTO/error cần thiết cho renderer. Không có
`getAllSecrets`, `fetchAnyUrl`, `runShell` hoặc generic privileged IPC command.
Request nhận operation allowlist + validated payload; target host/path được code
xác định. Redirect lạ không được mang authorization header đi theo.

Nếu quyết định scoped Firebase JS reads sau khi SDK/origin/auth chứng minh được,
ghi ADR/support matrix. Không mặc định persist refresh token vào localStorage/
IndexedDB. Không tự serialize Firebase SDK User internals để giả secure store.
Chỉ thêm persistence adapter qua public API được support và test; lựa chọn
session-only + system-browser reauth tốt hơn cách “remember me” không an toàn.

Dùng native-human session flow ở mục 3; browser identity có thể bootstrap nhưng
không thay MCP OAuth/public-client protocol bằng custom scheme chứa bearer token.
System-browser callback xử lý cold/warm launch, multiple login attempts, duplicate
callbacks, cancel, stale state và user switching. Exact allowlist redirect và
PKCE verification bắt buộc khi dùng authorization-code bridge.

Local app settings không chứa tokens. Separate OS credential entries theo app ID,
env, user và connection; token update/revoke atomic và có race tests đa cửa sổ.
OS store unavailable/locked thì yêu cầu unlock/relogin, không fallback plaintext.
Không bundle service-account credentials; native app không trusted server.

Human approval: server cấp/verify assurance phù hợp, bind action tới revision,
explicit confirm; app `userGesture=true` không đủ làm security proof. Chỉ local
biometric thành công không thay recent server authentication khi policy yêu cầu.

## 9. DESKTOP WORKSPACE UI VÀ ROADMAP

Mục tiêu là workspace làm việc hàng ngày, không một app shell chỉ có splash/login.
App shell: workspace/project selector, navigation, command palette, breadcrumbs,
main content và optional inspector. Hiển thị rõ env và offline/stale trạng thái.

Full work surfaces: projects/membership, backlog/list/Kanban/cycles, task editor,
roadmap, Knowledge/System Design, Ready Work, connections, executions/handoff,
decisions, impact, reviews, reports/KPI/workload, releases/deployment và settings.
Tận dụng mật độ bảng/editor/timeline hợp lý; không biến mọi thứ thành cards.

Desktop roadmap có frozen grid, zoom tuần/tháng/quý, pan/today, milestones,
baseline overlay, current/actual, dependencies, grouping/filter và inspector.
Drag/resize có preview, transaction validation, reason, rollback khi conflict;
forms/keyboard alternative vẫn có. Sticky row/header alignment test khi scaling.
Inspector mở đúng contract/context/evidence; không gộp “reported/CI/accepted” thành
một badge xanh. Sidebar width/selection được restore nhưng không leak private state.

Knowledge dùng canonical editor của web khi hợp lệ: retain AST/revisions/assets,
source diagrams, search/TOC/diff, conflict và approval. Sanitize content/URLs;
remote documents không được quyền clipboard/filesystem/native commands.
View source code/contract phải giữ Unicode, line wrapping và horizontal scroll
không làm layout toàn app vỡ. Tabs/second window giữ revision/action identity.

Có keyboard shortcuts native theo OS, light/dark/system, font scale, high contrast,
reduced motion, accessible labels/focus. App windows resize đúng trên màn hình nhỏ,
Retina/high-DPI/multi-monitor. Không đặt minimum size làm người dùng bị kẹt ngoài màn.

Multi-window nếu dùng: auth/logout/revoke/cache invalidation broadcast và version
conflict handling; đóng một window không logout nhầm mọi account. Default một
active account/env cho shared app session để không lẫn dữ liệu. Chỉ mở nhiều
account đồng thời khi có session isolation được thiết kế/test, không tự thêm.

## 10. LOCAL REPOSITORY BINDING VÀ EXTERNAL CODING TOOLS

Có thể cho user chọn local repository folder để liên kết với project repository
binding của v2. Folder chỉ lưu như local mapping theo máy/user, không cloud path
có thể mở ở mọi người. Thao tác folder picker là consent, không permission quét home.

Chỉ đọc bounded metadata cần thiết qua library/fixed read-only operations an toàn:
repository identity, remote đã redacted, base/head ref, dirty/unshared status.
Không chạy hooks, external Git helpers, commands trong docs/PR hoặc các script
repo. Canonicalize paths và bảo vệ symlink/reparse-point escape. Không load .env,
private keys, toàn file source hoặc tự upload patch lên workspace.
Không tự git pull/fetch/checkout/reset/stash/commit/push/merge; thiếu shared code
hiển thị HANDOFF_INCOMPLETE, không chữa bằng destructive Git operation.

Connect Agent wizard:
project/repo → client + surface + OS → capabilities → consent → read-only test
→ config preview → opt-in write grant → verification status.
Tạo configs theo docs/client version thực, không cùng một JSON cho bốn tools.
Không cài/update client hoặc sửa global config trong lúc xây app nếu chưa có quyền.

Trong sản phẩm, tính năng Apply configuration (nếu có) phải là user action rõ:
chọn exact config target → preview diff → backup phù hợp → bounded merge → atomic
write → verify. Không overwrite servers khác, không commit credentials hoặc tự
bật unrestricted tool permissions. Nếu parser chưa preserve format/comments an
toàn, chỉ tạo snippet/instructions và ghi limitation, không sửa file mù quáng.

Open in coding tool chỉ mở editor/app/deep link đã đăng ký khi user click.
Không spawn một phiên implement tự động, không truyền prompt như shell command,
không biến desktop thành agent runner. Nếu không có supported deep link/CLI trên
OS đó: no fabricated integration, cung cấp đúng setup guide/status.

Ưu tiên remote MCP trực tiếp; existing local stdio adapter chỉ reuse khi cần.
Không dựng daemon/privileged local MCP server/copy business logic. Nếu phải đóng
gói helper mỏng, review license/signature/resource bounds và stop/revoke behavior;
không chứa Admin keys hoặc biến thành always-on heartbeat giữ mọi claim.
App exit không kill external coding processes hoặc làm server MCP unavailable.

## 11. NATIVE FILES, NOTIFICATIONS, LIFECYCLE VÀ UPDATES

Native dialogs cho open/save/export; grants chỉ vùng user chọn. File export có
size/type limits, safe names, overwrite confirmation, integrity/manifest và
private temp cleanup. Không chấp nhận filename chứa traversal/absolute-path escape.
Clipboard chỉ đọc/ghi do explicit user action; không global clipboard watcher.
External links mở bằng OS API trên scheme/host allowlist, không arbitrary executable.

Notifications là native OS delivery cho events đã có quyền. Mặc định app đang
chạy thì sync in-app inbox + native toast/notification theo user preferences.
Opt-in tray/menu-bar mode có thể giữ process sống với bounded polling/listeners;
không tự bật autostart và không gọi nó là background agent execution.
App quit thật thì không hứa vẫn nhận mọi notification nếu chưa có OS push/service
triển khai riêng. Không copy firebase_messaging mobile sang Windows để fake support.
Notification click mở app/resource, rechecks auth/ACL; không approve bằng toast.
Dedupe theo server event ID, suppress private content trên lock screen theo policy.

Suspend/wake/reopen/offline: gọi revalidation dùng shared sync policy, không giữ
lease bằng desktop UI timer. Window close khác app quit và khác logout; UX giải
thích rõ. Không chạy process ẩn sau Quit khi user không opt-in.

Updater dùng artifact signatures theo cơ chế Tauri đã chọn và HTTPS release feed
được owner kiểm soát. OS code signing, update-artifact signature, transport TLS
và auth server tokens là các lớp KHÁC NHAU. Không nói hash download là chữ ký số.
Không assume Tauri tự ký toàn metadata/feed; threat-model version/channel/URL
selection, replay/downgrade và reject mismatched OS/architecture/channel.

Feed/config chuẩn bị trên infrastructure Firebase hiện có khi phù hợp; không
mua update SaaS. Auto-check theo preferences, install có consent và bảo vệ draft/
pending operations. Không restart trong lúc approve/save mà không recovery.
Keys chỉ trong authorized signing pipeline; public verification key trong app,
private key không ở renderer/repo/bundle. Key rotation phải có migration plan.
Invalid/missing signature, interrupted download hoặc unavailable feed → fail safe.
Prefer forward repair release; rollback có explicit version/data-compatibility
review, không disable verification để cài bản cũ. Store route và direct installer
route dùng update policy riêng; không nhúng updater trái kênh phát hành.

## 12. DESKTOP SECURITY, TEST STRATEGY VÀ QUALITY GATES

Tauri capabilities explicit theo window/platform, smallest permissions. Review
custom Rust commands, không chỉ plugin permissions: registered custom commands
cũng cần authorization/scoping theo actual Tauri model. Renderer compromise không
được generic filesystem/shell/network/token access. Native Rust vẫn validate
inputs, resource handles, path scopes và auth/session cho từng privileged command.

CSP/connect-src/navigation allowlists: bundled application code, approved backend
origins; không remote arbitrary HTML/JS ở privileged app window. Untrusted rich
content isolated, không nhận privileged labels/IPC. Không `dangerous` defaults,
allow-all FS/home, unrestricted opener hay devtools/debug remote port ở release.
Native API không tự dựa vào CORS để ngăn độc hại trong cùng máy.

Authentication callback listener nếu chọn loopback phải bind loopback-only,
short-lived, origin/host/state/challenge checks, bounded payload và tự đóng; không
mở port wildcard/LAN vì “localhost thuận tiện”. Chỉ dùng theo protocol đã threat-model.
App custom scheme không có secret trong route và không là bằng chứng chính chủ.

Tests: shared TS domain/contract, Rust unit/IPC permission negatives, Functions/
Rules, renderer tests, native-shell E2E, native dialogs/menu/auth/links/lifecycle,
installer/update/signature smoke. Browser Playwright/WDIO mock chỉ chứng minh UI
layer, không native Keychain/DPAPI, package identity hoặc OS behavior.

Chọn automation driver theo official support của OS/version. Test-only embedded
driver/debug hooks phải compile-gate và kiểm tra không nằm trong release binary.
Không cài paid driver hoặc cấp Accessibility permission tự động để né blocker.
Thiếu automation route vẫn làm supported tests và ghi native manual/NOT RUN rõ.

Synthetic workload dùng v2, có large timeline/doc/report/history; measure startup,
RSS/memory, UI responsiveness, reads/listeners và payload trên hardware/runtime
thực. Không khẳng định Tauri luôn nhẹ/nhanh hơn framework khác khi chưa benchmark.

CI chung có lint/typecheck/TS tests, cargo fmt/clippy/test, contract/regression,
build targets và platform jobs. Không linux-build-only rồi gắn cả macOS/Windows
PASS. Prepare scripts theo package manager thực, ví dụ desktop:dev, desktop:test,
desktop:test:native, desktop:verify và desktop:build:<os>; commands phải chạy thật.

## 13. WINDOWS-NATIVE EXPERIENCE, WEBVIEW2 VÀ FILE SECURITY

Window có native titlebar/minimize/maximize/close, resize/snap đúng, Alt+F4,
Ctrl+K/F và các shortcut tương ứng theo ngữ cảnh. Không copy nguyên Command keys
và macOS menu/traffic-light UI sang Windows. Tab/focus/access keys/Narrator đọc được.
App preferences không ghi vào install directory; dùng user app-data path chuẩn.

Per-monitor DPI/scaling phải test khi kéo giữa màn hình; titlebar hit-test, grid/
bar alignment, dialogs và menus không bị lệch. Light/dark/system và Windows high
contrast có colors/labels hợp lệ, không biến mọi text/icon thành không nhìn thấy.
Single-instance routing hoặc multi-window có design rõ; second launch/deep link
focus đúng cửa sổ, không tạo duplicate mutation hoặc cross-account state.

WebView2 runtime là prerequisite phải được xử lý trong installer/tooling. Chọn
Evergreen strategy từ docs hiện hành; kiểm tra runtime presence/version, x64/ARM64,
restricted network/proxy và missing-runtime recovery. Không assume máy cài Edge
nghĩa runtime thích hợp chắc chắn có sẵn. Offline-installer/fixed-runtime route
chỉ khi có quyết định phân phối và cập nhật security rõ, không bundle bản lỗi thời.
Không cài runtime thật hoặc sửa máy người dùng ngoài permission; trong sản phẩm,
installer phải có hành vi/consent/error recovery phù hợp.

Dùng Windows Credential Manager/DPAPI user-scoped hoặc OS-backed store có review.
Không plaintext AppData JSON/Registry token. Encrypted blob và key/OS binding tách
đúng; User A không lấy credential của B. Không coi DPAPI bảo vệ được máy đã bị
chiếm tài khoản hoặc process độc hại cùng quyền. Windows Hello local unlock không
mặc định là server MFA. Store unavailable/locked/profile restored có login recovery.

Paths Unicode/space/long-path, drive letters và case-insensitive matching phải
test. Chặn traversal, alternate data streams, reserved device names, dangerous
UNC/network paths mặc định, junction/reparse/symlink escapes ra khỏi chosen root.
Path scope kiểm tra trong native code trước IO, không chỉ regex ở React.
Không dùng tên task hoặc repo URL chưa validate làm đường dẫn executable.

Chọn folder/file bằng native picker; mở editor bằng typed/allowlisted OS operation,
không `cmd /c <task text>` hay PowerShell expression dựng từ dữ liệu. Không thay
ExecutionPolicy, Defender exclusions, firewall, registry security hay UAC để app chạy.

Windows client tools cần phân biệt native Windows, WSL và remote environment.
`C:\...`, WSL Linux paths và `\\wsl$\...` không tự có cùng identity/permission.
Không tự cài WSL, đổi distro, tìm secrets trong Linux home hoặc sửa config ở cả
Windows lẫn WSL. Default native config discovery opt-in; WSL integration phải có
explicit target/runtime/path translation/tests. Không assume CLI support trên OS.

Native notifications/toasts cần đúng installed-app identity/AppUserModelID hoặc
cơ chế framework thực sự dùng. Test dev/unpackaged và installed build riêng;
không lấy toast từ script ngoài làm evidence của app. User preference/quiet mode,
activation routing và stale-event ACL checks giữ nguyên. Tray/autostart opt-in;
Quit thực sự dừng app-owned process, không biến thành Windows service ngầm.

## 14. WINDOWS INSTALLER, SIGNING, UPDATE VÀ NATIVE TESTING

Build với Windows toolchain/Rust MSVC và SDK/runtime được lock/record. CI job
Windows riêng; cross-build artifact không chứng minh installer/native behavior.
Xác minh OS/CPU/version/package identity trong manifest artifact, không đoán từ filename.

Default per-user NSIS .exe, app chạy không cần Administrator. Per-machine install
chỉ khi owner chọn enterprise route; không đổi sang elevation mặc định vì lỗi ghi
file. MSI support nếu được yêu cầu có build/version/upgrade identity và tests riêng.
Không gọi .exe đổi đuôi .msi/.msix là installer hợp lệ. Microsoft Store route phải
kiểm tra packaging/policy hiện hành, không giả mọi channel giống direct distribution.

Installer cần app name/icon/publisher/version, Start menu/uninstall entry,
protocol registration theo user, WebView2 prerequisite strategy, update channel,
license notices và environment labels. Không tự bật launch-at-login hoặc thêm
startup registry entries không consent. Không ghi credentials trong Registry.

Signing: chuẩn bị Authenticode/certificate workflow được owner cấp và timestamping
phù hợp; preserve identity để upgrade. Signing private material trong approved
CI/key service/hardware mechanism, không export key ra repo hoặc log command secrets.
Có unsigned local/test packaging path rõ ràng. Chưa certificate thì public release
BLOCKED; không bảo người dùng tắt SmartScreen hoặc antivirus. Chữ ký đúng cũng
không được hứa luôn không có reputation warning.

Kiểm tra signature trên artifact thật bằng Windows-supported tooling, ví dụ
`Get-AuthenticodeSignature` hoặc `signtool verify` theo configuration/version thực.
Ghi signer/trust/verification outcome và timestamp, không chỉ có .sig file bên cạnh.
Tauri updater signature và Windows executable signature có test/key roles riêng.

Test installer lifecycle trên máy/user test được phép:
clean install → first launch/login → upgrade → restart → repair/reinstall khi
supported → uninstall. Preserve/export drafts trước thay schema; consent riêng
cho xóa local user data. Uninstall không xóa shared WebView2 runtime hoặc file của
app khác. Protocol/startup entries app tạo phải được cleanup đúng installation.
Không leak cached credentials sau account switch/reinstall; revalidate revoked sessions.

Proxy/TLS/offline environment: respect documented OS configuration, timeouts và
error messages; không disable certificate validation hoặc nhúng proxy credentials.
Installer thiếu internet/runtime có thông báo/hướng xử lý, không crash hoặc fake
success. App không đòi admin để ghi cache/log. Logs ở scoped user location, redacted.

Automation dùng current supported Tauri/WebDriver route. Khi dùng Edge WebDriver,
version phải tương thích runtime đang chạy; nếu dùng embedded driver, compile-gate
và verify production binary không có server/debug hooks. Actual-shell auth/menu/
file/toast tests khác renderer mock tests. Native test cần Windows runner/device,
không dùng screenshots từ Chrome trên macOS để gọi Windows pass.

CI Windows: shared/contract/Rust tests + build + native E2E + installer smoke;
release signing/upload jobs gated, không secrets ở untrusted pull-request jobs.
PowerShell scripts dùng typed args/quoted paths và UTF-8 theo test, không phụ thuộc
bash/git tools ngầm. Các command từ clean checkout phải ghi prerequisites cụ thể.

## 15. MILESTONES WINDOWS

WIN0 — Shared-core inventory/ownership, WebView2/auth/native-store feasibility,
contracts/emulator isolation và actual Windows shell read/write qua backend.
WIN1 — Window/navigation/tasks/contracts/decisions/review, roadmap và cross-client
read-back; keyboard/IME/DPI baseline. Pilot, không full final.
WIN2 — Full editor/knowledge, connections/local repo mapping, optional config apply,
notifications/links/tray/preferences, draft/conflict/security và updater integration.
WIN3 — Full KPI/reports/releases/client approvals/settings, native concurrency/
security/performance/accessibility tests, NSIS/MSI theo route, signing/readiness/docs.

Re-use macOS core nếu đã tồn tại; chỉ platform APIs/config/scripts nằm Windows
adapter. Không xóa macOS modules, đổi shared contract hay Firebase Rules vì Windows
SDK khác. Thiếu máy Windows/signing account/provider quyền: chuẩn bị code/config,
chạy supported tests còn lại và ghi chính xác native/release gate chưa đạt.

## 16. ACCEPTANCE SCENARIOS BẮT BUỘC

Các test chung dưới đây vẫn áp dụng riêng cho từng platform; kết quả ở nền
tảng khác không thay thế việc kiểm thử client đang xây.

| ID | Kịch bản và kết quả phải xác minh |
|---|---|
| C01 | Cùng tài khoản đăng nhập web và client → cùng UID/workspace/task; sign out/in/restart vẫn đọc đúng dữ liệu đã persist. |
| C02 | Tạo/sửa task ở client → đọc lại trên web và client khác; audit chỉ đúng actor, command và version, không lặp event. |
| C03 | Viewer, revoked member, foreign workspace, private nested doc/file/search/report bị chặn cả read lẫn mutation. |
| C04 | Hai thiết bị sửa cùng document/task version → conflict hiển thị, không lost update hoặc silent last-write-wins. |
| C05 | Baseline 2027-01-15, forecast 2027-01-20, actual 2027-01-18 → variance +3 calendar days; DST/timezone không đổi date-only. |
| C06 | Dependency cycle, missing target, scope conflict, parent/child rollup, unscheduled work, cancelled/reopened xử lý đúng v2. |
| C07 | Approve spec v2 khi execution pin v1 → current drift warning; immutable context/manifest/hash v1 không đổi. |
| C08 | Review mở submission A nhưng head/contract đã đổi → stale/revalidation, không accept nhầm revision mới. |
| C09 | Reported evidence/link/SHA không tự CI-verified; CI ở commit cũ không cho gate pass; Done không tự deployed. |
| C10 | Offline sensitive commands disabled/fail closed; reconnect không tự claim/approve/publish từ queue. |
| C11 | Local draft sống qua restart; sync có timeout sau commit dùng lại operation ID, không duplicate comment/status. |
| C12 | Đổi user/workspace/env khi còn draft/queue/listener → không replay hoặc hiển thị dữ liệu phiên cũ. |
| C13 | Logout/revoke xử lý caches/files/credentials/notifications theo policy; không tuyên bố xóa dữ liệu trên máy offline. |
| C14 | Suspend/wake đổi mạng → revalidate permissions/versions; lease đã expire không được GUI tự renew/takeover. |
| C15 | Human native session khác MCP grant; agent credentials không accept/approve dù owner là workspace admin. |
| C16 | Wrong auth state/audience/redirect/code replay/expired session → reject; không token/secret trong logs hoặc URL. |
| C17 | Deep link/notification đúng task có auth; foreign tenant/deleted resource/invalid URL không leak dữ liệu, không gây mutation. |
| C18 | Knowledge round-trip giữ blocks/AC IDs/Unicode/code fences/Mermaid/attachments; unsupported blocks không bị drop khi save. |
| C19 | Export đúng pinned manifest/hashes/ACL; ZIP traversal/CSV formula injection/unsafe HTML bị chặn; receipt không fake. |
| C20 | KPI/drill-down/asOf dùng đủ cohort, N/A/zero/pending khác nhau; nhiều attempts không nhân throughput. |
| C21 | API/schema client cũ/enum mới → compatibility handling không mất dữ liệu, update-required không xóa drafts. |
| C22 | Provider/MCP/Functions/emulator unavailable → error/retry rõ; test không fallback Firebase production. |
| C23 | Scope change, client approval, internal engineering approval và deployment records giữ revision/visibility riêng. |
| C24 | Journey web → external MCP agent → checkpoint/submission → native human review → roadmap/report nhất quán; phân biệt mock, emulator, actual client và provider. |
| WIN01 | Actual installed Windows x64 app khởi động đúng WebView2/runtime; ARM64/native/emulated status có evidence riêng. |
| WIN02 | Runtime missing/stale/offline/proxy ở clean machine có installer recovery đúng; không assume Edge browser đủ. |
| WIN03 | System-browser login cold/warm/second-instance callback, replay/wrong state/user switch không bypass auth hoặc nhân session. |
| WIN04 | Credential Manager/DPAPI user/env isolation, rotate/revoke/profile restore/locked store; không plaintext fallback. |
| WIN05 | Window titlebar/snap/minimize/restore/Alt+F4 và Ctrl shortcuts đúng; text editing/IME không bị shortcuts chiếm. |
| WIN06 | Multi-monitor DPI đổi trong runtime, high contrast, resize và restored bounds không làm timeline/dialog lệch. |
| WIN07 | Native file picker/export paths Unicode/space/long-path đúng; overwrite/denied/cancel/retry không fake success. |
| WIN08 | Junction/reparse/symlink/UNC/ADS/reserved-name/traversal attempts không thoát selected directory hoặc mở executable. |
| WIN09 | Untrusted docs/diagram/links không invoke generic shell/FS/HTTP/secrets; custom Rust command scopes test negative. |
| WIN10 | Protocol/deep-link second launch focus đúng project/window; invalid/foreign resource không leak, no mutation from link. |
| WIN11 | Installed toast identity/activation, quiet mode/permission/preferences và lockscreen privacy đúng; dev toast không thay test installed. |
| WIN12 | Tray/autostart opt-in; Quit dừng app-owned work không kill agent, không heartbeat renew claim hoặc Windows service ngầm. |
| WIN13 | Repo mapping cùng human owner nhưng Windows/WSL path khác → explicit target, không tự read/modify cả hai homes. |
| WIN14 | Client config preview/backup/merge/cancel theo native/WSL surface thật; không overwrite other MCP entries hoặc command injection. |
| WIN15 | Codex/Claude Code/Antigravity/Kimi compatibility từng version/OS/surface; unsupported clients/deep links được báo đúng. |
| WIN16 | Update wrong signature/OS/arch/channel/downgrade và interrupted download bị chặn; draft/queue không mất khi restart. |
| WIN17 | Per-user installer/app không đòi Admin; per-machine route explicit, upgrade identity/version giữ đúng account/cache migrations. |
| WIN18 | Authenticode verify thật và timestamp status đúng; missing/invalid cert không thành signed-ready, no SmartScreen-disable guidance. |
| WIN19 | NSIS .exe/MSI route artifacts thật; silent/repair/upgrade modes chỉ claim khi supported và đã test. |
| WIN20 | Uninstall cleanup app-owned protocol/startup files; không xóa shared runtime/other app data, data removal có consent. |
| WIN21 | Release bundle không WebDriver test server/devtools/unsafe localhost bypass/service-account/signing secrets. |
| WIN22 | Narrator/keyboard/high contrast/reduced motion/IME và native dialogs có Windows evidence, không Chrome-only claim. |
| WIN23 | Native Windows edits giữ macOS/web/MCP contracts/backward compatibility; parent Axx mapping và cross-device read-back đúng. |
| WIN24 | Enterprise proxy/offline/TLS errors và CPU/memory/read/listener profiling ghi environment; không bypass security hoặc bịa benchmark. |


## 17. DEFINITION OF DONE, BẰNG CHỨNG VÀ TIẾP TỤC

Mỗi slice: UI/native entry → validation → auth/ACL → shared command → persistence
→ restart/read-back → error/conflict/offline → automated tests → actual app evidence.
Không chỉ scaffold, browser-only demo, TODO handlers hoặc wrapper mở website.
Giữ matrix A01–A64 của v2 theo applicability và mapping tới Cxx/platform tests;
không ép một platform reimplement server tests, nhưng phải chứng minh invariant
liên quan ở boundary thực tế và không đánh dấu kế thừa là đã chạy lại.

Test status: PASS / FAIL / BLOCKED / NOT RUN. Feature status tách riêng:
PLANNED / IN_PROGRESS / IMPLEMENTED_UNVERIFIED / VERIFIED / BLOCKED.
Mock fixture ≠ Emulator integration ≠ actual native app ≠ actual AI client
≠ live GitHub/FCM/provider ≠ signed distributable ≠ store approval.

Mọi scenario phải có Given/When/Then, fixture ID, expected độc lập, test path,
exact command, OS/device/runtime/version và evidence path. Không dùng một green
build để nói tất cả workflows pass. Chụp VÀ xem ảnh thực của màn hình đã chạy;
kiểm tra layout, typography, contrast, focus, native dialogs, empty/error/conflict.
Không xóa tests, giảm assertions hoặc mock backend success để vượt gate.

Deliverables tối thiểu:
- Client source/native config, clean-checkout setup và version-pinned lockfiles.
- docs/windows/architecture.md, feature-matrix.md, auth-security.md,
  offline-sync.md, mcp-compatibility.md, release.md, verification.md, progress.md.
- Cross-platform contract fixtures/tests; source/license/asset provenance.
- CI jobs build/test đúng OS, release jobs approval-gated và secret-free examples.
- Packaging/signing/update configuration + artifact manifest/checksums khi build
  thực sự tạo được; file chưa tồn tại không được đưa đường dẫn download giả.

Báo cáo cuối: parent/source hash, paths đã sửa, reused vs new, milestones thực tế,
backend changes, commands/status, native screenshots, platform/client matrix,
artifacts ký hay chưa ký, release blockers, regression impact và bước tiếp theo.
Không gọi pilot là full parity, unsigned build là public-release ready hoặc code
client có nghĩa MCP/GitHub/notification đã được test với dịch vụ thật.

Nếu giới hạn phiên: giữ repo rõ trạng thái; cập nhật progress với branch/commit,
files, failing tests, exact next command và blockers. Tiếp tục phần độc lập trong
phiên hiện tại; không hứa chạy background hoặc ngầm cắt phạm vi.

## 18. NGUỒN, GIẢ ĐỊNH VÀ TÀI LIỆU CẦN KIỂM TRA

Nguồn nghiệp vụ: `HunpeoLabs-Workspace-Codex-Master-Prompt-FINAL-v2.md` (người dùng
đã chốt). Platform stack, native integrations, offline restrictions bổ sung,
packaging và release gates trong prompt này là THIẾT KẾ MỞ RỘNG ĐƯỢC ĐỀ XUẤT,
không phải tính năng đã có trong repository hay kết quả build của phiên soạn prompt.

Các entry points chính thức dưới đây được tham khảo khi soạn ngày 2026-10-03.
Kiểm tra lại đúng versions khi thực thi; ghi URL/access date/chosen version/support
level trong docs. Không hardcode “latest”, min OS/store policy từ trí nhớ.
Không có mạng thì dùng lockfile/docs có sẵn, ghi UNVERIFIED; không hạ bảo mật.

- Tauri architecture: https://v2.tauri.app/concept/architecture/
- Tauri capabilities/custom commands: https://v2.tauri.app/security/capabilities/
- Tauri Windows installers: https://v2.tauri.app/distribute/windows-installer/
- Tauri Windows signing: https://v2.tauri.app/distribute/sign/windows/
- Tauri updater: https://v2.tauri.app/plugin/updater/
- Tauri deep links: https://v2.tauri.app/plugin/deep-linking/
- Tauri native testing: https://v2.tauri.app/develop/tests/webdriver/
- Microsoft WebView2 distribution: https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/distribution
- Firebase platform-support caveat, không assume Windows production SDK: https://firebase.google.com/docs/flutter/setup
- Native OAuth: https://www.rfc-editor.org/rfc/rfc8252.html
- MCP/client/Firebase backend references: parent v2 mục 24; client native-vs-WSL support cần xác minh riêng.

## BẮT ĐẦU NGAY

1. Đọc toàn bộ parent v2 và prompt này; đọc policy, Git status, existing client/backend.
2. Ghi paths/source SHA/feature matrix; bảo vệ user changes và shared contracts.
3. Làm auth + data + native-runtime feasibility trước khi nhân rộng screens.
4. Xây một vertical slice thật từ project/task/contract tới review và read-back;
   sau đó roadmap, knowledge, MCP visibility, reports và platform integrations.
5. Chạy native tests/quality gates, xem screenshots, sửa root cause; hoàn thiện
   milestone và packaging trong quyền. Không dừng ở kế hoạch.
6. Bàn giao code/docs/evidence với trạng thái trung thực, không publish/deploy tự động.
