import firebase from "firebase-admin";
import { readFileSync } from "fs";
const serviceAccount = JSON.parse(
  readFileSync(new URL("../serviceAccountKey.json", import.meta.url))
);
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  storageBucket: "gs://fasco-a5db7.appspot.com",
});
const bucket = firebase.storage().bucket();
const auth = firebase.auth();
export { bucket, auth };
