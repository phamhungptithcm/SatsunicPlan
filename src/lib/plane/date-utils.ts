import {clsx,type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
/** Small adapter surface required by imported Plane Gantt helpers; calendar days, never elapsed 24h. */
export const cn=(...values:ClassValue[])=>twMerge(clsx(values));
export const calendarDay=(date:Date)=>Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000;
export function getDate(value:string|Date|null|undefined):Date|undefined {
 if(!value)return undefined;
 if(value instanceof Date)return Number.isFinite(value.valueOf())?new Date(value):undefined;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return undefined;
 const [y,m,d]=value.split('-').map(Number),result=new Date(y,m-1,d);
 return result.getFullYear()===y&&result.getMonth()===m-1&&result.getDate()===d?result:undefined;
}
export const addDaysToDate=(value:Date|string,days:number)=>{const result=getDate(value);if(result)result.setDate(result.getDate()+days);return result;};
export const findTotalDaysInRange=(start:Date,end:Date,inclusive=true)=>calendarDay(end)-calendarDay(start)+(inclusive?1:0);
export const dateOnly=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
