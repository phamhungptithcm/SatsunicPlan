import {useMemo} from 'react';
import {BaseGanttLayout} from '../../../vendor/plane-community/apps/web/core/components/base-layouts/gantt/layout';
import {TimelineProvider,toTimelineItems} from '../../lib/plane/timeline-context';
import type {Work,Baseline} from '../../domain/view';
export function PlaneRoadmap({tasks,baseline,open}:{tasks:Work[];baseline:Baseline|undefined;open:(work:Work)=>void}){
 const items=useMemo(()=>toTimelineItems(tasks),[tasks]);const groupedItemIds=useMemo(()=>({project:tasks.map(t=>t.id)}),[tasks]);
 return <><section className="roadmap-surface" aria-label="Project timeline"><div className="roadmap-summary"><span className="roadmap-count">{tasks.length} {tasks.length===1?'item':'items'} in this view</span><div className="legend"><span><i className="legend-baseline"/>Baseline</span><span><i className="legend-plan"/>Current plan</span><span><i className="legend-actual"/>Human-accepted completion</span></div></div>
 <TimelineProvider items={items} baseline={baseline}><BaseGanttLayout items={items} groups={[{id:'project',name:'Project'}]} groupedItemIds={groupedItemIds} title="Work items" showAllBlocks
 renderSidebar={item=><button className="text-button roadmap-item" onClick={()=>open(item)} title={`${item.key} · ${item.title}`}><span className="roadmap-status" data-status={item.status} aria-hidden="true"/><span className="roadmap-item-copy"><span className="roadmap-item-title">{item.title}</span><small>{item.key} · {item.type} · {item.status}</small></span></button>}
 renderBlock={item=><button className="plan-bar" data-status={item.status} onClick={()=>open(item)} title={`${item.title} · ${item.status} · ${item.start} → ${item.end}`} aria-label={`Open ${item.key}: ${item.title}, ${item.status}, current plan ${item.start} to ${item.end}`}>{item.title}</button>}/></TimelineProvider>
 {!tasks.length&&<p className="empty">No work in this view. Create a work item to plan its dates.</p>}</section><p className="roadmap-note">{baseline?`Baseline published ${new Date(baseline.createdDate).toLocaleString()} · ${baseline.reason}`:'No baseline yet. Publish a commitment snapshot before comparing variance.'}</p><p className="roadmap-note">Dates use inclusive calendar days. Completion dates use UTC. Edit dates in the inspector. Baselines remain unchanged.</p></>;
}
