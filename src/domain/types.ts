export type ExerciseMode='time'|'reps'|'free';
export interface ExerciseLookup {id:string;code:string;name:string;color?:string}
export interface Exercise {id:string;source?:'seed'|'workoutx';originalId?:string;code?:string;name:string;slug:string;description:string;instructions:string[];primaryMuscles:string[];secondaryMuscles:string[];primaryMuscleDetails?:ExerciseLookup[];secondaryMuscleDetails?:ExerciseLookup[];categories?:ExerciseLookup[];types?:ExerciseLookup[];bodyPart:string;target?:string;equipment:string;apparatus?:string[];difficulty:'Beginner'|'Intermediate'|'Advanced'|'Unspecified'|string;type:string;category?:string;met?:number;caloriesPerMinute?:number;recommendedSets?:string;recommendedReps?:string;movement_tags?:string[];gifUrl?:string;mechanic?:string;force?:string;mediaUrl?:string;thumbnail?:string;mediaPolicy?:'reference-only'|'cache-allowed'|'none'}
export interface RoutineExercise {uid:string;exerciseId:string;mode:ExerciseMode;duration:number;reps:number}
export interface RoutineBlock {id:string;name:string;rounds:number;restBetweenExercises:number;restBetweenRounds:number;restAfterBlock:number;exercises:RoutineExercise[]}
export const ROUTINE_CATEGORIES=['Full body','Strength','Cardio','HIIT','Mobility','Flexibility','Core','Upper body','Lower body','Legs','Glutes','Back','Chest','Shoulders','Arms','Recovery','Functional','Other'] as const;
export type RoutineCategory=typeof ROUTINE_CATEGORIES[number];
export interface Routine {id:string;userId:string;name:string;category?:RoutineCategory|string;imageUrl?:string;blocks:RoutineBlock[];createdAt:string;updatedAt:string}
export interface GymClass {id:string;userId:string;title:string;description:string;focusAreas:string[];category:RoutineCategory|string;instructorName:string;imageUrl?:string;createdAt:string;updatedAt:string}
export interface CalendarAssignment {kind:'routine'|'class';itemId:string}
export type Phase='PREPARING'|'EXERCISE'|'REST_BETWEEN_EXERCISES'|'REST_BETWEEN_ROUNDS'|'REST_BETWEEN_BLOCKS'|'PAUSED'|'WAITING_FOR_MANUAL_CONTINUE'|'COMPLETED';
export interface WorkoutState {phase:Phase;previousPhase?:Phase;blockIndex:number;roundIndex:number;exerciseIndex:number;remaining:number;elapsed:number;autoAdvance:boolean;completedExercises:number;startedAt:string;lastTickAt:string}
export interface WorkoutSession {id:string;routineId:string;routineName:string;startedAt:string;endedAt?:string;duration:number;completedExercises:number;completedBlocks:number;status:'active'|'completed'|'abandoned';state?:WorkoutState}
export const THEMES=['electric-navy','petrol-coral','violet-lavender','carbon-orange','burgundy-rose','night-cyan','turquoise-mango','indigo-fuchsia','cobalt-lime','plum-coral','cyan-violet','raspberry-peach','midnight-yellow','teal-bubblegum'] as const;
export type Theme=typeof THEMES[number];
export interface Preferences {sounds:boolean;vibration:boolean;countdown:boolean;voice:boolean;autoAdvance:boolean;theme:Theme}
