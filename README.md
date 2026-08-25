# GymApp

Live app: https://missy-sc.github.io/GymApp/

## Sign in

The app is gated behind Firebase Authentication. Enable **Email/Password** and
**Google** as sign-in providers in the Firebase console
(Authentication → Sign-in method), and add the domain the app is served from to
Authentication → Settings → Authorized domains, otherwise Google sign-in is
rejected with `auth/unauthorized-domain`. Without a Firebase configuration the
app falls back to a local, offline-only mode backed by `localStorage`.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the Firebase web app config
npm run dev
```

Set `VITE_FIREBASE_EMULATORS=true` in `.env.local` to point Auth, Firestore and
Storage at the local emulators (`firebase emulators:start`).

## Deployment

Pushing to `main` builds the app and publishes it to GitHub Pages through
`.github/workflows/deploy.yml`. The workflow reads the Firebase web app config
from the `VITE_FIREBASE_*` repository secrets.

`firebase.json` also carries a ready-to-use Hosting configuration, so the app
can be moved to Firebase Hosting later with:

```bash
npm run build
npx firebase-tools deploy --only hosting
```

Note that a Firebase Hosting build must be made without `VITE_BASE_PATH`, since
it is served from the domain root rather than the `/GymApp/` subpath Pages uses.
