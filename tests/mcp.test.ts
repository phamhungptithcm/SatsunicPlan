import {test} from 'node:test';import assert from 'node:assert/strict';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {fixture,key,headSha,baseSha,service,functionsOrigin} from './fixtures.js';
const endpoint=`${functionsOrigin}/demo-hunpeolabs-workspace/us-central1/mcp`;
test('A22 SDK harness only: initialize/list/resolve/recommend/claim/context/checkpoint/submit across stateless requests',async()=>{
 const f=await fixture();const client=new Client({name:'sdk-harness-not-real-codex',version:'0.1.0'});
 await client.connect(new StreamableHTTPClientTransport(new URL(endpoint),{requestInit:{headers:{Authorization:`Bearer ${f.grant.secret}`}}}));
 try{
  assert.equal((await client.listTools()).tools.length,15);
  const call=async(name:string,args:Record<string,unknown>)=>{const result=await client.callTool({name,arguments:args});assert.equal(result.isError,undefined,`domain tool ${name} must succeed`);return result.structuredContent as Record<string,any>;};
  await call('resolve_project',f.base);const rec=await call('recommend_work',f.base);assert.equal(rec.suggested[0].taskId,f.taskId);
  const c=(await call('claim_work',{...f.base,taskId:f.taskId,expectedVersion:3,contractHash:f.contract.hash,requestKey:key()})).claim;
  const context=await call('get_work_context',{...f.base,taskId:f.taskId,executionId:c.executionId});for(const part of context.manifest.parts)await call('read_context_part',{...f.base,taskId:f.taskId,executionId:c.executionId,partId:part.id});
  const cp=await call('checkpoint_work',{...f.base,taskId:f.taskId,executionId:c.executionId,generation:c.generation,expectedVersion:1,requestKey:key(),state:'started',summary:'SDK synthetic checkpoint',headSha,baseSha,nextAction:'submit',tests:[{command:'fixture assertion',result:'PASS'}]});
  await call('submit_delivery',{...f.base,taskId:f.taskId,executionId:c.executionId,generation:c.generation,expectedVersion:cp.claim.version,requestKey:key(),headSha,baseSha,pr:null,acEvidence:[{acId:'AC-1',result:'PASS',command:'fixture assertion'}],limitations:'SDK harness; actual client/provider NOT RUN'});
  const state=await call('get_work_state',{...f.base,taskId:f.taskId});assert.equal(state.task.status,'In review');
  const invalid=await client.callTool({name:'claim_work',arguments:{...f.base,actorType:'human'}});assert.equal(invalid.isError,true);
  await service.execute(f.owner,'revoke_connection',{...f.base,grantId:f.grant.grantId,requestKey:key()});await assert.rejects(client.callTool({name:'resolve_project',arguments:f.base}));
 }finally{await client.close();}
});
