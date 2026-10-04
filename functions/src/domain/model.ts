export type Role = 'admin' | 'manager' | 'contributor' | 'viewer';
export type Channel = 'human' | 'agent';
export interface Principal { uid: string; channel: Channel; grantId?: string }
export interface Work {
 id: string; key: string; title: string; description: string; type: 'epic'|'story'|'task'|'bug';
 version: number; semanticVersion: number; status: 'Backlog'|'Ready'|'In progress'|'In review'|'Done'|'Cancelled';
 priority: number; ac: {id: string; text: string}[]; dependencies: string[]; parentId: string|null;
 assignee: string|null; start: string|null; end: string|null; contractId: string|null;
 archived: boolean; blocked: boolean; createdBy: string; createdDate: number; changedBy: string; changedDate: number;
 startedAt: number|null; completedAt: number|null; generation: number;
}
export interface Contract {
 id: string; taskId: string; semanticVersion: number; scope: string; nonGoals: string; repository: string;
 ac: Work['ac']; documents: {id:string; revisionId:string; hash:string}[];
 hash: string; policyVersion: string; createdBy: string; createdDate: number;
}
export interface Claim { executionId:string; taskId:string; contractId:string; contractHash:string; principalUserId:string;
 connectionId:string; generation:number; expiresAt:number; state:string; version:number; createdDate:number; }
export class DomainError extends Error {constructor(public code:string) {super(code);}}
export function ensure(value: unknown, code='FORBIDDEN_OR_NOT_FOUND'): asserts value { if (!value) throw new DomainError(code); }
