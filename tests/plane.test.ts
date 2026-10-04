import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {test} from 'node:test';import assert from 'node:assert/strict';
import {getItemPositionWidth,getDateFromPositionOnGantt,getNumberOfDaysBetweenTwoDates} from '../vendor/plane-community/apps/web/core/components/gantt-chart/views/helpers';
import {getWeeksBetweenTwoDates} from '../vendor/plane-community/apps/web/core/components/gantt-chart/views/week-view';
import {currentViewDataWithView} from '../vendor/plane-community/apps/web/core/components/gantt-chart/data';
import {weekView} from '../vendor/plane-community/apps/web/core/components/gantt-chart/views/week-view';
import {monthView} from '../vendor/plane-community/apps/web/core/components/gantt-chart/views/month-view';
import {quarterView} from '../vendor/plane-community/apps/web/core/components/gantt-chart/views/quarter-view';
import {getDate,dateOnly} from '../src/lib/plane/date-utils';
import {EStartOfTheWeek,type ChartDataType} from '../vendor/plane-community/packages/types/src';
const chart=():ChartDataType=>({key:'week',i18n_title:'Week',data:{startDate:getDate('2026-03-01')!,endDate:getDate('2026-04-01')!,currentDate:getDate('2026-03-08')!,dayWidth:20,approxFilterRange:1}});
test('Plane port: date-only positions and inclusive duration across DST, no input mutation',()=>{
 const c=chart(),before=c.data.startDate.valueOf();assert.deepEqual(getItemPositionWidth(c,{id:'a',name:'a',data:{},sort_order:undefined,start_date:'2026-03-07',target_date:'2026-03-09'}),{marginLeft:120,width:60});assert.equal(c.data.startDate.valueOf(),before);
 assert.equal(dateOnly(getDateFromPositionOnGantt(160,c)!), '2026-03-09');assert.equal(getNumberOfDaysBetweenTwoDates(getDate('2026-03-07')!,getDate('2026-03-09')!),-2);assert.equal(getDate('2026-02-29'),undefined);
});
test('Plane port: week boundaries preserve seven calendar days across DST',()=>{
 for(const [start,end] of [['2026-03-06','2026-03-12'],['2026-10-30','2026-11-05']]){const rows=getWeeksBetweenTwoDates(getDate(start)!,getDate(end)!,true,EStartOfTheWeek.MONDAY);for(const row of rows){assert.equal(row.children?.length,7);assert.equal(getNumberOfDaysBetweenTwoDates(row.startDate,row.endDate),-6);}}
});
test('Plane port: actual upstream week/month/quarter generators have bounded complete ranges',()=>{
 for(const [view,generator] of [['week',weekView],['month',monthView],['quarter',quarterView]] as const){const source=currentViewDataWithView(view)!;const result=generator.generateChart({...source,data:{...source.data,currentDate:getDate('2026-12-31')!,approxFilterRange:1}},null);assert.ok(result.state.data.startDate<result.state.data.endDate);assert.equal(result.scrollWidth,(Math.abs(getNumberOfDaysBetweenTwoDates(result.state.data.startDate,result.state.data.endDate))+1)*source.data.dayWidth);}
});

test('Plane port: imported source hashes and license notices match retained manifest',()=>{
 const manifest=JSON.parse(readFileSync('docs/plane-reuse-manifest.json','utf8'));assert.equal(manifest.sha,'5f7d92784c403f76284f0f16718f320221dc7fec');assert.equal(manifest.entries.length,21);
 for(const entry of manifest.entries){const bytes=readFileSync(entry.target);assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.localHash);assert.match(bytes.toString('utf8').slice(0,600),/SPDX-License-Identifier: AGPL-3.0-only/);assert.doesNotMatch(bytes.toString('utf8').slice(0,600),/LicenseRef-/);if(!entry.modified)assert.equal(entry.localHash,entry.upstreamHash);}
 assert.match(readFileSync('vendor/plane-community/LICENSE.txt','utf8'),/GNU AFFERO GENERAL PUBLIC LICENSE/);
});
test('Plane port: scoped store keeps view across immutable data updates and isolates a new project',async()=>{
 const {FirebaseTimelineStore}=await import('../src/lib/plane/timeline-context');
 const store=new FirebaseTimelineStore({},undefined);store.updateCurrentView('quarter');store.updateSnapshot({},undefined);assert.equal(store.currentView,'quarter');const other=new FirebaseTimelineStore({},undefined);assert.equal(other.currentView,'month');assert.notEqual(store,other);
});
