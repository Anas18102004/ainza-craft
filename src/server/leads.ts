import { getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

import type { LeadInput } from "@/lib/leads";

function ensureFirebaseAdmin() {
  if (!getApps().length) {
    const projectId =
      process.env.FIREBASE_PROJECT_ID ??
      process.env.GCLOUD_PROJECT ??
      process.env.GOOGLE_CLOUD_PROJECT;

    initializeApp(projectId ? { projectId } : undefined);
  }

  return getFirestore();
}

export async function createLead(data: LeadInput) {
  const firestore = ensureFirebaseAdmin();
  const timestamp = FieldValue.serverTimestamp();

  const doc = await firestore.collection("leads").add({
    name: data.name,
    email: data.email,
    company: data.company ?? "",
    serviceInterest: data.serviceInterest,
    budgetRange: data.budgetRange,
    message: data.message,
    sourcePath: data.sourcePath,
    status: "new",
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return doc.id;
}
