"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncMuscleWiki = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
(0, app_1.initializeApp)();
const muscleWikiKey = (0, params_1.defineSecret)('MUSCLEWIKI_API_KEY');
const PAGE_SIZE = 100;
const WINDOW_MS = 60_000;
const text = (v, f = '') => typeof v === 'string' ? v.slice(0, 4000) : f;
const strings = (v) => Array.isArray(v) ? v.filter(x => typeof x === 'string').slice(0, 30) : [];
exports.syncMuscleWiki = (0, https_1.onCall)({ secrets: [muscleWikiKey], timeoutSeconds: 120 }, async (request) => { if (!request.auth)
    throw new https_1.HttpsError('unauthenticated', 'Authentication required'); const db = (0, firestore_1.getFirestore)(), gate = db.collection('_sync_state').doc('musclewiki'); const allowed = await db.runTransaction(async (tx) => { const prior = await tx.get(gate), last = prior.data()?.lastRequestAt?.toMillis?.() ?? 0; if (Date.now() - last < WINDOW_MS)
    return false; tx.set(gate, { lastRequestAt: firestore_1.FieldValue.serverTimestamp() }, { merge: true }); return true; }); if (!allowed)
    return { synced: 0, rateLimited: true }; const cursor = text(request.data?.cursor); const url = new URL('https://api.musclewiki.com/exercises'); url.searchParams.set('limit', String(PAGE_SIZE)); if (cursor)
    url.searchParams.set('cursor', cursor); const response = await fetch(url, { headers: { Authorization: `Bearer ${muscleWikiKey.value()}`, 'Accept': 'application/json' } }); if (response.status === 429)
    throw new https_1.HttpsError('resource-exhausted', 'Provider rate limit reached'); if (!response.ok)
    throw new https_1.HttpsError('unavailable', 'Catalog provider unavailable'); const payload = await response.json(); const rows = Array.isArray(payload) ? payload : Array.isArray(payload.results) ? payload.results : []; const batch = db.batch(); let synced = 0; for (const raw of rows.slice(0, PAGE_SIZE)) {
    if (!raw || typeof raw !== 'object')
        continue;
    const x = raw, id = text(x.id);
    if (!id || !text(x.name))
        continue;
    batch.set(db.collection('exercises').doc(`mw:${id}`), { source: 'musclewiki', originalId: id, name: text(x.name), slug: text(x.slug), description: text(x.description), instructions: strings(x.instructions), primaryMuscles: strings(x.muscles_primary), secondaryMuscles: strings(x.muscles_secondary), bodyPart: text(x.body_part), equipment: text(x.equipment, 'None'), difficulty: text(x.difficulty, 'Beginner'), type: text(x.exercise_type), mediaUrl: text(x.video_url), thumbnail: text(x.thumbnail_url), mediaPolicy: 'reference-only', syncedAt: new Date().toISOString() }, { merge: true });
    synced++;
} if (synced)
    await batch.commit(); const nextCursor = !Array.isArray(payload) ? text(payload.next_cursor) : ''; await gate.set({ lastSyncAt: firestore_1.FieldValue.serverTimestamp(), nextCursor: nextCursor || null, synced }, { merge: true }); return { synced, nextCursor: nextCursor || undefined, rateLimited: false }; });
