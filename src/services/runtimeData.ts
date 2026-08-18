import type { Exercise, Preferences, Routine, WorkoutSession } from '../domain/types';
import { exercises as seed, setExerciseCatalog } from '../data/exercises';
import { authService, firestoreRepositories, localRepositories, type AppRepositories } from './repositories';
import { FirestoreCatalogCache, MuscleWikiCatalog } from './muscleWiki';

export interface RuntimeData { userId:string; repositories:AppRepositories; catalog:Exercise[]; remote:boolean }
export async function initializeRuntime():Promise<RuntimeData>{
  const user=await authService.signInGuest().catch(()=>null);
  if(!user)return{userId:'local-user',repositories:localRepositories,catalog:seed,remote:false};
  const cache=new FirestoreCatalogCache();
  const catalog=await cache.list().catch(()=>[]);setExerciseCatalog(catalog.length?catalog:seed);
  const adapter=new MuscleWikiCatalog(cache);
  if(await adapter.shouldSync().catch(()=>false)){let cursor:string|undefined;for(let page=0;page<5;page++){const result=await adapter.sync(cursor).catch(()=>null);if(!result||result.rateLimited||!result.nextCursor)break;cursor=result.nextCursor}const refreshed=await adapter.read().catch(()=>[]);if(refreshed.length){catalog.splice(0,catalog.length,...refreshed);setExerciseCatalog(refreshed)}}
  return{userId:user.uid,repositories:firestoreRepositories,catalog:catalog.length?catalog:seed,remote:true};
}
export async function hydrateRuntime(runtime:RuntimeData){const[routines,sessions,preferences]=await Promise.all([runtime.repositories.routines.list(runtime.userId),runtime.repositories.sessions.list(runtime.userId),runtime.repositories.preferences.get(runtime.userId)]);return{routines:routines.map(r=>({...r,userId:runtime.userId})),sessions,preferences};}
export const persistRoutine=(runtime:RuntimeData,r:Routine)=>runtime.repositories.routines.save({...r,userId:runtime.userId});
export const persistSession=(runtime:RuntimeData,s:WorkoutSession)=>runtime.repositories.sessions.save(s,runtime.userId);
export const persistPreferences=(runtime:RuntimeData,p:Preferences)=>runtime.repositories.preferences.save(runtime.userId,p);


