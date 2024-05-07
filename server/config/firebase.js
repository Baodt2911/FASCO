import firebase from "firebase-admin";
import serviceAccount from "../key_account/serviceAccountKey.json" assert { type: "json" };
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  storageBucket: "gs://fasco-a5db7.appspot.com",
});

const bucket = firebase.storage().bucket();

// Upload a file to Firebase Storage
async function uploadFile() {
  try {
    await bucket.upload(
      "https://d1hjkbq40fs2x4.cloudfront.net/2016-01-31/files/1045.jpg",
      {
        destination: "photos/" + "anh.jpg",
      }
    );
    console.log("File uploaded successfully.");
  } catch (error) {
    console.log(error);
  }
}
