# AINZA Firebase SSR Deployment

This app is prepared for Firebase App Hosting with a Node SSR wrapper and Firestore lead capture.

## Local verification

```bash
npm ci
npm run build:firebase
npm run start:firebase
```

Open `http://localhost:3000`, then verify `/`, `/services`, `/ai-systems`, and `/contact`.

For local Firestore testing, run against a Firebase project or emulator with:

```bash
$env:FIREBASE_PROJECT_ID="ainza-web-1367"
$env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
npm run start:firebase
```

## Firebase setup

1. Create or select project `ainza-web-1367` in Firebase.
2. Enable Firestore in production mode.
3. Deploy locked Firestore rules from `firestore.rules`.
4. Create an App Hosting backend in region `asia-east1`.
5. Connect the repository with app root `main-react/ainza-craft-main`.
6. Use the temporary `hosted.app` URL for v1.

The contact form writes through Firebase Admin on the server. Firestore client rules intentionally deny all public reads and writes.

## Domain

Do not connect `ainza.com` in v1. The domain is registered through GoDaddy, so connect it later only if you control its DNS or after purchasing/choosing an alternative domain.
