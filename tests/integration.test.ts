import {test} from 'node:test';import assert from 'node:assert/strict';
import {fixture,service,db,key,author,headSha,baseSha} from './fixtures.js';
import {WorkspaceService} from '../functions/src/application/workspace.js';
import {bytesHash} from '../functions/src/domain/logic.js';
async function claim(f:Awaited<ReturnType<typeof fixture>>){return (await service.execute(f.agent,'claim_work',{...f.base,taskId:f.taskId,expectedVersion:3,contractHash:f.contract.hash,requestKey:key()})).claim;}
test('A01/A26/A28/A32/A39/A40/A45 persisted full core journey and atomic race',async()=>{
 const f=await fixture();const rec=await service.execute(f.agent,'recommend_work',f.base);assert.equal(rec.suggested[0].taskId,f.taskId);
 const input={...f.base,taskId:f.taskId,expectedVersion:3,contractHash:f.contract.hash,requestKey:key()};
 const results=await Promise.allSettled([service.execute(f.agent,'claim_work',input),service.execute(f.agent,'claim_work',{...input,requestKey:key()})]);
 assert.equal(results.filter(x=>x.status==='fulfilled').length,1);const won=results.find(x=>x.status==='fulfilled') as PromiseFulfilledResult<Record<string,any>>;const c=won.value.claim;
 const replay=await service.execute(f.agent,'claim_work',input).catch(()=>null);if(replay)assert.equal(replay.claim.executionId,c.executionId);
 const state=await service.execute(f.owner,'get_work_state',{...f.base,taskId:f.taskId});assert.equal(state.task.status,'Ready');assert.equal(state.task.assignee,f.uid);assert.equal(state.claim.state,'Reserved');
 const manifest=(await service.execute(f.agent,'get_work_context',{...f.base,taskId:f.taskId,executionId:c.executionId})).manifest;
 for(const part of manifest.parts){const p=await service.execute(f.agent,'read_context_part',{...f.base,taskId:f.taskId,executionId:c.executionId,partId:part.id});assert.equal(bytesHash(p.content),part.hash);}
 const cp=await service.execute(f.agent,'checkpoint_work',{...f.base,taskId:f.taskId,executionId:c.executionId,generation:c.generation,expectedVersion:1,requestKey:key(),state:'started',summary:'Preflight and local implementation completed',headSha,baseSha,nextAction:'Submit evidence',tests:[{command:'synthetic fixture',result:'PASS'}]});
 const submitInput={...f.base,taskId:f.taskId,executionId:c.executionId,generation:c.generation,expectedVersion:cp.claim.version,requestKey:key(),headSha,baseSha,pr:null,acEvidence:[{acId:'AC-1',result:'PASS',command:'synthetic assertion'}],limitations:'Provider checks NOT RUN'};
 const sub=await service.execute(f.agent,'submit_delivery',submitInput);const again=await service.execute(f.agent,'submit_delivery',submitInput);assert.equal(sub.submissionId,again.submissionId);
 const pending=await service.execute(f.owner,'get_work_state',{...f.base,taskId:f.taskId});assert.equal(pending.task.status,'In review');
 await assert.rejects(service.execute(f.agent,'review_delivery',{...f.base,taskId:f.taskId,expectedVersion:pending.task.version,submissionId:sub.submissionId,decision:'accept',reason:'agent attempts approval',requestKey:key()}),/FORBIDDEN/);
 await assert.rejects(service.execute(f.owner,'review_delivery',{...f.base,taskId:f.taskId,expectedVersion:pending.task.version,submissionId:sub.submissionId,decision:'accept',reason:'self review',requestKey:key()}),/INDEPENDENT/);
 await service.execute(f.reviewer,'review_delivery',{...f.base,taskId:f.taskId,expectedVersion:pending.task.version,submissionId:sub.submissionId,decision:'accept',reason:'Fixture AC independently checked',requestKey:key()});
 const fresh=new WorkspaceService(db);const done=await fresh.execute(f.owner,'get_project_status',f.base);assert.equal(done.items[0].status,'Done');assert.equal(done.metrics.throughput,1);assert.equal(done.submissions[0].provenance,'reported');assert.equal(done.deployments.length,0);
});
test('A27/A28 stale recommendation and digest-bound idempotency',async()=>{
 const f=await fixture(),k=key();const input={...f.base,taskId:f.taskId,expectedVersion:3,contractHash:f.contract.hash,requestKey:k};await service.execute(f.agent,'claim_work',input);
 await assert.rejects(service.execute(f.agent,'claim_work',{...input,contractHash:'0'.repeat(64)}),/IDEMPOTENCY_CONFLICT/);
});
test('A29 expiry is enforced without TTL cleanup and stale generation rejected',async()=>{
 const f=await fixture(),c=await claim(f);const expired=new WorkspaceService(db,()=>c.expiresAt+1);
 await assert.rejects(expired.execute(f.agent,'renew_claim',{...f.base,taskId:f.taskId,executionId:c.executionId,generation:c.generation,expectedVersion:1,requestKey:key()}),/CLAIM_EXPIRED/);
 const won=await expired.execute(f.agent,'claim_work',{...f.base,taskId:f.taskId,expectedVersion:4,contractHash:f.contract.hash,requestKey:key()});assert.equal(won.claim.generation,c.generation+1);
 await assert.rejects(expired.execute(f.agent,'renew_claim',{...f.base,taskId:f.taskId,executionId:c.executionId,generation:c.generation,expectedVersion:1,requestKey:key()}),/CLAIM_REVOKED/);
});
test('A02/A03/A34 draft edit preserves pins; approval drift blocks further mutation',async()=>{
 const f=await fixture(),c=await claim(f);const v2=await service.execute(f.owner,'create_document',{...f.base,documentId:f.doc.documentId,expectedVersion:2,title:'Spec v2',body:'Material new scope',requestKey:key()});
 const context=await service.execute(f.agent,'get_work_context',{...f.base,taskId:f.taskId,executionId:c.executionId});assert.equal(context.manifest.parts[1].revision,f.doc.revisionId);
 await service.execute(f.reviewer,'approve_document',{...f.base,documentId:f.doc.documentId,revisionId:v2.revisionId,expectedVersion:3,decision:'approve',requestKey:key()});
 await assert.rejects(service.execute(f.agent,'get_work_context',{...f.base,taskId:f.taskId,executionId:c.executionId}),/CONTEXT_CHANGED/);
 await assert.rejects(service.execute(f.agent,'renew_claim',{...f.base,taskId:f.taskId,executionId:c.executionId,generation:c.generation,expectedVersion:1,requestKey:key()}),/CONTEXT_CHANGED/);
});
test('A06/A33/A48 tenant isolation and revoke blocks next read even after manifest',async()=>{
 const f=await fixture(),other=await fixture(),c=await claim(f);
 await assert.rejects(service.execute(f.agent,'resolve_project',other.base),/FORBIDDEN/);
 await service.execute(f.owner,'revoke_connection',{...f.base,grantId:f.grant.grantId,requestKey:key()});
 await assert.rejects(service.execute(f.agent,'read_context_part',{...f.base,taskId:f.taskId,executionId:c.executionId,partId:'contract'}),/FORBIDDEN/);
});
test('A07/A11 baseline immutable and concurrent document edit conflict',async()=>{
 const f=await fixture();const baseline=await service.execute(f.reviewer,'publish_baseline',{...f.base,reason:'Fixture baseline',requestKey:key()});
 await service.execute(f.owner,'edit_work',{...f.base,taskId:f.taskId,expectedVersion:3,title:'Changed title',start:'2027-01-16',end:'2027-01-20',archived:false,requestKey:key()});
 const stored=(await db.doc(`workspaces/${f.base.workspaceId}/projects/${f.base.projectId}/baselines/${baseline.baseline.id}`).get()).data()!;assert.notEqual(stored.items[f.taskId].end,'2027-01-20');
 const edit={...f.base,documentId:f.doc.documentId,expectedVersion:2,title:'Spec next',body:'new text',requestKey:key()};
 const results=await Promise.allSettled([service.execute(f.owner,'create_document',edit),service.execute(f.owner,'create_document',{...edit,requestKey:key()})]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
});
test('review regression: approval cannot reopen started, review, or accepted work',async()=>{
 const f=await fixture(),c=await claim(f);
 await service.execute(f.agent,'checkpoint_work',{...f.base,taskId:f.taskId,executionId:c.executionId,generation:c.generation,expectedVersion:1,requestKey:key(),state:'started',summary:'Start',headSha,baseSha,nextAction:'Test',tests:[]});
 const current=await service.execute(f.owner,'get_work_state',{...f.base,taskId:f.taskId});
 await assert.rejects(service.execute(f.reviewer,'approve_contract',{...f.base,taskId:f.taskId,expectedVersion:current.task.version,contractId:f.contract.id,decision:'approve',requestKey:key()}),/WORK_NOT_AVAILABLE/);
 for(const status of ['In review','Done']){await db.doc(`workspaces/${f.base.workspaceId}/projects/${f.base.projectId}/work/${f.taskId}`).update({status});await assert.rejects(service.execute(f.reviewer,'approve_contract',{...f.base,taskId:f.taskId,expectedVersion:current.task.version,contractId:f.contract.id,decision:'approve',requestKey:key()}),/WORK_NOT_AVAILABLE/);}
});
test('review regression: authorization expiry advancing during transaction blocks writes',async()=>{
 const f=await fixture(),c=await claim(f);let calls=0;
 const advancing=new WorkspaceService(db,()=>++calls<=2?c.expiresAt-1:c.expiresAt+1);
 await assert.rejects(advancing.execute(f.agent,'renew_claim',{...f.base,taskId:f.taskId,executionId:c.executionId,generation:c.generation,expectedVersion:1,requestKey:key()}),/CLAIM_EXPIRED|AUTHORIZATION_EXPIRED/);
 const state=await service.execute(f.owner,'get_work_state',{...f.base,taskId:f.taskId});assert.equal(state.claim.version,1);
});
test('review regression: latest history is selected before bounded pagination',async()=>{
 const f=await fixture(),root=db.doc(`workspaces/${f.base.workspaceId}/projects/${f.base.projectId}`),batch=db.batch();
 for(let i=0;i<35;i++){const id=`attempt-${i.toString().padStart(2,'0')}`;batch.set(root.collection('executions').doc(id),{executionId:id,taskId:f.taskId,createdDate:i});batch.set(root.collection('checkpoints').doc(`cp-${i}`),{executionId:'attempt-34',createdDate:i,headSha,summary:`checkpoint ${i}`});}await batch.commit();
 const state=await service.execute(f.owner,'get_work_state',{...f.base,taskId:f.taskId});assert.equal(state.attempts[0].executionId,'attempt-34');assert.equal(state.checkpoint.summary,'checkpoint 34');assert.equal(state.coverage.attempts,false);assert.equal(state.coverage.checkpoints,false);
});
