# HunpeoLabs Workspace — Mobile, macOS và Windows Prompt Pack

Ngày soạn: 2026-10-03. Gói này có BA master prompt nền tảng độc lập, mỗi prompt
có bản Markdown và TXT cùng nội dung. Đây là yêu cầu để Codex xây app, không
phải app source, installer hoặc kết quả kiểm thử ứng dụng đã hoàn thành.

## 1. Những file cần dùng

| Mục tiêu | File master prompt |
|---|---|
| iOS + Android, phone/tablet/foldable | `HunpeoLabs-Workspace-Mobile-Codex-Master-Prompt-FINAL-v1.md` |
| Desktop macOS | `HunpeoLabs-Workspace-macOS-Codex-Master-Prompt-FINAL-v1.md` |
| Desktop Windows | `HunpeoLabs-Workspace-Windows-Codex-Master-Prompt-FINAL-v1.md` |

Parent `HunpeoLabs-Workspace-Codex-Master-Prompt-FINAL-v2.md` được kèm NGUYÊN BẢN để giữ nghiệp vụ.
SHA-256: `cf8015e13fc42be5dbcd5607921b8e2c1fe91dbcc2659ffe31b2524c84507ea5`.
Không cần bản v1 cũ loại trừ MCP. Không dán ba prompt vào một phiên rồi yêu cầu
agent chọn kiến trúc khác nhau. Mỗi prompt có 24 shared boundary scenarios +
24 platform scenarios = 48 kịch bản nghiệm thu; đây là test requirements, chưa chạy.

## 2. Kiến trúc trong gói

- Web hiện có: React + TypeScript + Vite, giữ nguyên.
- Mobile: Flutter + Dart cho iOS/Android. Đây là lựa chọn client mới, không phải
  yêu cầu stack vốn có trong v2. TS/Dart reuse qua contract/fixtures, không cùng UI code.
- macOS/Windows: một Tauri 2 + React + TypeScript desktop core, OS adapters riêng.
  Đây là bundled desktop app dùng system WebView, không phải thuần SwiftUI/WinUI.
- Cùng backend Firebase/MCP/domain services cho clients của cùng env; dev/staging/
  prod vẫn tách biệt. Không có ba Firebase backend và ba server MCP.
- External agents vẫn ở công cụ của developer. Mobile không chạy agent; desktop
  không tự biến thành terminal/agent host hay privileged local server.

Native auth, OS storage, push/notification, editor codec, installer/update là
những hạng mục MỚI phải spike/test. Không coi support của browser là bằng chứng
cho packaged desktop. Không lấy claim “MCP supported” thay actual-client evidence.

## 3. Cách sử dụng

Đặt parent v2 và prompt nền tảng muốn chạy ở thư mục gốc repo. Có thể giữ prompt
ở nơi khác nhưng sửa đường dẫn khởi động cho đúng. README này không thay master.
Nếu chỉ dùng bản TXT, copy toàn bộ TXT vào Codex; vẫn cung cấp parent v2 cùng repo.

Khuyến nghị thực hiện shared contract/auth feasibility trước. macOS hoặc Windows
chạy trước đều được; prompt desktop chạy sau phải reuse core đã có. Mobile có thể
làm song song sau khi API/auth contract và file ownership đã thống nhất.
Không nhiều agents ghi cùng checkout; dùng branch/worktree riêng khi được phép.
Backend/shared-core changes cần integration owner, không tự push/merge.

### Chạy mobile

```text
Đọc toàn bộ hai file tại workspace hiện tại:
./HunpeoLabs-Workspace-Codex-Master-Prompt-FINAL-v2.md
./HunpeoLabs-Workspace-Mobile-Codex-Master-Prompt-FINAL-v1.md

Thực hiện prompt MOBILE. Giữ web và backend/MCP chung. Inventory app hiện có,
Git status và repo policy trước. Dùng Flutter + Dart cho iOS/Android, không
wrapper website. Làm MOB0 rồi từng vertical slice thật. Không cắt scope hoặc
đánh dấu native/provider/store tests PASS khi chưa chạy. Theo dõi docs/mobile/.
Không tự push, deploy, bật billing, đăng ký account hoặc publish stores.
Bắt đầu bằng kiểm tra workspace và contract/auth feasibility.
```

### Chạy macOS

```text
Đọc toàn bộ hai file tại workspace hiện tại:
./HunpeoLabs-Workspace-Codex-Master-Prompt-FINAL-v2.md
./HunpeoLabs-Workspace-macOS-Codex-Master-Prompt-FINAL-v1.md

Thực hiện prompt macOS. Giữ web/backend/MCP, reuse một desktop core Tauri 2
+ React + TypeScript dùng chung với Windows. Kiểm tra core/code hiện có trước,
không scaffold lại hoặc xóa Windows adapters. Làm MAC0 rồi các vertical slices;
kiểm thử actual app, auth/Keychain, native workflows và packaging.
Theo dõi docs/macos/. Không tự push/deploy/notarize/upload/publish hoặc bật billing.
Thiếu native tooling/credentials thì ghi BLOCKED/NOT RUN, tiếp tục phần độc lập.
Bắt đầu bằng kiểm tra workspace, parent requirements và auth/runtime feasibility.
```

### Chạy Windows

```text
Đọc toàn bộ hai file tại workspace hiện tại:
./HunpeoLabs-Workspace-Codex-Master-Prompt-FINAL-v2.md
./HunpeoLabs-Workspace-Windows-Codex-Master-Prompt-FINAL-v1.md

Thực hiện prompt WINDOWS. Reuse desktop core Tauri 2 + React + TypeScript
đã có hoặc tạo một core dùng chung macOS. Không tạo backend/MCP riêng hoặc
copy app thành hai codebases. Giữ macOS/web regression. Làm WIN0 trước với
WebView2/auth/native store, rồi từng workflow và installer/update/signing gates.
Theo dõi docs/windows/. Không tự push/deploy/sign bằng credentials chưa được
cấp/publish/install global tools hoặc thay Windows security settings.
Ghi actual Windows tests riêng; không dùng browser/Mac tests để tuyên bố PASS.
Bắt đầu bằng kiểm tra workspace, API contracts và Windows runtime feasibility.
```

## 4. Quy tắc tránh lệch sản phẩm

V2 là product semantics. Platform prompt chỉ mở rộng client/native/runtime gates.
Không cấm MCP theo prompt cũ. Không đổi baseline/current/actual, contract revision,
claims/lease/fencing hoặc evidence/human acceptance. Không auto-approve offline.
Không làm ba repo/database rồi sync lẫn nhau. Không ship secrets trong app.

Nếu chưa có backend v2: làm dependency inventory/compatibility fixtures; có thể
bổ sung shared Functions theo quyền, nhưng không claim native end-to-end từ mocks.
Chạy local/debug không cần store approval; public release có signing/privacy/
license/runtime checks riêng, không bypass để gọi “production-ready”.

## 5. Bằng chứng cần Codex trả lại

Source/parent hashes; feature matrix; exact files/commands; tests PASS/FAIL/
BLOCKED/NOT RUN; actual native screenshots; auth/client/provider support matrix;
artifact paths/checksums khi có; signing/notarization/store state; blockers và
next executable step. Không yêu cầu Codex bịa rằng đã cài app hoặc publish.

## 6. Phạm vi xác minh của gói prompt này

Đã đối chiếu v2 để giữ nghiệp vụ và đã tham khảo official platform documentation.
Đã kiểm tra cấu trúc nội dung, số kịch bản, MD/TXT identical và checksum của parent.
Chưa build/test mobile/macOS/Windows app trong lượt soạn prompt; những hạng mục
đó là nhiệm vụ của Codex trên repo và môi trường có SDK/quyền phù hợp.
