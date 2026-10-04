import {initializeApp,getApps,getApp} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {onRequest,type Request} from 'firebase-functions/v2/https';
import {StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {WorkspaceService} from '../../application/workspace.js';
import {schemas,type Operation} from '../../application/schemas.js';
import {authenticate,rateLimit} from '../../auth/identity.js';
import {DomainError,ensure} from '../../domain/model.js';
import {createServer} from '../mcp/server.js';
import {resolveRuntimeConfig,assertRuntimeRequest,type RuntimeConfig} from './runtime-config.js';
// SDK discovery must be able to enumerate handlers without runtime credentials.
// Validate each invocation before initializing Admin or touching any data store.
function services(runtime:RuntimeConfig){
 if(!getApps().some(app=>app.name==='[DEFAULT]'))initializeApp({projectId:runtime.projectId});
 ensure(getApp().options.projectId===runtime.projectId,'LOCAL_ONLY');
 const db=getFirestore();return {db,service:new WorkspaceService(db)};
}
const options={region:'us-central1',maxInstances:3,timeoutSeconds:30,memory:'256MiB' as const};
function boundary(req:Request,channel:'human'|'agent'){
 const runtime=resolveRuntimeConfig(process.env);
 assertRuntimeRequest(runtime,channel,{host:req.headers.host,origin:req.headers.origin,bodyBytes:req.rawBody?.byteLength??0});
 return runtime;
}
const errorStatus=(code:string)=>code==='UNAUTHENTICATED'?401:code==='RATE_LIMITED'?429:code==='LOCAL_ONLY'||code==='TEMPORARILY_UNAVAILABLE'?503:code==='INVALID_INPUT'||code==='SIZE_LIMIT'?400:code==='FORBIDDEN_OR_NOT_FOUND'?403:409;
export const api=onRequest(options,async(req,res)=>{
 res.set('Cache-Control','no-store');
 try{
  const runtime=boundary(req,'human');if(req.headers.origin)res.set('Access-Control-Allow-Origin',req.headers.origin);res.set('Vary','Origin');
  if(req.method==='OPTIONS'){res.set('Access-Control-Allow-Headers','authorization,content-type');res.set('Access-Control-Allow-Methods','POST');res.status(204).end();return;}
  ensure(req.method==='POST','INVALID_INPUT');ensure(req.is('application/json'),'INVALID_INPUT');
  const {db,service}=services(runtime);
  const principal=await authenticate(db,req.headers.authorization,'human');await rateLimit(db,principal);
  const op=req.body?.operation as Operation;ensure(Object.hasOwn(schemas,op),'INVALID_INPUT');
  const result=await service.execute(principal,op,req.body?.input);res.json(result);
 }catch(e){const code=e instanceof DomainError?e.code:'TEMPORARILY_UNAVAILABLE';res.status(errorStatus(code)).json({error:code});}
});
export const mcp=onRequest(options,async(req,res)=>{
 res.set('Cache-Control','no-store');
 try{
  const runtime=boundary(req,'agent'),{db,service}=services(runtime);const principal=await authenticate(db,req.headers.authorization,'agent');await rateLimit(db,principal);
  const server=createServer(service,principal),transport=new StreamableHTTPServerTransport({sessionIdGenerator:undefined,enableJsonResponse:true});
  res.on('close',()=>{void transport.close();void server.close();});
  await server.connect(transport);await transport.handleRequest(req,res,req.body);
 }catch(e){if(!res.headersSent){const code=e instanceof DomainError?e.code:'TEMPORARILY_UNAVAILABLE';res.status(errorStatus(code)).json({error:code});}}
});
