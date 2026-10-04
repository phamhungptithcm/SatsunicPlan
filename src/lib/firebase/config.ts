export const EMULATOR_PROJECT_ID='demo-hunpeolabs-workspace';
export const CLOUD_PROJECT_ID='satsunicplan';
type PublicEnvironment=Readonly<Record<string,string|undefined>>;
export function resolveFirebaseConfig(env:PublicEnvironment,hostname:string,origin?:string){
 const mode=env.VITE_FIREBASE_MODE??'emulator';
 if(mode==='emulator'){
  if(!['localhost','127.0.0.1'].includes(hostname))throw new Error('Emulator mode requires a loopback host.');
  if(env.VITE_FIREBASE_PROJECT_ID&&env.VITE_FIREBASE_PROJECT_ID!==EMULATOR_PROJECT_ID)throw new Error('Emulator mode requires the synthetic project.');
  if(env.VITE_HUMAN_API_ENABLED!==undefined||env.VITE_FIREBASE_APP_ORIGIN!==undefined)throw new Error('Cloud activation settings are not valid in emulator mode.');
  return {mode,runtimeEnabled:true,options:{projectId:EMULATOR_PROJECT_ID,apiKey:'synthetic-emulator-key',authDomain:'localhost'},apiEndpoint:`http://127.0.0.1:15001/${EMULATOR_PROJECT_ID}/us-central1/api`};
 }
 if(mode!=='cloud')throw new Error('Unknown Firebase mode.');
 if(env.VITE_FIREBASE_PROJECT_ID!==CLOUD_PROJECT_ID)throw new Error('Cloud mode requires project satsunicplan.');
 const required=(name:string)=>{
  const value=env[name]?.trim();
  if(!value||/\s/.test(value))throw new Error(`Missing or invalid public Firebase setting: ${name}`);
  return value;
 };
 const apiKey=required('VITE_FIREBASE_API_KEY'),authDomain=required('VITE_FIREBASE_AUTH_DOMAIN'),appId=required('VITE_FIREBASE_APP_ID');
 const labels=authDomain.split('.');
 if(authDomain.length>253||labels.length<2||labels.some(label=>!/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/.test(label))||authDomain.toLowerCase().endsWith('.localhost')||/^\d+(\.\d+){3}$/.test(authDomain))throw new Error('Invalid Firebase Auth domain.');
 if(!/^1:\d+:web:[a-zA-Z0-9]+$/.test(appId))throw new Error('Invalid Firebase web app ID.');
 const enabled=env.VITE_HUMAN_API_ENABLED;
 if(enabled!==undefined&&enabled!=='true'&&enabled!=='false')throw new Error('Invalid human API activation setting.');
 let runtimeEnabled=false;
 if(enabled==='true'){
  let canonical:URL;try{canonical=new URL(required('VITE_FIREBASE_APP_ORIGIN'));}catch{throw new Error('Invalid application origin.');}
  if(canonical.protocol!=='https:'||canonical.origin!==env.VITE_FIREBASE_APP_ORIGIN||canonical.port||canonical.hostname!==hostname||origin!==canonical.origin||
   hostname.length>253||hostname.split('.').length<2||hostname.split('.').some(label=>!/^([a-z0-9]|[a-z0-9][a-z0-9-]{0,61}[a-z0-9])$/.test(label))||
   /^\d+(\.\d+){3}$/.test(hostname)||/(^|\.)(localhost|local|internal|test|invalid)$/.test(hostname))throw new Error('This application origin is not enabled.');
  runtimeEnabled=true;
 }
 return {mode,runtimeEnabled,options:{projectId:CLOUD_PROJECT_ID,apiKey,authDomain,appId},apiEndpoint:'/api'};
}

// Activation is explicit configuration, not a release or provider-readiness certificate.
export function requireReleasedRuntime(config:{mode:string;runtimeEnabled:boolean}){
 if(!['emulator','cloud'].includes(config.mode)||!config.runtimeEnabled)throw new Error('Cloud application release is pending Auth/API verification.');
}
