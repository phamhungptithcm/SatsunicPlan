// Own a separate synthetic suite; never reuse/stop/seed another chat's services.
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawn} from 'node:child_process';
const root=process.cwd(),config=JSON.parse(readFileSync('firebase.json','utf8'));
for(const value of Object.values(config.emulators))if(value&&typeof value==='object')for(const field of ['port','websocketPort'])if(field in value)value[field]+=10000;
config.functions[0].source='../../functions';config.firestore.rules=resolve('firestore.rules');config.firestore.indexes=resolve('firestore.indexes.json');config.storage.rules=resolve('storage.rules');delete config.hosting;
mkdirSync('tests/.cli-config',{recursive:true});
const configPath=resolve('tests/.cli-config/sp-prod-001-isolated.json');writeFileSync(configPath,JSON.stringify(config,null,2));
const env={...process.env,XDG_CONFIG_HOME:resolve('tests/.cli-config'),GOOGLE_APPLICATION_CREDENTIALS:resolve('tests/.cli-config/no-cloud-credentials.json'),GCLOUD_PROJECT:'demo-hunpeolabs-workspace',HWS_FIREBASE_MODE:'emulator',HWS_TEST_FUNCTIONS_ORIGIN:'http://127.0.0.1:25001'};
for(const key of ['FIREBASE_TOKEN','GOOGLE_OAUTH_ACCESS_TOKEN','HWS_HUMAN_API_ENABLED','GOOGLE_CLOUD_PROJECT','FIREBASE_CONFIG','FIRESTORE_EMULATOR_HOST','FIREBASE_AUTH_EMULATOR_HOST','FIREBASE_STORAGE_EMULATOR_HOST','STORAGE_EMULATOR_HOST'])delete env[key];
const java='/opt/homebrew/opt/openjdk@24/libexec/openjdk.jdk/Contents/Home';if(existsSync(java+'/bin/java')){env.JAVA_HOME=java;env.PATH=java+'/bin:'+env.PATH;}
const command='node --import tsx --test --test-concurrency=1 tests/rules.test.ts tests/integration.test.ts tests/mcp.test.ts tests/auth.test.ts';
const child=spawn(process.execPath,['node_modules/firebase-tools/lib/bin/firebase.js','emulators:exec','--config',configPath,'--project','demo-hunpeolabs-workspace','--only','auth,firestore,functions,storage',command],{cwd:root,env,stdio:'inherit'});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('error',()=>{console.error('Could not start the isolated test suite.');process.exitCode=1;});
child.on('exit',code=>{process.exitCode=code??1;});
