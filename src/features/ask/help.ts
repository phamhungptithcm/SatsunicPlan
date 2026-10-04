import {createAskRequest, validateAnswer, type AskAnswer, type AskLanguage, type AnswerQuestion, type HelpPage} from './contracts';
export function detectLanguage(question: string, fallback: AskLanguage): AskLanguage {
  return /[ăâđêôơưàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/i.test(question) ? 'vi' : fallback;
}
type Entry = {match:RegExp; action:HelpPage; en:[string,string,string]; vi:[string,string,string]};
const entries: Entry[] = [
 {match:/connect|mcp|agent|kết nối|coding client/i, action:'Connect agent', en:['Connect your coding client','Create a project-scoped connection in Connect agent. You choose whether it can claim work, checkpoint and submit. Read the context-transfer notice before creating a grant.','Open Connect agent'], vi:['Kết nối coding client','Tạo kết nối giới hạn trong project ở Connect agent. Bạn chọn quyền nhận việc, ghi checkpoint và nộp kết quả. Đọc thông báo chuyển ngữ cảnh trước khi tạo quyền truy cập.','Mở Connect agent']},
 {match:/eligible|ready work|recommend|nhận việc|sẵn sàng/i, action:'Ready work', en:['Find eligible work','Check eligible work to see the evaluated items and missing prerequisites. This check does not reserve work. An external coding client must claim it through MCP.','Open Ready work'], vi:['Tìm việc đủ điều kiện','Check eligible work hiển thị các việc đã được đánh giá và điều kiện còn thiếu. Thao tác này chưa giữ việc. Coding client bên ngoài phải nhận việc qua MCP.','Mở Ready work']},
 {match:/contract|approve|approval|hợp đồng|phê duyệt/i, action:'Work', en:['Approve an implementation contract','Open a work item and its Contract tab. Publish a contract with the required approved document revisions. Another authorized reviewer must approve it before execution.','Open Work'], vi:['Phê duyệt hợp đồng triển khai','Mở một work item và tab Contract. Xuất bản hợp đồng kèm các phiên bản tài liệu đã được phê duyệt. Một người có quyền khác phải phê duyệt trước khi thực thi.','Mở Work']},
 {match:/document|knowledge|context|tài liệu|ngữ cảnh/i, action:'Knowledge', en:['Keep approved context together','Saving a document creates an immutable draft revision. Another authorized reviewer approves that revision. Published contracts pin exact approved revisions; editing a draft does not replace them.','Open Knowledge'], vi:['Giữ ngữ cảnh đã phê duyệt','Lưu tài liệu tạo một phiên bản nháp bất biến. Một người có quyền khác phê duyệt phiên bản đó. Hợp đồng đã xuất bản ghim đúng phiên bản đã phê duyệt; sửa nháp không thay thế chúng.','Mở Knowledge']},
 {match:/roadmap|baseline|schedule|timeline|lộ trình|kế hoạch/i, action:'Roadmap', en:['Read the delivery roadmap','The roadmap shows the current plan, published baseline and human-accepted completion. Edit planned dates in the work item inspector. Publishing a new baseline does not rewrite an earlier commitment.','Open Roadmap'], vi:['Đọc lộ trình bàn giao','Roadmap hiển thị kế hoạch hiện tại, baseline đã xuất bản và mốc hoàn tất được người duyệt chấp nhận. Sửa ngày dự kiến trong chi tiết work item. Baseline mới không ghi đè cam kết trước.','Mở Roadmap']},
 {match:/review|evidence|delivery|bàn giao|bằng chứng/i, action:'Reviews', en:['Review delivery evidence','Submissions wait in Reviews. Compare the exact contract, commit and acceptance-criterion evidence before recording a human decision. Reported evidence is separate from provider verification.','Open Reviews'], vi:['Duyệt bằng chứng bàn giao','Kết quả được nộp chờ ở Reviews. Đối chiếu đúng hợp đồng, commit và bằng chứng cho từng tiêu chí trước khi ghi quyết định. Bằng chứng tự báo cáo khác với xác minh từ provider.','Mở Reviews']},
];
export const answerHelp: AnswerQuestion = async (raw, signal) => {
  if (signal.aborted) throw new Error('INTERRUPTED');
  const request = createAskRequest(raw.question,raw.history,raw.language);
  const language = detectLanguage(request.question,request.language);
  const entry = entries.find(e => e.match.test(request.question));
  let answer: AskAnswer;
  if (entry) {
    const [title, paragraph, actionLabel] = entry[language];
    answer = {title,paragraphs:[paragraph],bullets:[],action:entry.action,actionLabel,followUp:null,language,kind:'help'};
  } else {
    answer = {title:language === 'vi' ? 'Chưa có câu trả lời cho yêu cầu này' : 'No answer for this request yet', paragraphs:[language === 'vi' ? 'Ask hiện chỉ có hướng dẫn sử dụng Workspace. AI chưa được kết nối nên không thể phân tích project hoặc thực hiện yêu cầu này.' : 'Ask currently provides Workspace usage guidance. AI is not connected, so it cannot analyze your project or carry out this request.'],bullets:[],action:null,actionLabel:null,followUp:null,language,kind:'unavailable'};
  }
  return validateAnswer(answer);
};
