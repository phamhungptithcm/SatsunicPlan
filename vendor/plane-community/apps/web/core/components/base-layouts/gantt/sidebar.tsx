/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 * HunpeoLabs adaptation: Firebase-fed items; removes Plane issue-store/DnD/pagination bindings.
 * Source: apps/web/core/components/base-layouts/gantt/sidebar.tsx at pinned v1.4.2.
 */
import type {ReactNode} from 'react';
import {observer} from 'mobx-react';
import type {IBaseLayoutsBaseItem} from '@plane/types';
import {useTimeLineChartStore} from '@hws/plane-adapter';
type Props<T extends IBaseLayoutsBaseItem>={blockIds:string[];showAllBlocks?:boolean;items:Record<string,T>;renderItem:(item:T)=>ReactNode};
export const BaseGanttSidebar=observer(function BaseGanttSidebar<T extends IBaseLayoutsBaseItem>({blockIds,showAllBlocks=false,items,renderItem}:Props<T>){
 const {getBlockById}=useTimeLineChartStore();
 return <div>{blockIds.map(blockId=>{const block=getBlockById(blockId),item=items[blockId];const isBlockVisibleOnSidebar=block?.start_date&&block?.target_date;
  if(!block||(!showAllBlocks&&!isBlockVisibleOnSidebar)||!item)return null;
  return <div className="roadmap-row" key={blockId}>{renderItem(item)}</div>;
 })}</div>;
});
