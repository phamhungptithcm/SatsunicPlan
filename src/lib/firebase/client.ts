import {initializeApp} from 'firebase/app';
import {getAuth,connectAuthEmulator} from 'firebase/auth';
import {resolveFirebaseConfig,requireReleasedRuntime} from './config';
const config=resolveFirebaseConfig(import.meta.env,window.location.hostname,window.location.origin);
requireReleasedRuntime(config);
export const runtimeMode=config.mode;
const firebase=initializeApp(config.options);
export const auth=getAuth(firebase);
if(config.mode==='emulator')connectAuthEmulator(auth,'http://127.0.0.1:19099',{disableWarnings:true});
const messages:Record<string,string>={
 UNAUTHENTICATED:'Sign in again to continue.',FORBIDDEN_OR_NOT_FOUND:'This item is unavailable or you do not have access.',INVALID_INPUT:'Check the fields and try again.',VERSION_CONFLICT:'This item changed. Refresh before saving again.',INDEPENDENT_REVIEW_REQUIRED:'Another authorized person must review this revision.',CONTRACT_NOT_READY:'Approve the required contract and documents before continuing.',CLAIM_CONFLICT:'This work is reserved by another execution. Read its current state.',CONTEXT_CHANGED:'The approved context changed. Review the pinned revisions before continuing.',EVIDENCE_REQUIRED:'Each acceptance criterion needs passing evidence before acceptance.',CLAIM_EXPIRED:'The reservation expired. Revalidate and claim again.',DECISION_REQUIRED:'Resolve the pending decision before continuing.',RATE_LIMITED:'Too many requests. Wait a minute before trying again.',LOCAL_ONLY:config.mode==='emulator'?'The local services are not available.':'This service is not enabled for this workspace.',TEMPORARILY_UNAVAILABLE:'The service is unavailable. Refresh to check whether your changes were saved.'
};
export async function command<T=Record<string,unknown>>(operation:string,input:unknown):Promise<T>{
 if(!auth.currentUser)throw new Error(messages.UNAUTHENTICATED);
 const token=await auth.currentUser.getIdToken();
 let response:Response;
 try{response=await fetch(config.apiEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({operation,input})});}
 catch{throw new Error('Could not reach the service. Check your connection, then refresh to check your changes.');}
 let result;try{result=await response.json();}catch{throw new Error('Could not confirm the result. Refresh to check your changes.');}
 if(!response.ok)throw new Error(messages[result?.error]??'The action did not complete. Refresh and try again.');return result;
}
export const key=()=>crypto.randomUUID();
