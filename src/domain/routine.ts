import type {Routine,RoutineBlock,RoutineExercise} from './types';
export const id=()=>crypto.randomUUID();
export const newExercise=(exerciseId='trx-row'):RoutineExercise=>({uid:id(),exerciseId,mode:'time',duration:45,reps:10});
export const newBlock=(index=0):RoutineBlock=>({id:id(),name:`Block ${index+1}`,rounds:3,restBetweenExercises:15,restBetweenRounds:30,restAfterBlock:120,exercises:[newExercise(index?'trx-press':'trx-row'),newExercise(index?'mountain':'push-up')]});
export const sampleRoutine=():Routine=>({id:id(),userId:'local-user',name:'Full Body Flow',blocks:[newBlock(0),newBlock(1)],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
export function estimateRoutine(r:Routine){let seconds=0;for(const b of r.blocks){const active=b.exercises.reduce((n,e)=>n+(e.mode==='time'?e.duration:e.mode==='reps'?e.reps*3:30),0);seconds+=(active+b.restBetweenExercises*Math.max(0,b.exercises.length-1))*b.rounds+b.restBetweenRounds*Math.max(0,b.rounds-1)+b.restAfterBlock;}return seconds}
export const move=<T,>(items:T[],from:number,to:number)=>{const next=[...items];const [item]=next.splice(from,1);next.splice(to,0,item);return next};
