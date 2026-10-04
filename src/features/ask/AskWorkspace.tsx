// Source-derived from HunpeoLabs Ask Anything; adaptation manifest in docs/evidence/ask-reuse-manifest.json.

import { memo, useCallback, useEffect, useRef, useState, useSyncExternalStore, useId, type FormEvent, type PointerEvent as ReactPointerEvent } from "react";
import { createAskRequest, validateAnswer, type AskAnswer, type AskLanguage, type AnswerQuestion, type HelpPage } from './contracts';
import { answerHelp } from './help';
import { withinSignal } from './deadline';
import styles from './ask-workspace.module.css';
import integration from './ask-integration.module.css';

type Turn = { id: number; question: string; answer?: AskAnswer; status: "pending" | "answered" | "error" | "stopped"; rateLimited?: boolean };
const subscribeHydration = () => () => {};

function AskIcon({ kind }: { kind: "send" | "close" | "stop" | "chat" }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "chat" ? <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H9l-5 3v-5a7.5 7.5 0 1 1 16-5.5Z" /><path d="M8 10h8M8 14h5" /></> : kind === "send" ? <path d="M12 20V4m-7 7 7-7 7 7" /> : kind === "close" ? <path d="m7 7 10 10M17 7 7 17" /> : <rect x="7" y="7" width="10" height="10" rx="1" fill="currentColor" stroke="none" />}
  </svg>;
}

const PublishedAnswer = memo(function PublishedAnswer({ answer, onNavigate }: { answer: AskAnswer; onNavigate: (page: HelpPage) => void }) {
  return <div className={styles.answer} lang={answer.language}>
    <h2>{answer.title}</h2>
    {answer.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    {!!answer.bullets.length && <ul>{answer.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
    {answer.followUp && <p className={styles.followUp}>{answer.followUp}</p>}
    {answer.action && <button type="button" className={integration.nextAction} onClick={() => onNavigate(answer.action!)}>{answer.actionLabel} <span aria-hidden="true">↗</span></button>}
  </div>;
});

const ConversationContent = memo(function ConversationContent({ turns, language, busy, onRetry, onNavigate }: { turns: Turn[]; language: AskLanguage; busy: boolean; onRetry: (question: string) => Promise<void>; onNavigate: (page: HelpPage) => void }) {
  const vi = language === 'vi';
  return <>{turns.map(turn => <section className={styles.turn} key={turn.id} aria-label={turn.question}>
    <div className={styles.question}><p>{turn.question}</p></div>
    {turn.status === 'pending' ? <p className={styles.status} role="status"><span className={styles.logo} aria-hidden="true">HL</span>{vi ? 'Đang tìm hướng dẫn…' : 'Finding guidance…'}</p> : turn.answer ? <PublishedAnswer answer={turn.answer} onNavigate={onNavigate}/> : <div className={styles.error} role={turn.status === 'error' ? 'alert' : 'status'}>
      <p>{turn.status === 'stopped' ? (vi ? 'Đã dừng câu trả lời.' : 'Response stopped.') : (vi ? 'Chưa thể trả lời lúc này. Câu hỏi của bạn vẫn được giữ lại.' : 'We couldn’t answer just now. Your question is still here.')}</p>
      <button type="button" disabled={busy} onClick={() => void onRetry(turn.question)}>{vi ? 'Thử lại' : 'Try again'}</button>
    </div>}
  </section>)}</>;
});

export function AskWorkspace({ startCollapsed = false, suspended = false, answerQuestion = answerHelp, onNavigate }: { startCollapsed?: boolean; suspended?: boolean; answerQuestion?: AnswerQuestion; onNavigate: (page: HelpPage) => void }) {
  const titleId = useId();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(startCollapsed);
  const [hintVisible, setHintVisible] = useState(false);
  const [returned, setReturned] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [idleExiting, setIdleExiting] = useState(false);
  const [focused, setFocused] = useState(false);
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [language, setLanguage] = useState<AskLanguage>("en");
  const dialog = useRef<HTMLDialogElement>(null);
  const chatInput = useRef<HTMLInputElement>(null);
  const idleInput = useRef<HTMLInputElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const restoreLauncherFocus = useRef(false);
  const conversation = useRef<HTMLDivElement>(null);
  const abort = useRef<AbortController | null>(null);
  const activeId = useRef(0);
  const locked = useRef(false);
  const dialogMotion = useRef<Animation | null>(null);
  const idleMotion = useRef<Animation | null>(null);
  const idleShell = useRef<HTMLElement | null>(null);
  const closing = useRef(false);
  const outsidePointer = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    setExiting(false);
    element.showModal();
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const capsule = element.querySelector("form");
      if (capsule) {
        const panel = element.getBoundingClientRect(), box = capsule.getBoundingClientRect();
        const mask = `inset(${box.top - panel.top}px ${panel.right - box.right}px ${panel.bottom - box.bottom}px ${box.left - panel.left}px round 40px)`;
        dialogMotion.current = element.animate([{ clipPath: mask, transform: `translateY(${panel.bottom - box.bottom}px)` }, { clipPath: "inset(0px 0px 0px 0px round 28px)", transform: "translateY(0)" }], { duration: 360, easing: "cubic-bezier(.22,1,.36,1)" });
      }
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    chatInput.current?.focus({ preventScroll: true });
    return () => { dialogMotion.current?.cancel(); closing.current = false; element.close(); document.body.style.overflow = previousOverflow; };
  }, [open]);

  const newestTurnId = turns.at(-1)?.id;
  useEffect(() => {
    const pane = conversation.current;
    if (!open || !pane || newestTurnId === undefined) return;
    // Read from the submitted question onward. Answer/status updates never
    // yank a visitor away from the passage they are reading.
    let frame = 0;
    let cancelled = false;
    const cancel = () => { cancelled = true; cancelAnimationFrame(frame); };
    pane.addEventListener("wheel", cancel, { passive: true });
    pane.addEventListener("touchstart", cancel, { passive: true });
    pane.addEventListener("pointerdown", cancel, { passive: true });
    frame = requestAnimationFrame(started => {
      const latest = pane.lastElementChild;
      if (!latest || cancelled) return;
      const from = pane.scrollTop;
      const top = from + latest.getBoundingClientRect().top - pane.getBoundingClientRect().top - 28;
      const target = Math.min(Math.max(0, top), pane.scrollHeight - pane.clientHeight);
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        pane.scrollTo({ top: target, behavior: "instant" });
        return;
      }
      // Native smooth scrolling has browser-dependent duration. A bounded
      // transition finishes before reading resumes and yields to user input.
      const tick = (now: number) => {
        if (cancelled) return;
        const progress = Math.min(1, (now - started) / 300);
        pane.scrollTo({ top: from + (target - from) * (1 - (1 - progress) ** 3), behavior: "instant" });
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    return () => {
      cancel();
      pane.removeEventListener("wheel", cancel);
      pane.removeEventListener("touchstart", cancel);
      pane.removeEventListener("pointerdown", cancel);
    };
  }, [newestTurnId, open]);

  useEffect(() => () => {
    activeId.current++;
    abort.current?.abort();
    dialogMotion.current?.cancel();
    idleMotion.current?.cancel();
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  useEffect(() => {
    if (!dismissed || open || !hydrated || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let showTimer: ReturnType<typeof setTimeout>;
    let clearTimer: ReturnType<typeof setTimeout>;
    const reveal = () => {
      // A brief invitation, never continuous motion while the visitor reads.
      if (document.visibilityState === "visible") {
        setHintVisible(true);
        clearTimer = setTimeout(() => setHintVisible(false), 2800);
      }
      showTimer = setTimeout(reveal, 22000);
    };
    showTimer = setTimeout(reveal, 5000);
    return () => { clearTimeout(showTimer); clearTimeout(clearTimer); setHintVisible(false); };
  }, [dismissed, open, hydrated]);

  const interrupt = useCallback(() => {
    const id = activeId.current;
    activeId.current++;
    abort.current?.abort();
    abort.current = null;
    locked.current = false;
    setBusy(false);
    setTurns(current => current.map(turn => turn.id === id && turn.status === "pending" ? { ...turn, status: "stopped" } : turn));
  }, []);

  const close = useCallback(() => {
    if (!open || closing.current) return;
    closing.current = true;
    setExiting(true);
    interrupt();
    setFocused(false);
    const finish = () => { setReturned(true); setOpen(false); };
    const element = dialog.current;
    const currentStyle = element ? getComputedStyle(element) : null;
    const startClip = currentStyle?.clipPath === "none" ? "inset(0px 0px 0px 0px round 28px)" : currentStyle?.clipPath;
    const startTransform = currentStyle?.transform ?? "none";
    dialogMotion.current?.cancel();
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) { finish(); return; }
    const capsule = element.querySelector("form");
    if (!capsule) { finish(); return; }
    const panel = element.getBoundingClientRect(), box = capsule.getBoundingClientRect();
    const mask = `inset(${box.top - panel.top}px ${panel.right - box.right}px ${panel.bottom - box.bottom}px ${box.left - panel.left}px round 40px)`;
    const motion = element.animate([{ clipPath: startClip ?? "inset(0px 0px 0px 0px round 28px)", transform: startTransform }, { clipPath: mask, transform: `translateY(${panel.bottom - box.bottom}px)` }], { duration: 320, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
    dialogMotion.current = motion;
    void motion.finished.then(finish, () => {});
  }, [open, interrupt]);

  function isBackdrop(event: ReactPointerEvent<HTMLDialogElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    return event.target === event.currentTarget && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom);
  }

  function hide() {
    if (idleExiting) return;
    restoreLauncherFocus.current = true;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setFocused(false); setDismissed(true); return; }
    setIdleExiting(true);
    const shell = idleShell.current;
    if (shell) {
      const box = shell.getBoundingClientRect();
      const targetWidth = 56;
      const deltaX = innerWidth - 24 - targetWidth / 2 - (box.left + box.width / 2);
      const capsule = shell.querySelector("form")?.getBoundingClientRect();
      const deltaY = (capsule ? capsule.bottom - 28 : box.bottom - 28) - (box.top + box.height / 2);
      idleMotion.current = shell.animate([{ opacity: 1, transform: "translate(-50%, 0) scale(1)" }, { opacity: 0, transform: `translate(calc(-50% + ${deltaX}px), ${deltaY}px) scale(${targetWidth / box.width})` }], { duration: 320, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
    }
    hideTimer.current = setTimeout(() => { setFocused(false); setDismissed(true); setIdleExiting(false); idleMotion.current?.cancel(); hideTimer.current = null; }, 320);
  }

  const ask = useCallback(async (question: string) => {
    const text = question.trim();
    if (!text || text.length > 1000 || suspended || locked.current || closing.current || hideTimer.current) return;
    locked.current = true;
    const controller = new AbortController();
    const requestSignal = AbortSignal.any([controller.signal, AbortSignal.timeout(15_000)]);
    abort.current = controller;
    const id = ++activeId.current;
    const history = turns.filter(turn => turn.status === "answered").slice(-6).map(turn => turn.question);
    setTurns(current => [...current.slice(-11), { id, question: text, status: "pending" }]);
    setInput(""); setBusy(true); setDismissed(false); setOpen(true);
    try {
      const request = createAskRequest(text, history, language);
      const answer = validateAnswer(await withinSignal(answerQuestion(request, requestSignal), requestSignal));
      if (activeId.current !== id || requestSignal.aborted) return;
      setLanguage(answer.language);
      setTurns(current => current.map(turn => turn.id === id ? { ...turn, answer, status: 'answered' } : turn));
    } catch {
      if (activeId.current === id) {
        setTurns(current => current.map(turn => turn.id === id ? { ...turn, answer: undefined, status: "error" } : turn));
        setInput(text);
      }
    } finally {
      if (activeId.current === id) { locked.current = false; abort.current = null; setBusy(false); chatInput.current?.focus({ preventScroll: true }); }
    }
  }, [turns, language, answerQuestion, suspended]);

  useEffect(() => {
    if (suspended) { interrupt(); setOpen(false); setDismissed(true); setFocused(false); }
  }, [suspended]);
  useEffect(() => {
    if (dismissed && !open && !idleExiting && !suspended && restoreLauncherFocus.current) { launcher.current?.focus({preventScroll:true}); restoreLauncherFocus.current = false; }
  }, [dismissed, open, idleExiting, suspended]);
  useEffect(() => {
    if (!open && !dismissed && returned && !suspended) idleInput.current?.focus({preventScroll:true});
  }, [open, dismissed, returned, suspended]);

  const navigate = useCallback((page: HelpPage) => { close(); onNavigate(page); }, [close, onNavigate]);

  const vi = language === "vi";
  const suggestions = vi ? ["Kết nối coding client thế nào?", "Tìm việc sẵn sàng ở đâu?", "Đọc roadmap thế nào?"] : ["How do I connect my coding client?", "Where is eligible work?", "How do I read the roadmap?"];
  const composer = (expanded: boolean) => <div className={styles.composerArea}>
    {(expanded || focused) && <div className={styles.suggestions}>{suggestions.map(question => <button key={question} type="button" disabled={busy} onClick={() => void ask(question)}>{question}</button>)}</div>}
    <form className={styles.composer} onSubmit={(event: FormEvent) => { event.preventDefault(); if (busy) interrupt(); else void ask(input); }}>
      <input ref={expanded ? chatInput : idleInput} aria-label="Ask Workspace" placeholder="Ask anything..." value={input} maxLength={1000} disabled={!hydrated} onChange={event => setInput(event.target.value)} onFocus={() => setFocused(true)} onKeyDown={event => { if (event.key === "Enter" && event.nativeEvent.isComposing) event.preventDefault(); }} />
      <button className={`${styles.send} ${integration.send}`} type="submit" aria-label={busy ? "Stop response" : "Send question"} title={busy ? "Stop response" : "Send question"} disabled={!hydrated || (!busy && !input.trim())}><AskIcon kind={busy ? "stop" : "send"} /></button>
      <button className={`${styles.close} ${integration.close}`} type="button" disabled={!hydrated} aria-label={expanded ? "Close conversation" : "Hide Ask Workspace"} title={expanded ? "Close conversation" : "Hide Ask Workspace"} onClick={() => expanded ? close() : hide()}><AskIcon kind="close" /></button>
    </form>
    {(expanded || focused) && <p className={`${styles.notice} ${integration.notice}`}>{vi ? 'Hướng dẫn Workspace có sẵn. AI chưa được kết nối.' : 'Workspace guidance is available. AI is not connected.'} <button className={integration.privacyLink} type="button" aria-expanded={privacyOpen} onClick={() => setPrivacyOpen(current => !current)}>{vi ? 'Quyền riêng tư' : 'Privacy'}</button></p>}
    {privacyOpen && (expanded || focused) && <p className={integration.privacy} role="status">{vi ? 'Hội thoại chỉ ở trong bộ nhớ của trang này. Đóng rồi mở lại vẫn giữ hội thoại; tải lại trang, đổi tài khoản hoặc project sẽ xóa. Không gửi câu hỏi tới AI hay bên thứ ba.' : 'Conversation stays in this page’s memory. Close and reopen keeps it; reload, account or project changes clear it. Questions are not sent to AI or third parties.'}</p>}

  </div>;

  return <div className={integration.root} data-ask-workspace hidden={suspended}>
    {!startCollapsed && <div className={styles.bottomSpace} aria-hidden="true" />}
    {!open && (dismissed || idleExiting) && <button ref={launcher} className={`${styles.reopen} ${integration.reopen}`} data-emerging={idleExiting || undefined} data-hint={hintVisible || undefined} disabled={!hydrated || idleExiting} type="button" aria-label={vi ? "Hỏi Workspace" : "Ask Workspace"} title="Ask Anything" onClick={() => { setReturned(false); setDismissed(false); if (turns.length) setOpen(true); }}><AskIcon kind="chat" /><span className={styles.hint} aria-hidden="true">{Array.from("Ask Anything").map((letter, index) => <span key={index} style={{ animationDelay: `${index * 35}ms` }}>{letter === " " ? "\u00a0" : letter}</span>)}</span></button>}
    {!open && !dismissed && <aside ref={idleShell} className={styles.idle} data-returning={returned || undefined} data-hiding={idleExiting || undefined} aria-label="Ask Workspace">{!!turns.length && <button className={styles.resume} type="button" onClick={() => setOpen(true)}>{vi ? "Tiếp tục hội thoại" : "Continue conversation"}</button>}{composer(false)}</aside>}
    <dialog ref={dialog} data-closing={exiting || undefined} className={styles.dialog} aria-labelledby={titleId} onPointerDown={event => { outsidePointer.current = isBackdrop(event); }} onPointerUp={event => { const collapse = outsidePointer.current && isBackdrop(event); outsidePointer.current = false; if (collapse) close(); }} onPointerCancel={() => { outsidePointer.current = false; }} onCancel={event => { event.preventDefault(); close(); }} onClose={() => { if (open) close(); }}>
      <header className={styles.header}><span id={titleId}>Hunpeo<span>Labs</span></span><span>{vi ? "Hỏi Workspace" : "Ask Workspace"}</span></header>
      <div className={styles.conversation} ref={conversation} role="log" aria-label="Conversation with Workspace">
        <ConversationContent turns={turns} language={language} busy={busy} onRetry={ask} onNavigate={navigate} />
      </div>
      <div className={styles.dialogBottom}>{composer(true)}</div>
    </dialog>
  </div>;
}
