import {spawn,spawnSync} from 'node:child_process';
import {existsSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
const mode=process.argv[2]??'verify';
const allowed=new Set(['start','verify','rules','integration','mcp','auth','e2e']);if(!allowed.has(mode))throw new Error('Unknown verification mode');
const build=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','-p','functions/tsconfig.json'],{stdio:'inherit'});if(build.status!==0)process.exit(build.status??1);
const javaCandidates=[process.env.JAVA_HOME,'/opt/homebrew/opt/openjdk@24/libexec/openjdk.jdk/Contents/Home','/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home'].filter(Boolean);
const java=javaCandidates.find(p=>{if(!existsSync(p+'/bin/java'))return false;const r=spawnSync(p+'/bin/java',['-version'],{encoding:'utf8'});return Number((r.stderr+r.stdout).match(/version "(\d+)/)?.[1])>=21;});
mkdirSync('tests/.cli-config',{recursive:true});
const env={...process.env,XDG_CONFIG_HOME:resolve('tests/.cli-config'),GOOGLE_APPLICATION_CREDENTIALS:resolve('tests/.cli-config/no-cloud-credentials.json'),GCLOUD_PROJECT:'demo-hunpeolabs-workspace',...(java?{JAVA_HOME:java,PATH:java+'/bin:'+process.env.PATH}:{})};
delete env.FIREBASE_TOKEN;
delete env.GOOGLE_OAUTH_ACCESS_TOKEN;
const base=['--project','demo-hunpeolabs-workspace','--only','auth,firestore,functions,storage'];
let args;
if(mode==='start'){args=['emulators:start',...base,'--export-on-exit','tests/.emulator-data'];if(existsSync('tests/.emulator-data/firebase-export-metadata.json'))args.push('--import','tests/.emulator-data');}
else{
 const commands={rules:'node --import tsx --test tests/rules.test.ts',integration:'node --import tsx --test tests/integration.test.ts',mcp:'node --import tsx --test tests/mcp.test.ts',auth:'node --import tsx --test tests/auth.test.ts',e2e:'node --import tsx tests/seed.ts && playwright test --config tests/playwright.config.ts',verify:'node --import tsx --test --test-concurrency=1 tests/rules.test.ts tests/integration.test.ts tests/mcp.test.ts tests/auth.test.ts && node --import tsx tests/seed.ts && playwright test --config tests/playwright.config.ts'};
 args=['emulators:exec',...base,commands[mode]];
}
const child=spawn(process.execPath,['node_modules/firebase-tools/lib/bin/firebase.js',...args],{stdio:'inherit',env});child.on('exit',code=>process.exit(code??1));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
