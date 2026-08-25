# GymApp

Live app: https://gym-app-263d8.web.app

## Sign in

The app is gated behind Firebase Authentication. Enable **Email/Password** and
**Google** as sign-in providers in the Firebase console
(Authentication → Sign-in method). Without a Firebase configuration the app
falls back to a local, offline-only mode backed by `localStorage`.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the Firebase web app config
npm run dev
```

Set `VITE_FIREBASE_EMULATORS=true` in `.env.local` to point Auth, Firestore and
Storage at the local emulators (`firebase emulators:start`).

## Deployment

Pushing to `main` builds the app and deploys it to Firebase Hosting through
`.github/workflows/deploy.yml`. The workflow needs these repository secrets:

- `FIREBASE_SERVICE_ACCOUNT` — a service account key JSON with the
  *Firebase Hosting Admin* role
- `VITE_FIREBASE_*` — the Firebase web app config used at build time

To deploy by hand instead:

```bash
npm run build
npx firebase-tools deploy --only hosting
```
