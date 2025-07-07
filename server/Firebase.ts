import admin from "firebase-admin";
import { getApps } from "firebase-admin/app";

import serviceAccount from "./serviceAccountKey.json";



if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: "https://eventtracker-1f4f8.firebaseio.com" // For Realtime DB
  });
}

export const db = admin.firestore(); // or admin.database() for Realtime DB
