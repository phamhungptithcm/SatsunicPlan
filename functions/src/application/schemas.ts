import {z} from 'zod';
const id=z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/);
const text=z.string().trim().min(1).max(2000);
const sha=z.string().regex(/^[a-f0-9]{40}$/);
const base={workspaceId:id,projectId:id};
const version={expectedVersion:z.number().int().min(1),requestKey:id};
const work={...base,taskId:id};
const execution={...work,...version,executionId:id,generation:z.number().int().min(1)};
const ac=z.array(z.object({id,text}).strict()).min(1).max(32).refine(a=>new Set(a.map(x=>x.id)).size===a.length);
const dates={start:z.string().nullable(),end:z.string().nullable()};
export const schemas={
 bootstrap:z.object({name:text,repository:z.string().regex(/^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/),requestKey:id}).strict(),
 list_projects:z.object({}).strict(),
 create_work:z.object({...base,title:text,description:z.string().max(12000),type:z.enum(['epic','story','task','bug']),priority:z.number().int().min(0).max(4),ac,dependencies:z.array(id).max(16),parentId:id.nullable(),assignee:id.nullable(),...dates,requestKey:id}).strict(),
 edit_work:z.object({...work,...version,title:text,...dates,archived:z.boolean()}).strict(),
 get_document_revision:z.object({...base,documentId:id,revisionId:id}).strict(),
 create_document:z.object({...base,documentId:id.optional(),expectedVersion:z.number().int().min(0),title:text,body:z.string().min(1).max(40000),requestKey:id}).strict(),
 approve_document:z.object({...base,documentId:id,revisionId:id,expectedVersion:z.number().int().min(1),requestKey:id,decision:z.enum(['approve','revoke'])}).strict(),
 publish_contract:z.object({...work,...version,scope:text,nonGoals:z.string().max(2000),documentIds:z.array(id).min(1).max(8)}).strict(),
 approve_contract:z.object({...work,...version,contractId:id,decision:z.enum(['approve','revoke'])}).strict(),
 publish_baseline:z.object({...base,requestKey:id,reason:text}).strict(),
 grant_connection:z.object({...base,requestKey:id,label:text,write:z.boolean(),consent:z.literal(true)}).strict(),
 force_release:z.object({...work,...version,reason:text}).strict(),
 revoke_connection:z.object({...base,grantId:id,requestKey:id}).strict(),
 review_delivery:z.object({...work,...version,submissionId:id,decision:z.enum(['accept','request_changes','reject']),reason:text}).strict(),
 decide_blocker:z.object({...work,...version,decisionId:id,answer:text,semanticChange:z.literal(false)}).strict(),
 record_deployment:z.object({...base,taskId:id,guideRevisionId:id,environment:z.enum(['test','staging','production']),outcome:z.enum(['succeeded','failed','rolled_back']),reference:text,requestKey:id}).strict(),
 resolve_project:z.object({...base}).strict(),
 get_project_status:z.object({...base}).strict(),
 list_work:z.object({...base,cursor:id.optional(),limit:z.number().int().min(1).max(50).default(30)}).strict(),
 recommend_work:z.object({...base}).strict(),
 claim_work:z.object({...work,...version,contractHash:z.string().regex(/^[a-f0-9]{64}$/)}).strict(),
 renew_claim:z.object(execution).strict(),
 release_claim:z.object({...execution,reason:text}).strict(),
 get_work_context:z.object({...work,executionId:id}).strict(),
 read_context_part:z.object({...work,executionId:id,partId:id,offset:z.number().int().min(0).default(0)}).strict(),
 get_work_state:z.object(work).strict(),
 report_blocker:z.object({...execution,question:text}).strict(),
 checkpoint_work:z.object({...execution,state:z.enum(['started','progress','paused']),summary:text,baseSha:sha,headSha:sha.nullable(),nextAction:text,tests:z.array(z.object({command:text,result:z.enum(['PASS','FAIL','BLOCKED','NOT RUN'])}).strict()).max(20)}).strict(),
 resume_work:z.object(work).strict(),
 submit_delivery:z.object({...execution,headSha:sha,baseSha:sha,pr:z.string().regex(/^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/pull\/\d+$/).nullable(),acEvidence:z.array(z.object({acId:id,result:z.enum(['PASS','FAIL','BLOCKED','NOT RUN']),command:text}).strict()).min(1).max(32),limitations:z.string().max(4000)}).strict(),
 get_changes_since:z.object({...base,cursor:id.optional(),limit:z.number().int().min(1).max(50).default(30)}).strict(),
 export_context:z.object({...work,executionId:id}).strict()
};
export type Operation=keyof typeof schemas;
export const agentTools:Operation[]=['resolve_project','get_project_status','list_work','recommend_work','claim_work','renew_claim','release_claim','get_work_context','read_context_part','get_work_state','report_blocker','checkpoint_work','resume_work','submit_delivery','get_changes_since'];
export const mutations=new Set<Operation>(['force_release','bootstrap','create_work','edit_work','create_document','approve_document','publish_contract','approve_contract','publish_baseline','grant_connection','revoke_connection','review_delivery','decide_blocker','record_deployment','claim_work','renew_claim','release_claim','report_blocker','checkpoint_work','submit_delivery']);
