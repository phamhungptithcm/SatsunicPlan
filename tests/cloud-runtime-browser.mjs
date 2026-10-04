// Render the actual cloud build with intercepted synthetic Auth/API responses.
// This is UI/config evidence only, never live Firebase authentication acceptance.
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
const origin='https://satsunicplan.web.app',build=resolve('tests/.cloud-dist'),out=resolve('docs/evidence/sp-prod-001-browser');mkdirSync(out,{recursive:true});
const project={workspaceId:'synthetic-workspace',projectId:'synthetic-project',name:'Synthetic cloud UI fixture',repository:'https://github.com/example/fixture',role:'admin'};
const snapshot={project,role:'admin',items:[],documents:[],submissions:[],baselines:[],decisions:[],connections:[],deployments:[],metrics:{throughput:0,onTime:null},coverage:{work:true,documents:true},asOf:0};
const encode=value=>Buffer.from(JSON.stringify(value)).toString('base64url');
const now=Math.floor(Date.now()/1000);
const claims={aud:'satsunicplan',iss:'https://securetoken.google.com/satsunicplan',sub:'synthetic-human',user_id:'synthetic-human',iat:now,exp:now+3600,auth_time:now,email:'human@example.test',firebase:{sign_in_provider:'password',identities:{email:['human@example.test']}}};
const token=`${encode({alg:'none',typ:'JWT'})}.${encode(claims)}.`;
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try{
 for(const width of [1440,390,320]){
  const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block'}),page=await context.newPage();
  const errors=[],operations=[],blocked=[];let failure='';
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.origin===origin&&url.pathname==='/api'){
    const body=route.request().postDataJSON();operations.push(body.operation);
    if(body.operation==='list_projects')return route.fulfill({json:{projects:[project]}});
    if(body.operation==='get_project_status'){
     if(failure==='offline')return route.abort('failed');
     if(failure==='invalid')return route.fulfill({status:502,contentType:'text/html',body:'synthetic upstream failure'});
     if(failure==='disabled')return route.fulfill({status:503,json:{error:'LOCAL_ONLY'}});
     if(failure==='temporary')return route.fulfill({status:503,json:{error:'TEMPORARILY_UNAVAILABLE'}});
     return route.fulfill({json:snapshot});
    }
    throw new Error('Unexpected synthetic API operation');
   }
   if(url.hostname==='identitytoolkit.googleapis.com'&&url.pathname.endsWith('accounts:signInWithPassword'))return route.fulfill({json:{idToken:token,refreshToken:'synthetic-refresh-fixture',expiresIn:'3600',localId:'synthetic-human',email:'human@example.test',registered:true}});
   if(url.hostname==='identitytoolkit.googleapis.com'&&url.pathname.endsWith('accounts:lookup'))return route.fulfill({json:{users:[{localId:'synthetic-human',email:'human@example.test',emailVerified:true,providerUserInfo:[{providerId:'password',email:'human@example.test',federatedId:'human@example.test'}]}]}});
   if(url.origin===origin){
    const file=resolve(build,decodeURIComponent(url.pathname==='/'?'index.html':url.pathname.slice(1)));
    if(!file.startsWith(build+sep))throw new Error('Invalid fixture asset path');
    const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
    try{return route.fulfill({body:readFileSync(file),contentType:mime[extname(file)]??'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}
   }
   blocked.push(url.hostname);return route.abort('blockedbyclient');
  });
  await page.goto(origin);await page.getByLabel('Email',{exact:true}).fill('human@example.test');await page.getByLabel('Password',{exact:true}).fill('Synthetic-only-2026!');await page.getByRole('button',{name:'Sign in',exact:true}).click();
  try{await page.getByRole('heading',{name:'Roadmap',exact:true}).waitFor();}catch(e){
   await page.screenshot({path:resolve(out,`failed-signin-${width}.png`),fullPage:true});
   console.log(JSON.stringify({state:'synthetic-signin-failed',errors,operations,blocked,alerts:await page.getByRole('alert').allTextContents()}));throw e;
  }
  await page.getByRole('button',{name:'Connect agent',exact:true}).click();
  await page.getByText('Agent connections are not available in this cloud workspace yet.',{exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Create 24-hour grant'}).count(),0);
  assert.equal(await page.getByText('http://127.0.0.1:15001/demo-hunpeolabs-workspace/us-central1/mcp').count(),0);
  await page.screenshot({path:resolve(out,`cloud-agent-${width}.png`),fullPage:true});
  const cases=[['offline','Could not reach the service. Check your connection, then refresh to check your changes.'],['invalid','Could not confirm the result. Refresh to check your changes.'],['disabled','This service is not enabled for this workspace.'],['temporary','The service is unavailable. Refresh to check whether your changes were saved.']];
  for(const [state,message] of cases){
   failure=state;await page.getByRole('button',{name:'Refresh',exact:true}).click();await page.getByRole('alert').filter({hasText:message}).waitFor();
   assert.equal(await page.getByRole('heading',{name:'Connect agent',exact:true}).count(),1);
   if(state==='offline')await page.screenshot({path:resolve(out,`cloud-offline-${width}.png`),fullPage:true});
  }
  failure='';await page.getByRole('button',{name:'Refresh',exact:true}).focus();await page.keyboard.press('Enter');await page.getByText('Data refreshed',{exact:true}).waitFor();assert.equal(await page.getByRole('alert').count(),0);
  if(width===320){
   // Pixel-sized product type does not scale from a root-font change. Double actual sizes.
   await page.evaluate(()=>{const sizes=Array.from(document.querySelectorAll('body *')).map(element=>[element,parseFloat(getComputedStyle(element).fontSize)]);for(const [element,size] of sizes)element.style.setProperty('font-size',`${size*2}px`,'important');});
   assert.equal(await page.locator('p.empty').evaluate(element=>parseFloat(getComputedStyle(element).fontSize)),26);
   await page.screenshot({path:resolve(out,'cloud-agent-320-text-200.png'),fullPage:true});
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.deepEqual(errors,[]);assert.equal(operations.includes('grant_connection'),false);assert.equal(blocked.some(host=>host==='127.0.0.1'||host==='localhost'),false);
  results.push({width,states:cases.map(([name])=>name),keyboardRefresh:true,emulatorRequests:false,cloudGrantIssued:false,pageErrors:errors,unexpectedExternalHosts:blocked});
  await context.close();
 }
 writeFileSync(resolve(out,'results.json'),JSON.stringify({kind:'SIMULATED_AUTH_API_ACTUAL_BUILD_UI',liveFirebaseAcceptance:'NOT_TESTED',results},null,2));
 console.log('Cloud UI fixture: 3 viewports, 4 failure states, keyboard recovery PASS. Live Firebase NOT_TESTED.');
}finally{await browser.close();}
