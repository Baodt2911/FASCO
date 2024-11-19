// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyCMjvGt8Q0LQX-3PEXPbm8s5Xz0nBR87vY",
  authDomain: "fasco-a5db7.firebaseapp.com",
  databaseURL: "https://fasco-a5db7-default-rtdb.firebaseio.com",
  projectId: "fasco-a5db7",
  storageBucket: "fasco-a5db7.appspot.com",
  messagingSenderId: "582396501234",
  appId: "1:582396501234:web:f77c46f4df4c50303a046b",
  measurementId: "G-W0897XHZKC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
export { auth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged };
