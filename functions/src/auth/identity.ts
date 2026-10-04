import {getAuth} from 'firebase-admin/auth';
import {type Firestore} from 'firebase-admin/firestore';
import {ensure,type Principal} from '../domain/model.js';
import {bytesHash} from '../domain/logic.js';
export async function authenticate(db:Firestore,header:string|undefined,channel:'human'|'agent'):Promise<Principal>{
 ensure(header,'UNAUTHENTICATED');ensure(header.startsWith('Bearer '),'UNAUTHENTICATED');const token=header.slice(7);ensure(token.length>=20&&token.length<=8192,'UNAUTHENTICATED');
 if(channel==='human'){
  try {const decoded=await getAuth().verifyIdToken(token,true);return {uid:decoded.uid,channel};}catch {ensure(false,'UNAUTHENTICATED');}
 }
 const grantId=bytesHash(token),snapshot=await db.doc(`grants/${grantId}`).get();const g=snapshot.data();
 ensure(g?.active&&g.expiresAt>Date.now(),'UNAUTHENTICATED');return {uid:g.uid,channel,grantId};
}
export async function rateLimit(db:Firestore,principal:Principal){
 const now=Date.now(),bucket=Math.floor(now/60000),key=bytesHash(`${principal.uid}/${principal.grantId??'human'}/${bucket}`);
 await db.runTransaction(async tx=>{const ref=db.doc(`rateLimits/${key}`),snap=await tx.get(ref),count=snap.data()?.count??0;ensure(count<120,'RATE_LIMITED');tx.set(ref,{count:count+1,expiresAt:now+120000});});
}
