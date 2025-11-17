require("dotenv").config({quiet: true});
const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_RTDB_CRED);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_RTDB_URL
});
module.exports = admin.database();