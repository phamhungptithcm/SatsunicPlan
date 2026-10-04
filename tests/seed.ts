import {fixture,adminAuth,service,author,key} from './fixtures.js';
try{await adminAuth.getUserByEmail('author@example.test');console.log('Synthetic seed already exists; no existing data overwritten.');}
catch{const f=await fixture('demo');await service.execute(f.owner,'publish_baseline',{...f.base,reason:'Synthetic pilot commitment',requestKey:key()});console.log('Synthetic Customer Portal created through domain commands. Author and independent reviewer available. No provider verification.');}
