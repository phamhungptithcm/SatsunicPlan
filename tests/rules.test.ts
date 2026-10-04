import {test} from 'node:test';import {readFileSync} from 'node:fs';
import {initializeTestEnvironment,assertFails,assertSucceeds} from '@firebase/rules-unit-testing';
import {doc,setDoc,getDoc} from 'firebase/firestore';
import {ref,uploadBytes,getBytes} from 'firebase/storage';
import {assertEmulators,projectId,key} from './fixtures.js';
test('A06/A40 Rules reject cross-tenant/direct protected writes/credentials and Storage defaults',async()=>{
 assertEmulators();const storageHost=process.env.FIREBASE_STORAGE_EMULATOR_HOST??'127.0.0.1:19199';if(!/^127\.0\.0\.1:\d+$/.test(storageHost))throw new Error('Loopback Storage emulator required.');
 const e=await initializeTestEnvironment({projectId,firestore:{host:'127.0.0.1',port:Number(process.env.FIRESTORE_EMULATOR_HOST!.split(':')[1]),rules:readFileSync('firestore.rules','utf8')},storage:{host:'127.0.0.1',port:Number(storageHost.split(':')[1]),rules:readFileSync('storage.rules','utf8')}});
 const w=key(),p=key(),uid=key(),path=`workspaces/${w}/projects/${p}/work/task`;
 try{
  await e.withSecurityRulesDisabled(async c=>{await setDoc(doc(c.firestore(),`workspaces/${w}/members/${uid}`),{active:true});await setDoc(doc(c.firestore(),`workspaces/${w}/projects/${p}/members/${uid}`),{active:true,role:'viewer'});await setDoc(doc(c.firestore(),path),{title:'private',status:'Ready'});});
  const member=e.authenticatedContext(uid),other=e.authenticatedContext(key());
  await assertSucceeds(getDoc(doc(member.firestore(),path)));await assertFails(getDoc(doc(other.firestore(),path)));await assertFails(getDoc(doc(e.unauthenticatedContext().firestore(),path)));
  await assertFails(setDoc(doc(member.firestore(),path),{status:'Done'}));await assertFails(getDoc(doc(member.firestore(),'grants/verifier')));await assertFails(setDoc(doc(member.firestore(),`workspaces/${w}/projects/${p}/members/${uid}`),{role:'admin'}));
  await assertFails(uploadBytes(ref(member.storage(),'private/file.txt'),new TextEncoder().encode('private')));await assertFails(getBytes(ref(member.storage(),'private/file.txt')));
 }finally{await e.cleanup();}
});
