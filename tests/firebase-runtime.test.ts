import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveRuntimeConfig,assertRuntimeRequest} from '../functions/src/adapters/firebase/runtime-config.js';
const local={FUNCTIONS_EMULATOR:'true',GCLOUD_PROJECT:'demo-hunpeolabs-workspace',FIRESTORE_EMULATOR_HOST:'127.0.0.1:18080',FIREBASE_AUTH_EMULATOR_HOST:'127.0.0.1:19099'};
const cloud={HWS_FIREBASE_MODE:'cloud',HWS_HUMAN_API_ENABLED:'true',GCLOUD_PROJECT:'satsunicplan',HWS_API_HOSTS:'["satsunicplan.web.app","api-example.a.run.app"]',HWS_API_ORIGINS:'["https://satsunicplan.web.app"]'};
test('runtime configuration denies absent, mismatched and mixed trust environments',()=>{
 assert.throws(()=>resolveRuntimeConfig({}));
 assert.equal(resolveRuntimeConfig(local).projectId,'demo-hunpeolabs-workspace');
 assert.doesNotThrow(()=>resolveRuntimeConfig({...local,STORAGE_EMULATOR_HOST:'http://127.0.0.1:19199'}));
 assert.equal(resolveRuntimeConfig(cloud).projectId,'satsunicplan');
 for(const [key,value] of Object.entries({HWS_FIREBASE_MODE:'production',HWS_HUMAN_API_ENABLED:'false',GCLOUD_PROJECT:'other',GOOGLE_CLOUD_PROJECT:'other',FUNCTIONS_EMULATOR:'false',FIRESTORE_EMULATOR_HOST:'',FIREBASE_AUTH_EMULATOR_HOST:'127.0.0.1:19099',FIREBASE_STORAGE_EMULATOR_HOST:'127.0.0.1:19199',FIREBASE_CONFIG:'{"projectId":"other"}'}))assert.throws(()=>resolveRuntimeConfig({...cloud,[key]:value}),key);
 for(const key of ['HWS_HUMAN_API_ENABLED','GCLOUD_PROJECT','HWS_API_HOSTS','HWS_API_ORIGINS'])assert.throws(()=>resolveRuntimeConfig({...cloud,[key]:undefined}),key);
 for(const key of ['FIREBASE_EMULATOR_HUB','FIREBASE_FIRESTORE_EMULATOR_ADDRESS','CLOUD_EVENTARC_EMULATOR_HOST','CLOUD_TASKS_EMULATOR_HOST'])assert.throws(()=>resolveRuntimeConfig({...cloud,[key]:'127.0.0.1:19099'}),key);
 assert.doesNotThrow(()=>resolveRuntimeConfig({...cloud,FIREBASE_CONFIG:'{"projectId":"satsunicplan"}'}));
 for(const value of ['bad','null','{}','{"projectId":123}','/a/config.json'])assert.throws(()=>resolveRuntimeConfig({...cloud,FIREBASE_CONFIG:value}));
 for(const patch of [{GCLOUD_PROJECT:'satsunicplan'},{GOOGLE_CLOUD_PROJECT:'satsunicplan'},{FIRESTORE_EMULATOR_HOST:'remote.example.com:8080'},{HWS_HUMAN_API_ENABLED:'true'}])assert.throws(()=>resolveRuntimeConfig({...local,...patch}));
});
test('cloud allowlists require bounded canonical public HTTPS origins and exact hosts',()=>{
 for(const host of ['localhost','127.0.0.1','10.0.0.1','a.local','a.internal','a.test','*.web.app','a..web.app','a.-web.app','SATSUNICPLAN.web.app','satsunicplan.web.app:443','satsunicplan.web.app/path','satsunicplan.web.app,attacker.com'])assert.throws(()=>resolveRuntimeConfig({...cloud,HWS_API_HOSTS:JSON.stringify([host])}));
 for(const origin of ['http://satsunicplan.web.app','https://satsunicplan.web.app/','https://satsunicplan.web.app:443','https://satsunicplan.web.app:8443','https://user:pass@satsunicplan.web.app','https://satsunicplan.web.app/path','https://satsunicplan.web.app?q=1','https://attacker.example.com','null'])assert.throws(()=>resolveRuntimeConfig({...cloud,HWS_API_ORIGINS:JSON.stringify([origin])}));
 for(const list of ['[]','{}','null','[1]','["satsunicplan.web.app","satsunicplan.web.app"]',JSON.stringify(Array.from({length:17},(_,i)=>`host${i}.example.com`))])assert.throws(()=>resolveRuntimeConfig({...cloud,HWS_API_HOSTS:list}));
});
test('human cloud opt-in never enables MCP; host/origin/size checks precede auth',()=>{
 const config=resolveRuntimeConfig(cloud),request={host:'satsunicplan.web.app',origin:'https://satsunicplan.web.app',bodyBytes:10};
 assert.doesNotThrow(()=>assertRuntimeRequest(config,'human',request));
 assert.doesNotThrow(()=>assertRuntimeRequest(config,'human',{...request,host:'satsunicplan.web.app:443'}));
 assert.doesNotThrow(()=>assertRuntimeRequest(config,'human',{...request,origin:undefined}));
 assert.throws(()=>assertRuntimeRequest(config,'agent',request),/LOCAL_ONLY/);
 for(const host of [undefined,'','satsunicplan.web.app.attacker.com','satsunicplan.web.app:8443','SATSUNICPLAN.web.app','satsunicplan.web.app,attacker.com','satsunicplan.web.app.','satsunicplan.web.app/path','localhost'])assert.throws(()=>assertRuntimeRequest(config,'human',{...request,host}),/FORBIDDEN/);
 for(const origin of ['','null','https://attacker.example.com','https://satsunicplan.web.app/','https://satsunicplan.web.app:443'])assert.throws(()=>assertRuntimeRequest(config,'human',{...request,origin}),/FORBIDDEN/);
 for(const bodyBytes of [-1,100001,NaN,Infinity,1.5])assert.throws(()=>assertRuntimeRequest(config,'human',{...request,bodyBytes}),/SIZE_LIMIT/);
 assert.doesNotThrow(()=>assertRuntimeRequest(config,'human',{...request,bodyBytes:100000}));
});
test('emulator boundary preserves both channels and refuses malformed loopback hosts',()=>{
 const config=resolveRuntimeConfig(local);
 for(const channel of ['human','agent'] as const)assert.doesNotThrow(()=>assertRuntimeRequest(config,channel,{host:'127.0.0.1:15001',origin:'http://127.0.0.1:15173',bodyBytes:0}));
 for(const host of ['127.0.0.1.attacker.com','localhost:65536','localhost:0','localhost:abc','localhost,attacker.com'])assert.throws(()=>assertRuntimeRequest(config,'human',{host,origin:undefined,bodyBytes:0}));
});
