export const helpPages = ['Roadmap', 'Work', 'Knowledge', 'Ready work', 'Decisions', 'Reviews', 'Reports', 'Releases', 'Connect agent'] as const;
export type HelpPage = typeof helpPages[number];
export type AskLanguage = 'en' | 'vi';
export interface AskRequest { question: string; history: string[]; language: AskLanguage }
export interface AskAnswer {
  title: string; paragraphs: string[]; bullets: string[];
  action: HelpPage | null; actionLabel: string | null; followUp: string | null;
  language: AskLanguage; kind: 'help' | 'unavailable';
}
export type AnswerQuestion = (request: AskRequest, signal: AbortSignal) => Promise<AskAnswer>;
export const MAX_ASK_BYTES = 12_000;
export function createAskRequest(question: string, history: string[], language: AskLanguage): AskRequest {
  const text = question.trim();
  if (!text || text.length > 1000) throw new Error('INVALID_QUESTION');
  const request = { question: text, history: history.filter(q => typeof q === 'string' && q.trim() && q.length <= 1000).slice(-6), language };
  while (new TextEncoder().encode(JSON.stringify(request)).length > MAX_ASK_BYTES && request.history.length) request.history.shift();
  if (new TextEncoder().encode(JSON.stringify(request)).length > MAX_ASK_BYTES) throw new Error('INVALID_QUESTION');
  return request;
}
/** Strict runtime boundary: adapters cannot add URLs, HTML, model modes or unknown destinations. */
export function validateAnswer(value: unknown): AskAnswer {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('INVALID_RESPONSE');
  const a = value as Record<string, unknown>;
  const keys = ['title','paragraphs','bullets','action','actionLabel','followUp','language','kind'];
  const text = (v: unknown, max: number): v is string => typeof v === 'string' && v.length > 0 && v.length <= max;
  const texts = (v: unknown, count: number, max: number) => Array.isArray(v) && v.length <= count && v.every(s => text(s,max));
  if (Object.keys(a).length !== keys.length || Object.keys(a).some(k => !keys.includes(k)) ||
      !text(a.title,160) || !texts(a.paragraphs,5,1500) || !texts(a.bullets,6,500) ||
      !(a.language === 'en' || a.language === 'vi') || !(a.kind === 'help' || a.kind === 'unavailable') ||
      !(a.followUp === null || text(a.followUp,240)) ||
      !(a.action === null ? a.actionLabel === null : helpPages.includes(a.action as HelpPage) && text(a.actionLabel,100))) throw new Error('INVALID_RESPONSE');
  return {title:a.title as string, paragraphs:[...(a.paragraphs as string[])], bullets:[...(a.bullets as string[])], action:a.action as HelpPage|null, actionLabel:a.actionLabel as string|null, followUp:a.followUp as string|null, language:a.language, kind:a.kind};
}
