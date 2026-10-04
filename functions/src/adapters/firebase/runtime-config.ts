import {ensure} from '../../domain/model.js';

type Environment=Readonly<Record<string,string|undefined>>;
export type RuntimeConfig={mode:'emulator'|'cloud';projectId:string;hosts:readonly string[];origins:readonly string[]};
const emulatorKeys=['FIRESTORE_EMULATOR_HOST','FIREBASE_AUTH_EMULATOR_HOST','FIREBASE_STORAGE_EMULATOR_HOST','STORAGE_EMULATOR_HOST','FIREBASE_DATABASE_EMULATOR_HOST','PUBSUB_EMULATOR_HOST'];
const configError=()=>{throw new Error('Invalid Firebase runtime configuration.');};

function publicHost(value:string){
 const labels=value.split('.');
 return value.length<=253&&value===value.toLowerCase()&&labels.length>=2&&
  labels.every(label=>/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))&&
  !/^\d+(\.\d+){3}$/.test(value)&&!/(^|\.)(localhost|local|internal|test|invalid)$/.test(value);
}
function list(env:Environment,name:string){
 let values:unknown;try{values=JSON.parse(env[name]??'');}catch{configError();}
 if(!Array.isArray(values)||!values.length||values.length>16||values.some(v=>typeof v!=='string')||new Set(values).size!==values.length)configError();
 return values as string[];
}
export function resolveRuntimeConfig(env:Environment):RuntimeConfig{
 const mode=env.HWS_FIREBASE_MODE??'emulator';
 if(mode==='emulator'){
  if(env.FUNCTIONS_EMULATOR!=='true'||
   !['FIRESTORE_EMULATOR_HOST','FIREBASE_AUTH_EMULATOR_HOST'].every(key=>/^127\.0\.0\.1:\d+$/.test(env[key]??''))||
   ['GCLOUD_PROJECT','GOOGLE_CLOUD_PROJECT'].some(key=>env[key]!==undefined&&env[key]!=='demo-hunpeolabs-workspace')||
   env.HWS_HUMAN_API_ENABLED!==undefined||
   emulatorKeys.some(key=>env[key]!==undefined&&!(key==='STORAGE_EMULATOR_HOST'?/^http:\/\/127\.0\.0\.1:\d+$/:/^127\.0\.0\.1:\d+$/).test(env[key]!)))configError();
  return {mode,projectId:'demo-hunpeolabs-workspace',hosts:['127.0.0.1','localhost'],origins:['http://127.0.0.1:15173','http://localhost:15173']};
 }
 if(mode!=='cloud'||env.HWS_HUMAN_API_ENABLED!=='true'||env.GCLOUD_PROJECT!=='satsunicplan'||
  (env.GOOGLE_CLOUD_PROJECT!==undefined&&env.GOOGLE_CLOUD_PROJECT!=='satsunicplan')||
  Object.keys(env).some(key=>/(^|_)EMULATOR(_|$)/.test(key)&&env[key]!==undefined))configError();
 // FIREBASE_CONFIG is platform metadata, never a credential or alternate project override.
 if(env.FIREBASE_CONFIG!==undefined){
  let metadata:unknown;try{metadata=JSON.parse(env.FIREBASE_CONFIG);}catch{configError();}
  if(!metadata||typeof metadata!=='object'||(metadata as {projectId?:unknown}).projectId!=='satsunicplan')configError();
 }
 const hosts=list(env,'HWS_API_HOSTS'),origins=list(env,'HWS_API_ORIGINS');
 if(hosts.some(host=>!publicHost(host)))configError();
 for(const origin of origins){
  let url:URL;try{url=new URL(origin);}catch{configError();}
  if(url!.protocol!=='https:'||url!.origin!==origin||url!.port||!publicHost(url!.hostname)||!hosts.includes(url!.hostname))configError();
 }
 return {mode:'cloud',projectId:'satsunicplan',hosts,origins};
}

export function assertRuntimeRequest(config:RuntimeConfig,channel:'human'|'agent',request:{host:string|undefined;origin:string|undefined;bodyBytes:number}){
 ensure(config.mode==='emulator'||channel==='human','LOCAL_ONLY');
 const host=request.host??'';
 // Deliberately inspect the actual Host only; forwarded headers are not identity evidence.
 const pattern=config.mode==='emulator'?/^(localhost|127\.0\.0\.1)(?::([1-9]\d{0,4}))?$/:/^([a-z0-9.-]+)(?::443)?$/;
 const match=host.match(pattern);
 ensure(match&&config.hosts.includes(match[1])&&(!match[2]||Number(match[2])<=65535),'FORBIDDEN_OR_NOT_FOUND');
 // Absent Origin supports authenticated native human callers. Bearer auth is still mandatory.
 ensure(request.origin===undefined||config.origins.includes(request.origin),'FORBIDDEN_OR_NOT_FOUND');
 ensure(Number.isSafeInteger(request.bodyBytes)&&request.bodyBytes>=0&&request.bodyBytes<=100000,'SIZE_LIMIT');
}
