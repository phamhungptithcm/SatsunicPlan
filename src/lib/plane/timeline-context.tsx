import {createContext,useContext,useState,useLayoutEffect,type ReactNode} from 'react';
import {makeObservable,observable,action} from 'mobx';
import {GanttStore} from '../../../vendor/plane-community/apps/web/core/store/issue/issue_gantt_view.store';
import type {IGanttBlock} from '@plane/types';
import type {Work,Baseline} from '../../domain/view';
export interface TimelineItem extends Work {start_date:string|undefined;target_date:string|undefined;[key:string]:unknown}
export const toTimelineItems=(tasks:Work[]):Record<string,TimelineItem>=>Object.fromEntries(tasks.map(work=>[work.id,{...work,start_date:work.start??undefined,target_date:work.end??undefined}]));
export class FirebaseTimelineStore extends GanttStore {
 blockIds:string[]=[];
 items:Record<string,TimelineItem>;baseline:Baseline|undefined;
 constructor(items:Record<string,TimelineItem>,baseline:Baseline|undefined){super();this.items=items;this.baseline=baseline;makeObservable(this,{items:observable.ref,baseline:observable.ref,updateSnapshot:action.bound});}
 updateSnapshot=(items:Record<string,TimelineItem>,baseline:Baseline|undefined)=>{this.items=items;this.baseline=baseline;};
 setBlockIds=(ids:string[])=>{this.blockIds=[...ids];};
 getBlockById=(id:string):IGanttBlock|undefined=>{const item=this.items[id];return item?{id,name:item.title,data:item,sort_order:undefined,start_date:item.start_date,target_date:item.target_date}:undefined;};
}
const Context=createContext<FirebaseTimelineStore|null>(null);
export function TimelineProvider({items,baseline,children}:{items:Record<string,TimelineItem>;baseline:Baseline|undefined;children:ReactNode}){
 const [store]=useState(()=>new FirebaseTimelineStore(items,baseline));useLayoutEffect(()=>{store.updateSnapshot(items,baseline);},[store,items,baseline]);return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function useTimeLineChartStore(){const store=useContext(Context);if(!store)throw new Error('Project timeline context missing');return store;}
