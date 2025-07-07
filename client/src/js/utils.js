import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
export const url_api =
  window.location.hostname == "localhost"
    ? "http://localhost:3000"
    : "https://fasco.onrender.com";

const notification = ({ message, status, duration = 3000 }) => {
  // Tạo notification container nếu chưa có
  let notificationContainer = document.getElementById("notification-container");
  if (!notificationContainer) {
    notificationContainer = document.createElement("div");
    notificationContainer.id = "notification-container";
    notificationContainer.className = "notification-container";
    document.body.appendChild(notificationContainer);
  }

  // Tạo notification element
  const notificationElement = document.createElement("div");

  // Icon theo status
  const config = {
    success: {
      icon: "✓",
    },
    warning: {
      icon: "⚠",
    },
    error: {
      icon: "✕",
    },
    info: {
      icon: "ℹ",
    },
  };

  const currentConfig = config[status] || config.info;

  // Thêm classes
  notificationElement.className = `notification notification-${status}`;

  notificationElement.innerHTML = `
    <div class="notification-icon">
      ${currentConfig.icon}
    </div>
    <div class="notification-message">
      ${message}
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">
      ×
    </button>
  `;

  // Thêm progress bar
  const progressBar = document.createElement("div");
  progressBar.className = "notification-progress";
  notificationElement.appendChild(progressBar);

  // Thêm vào container
  notificationContainer.appendChild(notificationElement);

  // Animation in
  setTimeout(() => {
    notificationElement.classList.add("show");
  }, 10);

  // Animate progress bar
  const startTime = Date.now();
  const animateProgress = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.max(0, 100 - (elapsed / duration) * 100);
    progressBar.style.width = progress + "%";

    if (progress > 0) {
      requestAnimationFrame(animateProgress);
    }
  };
  animateProgress();

  // Auto remove sau duration
  setTimeout(() => {
    if (notificationElement.parentElement) {
      notificationElement.classList.remove("show");
      setTimeout(() => {
        if (notificationElement.parentElement) {
          notificationElement.remove();
        }
      }, 300);
    }
  }, duration);
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

const isLoggedIn = async () => {
  // Check local
  if (
    !window.localStorage.getItem("at") ||
    isTokenExpired(window.localStorage.getItem("at"))
  ) {
    return false;
  }
  // Check server
  try {
    const res = await fetch(url_api + "/auth/is-login", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      window.localStorage.removeItem("at");
      return false;
    }
    const { isLogin } = await res.json();
    if (!isLogin) {
      window.localStorage.removeItem("at");
    }
    return isLogin;
  } catch (error) {
    console.error(error);
    window.localStorage.removeItem("at");
    return false;
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
const getAccessToken = async () => {
  let token = window.localStorage.getItem("at");
  if (!token || isTokenExpired(token)) {
    token = await requestRefreshToken();
  }
  return token;
};
const socket = io(url_api, {
  auth: {
    token: window.localStorage.getItem("at"),
  },
  transports: ["websocket", "polling"],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Connected to server with socket ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("auth_error", (error) => {
  console.log("Socket auth error, redirecting to login");
  window.localStorage.removeItem("at");
  window.location.href = "/signIn.html";
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
