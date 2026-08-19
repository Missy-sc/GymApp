"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncMuscleWiki = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
(0, app_1.initializeApp)();
const muscleWikiKey = (0, params_1.defineSecret)('MUSCLEWIKI_API_KEY');
exports.syncMuscleWiki = (0, https_1.onCall)({ secrets: [muscleWikiKey] }, async (request) => { if (!request.auth)
    throw new https_1.HttpsError('unauthenticated', 'Authentication required'); const response = await fetch('https://api.musclewiki.com/exercises', { headers: { Authorization: `Bearer ${muscleWikiKey.value()}` } }); if (!response.ok)
    throw new https_1.HttpsError('unavailable', 'Catalog provider unavailable'); const rows = await response.json(); const db = (0, firestore_1.getFirestore)(); for (const x of rows) {
    const id = String(x.id);
    await db.collection('exercises').doc(`mw:${id}`).set({ source: 'musclewiki', originalId: id, name: x.name, slug: x.slug, description: x.description ?? '', instructions: x.instructions ?? [], primaryMuscles: x.muscles_primary ?? [], secondaryMuscles: x.muscles_secondary ?? [], bodyPart: x.body_part ?? '', equipment: x.equipment ?? 'None', difficulty: x.difficulty ?? 'Beginner', type: x.exercise_type ?? '', mediaUrl: x.video_url, thumbnail: x.thumbnail_url, mediaPolicy: 'reference-only', syncedAt: new Date().toISOString() }, { merge: true });
} return { synced: rows.length }; });
