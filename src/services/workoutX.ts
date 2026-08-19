import {collection,getDocs,orderBy,query} from 'firebase/firestore';
import type {Exercise} from '../domain/types';
import {db} from './firebase';
export class FirestoreCatalogCache{async list(){if(!db)return[];const snap=await getDocs(query(collection(db,'exercises'),orderBy('name')));return snap.docs.map(d=>({id:d.id,...d.data()} as Exercise)).filter(valid)}}
const valid=(exercise:Exercise)=>Boolean(exercise.source==='workoutx'&&exercise.id&&exercise.name&&Array.isArray(exercise.primaryMuscles)&&Array.isArray(exercise.secondaryMuscles));
