const admin = require("firebase-admin");
const serviceAccount = require("./src/config/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const adminUid = "o9h7yv1N58fEiFRpAuMApiyKo0B2";

admin.auth().setCustomUserClaims(adminUid, { role: "admin" })
  .then(() => console.log("Admin role assigned successfully!"))
  .catch(console.error);
 