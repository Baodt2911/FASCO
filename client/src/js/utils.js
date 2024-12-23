import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import { auth, onAuthStateChanged } from "./firebase.js";
export const url_api = "http://localhost:3000";
const notification = ({ message, status }) => {
  const notification = document.getElementById("notification");
  const icon = {
    success: '<i class="fa-solid fa-check"></i>',
    warning: '<i class="fa-solid fa-exclamation"></i>',
  };
  notification.classList.remove("hidden-notification");
  notification.innerHTML = `<div class="${status} z-[1000] text-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <!-- Icon -->
            <span class="mr-4">
              ${icon[status]}
            </span>
            <!-- Message -->
            <span class="text-sm message text-white"
              >${message}</span
            >
        </div>`;
  setTimeout(() => {
    notification.classList.add("hidden-notification");
  }, 2500);
};
const isLoggedIn = async () => {
  try {
    const res = await fetch(url_api + "/auth/is-login", {
      method: "GET",
      credentials: "include",
    });
    const { isLogin } = await res.json();
    return isLogin;
  } catch (error) {
    console.error(error);
  }
};
const mutationObserverElement = (element, callback, option) => {
  const mutationObserver = new MutationObserver(callback);
  mutationObserver.observe(element, option);
};
const getProducts = async (path) => {
  try {
    const res = await fetch(url_api + `/product${path}`);
    if (!res.ok) {
      console.log("Không lấy được danh sách sản phẩm");
      return;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
const requestRefreshToken = async () => {
  try {
    const res = await fetch(url_api + "/auth/refresh-token", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { accessToken } = await res.json();
    if (accessToken) {
      window.localStorage.setItem("at", accessToken);
      return accessToken;
    } else {
      await isLoggedIn();
    }
  } catch (error) {
    console.log(error);
  }
};
const parseJwt = (token) => {
  const base64Url = token?.split(".")[1];
  const base64 = base64Url?.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
};
const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }
  const decoded = parseJwt(token);
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};
const getAccessToken = async () => {
  let token = window.localStorage.getItem("at");
  if (!token || isTokenExpired(token)) {
    token = await requestRefreshToken();
  }
  return token;
};
const socket = io(url_api, {
  auth: {
    token: await getAccessToken(),
  },
});
socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
export {
  notification,
  isLoggedIn,
  mutationObserverElement,
  getProducts,
  getAccessToken,
  socket,
  params,
};
