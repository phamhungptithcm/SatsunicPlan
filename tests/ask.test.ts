import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createAskRequest,validateAnswer,MAX_ASK_BYTES} from '../src/features/ask/contracts.js';
import {answerHelp} from '../src/features/ask/help.js';
import {withinSignal} from '../src/features/ask/deadline.js';

test('Ask request budgets bound unicode/history and reject invalid questions',()=>{
 const q='界'.repeat(1000);const request=createAskRequest(q,Array(20).fill(q),'en');
 assert.ok(new TextEncoder().encode(JSON.stringify(request)).length<=MAX_ASK_BYTES);assert.ok(request.history.length<=6);
 assert.equal(createAskRequest('  roadmap  ',['older','latest'],'en').question,'roadmap');
 assert.throws(()=>createAskRequest(' ',[],'en'));assert.throws(()=>createAskRequest('x'.repeat(1001),[],'en'));
});
test('Ask adapter rejects unknown actions, modes, extra URLs and oversized content',async()=>{
 const answer=await answerHelp({question:'roadmap',history:[],language:'en'},new AbortController().signal);
 assert.equal(validateAnswer(answer).action,'Roadmap');
 for(const value of [{...answer,action:'javascript:alert(1)'},{...answer,url:'https://outside.invalid'},{...answer,kind:'gemini'},{...answer,paragraphs:['x'.repeat(1501)]},{...answer,action:null},{...answer,actionLabel:null}])assert.throws(()=>validateAnswer(value));
 const safe=validateAnswer(answer);safe.paragraphs.push('separate');assert.notDeepEqual(safe.paragraphs,answer.paragraphs);
});
test('Workspace help uses actual destinations and unknown/AI requests disclose unavailable',async()=>{
 for(const [question,page] of [['connect my coding client','Connect agent'],['eligible work','Ready work'],['approve contract','Work'],['document revisions','Knowledge'],['roadmap','Roadmap'],['delivery evidence','Reviews']]){
  const answer=await answerHelp({question,history:[],language:'en'},new AbortController().signal);assert.equal(answer.action,page);assert.equal(answer.kind,'help');
 }
 const answer=await answerHelp({question:'Generate a new payment integration',history:[],language:'en'},new AbortController().signal);assert.equal(answer.kind,'unavailable');assert.equal(answer.action,null);assert.match(answer.paragraphs[0],/AI is not connected/);
 const vi=await answerHelp({question:'Đọc lộ trình thế nào?',history:[],language:'en'},new AbortController().signal);assert.equal(vi.language,'vi');assert.equal(vi.action,'Roadmap');
});
test('Cancellation rejects promptly and consumes late adapter success/failure',async()=>{
 const c=new AbortController();let resolve!:(value:string)=>void;const late=new Promise<string>(r=>resolve=r);const waiting=withinSignal(late,c.signal);c.abort();await assert.rejects(waiting,/INTERRUPTED/);resolve('late');
 const stopped=new AbortController();stopped.abort();await assert.rejects(withinSignal(Promise.reject(new Error('late error')),stopped.signal),/INTERRUPTED/);
 const prior=new AbortController();await assert.rejects(answerHelp({question:'roadmap',history:[],language:'en'},prior.signal).then(async value=>{prior.abort();return withinSignal(Promise.resolve(value),prior.signal);}),/INTERRUPTED/);
});
test('Ask stylesheet remains byte-identical to hash-bound original HunpeoLabs source',()=>{
 const source=JSON.parse(readFileSync('docs/evidence/ask-hunpeolabs-source-snapshot.json','utf8'));
 const css=source.entries.find((e:{path:string})=>e.path==='components/ask-hunpeolabs.module.css');
 const hash=createHash('sha256').update(readFileSync('src/features/ask/ask-workspace.module.css')).digest('hex');assert.equal(hash,css.sha256);
 const component=readFileSync('src/features/ask/AskWorkspace.tsx','utf8');assert.doesNotMatch(component,/fetch\(|next\/|gemini|firebase-client|\/api\/ask/);
 assert.match(component,/duration: 360/);assert.match(component,/duration: 320/);assert.match(component,/\/ 300/);
});
