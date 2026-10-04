import test from 'node:test';
import assert from 'node:assert/strict';
import {getApps} from 'firebase-admin/app';
import {api,mcp} from '../functions/src/adapters/firebase/http.js';

test('SDK discovery is credential-free; cloud HTTP denial cannot initialize Admin',async()=>{
 assert.equal(getApps().length,0);
 const previous={...process.env};
 try{
  for(const key of Object.keys(process.env))if(/(^|_)EMULATOR(_|$)/.test(key))delete process.env[key];
  Object.assign(process.env,{HWS_FIREBASE_MODE:'cloud',HWS_HUMAN_API_ENABLED:'true',GCLOUD_PROJECT:'satsunicplan',HWS_API_HOSTS:'["satsunicplan.web.app"]',HWS_API_ORIGINS:'["https://satsunicplan.web.app"]'});
  delete process.env.FIREBASE_CONFIG;delete process.env.GOOGLE_CLOUD_PROJECT;
  const invoke=async(handler:typeof api,overrides:Record<string,unknown>={})=>{
   const response={statusCode:200,body:undefined as unknown,headers:{} as Record<string,string>,set(key:string,value:string){this.headers[key]=value;return this;},status(value:number){this.statusCode=value;return this;},json(value:unknown){this.body=value;return this;},end(){return this;}};
   const request={method:'POST',headers:{host:'satsunicplan.web.app',origin:'https://satsunicplan.web.app'},rawBody:Buffer.from('{}'),body:{},is:()=>true,...overrides};
   await handler(request as never,response as never);return response;
  };
  const locked=await invoke(mcp);assert.equal(locked.statusCode,503);assert.deepEqual(locked.body,{error:'LOCAL_ONLY'});
  const wrongHost=await invoke(api,{headers:{host:'attacker.example.com','x-forwarded-host':'satsunicplan.web.app'}});assert.equal(wrongHost.statusCode,403);
  const wrongOrigin=await invoke(api,{headers:{host:'satsunicplan.web.app',origin:'https://attacker.example.com'}});assert.equal(wrongOrigin.statusCode,403);
  const wrongMethod=await invoke(api,{method:'GET',rawBody:undefined});assert.equal(wrongMethod.statusCode,400);
  const preflight=await invoke(api,{method:'OPTIONS'});assert.equal(preflight.statusCode,204);assert.equal(preflight.headers['Access-Control-Allow-Origin'],'https://satsunicplan.web.app');
  delete process.env.HWS_HUMAN_API_ENABLED;
  const missingConfig=await invoke(api);assert.equal(missingConfig.statusCode,503);assert.deepEqual(missingConfig.body,{error:'TEMPORARILY_UNAVAILABLE'});
  assert.equal(getApps().length,0);
 }finally{
  for(const key of Object.keys(process.env))if(!(key in previous))delete process.env[key];
  Object.assign(process.env,previous);
 }
});
