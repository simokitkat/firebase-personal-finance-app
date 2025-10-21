import admin from "firebase-admin";
import { Buffer } from "buffer"; // Node.js Buffer

const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!admin.apps.length) {
  if (!serviceAccountBase64) {
    throw new Error(
      "Firebase service account key is not set in environment variables. Make sure FIREBASE_SERVICE_ACCOUNT is in your .env.local file."
    );
  }
  try {
    // Decode the Base64 string back into the JSON object
    const serviceAccountJson = Buffer.from(
      serviceAccountBase64,
      "base64"
    ).toString("utf-8");
    const serviceAccount = JSON.parse(serviceAccountJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK Initialized Successfully.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Firebase Admin Initialization Error:", error.message);

      if (process.env.NODE_ENV !== "production") {
        console.error(error.stack);
      }
    }
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore(); // for server-side Firestore access
export default admin;
