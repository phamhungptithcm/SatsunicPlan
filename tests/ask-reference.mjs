// Hash-bound, isolated source/target behavior fixture. Never builds/writes sibling repo.
import {mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {createServer} from 'vite';
import react from '@vitejs/plugin-react';
const workspace=process.cwd();
const snapshot=JSON.parse(await readFile('docs/evidence/ask-hunpeolabs-source-snapshot.json','utf8'));
const root=await mkdtemp(join(tmpdir(),'hws-ask-reference-'));
const copies={};
for(const [source,target] of [['components/ask-hunpeolabs.tsx','source.tsx'],['components/ask-hunpeolabs.module.css','ask-hunpeolabs.module.css'],['lib/ask/deadline.ts','deadline.ts']]){
 const bytes=await readFile(join(snapshot.sourceRoot,source));
 if(createHash('sha256').update(bytes).digest('hex')!==snapshot.entries.find(e=>e.path===source)?.sha256)throw new Error('Source fixture provenance changed');
 await writeFile(join(root,target),bytes);copies[source]=target;
}
const files={
 'index.html':'<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>',
 'main.tsx':`import React,{useState} from 'react';import {createRoot} from 'react-dom/client';import './reference.css';
import {AskHunpeoLabs} from './source';import {AskWorkspace} from ${JSON.stringify(join(workspace,'src/features/ask/AskWorkspace.tsx'))};import {answerHelp} from ${JSON.stringify(join(workspace,'src/features/ask/help.ts'))};
function Fixture(){const [epoch,setEpoch]=useState(0);const adapter=async(request,signal)=>{if(!request.question.startsWith('Delayed'))return answerHelp(request,signal);return new Promise((resolve,reject)=>{window.fixtureAnswer=()=>answerHelp({...request,question:'roadmap'},new AbortController().signal).then(resolve);window.fixtureFailure=()=>reject(new Error('fixture unavailable'));});};return <><p>Isolated source/target visual and behavior fixture; no provider.</p>{location.pathname==='/target'?<><button onClick={()=>setEpoch(e=>e+1)}>Reset scope</button><AskWorkspace key={epoch} answerQuestion={adapter} onNavigate={()=>{}}/></>:<AskHunpeoLabs/>}</>};createRoot(document.getElementById('root')).render(<React.StrictMode><Fixture/></React.StrictMode>);`,
 'reference.css':'*{box-sizing:border-box}body{margin:0;font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:14px;line-height:1.5}button,input{font:inherit}',
 'link.tsx':`export default function Link({href,children,...props}){return <a href={href} {...props}>{children}</a>}`,
 'image.tsx':`export default function Image(props){return <img {...props}/>}`,
 'knowledge.ts':`export const founderProfile={name:'Fixture only',portrait:'',role:'Fixture',description:{en:'Fixture',vi:'Fixture'},links:[]};`,
 'contracts.ts':`export function sourceLink(id){return {label:'Fixture source',href:'#fixture-only'}}`,
 'retrieval.ts':`export const detectLanguage=()=> 'en';export const retrieveSelection=()=>({topic:'services'});export function buildAnswer(){return {title:'Source answer fixture',paragraphs:['Synthetic answer for source layout characterization only. No API or provider called.'],bullets:[],sourceIds:[],founder:false,action:'services',followUp:null,language:'en',mode:'published'}}`,
 'stream.ts':`export const readAskStream=async()=>{throw new Error('SOURCE_TRANSPORT_DENIED')}`,
 'firebase-client.ts':`export const askAppCheckToken=async()=>{throw new Error('SOURCE_PROVIDER_DENIED')}`,
};
for(const [name,body] of Object.entries(files))await writeFile(join(root,name),body);
const aliases={
 'react':join(workspace,'node_modules/react'),'react-dom':join(workspace,'node_modules/react-dom'),
 'next/link':join(root,'link.tsx'),'next/image':join(root,'image.tsx'),
 '@/content/ask-knowledge':join(root,'knowledge.ts'),
 ...Object.fromEntries(['contracts','retrieval','stream','deadline','firebase-client'].map(name=>['@/lib/ask/'+name,join(root,name+'.ts')]))
};
const server=await createServer({configFile:false,root,plugins:[react(),{name:'deny-source-transport',configureServer(server){server.middlewares.use((req,res,next)=>{if(req.url?.startsWith('/api/')){res.statusCode=503;res.end('SOURCE_TRANSPORT_DENIED');}else next();});}}],resolve:{alias:aliases},server:{host:'127.0.0.1',port:15174,strictPort:true,hmr:false,fs:{allow:[root,join(workspace,"src"),join(workspace,"node_modules")]}}});
await server.listen();
console.log('Isolated hash-bound Ask source/target fixture on loopback 15174; source business content substituted, provider unavailable.');
let closing=false;const close=async()=>{if(closing)return;closing=true;await server.close();await rm(root,{recursive:true,force:true});process.exit(0);};for(const signal of ['SIGTERM','SIGINT'])process.on(signal,close);
