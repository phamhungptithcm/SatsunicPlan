# MASTER PROMPT — MOBILE APP — iOS + Android
## HunpeoLabs Workspace · Platform extension FINAL v1.0

**Ngày soạn:** 2026-10-03. **Parent:** Master Prompt FINAL v2.0.
**Loại nhiệm vụ:** TRIỂN KHAI CLIENT THẬT trong repository, không chỉ tư vấn.
**Phạm vi phiên:** mobile. Không chạy cả ba prompt đồng thời trong cùng checkout.

Parent reference SHA-256 (đối chiếu nguồn, không phải cơ chế cấp quyền):
`cf8015e13fc42be5dbcd5607921b8e2c1fe91dbcc2659ffe31b2524c84507ea5`

Nếu parent thực tế đã có revision mới được chủ dự án chấp thuận, ghi hash mới và
diff yêu cầu; không hạ về file cũ để làm tests dễ hơn. “Final” mô tả brief, không
phải chứng nhận code, bảo mật hoặc store readiness.

## 0. QUYẾT ĐỊNH CHO MOBILE

Xây một app **Flutter + Dart cho iOS và Android**, gồm phone, tablet và foldable.
Web hiện tại vẫn React + TypeScript + Vite; không convert web sang Flutter.
Dùng FlutterFire phù hợp cho mobile, cùng Firebase backend/MCP của v2.
Không tạo hai codebases Swift/Kotlin độc lập; native code chỉ cho bridge cần thiết.
Không dựng PWA/WebView wrapper toàn website rồi gọi là mobile app hoàn chỉnh.

Đây là lựa chọn kiến trúc mới cho client, không phải stack đã được v2 quy định.
Lợi ích mong muốn: UI touch/adaptive và một mobile codebase. Đánh đổi: Dart UI
không reuse trực tiếp React components; reuse qua API contracts, fixtures, tokens,
assets hợp lệ và server semantics. Không hứa phần trăm code reuse.

Đường dẫn mặc định khi chưa có mobile app: `apps/mobile/`. Không tự di chuyển
web repo hiện có. Native IDs/bundle IDs phải lấy từ project owner/config hiện có;
chỉ dùng dev placeholder có nhãn khi chưa được cấp, không đăng ký domain/app tự động.

Trải nghiệm mục tiêu: PM xem roadmap trên điện thoại, developer xem task/spec,
trả lời decision, kiểm tra checkpoint/CI và reviewer nghiệm thu đúng submission.
Coding vẫn xảy ra trong external tools; mobile không chạy IDE/terminal/agent.

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

## 7. KIẾN TRÚC FLUTTER VÀ FIREBASE MOBILE

Inventory mobile source trước. Nếu chưa có, tạo Flutter app tối giản tại path
đã chọn, pin Flutter/Dart và compatible native dependencies trong lockfiles.
Chọn một routing strategy và một state-management strategy phù hợp codebase;
không gom nhiều thư viện cùng chức năng hoặc bọc Firebase qua generic ORM nặng.

Cấu trúc tham khảo:
```text
apps/mobile/
  lib/app/                 # bootstrap, routing, theme, lifecycle
  lib/features/            # work, roadmap, knowledge, decisions, review, reports
  lib/data/                # typed API/Firebase adapters; no Admin SDK
  lib/models/              # generated/versioned DTOs when supported
  lib/platform/            # auth, links, notifications, secure storage
  test/fixtures/
  integration_test/
  ios/
  android/
  pubspec.yaml
  pubspec.lock
docs/mobile/
```

Firebase Authentication/Firestore/Storage/Functions/FCM chỉ dùng khi có nhu cầu
và SDK support được kiểm chứng trên iOS/Android. Không bật Analytics/Crashlytics
chỉ vì sample setup có sẵn. Crash reporting cần privacy review/config riêng.

Direct Firestore reads/simple writes chỉ trong Rules cho phép; authoritative
commands qua cùng Functions services như web/MCP. API adapter xử lý token refresh,
expiry, idempotency, expectedVersion, cancellation và typed errors nhất quán.
Không replicate ready-work ranking/acceptance engine sang Dart làm authority.

Config môi trường và platform registrations riêng theo env, nhưng cùng backend
của env đó. `flutterfire configure` có thể tác động cloud: không chạy vào tài khoản
thật khi chưa có quyền. Chuẩn bị configs an toàn và checklist phần owner cần cấp.
Min iOS/Android SDK chọn từ intersection Flutter + Firebase + plugins + chính sách
phát hành tại lúc build; ghi matrix, không chọn từ một guide cũ duy nhất.

## 8. NAVIGATION VÀ FULL WORKFLOWS TRÊN TOUCH

Thiết kế trước các screen/state chính; dùng design tokens/assets HunpeoLabs có
bằng chứng. Thiếu brand guide thì ghi tạm thời, không tự tuyên bố màu/font chính thức.

Phone navigation gợi ý: Home/My Work, Projects, Inbox, More. Trong project có
Roadmap, Work/Ready, Knowledge, Reviews, Reports, Releases và Settings theo quyền.
Đây là navigation grouping, không xóa modules phía sau More.

Tablet/foldable: navigation rail/sidebar + list/detail, inspector có chiều rộng
đọc được, giữ selection khi đổi portrait/landscape/gập máy. Không nhận dạng một
model điện thoại cụ thể để hardcode layout. Keyboard ngoài và mouse vẫn dùng được.

Luồng đầy đủ cần có:
- Sign in/join workspace/create project, invite được bảo vệ, account/settings.
- Backlog, list/Kanban, filters, create/edit story/task/AC, assign, comments,
  attachments, cycles, worklogs, archive/restore theo policy.
- Ready queue với reasons/blockers/claim state; xem execution/contract/handoff.
- Decision Inbox: đọc câu hỏi → trả lời → revision/approval khi policy yêu cầu.
- Review queue: contract/submission/CI freshness → accept/request changes/reject.
- Knowledge authoring/review, roadmap edits và KPI targets theo đúng permissions.
- Release/deployment docs/history và client-visible scope-change/dossier views.

State restoration giữ route/workspace/filter/scroll và draft theo user; sau
relaunch phải revalidate auth trước hiển thị nội dung private. Android Back và
iOS back gesture không làm mất draft; nested routes/deep links có stack hợp lý.

Nút tạo/sửa/duyệt phải gọi backend thật và read-back. Không làm mobile thành
“chỉ xem, muốn sửa thì mở web” cho các nghiệp vụ bắt buộc. Trong milestone đầu
có thể thiếu screen nhưng phải ghi PLANNED/BLOCKED, không gọi full parity.

## 9. ROADMAP MOBILE KHÔNG PHẢI GANTT THU NHỎ

Phone mặc định summary/agenda theo tuần/tháng, milestones và slippage; có
focused horizontal timeline để xem selected project/feature. Tablet cho phép
planning grid và inspector rộng hơn. Một label phải đọc được mà không pinch zoom.

Baseline/current/actual có legend, text labels, variance/calendar unit và toggle.
Tap milestone/bar → task/story → pinned spec/contract → evidence/release giữ context.
Pinch/zoom/pan nếu có phải có buttons/forms thay thế, không nuốt scroll dọc/back.
Unscheduled hiển thị riêng; không tạo ngày giả để mọi item có thanh.

Cho đổi planned dates bằng form trên phone; bulk/dependency changes có preview
và explicit confirmation, giữ expectedVersion/audit. Drag/resize optional trên
phone nhưng edit functionality không optional. Tablet hỗ trợ drag khi đáng dùng.
Publish baseline theo capability, online-only; không ghi đè commitment cũ.

Reports tối ưu thành summary + drill-down và bảng thay thế cho charts. Hiển thị
asOf, coverage, denominator và baseline ID; không tính KPI từ 20 rows vừa load.
Không vẽ gradient gauges hay score năng lực cá nhân thay dữ liệu từ v2.

## 10. EDITOR, SYSTEM DESIGN VÀ DOCUMENT FIDELITY

Trước khi chọn Flutter rich-text editor, xác định canonical format thực tế của
web (JSON AST/Markdown/khác). Không assume Quill Delta và một web editor AST có
thể đổi qua lại mà không mất thông tin. Golden corpus phải gồm nested lists,
tables, code/language, links, mentions, attachments, stable node IDs và Mermaid.

Reader phải hiển thị đầy đủ docs/spec/ADR/contracts, TOC, revision/status, code
select/copy có kiểm soát và diagram pan/zoom. Attachment access auth riêng.
Authoring phải giữ format khi save→web edit→mobile reopen; unknown blocks được
preserve hoặc read-only có lý do, không âm thầm xóa khi chỉnh một đoạn text khác.

Ưu tiên native editor khi có codec round-trip đã test. Nếu canonical web editor
khó map không mất dữ liệu, được reuse **một editor module local, isolated** trong
WebView cho surface document phức tạp. Đây là ngoại lệ hẹp, không phải wrapper
app: không remote web app, không native privileged bridge, không auth tokens trong
document JS, không arbitrary navigation. Parent gửi/nhận typed document messages
có validation/version/size limits, content assets được kiểm soát.

Mermaid render bằng thư viện hợp lệ trong isolated local surface khi cần; không
CDN scripts tùy ý, unsafe HTML hoặc callbacks execute native code. Lưu source và
revision đúng, không chỉ chụp diagram. SDK/editor/plugin limitations là rõ ràng.

Autosave có Saving/Saved locally/Saved/Conflict/Offline/Error. Approved revision
không sửa in-place. Conflict view giữ cả local draft và server revision để resolve.
Large document incremental loading không cắt required spec rồi báo đã đọc đủ.

## 11. MOBILE AUTH, APP LINKS VÀ NOTIFICATIONS

Dùng provider flow được hỗ trợ cho iOS/Android, same Firebase UID với web.
Kiểm tra Google/Apple/enterprise provider theo cấu hình thật; không tự thêm paid
identity provider. Sign in with Apple/account deletion yêu cầu rà soát store rules
hiện hành và trường hợp ngoại lệ, không khẳng định mọi app cùng một điều kiện.
Session restore/logout/revoke/MFA/account-linking là test bắt buộc.

Local app lock optional bằng biometric/passcode với fallback; secrets trong native
secure storage. SDK token persistence và bản sao cache phải được threat-model.
Không tự làm export raw refresh tokens ra Dart preferences. App switcher snapshot
redaction cho màn nhạy cảm theo policy, không quảng cáo chống chụp ảnh tuyệt đối.

Universal Links (iOS) và Android App Links cho project/task/review/invite.
Domain association files/entitlements dùng domain thực được cấp quyền; không đổi
DNS/hosting production tự động. Không dùng Firebase Dynamic Links cho tính năng
mới. Không assume app chưa cài xong sẽ giữ original deep link qua app store;
web fallback phải hoạt động và deferred routing chỉ khi thật sự triển khai/test.
Callback sign-in và task link tách nhau, validate route/query/host/state, không
nhận URL điều khiển API base host hoặc chứa tokens.

FCM là extension notification được phép trong cùng Firebase, APNs cho iOS qua
cấu hình đúng. Chuẩn bị code/config và có device registry phía server:
user + installation + platform + app/env version + token rotation + preferences.
Push token là delivery address, không authorization. Server xác nhận ownership,
revoke/logout unbind, dedupe events và dọn invalid tokens; không spam retry.

Events hữu ích: assigned/mentioned, decision requested/answered, review requested,
spec drift, claim expired, delivery accepted/requested changes. User bật/tắt theo
project/event; hỏi notification permission theo ngữ cảnh, xử lý denied/restricted.
Payload mặc định tối giản, không mang toàn spec/PII/CI logs hoặc private titles lên
lockscreen. Tap mở app → reauthenticate/recheck ACL → fetch current resource.

Foreground/background/terminated behavior test riêng. Push có thể chậm, mất hoặc
lặp; in-app inbox/cursor sync mới là nguồn phục hồi. Không giữ long-running socket,
agent heartbeat hay background process để biến điện thoại thành execution runner.
Không claim “push chạy thật” từ emulator hoặc một toast local. APNs keys/config
thiếu thì live-push BLOCKED, in-app notifications vẫn dùng được.

## 12. MOBILE PRIVACY, UPLOAD VÀ LOCAL DATA

File picker/share sheet chỉ lấy file user chọn, enforce size/type/filename/quota,
private upload path và ACL. Camera không bắt buộc; chỉ xin permission lúc người
dùng chủ động chụp attachment, không xin full photo-library access vô điều kiện.
Upload cancel/retry/background suspension không tạo orphan public files hoặc
attachment trùng. Server xác nhận file ready trước khi link vào submission.

App không đọc clipboard tự động. Copy/share context có preview, classification
warning và đúng capability; share ra ngoài không thể thu hồi bằng logout.
Bản export chỉ ở app-private temp, có expiry/cleanup theo platform; selected
external file do user giữ phải được mô tả rõ không có guarantee remote deletion.

Account deletion/disconnect flow cần xác thực lại, transfer last owner nếu cần,
server job/idempotency và thông báo retention/audit obligations thật. Không chỉ
xóa Firebase Auth UID làm mồ côi workspace. Sign out, xóa local cache, xóa account
và xóa workspace là bốn hành động khác nhau.

Không đưa draft/spec vào OS backup unencrypted ngoài policy. Kiểm tra restore vào
thiết bị mới không hồi sinh credentials/old queue và không lẫn Firebase env.
Nếu device mất mạng hoặc app bị kill, show last known sync time khi mở lại.

## 13. PERFORMANCE, OBSERVABILITY VÀ NATIVE QA

Đặt budget trước benchmark: startup warm/cold, frame timing khi scroll/timeline,
API latency, memory/cache, reads/listeners, battery khi foreground/background.
Đây là targets phải đo, không claim số ms/fps chưa kiểm thử.
Fixture dùng lại v2 (nhiều projects, 5.000 work items, 200 docs); chỉ tải scoped
pages, virtualize lists, lazy-load bodies/diagrams và suspend unnecessary listeners.

Test small phone, large phone, tablet, foldable layout; safe areas, keyboard,
large text, light/dark/system, reduced motion, screen reader, landscape và IME
Việt/Anh. Không truncate acceptance criteria mà không mở được full content.
OS font scaling và RTL nếu được hỗ trợ phải không làm nút duyệt bị che.

Dùng Flutter unit/widget/golden/integration tests, Rules/Functions tests của
backend và contract fixtures. Real app integration khác widget tests.
Emulator host map phải đúng simulator/Android emulator/device, explicit allowlist;
không fallback production khi localhost không tới được. Debug-only cleartext
local settings không lọt vào release. Không tắt TLS production để chạy demo.

CI chạy lint/analyze/test/contracts; Android build đúng toolchain; iOS build trên
macOS có Xcode. Native plugins/FCM/auth signed-device tests có job/evidence riêng.
Simulator success không chứng minh mọi lifecycle/push/store scenario.

## 14. BUILD, SIGNING VÀ APP-STORE READINESS

Android deliverables: APK cho test được chỉ định; AAB cho release route khi đủ
prerequisites. iOS: simulator build, Xcode archive, IPA đúng signing/export route
khi có quyền/certificates. Không đổi extension file để giả artifact.

Chuẩn bị app icon/splash/assets bằng nguồn hợp lệ, app display name, app IDs,
versions/build numbers, dev/staging/prod flavors và installer environment labels.
Chọn min/target SDK từ docs/toolchain/store policy hiện hành, ghi ngày kiểm tra.
Không tự regenerate signing keys làm app không update được bản cũ.

Signing keys/APNs secrets/provisioning chỉ qua authorized local/CI secret store;
không commit, in log hoặc đưa vào prompt. Có unsigned/debug path rõ khi chưa có
quyền; không gọi đó là TestFlight/App Store ready. Không tự upload/store-submit.

Release checklist: privacy policy/support links thực, account lifecycle/deletion,
SDK data collection disclosures, permission purpose strings, privacy manifests
khi áp dụng, screenshots từ build thật, review demo account được owner duyệt,
license/source-distribution review và crash-free smoke evidence.
Không khai “không thu dữ liệu” nếu auth/crash/push SDK thực tế thu dữ liệu.
Billing không nằm trong scope: không nhét external purchase links hoặc payment
flow vào mobile mà chưa có brief và store-policy review.

Không thêm OTA executable-code updates/code-push provider. Dùng kênh store cho
binary; data/config updates không được biến thành remote code execution hoặc
bypass review. Không hứa được Apple/Google phê duyệt; readiness là evidence checklist.

Scripts thật theo repo: mobile:doctor, mobile:analyze, mobile:test,
mobile:test:integration, mobile:verify, mobile:build:android, mobile:build:ios.
Script phải kiểm tra environment/flavor/dev project và return nonzero khi fail.
Có instructions run từ clean checkout; không giả runner Windows build iOS archive.

## 15. MILESTONES TRIỂN KHAI MOBILE

MOB0 — Inventory/contract/auth feasibility, Flutter shell/theme/routing,
emulator guard, one scoped read + one protected mutation, editor-format spike.
MOB1 — Sign-in/workspace/tasks + project detail, pinned spec reader, decisions,
review/read-back và một roadmap summary dùng dữ liệu thật. Đây là pilot.
MOB2 — Full adapted work/knowledge editing, roadmap planning forms/tablet timeline,
connections/execution/handoff views, notifications/deep links, draft/conflict flows.
MOB3 — Reports/KPI/worklogs, releases/deployment/client approvals, full feature
mapping, performance/accessibility/privacy/security regression, release artifacts/docs.

Xây từng slice hoàn chỉnh, không dựng 30 screens fake trước. Có backend blocker
thì hoàn thiện UI states/tests adapter bằng fixtures riêng, không production fallback.
Không kết luận final complete từ MOB1. Web và MCP phải còn pass regression sau mọi
backend additions. Chỉ chuyển milestone theo evidence, không theo số màn hình.

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
| MOB01 | App cold start/sign-in/background/kill/relaunch ở iOS và Android giữ đúng session policy, route và data isolation. |
| MOB02 | Google/Apple hoặc provider thực đã cấu hình map cùng UID; account linking/MFA/recent-auth không bị bridge làm mất assurance. |
| MOB03 | Universal/App Links cold/warm launch đúng project/task; invalid hosts/replayed auth callback bị chặn; app chưa cài có web fallback. |
| MOB04 | FCM permission allowed/denied; token rotation, logout/login và stale registration không gửi private event sang người khác. |
| MOB05 | Push foreground/background/terminated và duplicate event → inbox nhất quán; tap rechecks ACL, không tự approve. |
| MOB06 | Live APNs/FCM tests ghi device/build/provider thật; thiếu config chỉ BLOCKED, không thay bằng local notification PASS. |
| MOB07 | Phone roadmap agenda/focused timeline; tablet planning grid giữ baseline/current/actual, legend và selected inspector. |
| MOB08 | Resize/rotate/fold/unfold/large text không mất selection/draft hoặc che primary action; timeline date labels vẫn đọc được. |
| MOB09 | Back gesture/Android Back/deep-link navigation không làm mất draft và không mở private screen trước auth. |
| MOB10 | Editor mobile→web→mobile golden round-trip giữ AST/Unicode/Mermaid/tables/IDs; unsupported blocks không bị mất. |
| MOB11 | Isolated editor/diagram content không mở native privileged bridge, external URLs hoặc executable attachment. |
| MOB12 | Airplane mode/dropped response/suspended upload → LOCAL_DRAFT/PENDING rõ, không ghost Saved hoặc duplicate side effect. |
| MOB13 | SDK disk persistence/private drafts/OS backups đúng policy; restricted content không tự lưu plaintext ngoài thiết kế. |
| MOB14 | Biometric denied/not enrolled/device locked có fallback; local unlock không bypass server human-approval capability. |
| MOB15 | File picker/share sheet/camera opt-in và upload quota/type checks; cancel/retry không public/orphan artifact. |
| MOB16 | Review từ mobile gắn exact contract/submission/SHA; race với new commit hoặc revoke không accept stale. |
| MOB17 | Connect Agent là quản lý grants/context; app suspend/close không cấp heartbeat hoặc gọi coding runtime. |
| MOB18 | Account deletion yêu cầu recent auth và owner transfer/retention; không làm mồ côi tenant hay revive old queue sau restore. |
| MOB19 | VoiceOver/TalkBack, focus, large text, contrast, touch targets, IME và hardware keyboard chạy thật theo device matrix. |
| MOB20 | Release build không chứa debug emulator bypass, insecure cleartext config, production service account hoặc private keys. |
| MOB21 | Android APK/AAB đúng appId/flavor/version/signing; upgrade giữ cache migration/drafts và không đổi user/env. |
| MOB22 | iOS simulator/archive/IPA kết quả phân loại; Xcode signing/capability failures không bị bỏ qua để báo store-ready. |
| MOB23 | Battery/listener/read/render profiling ghi device/workload; background không poll/renew agent lease vô hạn. |
| MOB24 | Client-visible dossier/scope approval trên phone không leak private ADR/comments và không tự engineering-accept/deploy. |


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
- docs/mobile/architecture.md, feature-matrix.md, auth-security.md,
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

- Firebase/Flutter setup, supported products: https://firebase.google.com/docs/flutter/setup
- Flutter iOS distribution: https://docs.flutter.dev/deployment/ios
- Flutter Android distribution: https://docs.flutter.dev/deployment/android
- FCM/Flutter: https://firebase.google.com/docs/cloud-messaging/flutter/get-started
- Android App Links: https://docs.flutter.dev/cookbook/navigation/set-up-app-links
- iOS Universal Links: https://docs.flutter.dev/cookbook/navigation/set-up-universal-links
- Firebase Dynamic Links status: https://firebase.google.com/support/dynamic-links-faq
- Native OAuth: https://www.rfc-editor.org/rfc/rfc8252.html
- Apple App Review: https://developer.apple.com/app-store/review/guidelines/
- Google Play account deletion: https://support.google.com/googleplay/android-developer/answer/13327111
- MCP, client docs, Firebase Rules/Functions và GitHub sources: xem parent v2 mục 24; xác minh lại khi dùng.

## BẮT ĐẦU NGAY

1. Đọc toàn bộ parent v2 và prompt này; đọc policy, Git status, existing client/backend.
2. Ghi paths/source SHA/feature matrix; bảo vệ user changes và shared contracts.
3. Làm auth + data + native-runtime feasibility trước khi nhân rộng screens.
4. Xây một vertical slice thật từ project/task/contract tới review và read-back;
   sau đó roadmap, knowledge, MCP visibility, reports và platform integrations.
5. Chạy native tests/quality gates, xem screenshots, sửa root cause; hoàn thiện
   milestone và packaging trong quyền. Không dừng ở kế hoạch.
6. Bàn giao code/docs/evidence với trạng thái trung thực, không publish/deploy tự động.
