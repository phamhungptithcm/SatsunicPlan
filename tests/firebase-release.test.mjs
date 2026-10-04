import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {prepareRelease,components} from '../scripts/firebase-release.mjs';
test('release preparation isolates components and never deploys',()=>{
 for(const component of Object.keys(components)){
  const result=prepareRelease(component,'satsunicplan');
  assert.equal(result.executesDeployment,false);assert.equal(result.status,'PREPARATION_ONLY');
  assert.ok(result.blockers.length);assert.ok(!result.plannedSelector.includes(','));
  for(const hash of Object.values(result.files))assert.match(hash,/^[a-f0-9]{64}$/);
 }
 for(const name of ['all','__proto__','functions',''])assert.throws(()=>prepareRelease(name,'satsunicplan'));
 assert.throws(()=>prepareRelease('hosting',undefined));assert.throws(()=>prepareRelease('hosting','other'));
});
test('CLI rejects broad deploy or execute flags',()=>{
 for(const args of [[],['all','--project','satsunicplan'],['api','--project','satsunicplan','--execute']]){
  const result=spawnSync(process.execPath,['scripts/firebase-release.mjs',...args],{encoding:'utf8'});
  assert.equal(result.status,1);assert.equal(result.stdout,'');
 }
 const result=spawnSync(process.execPath,['scripts/firebase-release.mjs','api','--project','satsunicplan'],{encoding:'utf8'});
 assert.equal(result.status,0);assert.equal(JSON.parse(result.stdout).executesDeployment,false);
});
