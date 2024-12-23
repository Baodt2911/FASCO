import utils from "./utils.js";
utils.isLoggedIn();
const btnLogin = document.querySelector(".btn-login");
const email = document.getElementById("email");
const password = document.getElementById("password");
const currentUrl = utils.getCurrentUrl();
btnLogin.addEventListener("click", async (e) => {
  if (!(email.value || password.value)) {
    return;
  }
  e.preventDefault();
  try {
    const res = await fetch(currentUrl + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.message == "Email is invalid!") {
        email.classList.add("is-invalid");
      }
      if (data.message == "Password is invalid!") {
        password.classList.add("is-invalid");
      }
    } else {
      const { admin } = utils.parseJwt(data.accessToken);
      if (admin) {
        utils.isLoggedIn();
        window.localStorage.setItem("at", data.accessToken);
      } else {
        await utils.logout();
        utils.showNotification({
          message: "Bạn không có quyền truy cập",
          status: "warning",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});
