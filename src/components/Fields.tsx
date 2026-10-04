import {cloneElement,useId,type ReactElement,type ReactNode} from 'react';
export function Field({label,children,hint}:{label:string;children:ReactElement;hint?:string}){
 const id=useId(),description=hint?`${id}-hint`:undefined;
 return <div className="field"><label htmlFor={id}>{label}</label>{cloneElement(children as ReactElement<{id:string;'aria-describedby'?:string}>,{id,'aria-describedby':description})}{hint&&<small id={description}>{hint}</small>}</div>;
}
export function Badge({children}:{children:ReactNode}){return <span className="badge">{children}</span>;}
export function Empty({children}:{children:ReactNode}){return <p className="empty">{children}</p>;}
