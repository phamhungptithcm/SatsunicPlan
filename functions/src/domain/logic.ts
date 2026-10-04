import {createHash} from 'node:crypto';
import {ensure, type Work} from './model.js';
export function canonical(value: unknown): string {
 if (Array.isArray(value)) return '['+value.map(canonical).join(',')+']';
 if (value && typeof value==='object') return '{'+Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>JSON.stringify(k)+':'+canonical(v)).join(',')+'}';
 return JSON.stringify(value);
}
export const hash = (value:unknown) => createHash('sha256').update(canonical(value)).digest('hex');
export const bytesHash = (value:string) => createHash('sha256').update(value,'utf8').digest('hex');
export function validDate(value:string) {const d=new Date(value+'T00:00:00Z');return /^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(d.valueOf())&&d.toISOString().slice(0,10)===value;}
export function schedule(start:string|null,end:string|null) {ensure(!start||validDate(start),'INVALID_INPUT');ensure(!end||validDate(end),'INVALID_INPUT');ensure(!start||!end||start<=end,'INVALID_INPUT');}
export function calendarVariance(actual:string, baseline:string) {ensure(validDate(actual)&&validDate(baseline),'INVALID_INPUT');return Math.round((Date.parse(actual+'T00:00:00Z')-Date.parse(baseline+'T00:00:00Z'))/86400000);}
export function eligible(task:Work, approved:boolean, validDocs:boolean, dependenciesAccepted:boolean, hasClaim:boolean) {
 const reasons:string[]=[];
 if(task.archived||['Done','Cancelled','In review'].includes(task.status)) reasons.push('WORK_NOT_AVAILABLE');
 if(!task.ac.length) reasons.push('AC_REQUIRED');
 if(!approved) reasons.push('APPROVED_CONTRACT_REQUIRED');
 if(!validDocs) reasons.push('CONTEXT_CHANGED');
 if(task.blocked) reasons.push('DECISION_REQUIRED');
 if(!dependenciesAccepted) reasons.push('DEPENDENCY_NOT_ACCEPTED');
 if(hasClaim) reasons.push('CLAIM_CONFLICT');
 return reasons;
}
export function rank(tasks:Work[]) {return [...tasks].sort((a,b)=>b.priority-a.priority||a.key.localeCompare(b.key));}
export function throughput(tasks:Work[]) {return tasks.filter(t=>!t.archived&&t.status==='Done').length;}
export function onTime(tasks:Work[],baseline:Record<string,{end:string|null}>) {
 const due=tasks.filter(t=>baseline[t.id]?.end); if(!due.length)return null;
 return {numerator:due.filter(t=>t.status==='Done'&&t.completedAt&&new Date(t.completedAt).toISOString().slice(0,10)<=baseline[t.id].end!).length,denominator:due.length};
}
export function assertAcyclic(tasks: {id:string;dependencies:string[]}[]) {
 const map=new Map(tasks.map(t=>[t.id,t.dependencies])); const visit=new Set<string>(),done=new Set<string>();
 function walk(id:string){ensure(!visit.has(id),'DEPENDENCY_CYCLE');if(done.has(id))return;ensure(map.has(id),'FORBIDDEN_OR_NOT_FOUND');visit.add(id);for(const dep of map.get(id)!)walk(dep);visit.delete(id);done.add(id);}
 for(const t of tasks)walk(t.id);
}
