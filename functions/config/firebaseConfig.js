const admin = require('firebase-admin');
const fs = require('node:fs');
const serviceAccount = JSON.parse(fs.readFileSync('./firebase-config.json').toString())


if (!admin.apps.length) {
    try {
        admin.initializeApp({
            /* ===  credential: admin.credential.applicationDefault() === */
            credential: admin.credential.cert(serviceAccount),
            /* === databaseURL: process.env.FIREBASE_DATABASE_URL // Add this if needed. === */
        });
    } catch (error) {
        console.error("Firebase Admin SDK initialization error:", error);
        throw new Error("Error initializing Firebase Admin SDK");
    }
} else {
    admin.app();
}

/* === Access Firestore === */
const db = admin.firestore();

/* === To define other firebase services like (e.g., Firebase Auth, Firebase Storage) === */
const auth = admin.auth();

module.exports = { db, auth };

