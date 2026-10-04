import {initializeApp,getApps} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {getAuth} from 'firebase-admin/auth';
import {WorkspaceService} from '../functions/src/application/workspace.js';
import {randomUUID} from 'node:crypto';
export const projectId='demo-hunpeolabs-workspace';
export function assertEmulators(){for(const name of ['FIRESTORE_EMULATOR_HOST','FIREBASE_AUTH_EMULATOR_HOST'])if(!/^127\.0\.0\.1:\d+$/.test(process.env[name]??''))throw new Error('Emulators required; production fallback is forbidden.');if(process.env.GCLOUD_PROJECT!==projectId)throw new Error('Synthetic demo project required.');}
// An explicitly isolated test runner may select another loopback Functions port.
export const functionsOrigin=process.env.HWS_TEST_FUNCTIONS_ORIGIN??'http://127.0.0.1:15001';
if(!/^http:\/\/127\.0\.0\.1:[1-9]\d{0,4}$/.test(functionsOrigin)||Number(new URL(functionsOrigin).port)>65535)throw new Error('Loopback Functions test endpoint required.');
assertEmulators();if(!getApps().length)initializeApp({projectId});
export const db=getFirestore(),service=new WorkspaceService(db),adminAuth=getAuth();
export const password='Synthetic-only-2026!',key=()=>randomUUID();
export const author=(uid:string)=>({uid,channel:'human' as const});
export async function fixture(label=key()){
 const uid=`author-${label}`,reviewUid=`reviewer-${label}`;
 await adminAuth.createUser({uid,email:label==='demo'?'author@example.test':`${uid}@example.test`,password});await adminAuth.createUser({uid:reviewUid,email:label==='demo'?'reviewer@example.test':`${reviewUid}@example.test`,password});
 const owner=author(uid),reviewer=author(reviewUid);
 const scope=await service.execute(owner,'bootstrap',{name:'Customer Portal',repository:'https://github.com/example/customer-portal',requestKey:key()});
 const base={workspaceId:scope.workspaceId,projectId:scope.projectId};
 const batch=db.batch();batch.set(db.doc(`workspaces/${base.workspaceId}/members/${reviewUid}`),{role:'manager',active:true});batch.set(db.doc(`workspaces/${base.workspaceId}/projects/${base.projectId}/members/${reviewUid}`),{role:'manager',active:true});batch.set(db.doc(`users/${reviewUid}/projects/${base.projectId}`),base);await batch.commit();
 const doc=await service.execute(owner,'create_document',{...base,expectedVersion:0,title:'Portal implementation specification',body:'# Customer Portal\n\nAC-1: Persist the project name after refresh.\n\nDo not change authentication or deploy code.',requestKey:key()});
 await service.execute(reviewer,'approve_document',{...base,documentId:doc.documentId,revisionId:doc.revisionId,expectedVersion:1,decision:'approve',requestKey:key()});
 const today=new Date().toISOString().slice(0,10);
 const r=await service.execute(owner,'create_work',{...base,title:'Preserve project names after refresh',description:'Persist a project name and read it back after a browser refresh.',type:'task',priority:3,ac:[{id:'AC-1',text:'Project name survives refresh'}],dependencies:[],parentId:null,assignee:uid,start:today,end:today,requestKey:key()});
 const contract=await service.execute(owner,'publish_contract',{...base,taskId:r.task.id,expectedVersion:1,scope:r.task.description,nonGoals:'No production deployment or authentication changes.',documentIds:[doc.documentId],requestKey:key()});
 await service.execute(reviewer,'approve_contract',{...base,taskId:r.task.id,expectedVersion:2,contractId:contract.contract.id,decision:'approve',requestKey:key()});
 const grant=await service.execute(owner,'grant_connection',{...base,write:true,consent:true,label:'SDK test harness',requestKey:key()});
 const agent={uid,channel:'agent' as const,grantId:grant.grantId};
 return {base,owner,reviewer,agent,uid,reviewUid,taskId:r.task.id,contract:contract.contract,doc,grant};
}
export async function humanToken(email:string){assertEmulators();const r=await fetch(`http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=synthetic`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,returnSecureToken:true})});if(!r.ok)throw new Error('Emulator sign-in failed');return (await r.json()).idToken as string;}
export const headSha='a'.repeat(40),baseSha='b'.repeat(40);
