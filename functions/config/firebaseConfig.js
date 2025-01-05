// const admin = require('firebase-admin');
// const fs = require('node:fs');
// const serviceAccount = JSON.parse(fs.readFileSync('./firebase-config.json').toString())

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




const admin = require('firebase-admin');
<<<<<<< HEAD
require('dotenv').config();

try {
    console.log(process.env.FIREBASE_SERVICE_ACCOUNT);

    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    if (!serviceAccount) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable not found.  Check your Render settings.");
    }

=======

try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    if (!serviceAccount) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable not found.");
    }
>>>>>>> 6dea253f0f315bd5071ab4f713c75a253ef39968
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
<<<<<<< HEAD
    // Handle the error appropriately for production (e.g., return a 500 error)
    throw error; // Re-throw to prevent silent failure
=======
    // Handle the error appropriately, such as by returning a 500 error to the client.
    throw error; // Re-throw to prevent the application from silently failing.
>>>>>>> 6dea253f0f315bd5071ab4f713c75a253ef39968
}
