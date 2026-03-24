import * as admin from 'firebase-admin';

// Initialize the Firebase admin app
// It automatically discovers service account credentials in standard environments
if (!admin.apps.length) {
    admin.initializeApp();
}

export const db = admin.firestore();
export const auth = admin.auth();
export const messaging = admin.messaging();
