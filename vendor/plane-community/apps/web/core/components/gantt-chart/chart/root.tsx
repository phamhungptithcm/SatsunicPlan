/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 * HunpeoLabs adaptation of ChartViewRoot: retained upstream week/month/quarter generation,
 * GanttRoot contract and positioning. Scoped Firebase provider replaces Plane user/root stores;
 * baseline/actual overlays and accessible local controls replace upstream application bindings.
 */
import {useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import {observer} from 'mobx-react';
import type {IBlockUpdateData,IBlockUpdateDependencyData,TGanttViews,ChartDataType} from '@plane/types';
import {useTimeLineChartStore} from '@hws/plane-adapter';
import {currentViewDataWithView} from '../data';
import {weekView} from '../views/week-view';
import {monthView} from '../views/month-view';
import {quarterView} from '../views/quarter-view';
import {getItemPositionWidth,getPositionFromDate} from '../views/helpers';
import {dateOnly,getDate,addDaysToDate} from '@plane/utils';
import {Button} from '@hws/plane-button';
type Props = {
  border: boolean;
  title: string;
  loaderTitle: string;
  blockIds: string[];
  blockUpdateHandler: (block: any, payload: IBlockUpdateData) => void;
  blockToRender: (data: any) => React.ReactNode;
  sidebarToRender: (props: any) => React.ReactNode;
  enableBlockLeftResize: boolean | ((blockId: string) => boolean);
  enableBlockRightResize: boolean | ((blockId: string) => boolean);
  enableBlockMove: boolean | ((blockId: string) => boolean);
  enableReorder: boolean | ((blockId: string) => boolean);
  enableAddBlock: boolean | ((blockId: string) => boolean);
  enableSelection: boolean | ((blockId: string) => boolean);
  enableDependency: boolean | ((blockId: string) => boolean);
  bottomSpacing: boolean;
  showAllBlocks: boolean;
  loadMoreBlocks?: () => void;
  updateBlockDates?: (updates: IBlockUpdateDependencyData[]) => Promise<void>;
  canLoadMoreBlocks?: boolean;
  quickAdd?: React.ReactNode | undefined;
  showToday: boolean;
  isEpic?: boolean;
};
const timelineViewHelpers={week:weekView,month:monthView,quarter:quarterView};
export const ChartViewRoot=observer(function ChartViewRoot({title,blockIds,blockToRender,sidebarToRender,showAllBlocks}:Props){
 const store=useTimeLineChartStore();const [anchor,setAnchor]=useState(new Date().toISOString().slice(0,10));const scroller=useRef<HTMLDivElement>(null);
 const view=store.currentView,setView=store.updateCurrentView;
 const generated=useMemo(()=>{const template=currentViewDataWithView(view)!;const payload:ChartDataType={...template,data:{...template.data,currentDate:getDate(anchor)!,approxFilterRange:view==='quarter'?3:1}};return timelineViewHelpers[view].generateChart(payload,null);},[anchor,view]);
 const chart=generated.state,width=generated.scrollWidth;
 const ticks=useMemo(()=>{const result:{date:string;left:number}[]=[];let date=new Date(chart.data.startDate);while(date<=chart.data.endDate){result.push({date:dateOnly(date),left:getPositionFromDate(chart,date,0)});date=addDaysToDate(date,view==='week'?1:7)!;}return result;},[generated,view]);
 useEffect(()=>{const container=scroller.current;if(!container)return;const center=()=>{const sidebar=container.querySelector<HTMLElement>('.roadmap-labels');const available=container.clientWidth-(sidebar?.offsetWidth??0);container.scrollLeft=Math.max(0,getPositionFromDate(chart,getDate(anchor)!,0)-Math.max(0,available/2));};const observer=new ResizeObserver(center);observer.observe(container);center();return()=>observer.disconnect();},[generated,anchor]);
 return <><div className="toolbar"><label className="field">Timeline range<input aria-label="Timeline range" type="date" value={anchor} onChange={e=>{if(getDate(e.target.value))setAnchor(e.target.value);}}/></label><label className="field">Zoom<select aria-label="Zoom" value={view} onChange={e=>setView(e.target.value as TGanttViews)}><option value="week">Week</option><option value="month">Month</option><option value="quarter">Quarter</option></select></label><Button className="plane-neutral" onClick={()=>setAnchor(new Date().toISOString().slice(0,10))}>Today</Button></div>
 <div className="roadmap-scroll" ref={scroller} data-plane-component="BaseGanttLayout"><div className="roadmap-grid"><div className="roadmap-labels"><div className="timeline-heading">{title}</div>{sidebarToRender({blockIds,showAllBlocks})}</div><div className="timeline" style={{width,minWidth:width}}><div className="timeline-heading">{ticks.map(t=><span key={t.date} style={{left:t.left}}>{t.date.slice(5)}</span>)}</div>
 {blockIds.map(id=>{const block=store.getBlockById(id);if(!block||(!showAllBlocks&&(!block.start_date||!block.target_date)))return null;const item=store.items[id],position=block.start_date&&block.target_date?getItemPositionWidth(chart,block):undefined;const base=store.baseline?.items[id];const baselinePosition=base?.start&&base.end?getItemPositionWidth(chart,{...block,start_date:base.start,target_date:base.end}):undefined;
 return <div className="timeline-row" key={id} style={{backgroundSize:`${chart.data.dayWidth*7}px 100%`}}>{baselinePosition&&base&&<span className="baseline-bar" style={{left:baselinePosition.marginLeft,width:baselinePosition.width}} title={`Baseline ${base.start} to ${base.end}`}/>} {position?<div className="plane-block" style={{left:position.marginLeft,width:position.width}}>{blockToRender(item)}</div>:<span className="unscheduled">Unscheduled</span>}{item.completedAt&&<span className="actual-marker" style={{left:getPositionFromDate(chart,getDate(new Date(item.completedAt).toISOString().slice(0,10))!,0)}} title={`Human-accepted completion ${new Date(item.completedAt).toISOString()}`}>◆</span>}</div>;
 })}</div></div></div></>;
});
