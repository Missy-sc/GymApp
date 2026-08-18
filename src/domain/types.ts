export type ExerciseMode='time'|'reps'|'free';
export interface Exercise {id:string;originalId?:string;name:string;slug:string;description:string;instructions:string[];primaryMuscles:string[];secondaryMuscles:string[];bodyPart:string;equipment:string;difficulty:'Beginner'|'Intermediate'|'Advanced';type:string;mechanic?:string;force?:string;mediaUrl?:string;thumbnail?:string;mediaPolicy?:'reference-only'|'cache-allowed'}
export interface RoutineExercise {uid:string;exerciseId:string;mode:ExerciseMode;duration:number;reps:number}
export interface RoutineBlock {id:string;name:string;rounds:number;restBetweenExercises:number;restBetweenRounds:number;restAfterBlock:number;exercises:RoutineExercise[]}
export interface Routine {id:string;userId:string;name:string;blocks:RoutineBlock[];createdAt:string;updatedAt:string}
export type Phase='PREPARING'|'EXERCISE'|'REST_BETWEEN_EXERCISES'|'REST_BETWEEN_ROUNDS'|'REST_BETWEEN_BLOCKS'|'PAUSED'|'WAITING_FOR_MANUAL_CONTINUE'|'COMPLETED';
export interface WorkoutState {phase:Phase;previousPhase?:Phase;blockIndex:number;roundIndex:number;exerciseIndex:number;remaining:number;elapsed:number;autoAdvance:boolean;completedExercises:number;startedAt:string;lastTickAt:string}
export interface WorkoutSession {id:string;routineId:string;routineName:string;startedAt:string;endedAt?:string;duration:number;completedExercises:number;completedBlocks:number;status:'active'|'completed'|'abandoned';state?:WorkoutState}
export interface Preferences {sounds:boolean;vibration:boolean;countdown:boolean;voice:boolean;autoAdvance:boolean}
