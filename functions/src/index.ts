import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

initializeApp();
const workoutXKey = defineSecret('WORKOUTX_API_KEY');
const API_URL = 'https://api.workoutxapp.com/v1/exercises';
const PAGE_SIZE = 10;
const REQUEST_DELAY_MS = 2_100;
const WINDOW_MS = 60_000;
const FRESH_CATALOG_MS = 24 * 60 * 60 * 1_000;

type WorkoutXExercise = Record<string, unknown> & { id?: unknown; name?: unknown; bodyPart?: unknown; target?: unknown; secondaryMuscles?: unknown; equipment?: unknown; instructions?: unknown; gifUrl?: unknown };
type WorkoutXPage = { total?: unknown; count?: unknown; data?: unknown };
const text = (value: unknown, max = 4_000) => typeof value === 'string' ? value.slice(0, max) : '';
const strings = (value: unknown, max = 100) => Array.isArray(value) ? value.slice(0, max).filter((item): item is string => typeof item === 'string').map(item => item.slice(0, 4_000)) : [];
const sleep = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));

async function fetchPage(offset: number): Promise<WorkoutXPage> {
  const url = new URL(API_URL);
  url.searchParams.set('offset', String(offset));
  url.searchParams.set('limit', String(PAGE_SIZE));
  const response = await fetch(url, {headers:{'X-WorkoutX-Key':workoutXKey.value(),Accept:'application/json'}});
  if (response.status === 429) throw new HttpsError('resource-exhausted', 'WorkoutX rate limit reached');
  if (!response.ok) throw new HttpsError('unavailable', `WorkoutX request failed with HTTP ${response.status}`);
  return response.json() as Promise<WorkoutXPage>;
}

export const syncWorkoutX = onCall({secrets:[workoutXKey],timeoutSeconds:540,memory:'512MiB'}, async request => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Authentication required');
  if (request.auth.token.admin !== true) throw new HttpsError('permission-denied', 'Administrator access required');
  const db = getFirestore();
  const gate = db.collection('_sync_state').doc('workoutx');
  const gateResult = await db.runTransaction(async transaction => {
    const prior = await transaction.get(gate);
    const priorData = prior.data();
    const lastSyncAt = priorData?.lastSyncAt?.toMillis?.() ?? 0;
    if (Date.now() - lastSyncAt < FRESH_CATALOG_MS) {
      return {
        imported: Number(priorData?.imported) || 0,
        total: Number(priorData?.total) || 0,
        pages: Number(priorData?.pages) || 0,
      };
    }
    const lastRequestAt = priorData?.lastRequestAt?.toMillis?.() ?? 0;
    if (Date.now() - lastRequestAt < WINDOW_MS) return false;
    transaction.set(gate,{lastRequestAt:FieldValue.serverTimestamp()},{merge:true});
    return true;
  });
  if (gateResult === false) return {imported:0,total:0,pages:0,rateLimited:true};
  if (gateResult !== true) return {...gateResult,rateLimited:false,cached:true};

  const exercises: WorkoutXExercise[] = [];
  let offset = 0;
  let total = Number.POSITIVE_INFINITY;
  let pages = 0;
  while (offset < total) {
    const payload = await fetchPage(offset);
    const data = Array.isArray(payload.data) ? payload.data as WorkoutXExercise[] : [];
    const reportedTotal = Number(payload.total);
    const reportedCount = Number(payload.count);
    if (!Number.isFinite(reportedTotal) || !Number.isFinite(reportedCount) || reportedCount !== data.length) throw new HttpsError('data-loss', 'Unexpected WorkoutX pagination response');
    total = reportedTotal;
    exercises.push(...data);
    pages++;
    if (data.length === 0) break;
    offset += data.length;
    if (offset < total) await sleep(REQUEST_DELAY_MS);
  }

  const normalized = exercises.map(raw => {
    const serialized = JSON.stringify(raw);
    if (serialized.length > 500_000) throw new HttpsError('data-loss', 'WorkoutX exercise exceeds the supported document size');
    return JSON.parse(serialized) as WorkoutXExercise;
  });

  let imported = 0;
  for (let start = 0; start < normalized.length; start += 400) {
    const batch = db.batch();
    for (const raw of normalized.slice(start, start + 400)) {
      const originalId = text(raw.id, 200), name = text(raw.name);
      if (!originalId || !name) continue;
      const bodyPart = text(raw.bodyPart), target = text(raw.target), secondaryMuscles = strings(raw.secondaryMuscles);
      const equipment = text(raw.equipment) || 'Unspecified', instructions = strings(raw.instructions), gifUrl = text(raw.gifUrl);
      batch.set(db.collection('exercises').doc(`wx:${originalId}`), {
        ...raw, id:originalId, source:'workoutx', originalId, name,
        slug:name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''), bodyPart, target,
        primaryMuscles:target?[target]:[], secondaryMuscles, equipment, instructions, gifUrl,
        mediaUrl:gifUrl, thumbnail:gifUrl, mediaPolicy:'reference-only', syncedAt:new Date().toISOString(),
      }, {merge:false});
      imported++;
    }
    await batch.commit();
  }

  await gate.set({lastSyncAt:FieldValue.serverTimestamp(),imported,total,pages},{merge:true});
  return {imported,total,pages,rateLimited:false};
});
