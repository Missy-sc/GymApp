import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously, signOut, type User } from 'firebase/auth';
import type { CalendarAssignment, GymClass, Preferences, Routine, WorkoutSession } from '../domain/types';
import { auth, db } from './firebase';
import { store } from './storage';

export interface AppRepositories {
  routines: { list(userId:string):Promise<Routine[]>; save(value:Routine):Promise<void>; remove(id:string):Promise<void> };
  gymClasses: { list(userId:string):Promise<GymClass[]>; save(value:GymClass):Promise<void>; remove(id:string):Promise<void> };
  schedule: { get(userId:string):Promise<Record<string,CalendarAssignment>>; save(userId:string,value:Record<string,CalendarAssignment>):Promise<void> };
  sessions: { list(userId:string):Promise<WorkoutSession[]>; save(value:WorkoutSession,userId:string):Promise<void> };
  preferences: { get(userId:string):Promise<Preferences>; save(userId:string,value:Preferences):Promise<void> };
}

export const localRepositories:AppRepositories={
  routines:{list:async()=>store.routines(),save:async value=>store.saveRoutines([...store.routines().filter(item=>item.id!==value.id),value]),remove:async id=>store.saveRoutines(store.routines().filter(item=>item.id!==id))},
  gymClasses:{list:async()=>store.gymClasses(),save:async value=>store.saveGymClasses([...store.gymClasses().filter(item=>item.id!==value.id),value]),remove:async id=>store.saveGymClasses(store.gymClasses().filter(item=>item.id!==id))},
  schedule:{get:async()=>store.schedule(),save:async(_,value)=>store.saveSchedule(value)},
  sessions:{list:async()=>store.sessions(),save:async value=>store.saveSessions([...store.sessions().filter(item=>item.id!==value.id),value])},
  preferences:{get:async()=>store.preferences(),save:async(_,value)=>store.savePreferences(value)},
};

const remoteDb=db;
export const firestoreRepositories:AppRepositories=remoteDb?{
  routines:{list:async userId=>(await getDocs(query(collection(remoteDb,'routines'),where('userId','==',userId)))).docs.map(row=>row.data() as Routine),save:async value=>void await setDoc(doc(remoteDb,'routines',value.id),value),remove:async id=>void await deleteDoc(doc(remoteDb,'routines',id))},
  gymClasses:{list:async userId=>(await getDocs(query(collection(remoteDb,'gym_classes'),where('userId','==',userId)))).docs.map(row=>row.data() as GymClass),save:async value=>void await setDoc(doc(remoteDb,'gym_classes',value.id),value),remove:async id=>void await deleteDoc(doc(remoteDb,'gym_classes',id))},
  schedule:{get:async userId=>{const row=await getDoc(doc(remoteDb,'user_schedules',userId));return(row.data()?.assignments as Record<string,CalendarAssignment>)??{}},save:async(userId,value)=>void await setDoc(doc(remoteDb,'user_schedules',userId),{userId,assignments:value,updatedAt:new Date().toISOString()})},
  sessions:{list:async userId=>(await getDocs(query(collection(remoteDb,'workout_sessions'),where('userId','==',userId)))).docs.map(row=>row.data() as WorkoutSession),save:async(value,userId)=>void await setDoc(doc(remoteDb,'workout_sessions',value.id),{...value,userId})},
  preferences:{get:async userId=>{const rows=await getDocs(query(collection(remoteDb,'user_preferences'),where('userId','==',userId)));return(rows.docs[0]?.data() as Preferences)??store.preferences()},save:async(userId,value)=>void await setDoc(doc(remoteDb,'user_preferences',userId),{...value,userId})},
}:localRepositories;

export const authService={
  subscribe(callback:(user:User|null)=>void){return auth?onAuthStateChanged(auth,callback):(callback(null),()=>{})},
  async signInGuest(){return auth?(await signInAnonymously(auth)).user:null},
  async signOut(){if(auth)await signOut(auth)},
};
