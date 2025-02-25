const admin = require('firebase-admin');

try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    if (!serviceAccount) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable not set. Check Render settings.");
    }

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } else {
        admin.app();
    }

    const db = admin.firestore();
    const auth = admin.auth();
    module.exports = { db, auth };
} catch (error) {
    console.error("Error initializing Firebase:", error);
    process.exit(1); 
}

