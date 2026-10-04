import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveFirebaseConfig,requireReleasedRuntime} from '../src/lib/firebase/config.ts';
const cloud={VITE_FIREBASE_MODE:'cloud',VITE_FIREBASE_PROJECT_ID:'satsunicplan',VITE_FIREBASE_API_KEY:'public-fixture',VITE_FIREBASE_AUTH_DOMAIN:'satsunicplan.firebaseapp.com',VITE_FIREBASE_APP_ID:'1:123456:web:abc123'};
test('default emulator is loopback-only and cannot select cloud project',()=>{
 const config=resolveFirebaseConfig({},'localhost');
 assert.equal(config.options.projectId,'demo-hunpeolabs-workspace');
 assert.match(config.apiEndpoint,/^http:\/\/127\.0\.0\.1:/);
 assert.doesNotThrow(()=>requireReleasedRuntime(config));
 for(const host of ['satsunicplan.web.app','localhost.attacker.test','::1'])assert.throws(()=>resolveFirebaseConfig({},host));
 assert.throws(()=>resolveFirebaseConfig({VITE_FIREBASE_PROJECT_ID:'satsunicplan'},'localhost'));
 assert.throws(()=>resolveFirebaseConfig({VITE_FIREBASE_MODE:'production'},'localhost'));
});
test('cloud preparation validates project and public settings without enabling release',()=>{
 const config=resolveFirebaseConfig(cloud,'satsunicplan.web.app');
 assert.equal(config.options.projectId,'satsunicplan');assert.equal(config.apiEndpoint,'/api');
 assert.throws(()=>requireReleasedRuntime(config),/pending/);
 assert.throws(()=>resolveFirebaseConfig({...cloud,VITE_FIREBASE_PROJECT_ID:'wrong'},'localhost'));
 for(const name of ['VITE_FIREBASE_API_KEY','VITE_FIREBASE_AUTH_DOMAIN','VITE_FIREBASE_APP_ID']){
  for(const value of ['',undefined,'white space'])assert.throws(()=>resolveFirebaseConfig({...cloud,[name]:value},'localhost'));
 }
 for(const domain of ['https://satsunicplan.firebaseapp.com','localhost','127.0.0.1','a.localhost','a.LOCALHOST','a.test/path','a..test','a.-test','a.test-',`${'a'.repeat(64)}.test`])assert.throws(()=>resolveFirebaseConfig({...cloud,VITE_FIREBASE_AUTH_DOMAIN:domain},'localhost'));
 assert.throws(()=>resolveFirebaseConfig({...cloud,VITE_FIREBASE_APP_ID:'not-an-app-id'},'localhost'));
});
test('human cloud activation requires the exact HTTPS application origin',()=>{
 const enabled={...cloud,VITE_HUMAN_API_ENABLED:'true',VITE_FIREBASE_APP_ORIGIN:'https://satsunicplan.web.app'};
 const config=resolveFirebaseConfig(enabled,'satsunicplan.web.app','https://satsunicplan.web.app');
 assert.equal(config.runtimeEnabled,true);assert.equal(config.apiEndpoint,'/api');
 assert.doesNotThrow(()=>requireReleasedRuntime(config));
 for(const origin of ['http://satsunicplan.web.app','https://attacker.example.com','https://satsunicplan.web.app:8443',undefined])assert.throws(()=>resolveFirebaseConfig(enabled,'satsunicplan.web.app',origin));
 for(const canonical of ['',undefined,'https://satsunicplan.web.app/','https://user:pass@satsunicplan.web.app','https://satsunicplan.web.app/path','https://satsunicplan.web.app:443','https://127.0.0.1'])assert.throws(()=>resolveFirebaseConfig({...enabled,VITE_FIREBASE_APP_ORIGIN:canonical},'satsunicplan.web.app','https://satsunicplan.web.app'));
 assert.throws(()=>resolveFirebaseConfig({...enabled,VITE_HUMAN_API_ENABLED:'yes'},'satsunicplan.web.app','https://satsunicplan.web.app'));
 assert.throws(()=>resolveFirebaseConfig({VITE_HUMAN_API_ENABLED:'true'},'localhost','http://localhost'));
 assert.throws(()=>requireReleasedRuntime({mode:'unknown',runtimeEnabled:true}));
 assert.throws(()=>requireReleasedRuntime(resolveFirebaseConfig({...enabled,VITE_HUMAN_API_ENABLED:'false'},'satsunicplan.web.app','https://satsunicplan.web.app')));
});
