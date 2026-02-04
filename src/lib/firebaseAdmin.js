import admin from "firebase-admin";

let adminDb = null;
let adminAuth = null;

// Only initialize if we have the required credentials
const hasCredentials =
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY;

if (hasCredentials && !admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
        adminDb = admin.firestore();
        adminAuth = admin.auth();
    } catch (error) {
        console.error("Firebase Admin Initialization Error:", error);
    }
} else if (!hasCredentials) {
    console.warn("Firebase Admin credentials missing. Admin features disabled.");
}

export { adminDb, adminAuth };
