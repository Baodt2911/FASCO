import { notification, isLoggedIn, url_api } from "./utils.js";
import {
  auth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "./firebase.js";
const isLogin = await isLoggedIn();
console.log(isLogin);

const email = document.getElementById("emailSignIn");
const password = document.getElementById("passwordSignIn");
const btnSignIn = document.getElementById("btn-signIn");
const btnGoogle = document.querySelector(".btn-login-google");
if (isLogin) {
  window.location.assign("/client/public/pages/index.html");
}
const GoogleProvider = new GoogleAuthProvider();

btnGoogle.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, GoogleProvider);
    const token = await result.user.getIdToken();
    const res = await fetch(url_api + "/auth/login/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      credentials: "include",
    });
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
});
const SignIn = () => {
  fetch(url_api + "/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email: email.value, password: password.value }),
  })
    .then((res) => res.json())
    .then(({ user, message, accessToken }) => {
      let status = "success";
      if (!user) {
        status = "warning";
        notification({
          message: message,
          status,
        });
        return;
      }
      localStorage.setItem("at", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      if (status == "success") {
        window.location.assign("/client/public/pages/index.html");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

btnSignIn.addEventListener("click", SignIn);
