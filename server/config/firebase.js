import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    storageBucket: "fasco-a5db7.appspot.com",
  });
}

const bucket = admin.storage().bucket();
const auth = admin.auth();

export { bucket, auth };
