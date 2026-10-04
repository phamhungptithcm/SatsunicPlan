import {test} from 'node:test';import assert from 'node:assert/strict';
import {request} from 'node:http';
import {fixture,humanToken,key,adminAuth,db,functionsOrigin} from './fixtures.js';
const api=`${functionsOrigin}/demo-hunpeolabs-workspace/us-central1/api`;const mcp=api.replace(/api$/,'mcp');
test('A40/A47/A48 human API vs scoped agent credentials; host/origin boundaries',async()=>{
 const f=await fixture(),token=await humanToken(`${f.uid}@example.test`);
 const send=(url:string,bearer:string,body:unknown,headers:Record<string,string>={})=>fetch(url,{method:'POST',headers:{Authorization:`Bearer ${bearer}`,'Content-Type':'application/json',...headers},body:JSON.stringify(body)});
 assert.equal((await send(api,token,{operation:'resolve_project',input:f.base})).status,200);
 assert.equal((await fetch(api,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({operation:'resolve_project',input:f.base})})).status,401);
 assert.equal((await fetch(api)).status,400);
 const spoofedHostStatus=await new Promise<number>((resolve,reject)=>{
  const req=request(api,{method:'POST',headers:{Host:'attacker.example.com','X-Forwarded-Host':'127.0.0.1',Authorization:`Bearer ${token}`,'Content-Type':'application/json'}},res=>{res.resume();resolve(res.statusCode!);});
  req.on('error',reject);req.end(JSON.stringify({operation:'resolve_project',input:f.base}));
 });
 assert.equal(spoofedHostStatus,403);
 assert.equal((await send(api,token,{operation:'resolve_project',input:f.base},{Origin:'null'})).status,403);
 assert.equal((await send(api,f.grant.secret,{operation:'resolve_project',input:f.base})).status,401);
 assert.equal((await send(mcp,token,{jsonrpc:'2.0',id:1,method:'initialize',params:{}})).status,401);
 assert.equal((await send(api,token,{operation:'resolve_project',input:f.base},{Origin:'https://attacker.invalid'})).status,403);
 assert.equal((await send(api,token,{operation:'resolve_project',input:{...f.base,role:'admin'}})).status,400);
 const other=await fixture();
 assert.equal((await send(api,token,{operation:'resolve_project',input:other.base})).status,403);
 const payload=JSON.parse(Buffer.from(token.split('.')[1],'base64url').toString());
 // Emulator tokens are unsigned. Wrong issuer/audience must still be rejected.
 const altered=[token.split('.')[0],Buffer.from(JSON.stringify({...payload,aud:'other-project',iss:'https://securetoken.google.com/other-project'})).toString('base64url'),token.split('.')[2]].join('.');
 assert.equal((await send(api,altered,{operation:'resolve_project',input:f.base})).status,401);
 await db.doc(`workspaces/${f.base.workspaceId}/projects/${f.base.projectId}/members/${f.uid}`).update({active:false});
 assert.equal((await send(api,token,{operation:'resolve_project',input:f.base})).status,403);
 await db.doc(`workspaces/${f.base.workspaceId}/projects/${f.base.projectId}/members/${f.uid}`).update({active:true});
 await adminAuth.updateUser(f.uid,{disabled:true});
 assert.equal((await send(api,token,{operation:'resolve_project',input:f.base})).status,401);
 await adminAuth.updateUser(f.uid,{disabled:false});
 await adminAuth.revokeRefreshTokens(f.uid);
 assert.equal((await send(api,token,{operation:'resolve_project',input:f.base})).status,401);
});
