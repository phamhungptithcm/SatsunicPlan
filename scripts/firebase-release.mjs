// Preparation only: no Firebase CLI invocation or network/credential access.
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
export const components={
 hosting:{selector:'hosting',files:['firebase.cloud.json'],phase:3},
 rules:{selector:'firestore:rules',files:['firebase.cloud.json','firestore.rules'],phase:4},
 indexes:{selector:'firestore:indexes',files:['firebase.cloud.json','firestore.indexes.json'],phase:4},
 storage:{selector:'storage',files:['firebase.cloud.json','storage.rules'],phase:4},
 api:{selector:'functions:api',files:['firebase.cloud.json','functions/src/adapters/firebase/http.ts'],phase:4},
 mcp:{selector:'functions:mcp',files:['firebase.cloud.json','functions/src/adapters/firebase/http.ts'],phase:5}
};
export function prepareRelease(component,project){
 if(project!=='satsunicplan')throw new Error('Explicit project satsunicplan is required.');
 if(!Object.hasOwn(components,component))throw new Error('Select one component: hosting, rules, indexes, storage, api or mcp.');
 const selected=components[component];
 const configuration=JSON.parse(readFileSync(resolve(root,'firebase.cloud.json'),'utf8'));
 if(configuration.hosting.rewrites.some(r=>r.source==='/mcp'))throw new Error('MCP must remain absent from cloud Hosting until its separate review.');
 return {product:'SatsunicPlan',project,component,phase:selected.phase,status:'PREPARATION_ONLY',
  files:Object.fromEntries(selected.files.map(file=>[file,createHash('sha256').update(readFileSync(resolve(root,file))).digest('hex')])),
  plannedSelector:selected.selector,
  releaseReceiptRequired:['reviewed plan and human approval','verified cloud project/site/providers/region','exact built artifact and validation hashes','prior resource version and rollback','post-deployment readback'],
  blockers:component==='hosting'?['Dedicated static preview artifact and approved preview channel required; current dist is local-only.']:component==='api'||component==='mcp'?['Backend is emulator-only; separate runtime/security approval required.']:['Review current rules/indexes against verified cloud baseline before release.'],
  executesDeployment:false};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const args=process.argv.slice(2);
  if(args.length!==3||args[1]!=='--project')throw new Error('Usage: npm run firebase:prepare -- <component> --project satsunicplan (preparation only)');
  console.log(JSON.stringify(prepareRelease(args[0],args[2]),null,2));
 }catch(error){console.error(error.message);process.exitCode=1;}
}
