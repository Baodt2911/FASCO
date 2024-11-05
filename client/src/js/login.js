import { notification, isLoggedIn, url_api } from "./utils.js";
const isLogin = await isLoggedIn();
const email = document.getElementById("emailSignIn");
const password = document.getElementById("passwordSignIn");
const btnSignIn = document.getElementById("btn-signIn");
if (isLogin) {
  window.location.assign("/client/public/pages/index.html");
}
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
