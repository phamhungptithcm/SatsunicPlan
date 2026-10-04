# MASTER PROMPT — macOS DESKTOP APP
## HunpeoLabs Workspace · Platform extension FINAL v1.0

**Ngày soạn:** 2026-10-03. **Parent:** Master Prompt FINAL v2.0.
**Loại nhiệm vụ:** TRIỂN KHAI CLIENT THẬT trong repository, không chỉ tư vấn.
**Phạm vi phiên:** macos. Không chạy cả ba prompt đồng thời trong cùng checkout.

Parent reference SHA-256 (đối chiếu nguồn, không phải cơ chế cấp quyền):
`cf8015e13fc42be5dbcd5607921b8e2c1fe91dbcc2659ffe31b2524c84507ea5`

Nếu parent thực tế đã có revision mới được chủ dự án chấp thuận, ghi hash mới và
diff yêu cầu; không hạ về file cũ để làm tests dễ hơn. “Final” mô tả brief, không
phải chứng nhận code, bảo mật hoặc store readiness.

## 0. QUYẾT ĐỊNH CHO macOS

Xây **HunpeoLabs Workspace desktop cho macOS bằng Tauri 2 + React + TypeScript**,
tái sử dụng desktop core chung với Windows. Rust/native integration là lớp mỏng;
không rewrite toàn UI bằng SwiftUI/AppKit và không xây backend riêng.

Đây là lựa chọn mở rộng client mới: bundle cài đặt thật, UI React trong system
WebView, có menu/window/Keychain/notifications/native dialogs phù hợp macOS.
Không gọi đó là app thuần SwiftUI; không chỉ mở website trong một cửa sổ.
Đánh đổi: reuse React tốt hơn nhưng phải kiểm thử system WebView, auth và native
behavior; không giả mọi browser API hoạt động y hệt Safari/Chrome.

Path mặc định khi chưa có desktop: `apps/desktop/`; platform-specific code tại
`src-tauri/src/platform/macos/`. Nếu Windows core đã tồn tại, mở rộng nó và giữ
Windows compatibility. Prompt Windows không bắt buộc đã chạy trước.

Target mặc định Apple Silicon; đánh giá và ghi rõ Intel/Universal support theo
Tauri/dependencies/toolchain hiện hành. Không gắn nhãn Universal khi chỉ có một
architecture. Bundle ID/team ID/domain lấy từ config được owner cấp, không bịa.
Phân phối mặc định ngoài Mac App Store bằng .app/.dmg có signing/notarization khi
đủ quyền. Mac App Store là conditional channel riêng, không tự submit.

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

## 13. macOS-NATIVE EXPERIENCE VÀ QUYỀN TỐI THIỂU

Menu bar thật: App/About/Settings/Hide/Quit, File, Edit, View, Window, Help theo
nhu cầu; dùng Tauri/native menu APIs. Shortcuts Command+K, Command+F, Command+,
và Command+W/Q khi phù hợp; không override system text-editing shortcuts tùy ý.
App name/menu/window title đều HunpeoLabs, legal notices vẫn giữ.

Window có traffic-light/titlebar hit regions đúng, fullscreen/Spaces, reopen từ
Dock, restored bounds clamp vào màn hình hiện còn, drag regions không ăn click
controls. Close last window không mặc định đồng nghĩa Quit; behavior rõ, user
không bị process ẩn bất ngờ. Optional menu-bar mode và launch-at-login phải opt-in.
Không xin Accessibility, screen recording hoặc Apple Events chỉ để mở folder/editor.

Native NSOpenPanel/NSSavePanel tương đương qua APIs hợp lệ cho export/repo pick.
Nếu distribution chọn App Sandbox, persistent file access dùng security-scoped
bookmarks đúng vòng đời và handling stale bookmarks. Không thêm entitlement
broad read/write để khỏi xử lý picker. Không coi sandbox và hardened runtime là một.

Dùng Keychain thông qua OS API/library được review; service/account names scoped
app/env/user. Keychain locked/denied/missing item → login/recovery, không plaintext
fallback hoặc log dump. Credential không sync qua iCloud mặc định nếu policy
không cho. Verify Keychain accessibility/uninstall/reinstall behavior theo SDK.

System appearance/accessibility: light/dark/system, Reduce Motion, Increase
Contrast/Reduce Transparency khi có thể; VoiceOver, focus rings và readable density.
Không bắt dùng blur/Liquid Glass; chỉ dùng supported styling khi giữ contrast và
không private APIs. UI không có titlebar trùng hoặc custom chrome che native controls.

Native notification request theo ngữ cảnh, permission denied có in-app inbox.
Signed installed build phải test identifiers/deep-link activation; app đang chạy
trong dev không chứng minh notification của distributed bundle hoạt động.
External auth browser callback cold/warm/multiple instance xử lý qua validated
link routing; không dùng URL tự gửi làm privileged command.

## 14. macOS BUILD, SIGNING, NOTARIZATION VÀ TEST MATRIX

Build trên macOS với Xcode command-line tooling và Rust/Node/package versions
được pin, không giả cross-compile Linux là đã chạy native app. Record CPU/OS/SDK,
architecture của main binary và helpers; Intel/ARM dependencies phải đúng target.
Universal artifact chỉ sau build/inspect cả slices và native dependencies phù hợp.

Direct distribution: chuẩn bị .app và .dmg, Developer ID signing khi có quyền,
hardened runtime/entitlements tối thiểu, nested helpers/frameworks signing đúng,
notarization submission/log review/stapling theo kênh được owner cho phép.
Không cần notarize cho ordinary local debug; phân biệt ad-hoc/development/signed/
notarized. Không tự upload binary tới Apple hoặc trích xuất private key từ Keychain.

Sau build dùng actual artifact path để inspect, ví dụ các lệnh đọc/xác minh:
```sh
codesign -dvvv --entitlements :- "<actual-app-path>"
codesign --verify --deep --strict --verbose=2 "<actual-app-path>"
spctl --assess --type execute --verbose=4 "<actual-app-path>"
xcrun stapler validate "<actual-notarized-artifact>"
```
Chọn cú pháp theo tools thực; command không chạy thì NOT RUN. Không dùng deep
re-sign mù quáng, disable Gatekeeper, xóa quarantine hàng loạt hoặc thêm entitlement
không rõ lý do để làm distributed app “chạy”. Fix bundle/signing/root cause.

Test từ .dmg → Applications/user-approved location → first launch → sign-in →
restart → update. Xác minh quarantine/Gatekeeper flow trên clean test user/machine
khi được cấp quyền, không chỉ launch target/debug. Không modify signed bundle
sau khi ký, kể cả inject config/secrets hoặc thay icon.

Mac App Store conditional: sandbox, provisioning, store signing, privacy/license
và update route được rà riêng. Không gọi notarized DMG là App Store artifact.
Không auto-choose store route hoặc bật restricted entitlements chưa được cấp.

Native UI E2E chọn supported route: official Tauri docs có hướng embedded
WebDriver service; raw tauri-driver và embedded service không cùng support model.
Đọc đúng version, isolate test driver bằng build flag và kiểm tra release không
chứa debug server/IPC execute hooks. Không mặc định “macOS không test được”,
cũng không dùng browser screenshot giả native evidence.

CI macOS jobs: shared tests + native build/test, arm64 và Intel khi target support
được chốt, packaging unsigned/test-sign path và gated release path. Keychain cho
CI tách biệt, cleanup trong finally, không thay default login Keychain của user
mà không khôi phục. Store/notarization secrets chỉ trong approved CI environment.

## 15. MILESTONES macOS

MAC0 — Desktop inventory/shared-core ownership, auth/runtime/keychain spike,
contracts/emulator safety, macOS build + one protected read/write in actual shell.
MAC1 — App shell/menu/navigation, tasks/contracts/decisions/reviews, roadmap
baseline/current/actual và cross-client read-back. Chưa gọi full parity.
MAC2 — Full knowledge/editor, connected-agent workflows, local repo mapping,
window lifecycle/links/notifications/files, draft/conflict and updater safety.
MAC3 — Full reports/releases/settings/client approvals, permissions/large datasets/
accessibility/regression, .app/.dmg packaging, signing/notarization readiness và docs.

Nếu Windows prompt đã xây một phần chung: reuse, run parity tests, thay đổi macOS
trong adapter/config OS, không xóa Windows code. Native app + web + MCP phải dùng
cùng backend truth. Release blockers như signing identity, test machine hoặc
notarization authorization không ngăn làm code/test local, nhưng chặn release claim.

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
| MAC01 | Actual .app chạy trên Apple Silicon target; x86_64/Universal build ghi rõ slices và native dependency support, không giả cross-OS pass. |
| MAC02 | System-browser auth cold/warm callback, cancel/duplicate/code replay đúng; no bearer token trong URL/log/renderer persistent storage. |
| MAC03 | Keychain create/read/rotate/revoke/locked/denied flow; credential đúng env/account; unavailable không fallback plaintext. |
| MAC04 | Menu/About/Settings/Edit/Window/Help và Command shortcuts hoạt động; editor copy/paste/undo không bị global shortcuts chiếm. |
| MAC05 | Close/Reopen/Quit/Dock activation, multi-window logout và unsaved draft prompt giữ đúng lifecycle. |
| MAC06 | Fullscreen/Spaces/external monitor disconnect/restored bounds và Retina scaling không mất cửa sổ hoặc lệch timeline rows. |
| MAC07 | Native file open/save/export và selected-folder access; stale bookmark/symlink escape bị xử lý, không broad home access. |
| MAC08 | Context export từ actual app giữ hashes/ACL; permission denied/write failure/overwrite/cancel không giả success. |
| MAC09 | Untrusted Mermaid/doc/iframe không gọi native FS/shell/auth commands; custom IPC commands negative-permission tests. |
| MAC10 | App deep links validate host/path/state, denied project/deleted resource không leak; repeated event không tạo cửa sổ/action vô hạn. |
| MAC11 | Native notifications authorized/denied/muted/locked screen và installed-bundle click routing; no approval from notification. |
| MAC12 | Opt-in menu-bar/login-item mode rõ; Quit dừng app-owned work, không kill coding clients và không auto-renew claims. |
| MAC13 | Repository folder mapping cho đúng remote/base/dirty state; no hooks/auto-fetch/upload/.env; missing shared commit = incomplete handoff. |
| MAC14 | Client config preview/apply opt-in giữ các MCP servers khác, backup/atomic write và permissions; không plaintext secret trong committed files. |
| MAC15 | Codex/Claude Code/Antigravity/Kimi compatibility từng surface thật hoặc NOT RUN; unsupported deep links không giả thành công. |
| MAC16 | Signed update sai chữ ký/OS/arch/channel, interrupted download và draft đang mở → fail-safe không dữ liệu mất. |
| MAC17 | Update/relaunch giữ schema migration/session policy; stale/old version không bypass backend minimum capability. |
| MAC18 | VoiceOver/keyboard/focus/contrast/reduced-motion/light-dark với actual native shell, không chỉ browser. |
| MAC19 | Large timeline/wiki cold/warm startup benchmark ghi runtime/hardware, scoped listeners và memory; không bịa performance. |
| MAC20 | codesign/bundle/nested helpers/entitlements verification trên artifact thật; ad-hoc không gọi Developer ID/notarized. |
| MAC21 | Notarization/stapling/Gatekeeper clean-download checks chỉ PASS khi đã chạy với quyền; thiếu account = BLOCKED. |
| MAC22 | Release binary không test WebDriver server/debug bridge/devtools, dev URLs hoặc signing secrets. |
| MAC23 | macOS platform changes không làm shared desktop/web/MCP contracts drift; Windows native status không suy ra từ macOS build. |
| MAC24 | Uninstall/reinstall/logout/cache cleanup không revive revoked session; .dmg installation first-run và update smoke có evidence. |


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
- docs/macos/architecture.md, feature-matrix.md, auth-security.md,
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
- Tauri deep links: https://v2.tauri.app/plugin/deep-linking/
- Tauri updates: https://v2.tauri.app/plugin/updater/
- Tauri macOS signing: https://v2.tauri.app/distribute/sign/macos/
- Apple notarization: https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution
- Tauri native testing: https://v2.tauri.app/develop/tests/webdriver/
- Native OAuth: https://www.rfc-editor.org/rfc/rfc8252.html
- Firebase auth reference, chỉ dùng supported flows: https://firebase.google.com/docs/auth/web/custom-auth
- Store review nếu chọn kênh store: https://developer.apple.com/app-store/review/guidelines/
- MCP/client/Firebase backend references: parent v2 mục 24, cần đọc lại khi cấu hình thực tế.

## BẮT ĐẦU NGAY

1. Đọc toàn bộ parent v2 và prompt này; đọc policy, Git status, existing client/backend.
2. Ghi paths/source SHA/feature matrix; bảo vệ user changes và shared contracts.
3. Làm auth + data + native-runtime feasibility trước khi nhân rộng screens.
4. Xây một vertical slice thật từ project/task/contract tới review và read-back;
   sau đó roadmap, knowledge, MCP visibility, reports và platform integrations.
5. Chạy native tests/quality gates, xem screenshots, sửa root cause; hoàn thiện
   milestone và packaging trong quyền. Không dừng ở kế hoạch.
6. Bàn giao code/docs/evidence với trạng thái trung thực, không publish/deploy tự động.
