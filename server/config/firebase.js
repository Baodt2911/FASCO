import firebase from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  storageBucket: "gs://fasco-a5db7.appspot.com",
});
const bucket = firebase.storage().bucket();
const auth = firebase.auth();
export { bucket, auth };
