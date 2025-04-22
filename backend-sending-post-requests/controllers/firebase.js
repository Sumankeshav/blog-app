const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fun-code-24e3f.firebaseio.com",
});
const db = admin.firestore();
module.exports = db;
