import type { CalendarAssignment, Exercise, GymClass, Preferences, Routine, WorkoutSession } from '../domain/types';
import { exercises as seed, setExerciseCatalog } from '../data/exercises';
import type { User } from 'firebase/auth';
import { firestoreRepositories, localRepositories, type AppRepositories } from './repositories';
import { FirestoreCatalogCache } from './workoutX';

export interface RuntimeData { userId:string; repositories:AppRepositories; catalog:Exercise[]; remote:boolean }
export async function initializeRuntime(user:User|null):Promise<RuntimeData>{
  if(!user)return{userId:'local-user',repositories:localRepositories,catalog:seed,remote:false};
  const cache=new FirestoreCatalogCache();
  const catalog=await cache.list();
  if(!catalog.length) throw new Error('The exercise catalog is empty.');
  setExerciseCatalog(catalog);
  return{userId:user.uid,repositories:firestoreRepositories,catalog,remote:true};
}
export async function hydrateRuntime(runtime:RuntimeData){const[routines,gymClasses,schedule,sessions,preferences]=await Promise.all([runtime.repositories.routines.list(runtime.userId),runtime.repositories.gymClasses.list(runtime.userId),runtime.repositories.schedule.get(runtime.userId),runtime.repositories.sessions.list(runtime.userId),runtime.repositories.preferences.get(runtime.userId)]);return{routines:routines.map(r=>({...r,userId:runtime.userId})),gymClasses,schedule,sessions,preferences};}
export const persistRoutine=(runtime:RuntimeData,r:Routine)=>runtime.repositories.routines.save({...r,userId:runtime.userId});
export const persistSession=(runtime:RuntimeData,s:WorkoutSession)=>runtime.repositories.sessions.save(s,runtime.userId);
export const persistPreferences=(runtime:RuntimeData,p:Preferences)=>runtime.repositories.preferences.save(runtime.userId,p);
export const persistGymClass=(runtime:RuntimeData,value:GymClass)=>runtime.repositories.gymClasses.save({...value,userId:runtime.userId});
export const persistSchedule=(runtime:RuntimeData,value:Record<string,CalendarAssignment>)=>runtime.repositories.schedule.save(runtime.userId,value);


