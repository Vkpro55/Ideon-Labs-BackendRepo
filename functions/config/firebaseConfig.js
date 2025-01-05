// const admin = require('firebase-admin');
// const fs = require('node:fs');
// const serviceAccount = JSON.parse(fs.readFileSync('./firebase-config.json').toString())
// const serviceAccountString = JSON.stringify(serviceAccount);
// console.log(serviceAccountString);

// console.log(serviceAccount);

// if (!admin.apps.length) {
//     try {
//         admin.initializeApp({
//             /* ===  credential: admin.credential.applicationDefault() === */
//             credential: admin.credential.cert(serviceAccount),
//             /* === databaseURL: process.env.FIREBASE_DATABASE_URL // Add this if needed. === */
//         });
//     } catch (error) {
//         console.error("Firebase Admin SDK initialization error:", error);
//         throw new Error("Error initializing Firebase Admin SDK");
//     }
// } else {
//     admin.app();
// }

// /* === Access Firestore === */
// const db = admin.firestore();

// /* === To define other firebase services like (e.g., Firebase Auth, Firebase Storage) === */
// const auth = admin.auth();

// module.exports = { db, auth };




var admin = require("firebase-admin");
var serviceAccount = require("../firebase-config.json");

try {
    if (!serviceAccount) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable not found.  Check your Render settings.");
    }

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
        admin.app();
    }
    const db = admin.firestore();
    const auth = admin.auth();
    module.exports = { db, auth };
} catch (error) {
    console.error("Error initializing Firebase:", error);
    throw error;
}


// var admin = require("firebase-admin");
// var serviceAccount = require("../firebase-config.json");

// console.log(serviceAccount)

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });
