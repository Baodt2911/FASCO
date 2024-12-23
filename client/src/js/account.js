import { getAccessToken, isLoggedIn, notification, url_api } from "./utils.js";
const isLogin = await isLoggedIn();
if (!isLogin) {
  window.location.href = "SignIn.html";
}
const fullName = document.getElementById("full-name");
const email = document.getElementById("email");
const mobileNumber = document.getElementById("mobile-number");
const firstNameModal = document.getElementById("first-name-modal-edit");
const lastNameModal = document.getElementById("last-name-modal-edit");
const emailModal = document.getElementById("email-modal-edit");
const mobileNumberModal = document.getElementById("mobile-number-modal-edit");
const btnSaveModalDetails = document.getElementById("btn-save-modal-details");
const btnSaveModalPassword = document.getElementById("btn-save-modal-password");
const currentPassword = document.getElementById("current-password");
const newPassword = document.getElementById("new-password");
const confirmPassword = document.getElementById("confirm-password");
const btnShowPassword = document.querySelectorAll(".btn-show-password");
btnShowPassword.forEach((item) => {
  item.addEventListener("click", (e) => {
    const type = e.currentTarget.parentElement
      .querySelector("input")
      .getAttribute("type");
    if (type === "password") {
      e.currentTarget.parentElement
        .querySelector("input")
        .setAttribute("type", "text");
      e.currentTarget.innerHTML = '<i class="fa-regular fa-eye"></i>';
    } else {
      e.currentTarget.parentElement
        .querySelector("input")
        .setAttribute("type", "password");
      e.currentTarget.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
    }
  });
});
const getInfoUser = async () => {
  try {
    const res = await fetch(url_api + "/auth/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    });
    const { message, user } = await res.json();
    firstNameModal.value = user?.firstName;
    lastNameModal.value = user?.lastName;
    fullName.textContent = `${user?.firstName} ${user?.lastName}`;
    email.textContent = user?.email;
    emailModal.value = user?.email;
    mobileNumber.textContent = user?.phone || "";
    mobileNumberModal.value = user?.phone || "";
  } catch (error) {
    console.log(error);
  }
};
await getInfoUser();
btnSaveModalDetails.addEventListener("click", async () => {
  try {
    const res = await fetch(url_api + "/auth/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify({
        firstName: firstNameModal.value,
        lastName: lastNameModal.value,
        phone: mobileNumberModal.value,
      }),
    });
    const { message, user } = await res.json();
    if (!res.ok) {
      return notification({ message, status: "warning" });
    }
    notification({ message, status: "success" });
    fullName.textContent = `${user?.firstName} ${user?.lastName}`;
    email.textContent = user?.email;
    mobileNumber.textContent = user?.phone || "";
    closeModalDetails();
  } catch (error) {
    console.log(error);
  }
});
newPassword.addEventListener("input", (e) => {
  if (e.target.value.length < 8) {
    newPassword.classList.remove("border-gray-300");
    newPassword.classList.add("border-red-500");
    newPassword.style.outlineColor = "red";
    e.currentTarget.parentElement.parentElement.querySelector("p").textContent =
      "Too short.Your password needs to be at least 8 characters";
    e.currentTarget.parentElement.parentElement.querySelector("p").style.color =
      "red";
  } else {
    newPassword.classList.remove("border-red-500");
    newPassword.classList.add("border-gray-300");
    newPassword.style.outlineColor = "black";
    e.currentTarget.parentElement.parentElement.querySelector("p").textContent =
      "Strong password.";
    e.currentTarget.parentElement.parentElement.querySelector("p").style.color =
      "green";
  }
});
confirmPassword.addEventListener("input", (e) => {
  if (e.target.value != newPassword.value) {
    confirmPassword.classList.remove("border-gray-300");
    confirmPassword.classList.add("border-red-500");
    confirmPassword.style.outlineColor = "red";
    e.currentTarget.parentElement.parentElement
      .querySelector("p")
      .classList.remove("hidden");
  } else {
    confirmPassword.classList.remove("border-red-500");
    confirmPassword.classList.add("border-gray-300");
    confirmPassword.style.outlineColor = "black";
    e.currentTarget.parentElement.parentElement
      .querySelector("p")
      .classList.add("hidden");
  }
});

currentPassword.addEventListener("input", (e) => {
  if (!!e.target.value) {
    currentPassword.classList.remove("border-red-500");
    currentPassword.classList.add("border-gray-300");
    currentPassword.style.outlineColor = "black";
  }
});
const validatePassword = () => {
  if (!currentPassword.value) {
    currentPassword.classList.remove("border-gray-300");
    currentPassword.classList.add("border-red-500");
    currentPassword.style.outlineColor = "red";
    return true;
  }
  if (!newPassword.value) {
    newPassword.classList.remove("border-gray-300");
    newPassword.classList.add("border-red-500");
    newPassword.style.outlineColor = "red";
    return true;
  }
  if (newPassword.value.length < 8) {
    return true;
  }
  if (!!(newPassword.value != confirmPassword.value)) {
    return true;
  }
  return false;
};
btnSaveModalPassword.addEventListener("click", async () => {
  if (validatePassword()) {
    return;
  }
  try {
    const res = await fetch(url_api + "/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify({
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      }),
    });
    const { message } = await res.json();
    if (!res.ok) {
      currentPassword.parentElement.parentElement.querySelector(
        "p"
      ).textContent = message;
      currentPassword.parentElement.parentElement
        .querySelector("p")
        .classList.remove("hidden");
      return notification({ message, status: "warning" });
    }
    notification({ message, status: "success" });
    closeModalPassword();
  } catch (error) {
    console.log(error);
  }
});
