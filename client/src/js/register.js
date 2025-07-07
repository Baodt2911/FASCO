import { auth, GoogleAuthProvider, signInWithPopup } from "./firebase.js";
import { notification, isLoggedIn, url_api } from "./utils.js";
const isLogin = await isLoggedIn();
const btnSendOtp = document.querySelector(".btn-send_otp");
const btnCreateAccount = document.getElementById("btn-create-account");
const firstName = document.querySelector(".first_name");
const lastName = document.querySelector(".last_name");
const phone = document.querySelector(".phone");
const email = document.getElementById("emailSignUp");
const otp = document.querySelector(".verification-code");
const password = document.querySelector(".password");
const confirmPassword = document.querySelector(".confirm-password");
const btnShowPassword = document.querySelector(".show-password");
const btnShowConfirmPassword = document.querySelector(".show-confirm-password");
const btnGoogle = document.querySelector(".btn-login-google");
if (isLogin) {
  window.location.href = "index.html";
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
    const { message, accessToken } = await res.json();
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
    if (status == "success") {
      window.location.href = "index.html";
    }
  } catch (error) {
    console.log(error);
  }
});
btnShowPassword.addEventListener("click", () => {
  if (password.type == "password") {
    password.type = "text";
    btnShowPassword.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
  } else {
    password.type = "password";
    btnShowPassword.innerHTML = '<i class="fa-regular fa-eye"></i>';
  }
});
btnShowConfirmPassword.addEventListener("click", () => {
  if (confirmPassword.type == "password") {
    confirmPassword.type = "text";
    btnShowConfirmPassword.innerHTML =
      '<i class="fa-regular fa-eye-slash"></i>';
  } else {
    confirmPassword.type = "password";
    btnShowConfirmPassword.innerHTML = '<i class="fa-regular fa-eye"></i>';
  }
});
confirmPassword.addEventListener("input", (e) => {
  if (!(e.target.value == password.value)) {
    password.parentElement.classList.add("border-red-500");
    e.target.parentElement.classList.add("border-red-500");
  } else {
    password.parentElement.classList.remove("border-red-500");
    e.currentTarget.parentElement.classList.remove("border-red-500");
  }
});
const sendOtp = () => {
  if (!email.value) {
    return;
  }
  fetch(url_api + "/otp/send-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email.value }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((error) => {
      console.log(error);
    });
};
const isInfor = () => {
  return !!(
    firstName.value &&
    lastName.value &&
    email.value &&
    otp.value &&
    phone.value &&
    password.value == confirmPassword.value
  );
};

const createAccount = () => {
  if (!isInfor()) {
    notification({
      message: "Check information",
      status: "warning",
    });
    return;
  }
  fetch(url_api + "/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
      otp: otp.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      notification({
        message: data.message,
        status: "success",
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
btnCreateAccount.addEventListener("click", createAccount);
btnSendOtp.addEventListener("click", sendOtp);
