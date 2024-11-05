const utils = (function () {
  const currentUrl = window.location.href
    .toString()
    .split(window.location.pathname)[0];
  return {
    convertTimeUTC: (time) => {
      const date = new Date(time).toLocaleString("vi-VN");
      return date;
    },
    getCurrentUrl: () => currentUrl,
    getProducts: async (path) => {
      try {
        const res = await fetch(utils.getCurrentUrl() + `/product${path}`);
        if (!res.ok) {
          console.log("Không lấy được danh sách sản phẩm");
          return;
        }
        const data = await res.json();
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    checkCookie: (cookieName) => {
      const cookies = document.cookie.split(";");
      return cookies.some((cookie) =>
        cookie.trim().startsWith(cookieName + "=")
      );
    },
    requestRefreshToken: async () => {
      try {
        const res = await fetch(currentUrl + "/auth/refresh-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + utils.getRefreshToken(),
          },
        });
        const { accessToken } = await res.json();
        if (accessToken) {
          window.localStorage.setItem("at", accessToken);
          return accessToken;
        } else {
          await utils.isLoggedIn();
        }
      } catch (error) {
        console.log(error);
      }
    },
    parseJwt: (token) => {
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
    },
    isTokenExpired: (token) => {
      if (!token) {
        return true;
      }
      const decoded = utils.parseJwt(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    },
    getRefreshToken: () => {
      let token = document.cookie.split(";").find((token) => {
        return token.trim().startsWith("rt" + "=");
      });
      return token.split("=")[1];
    },
    getAccessToken: async () => {
      let token = window.localStorage.getItem("at");
      if (!token || utils.isTokenExpired(token)) {
        token = await utils.requestRefreshToken();
      }
      return token;
    },

    isAdmin: (token) => {
      return utils.parseJwt(token)?.admin;
    },
    isLoggedIn: async () => {
      const isCookie = utils.checkCookie("rt");
      const pathname = window.location.pathname;
      let isLoggedIn = false;
      if (isCookie) {
        try {
          const res = await fetch(currentUrl + "/auth/is-login", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + utils.getRefreshToken(),
            },
          });
          const { isLogin } = await res.json();
          isLoggedIn = isLogin;
        } catch (error) {
          console.error(error);
        }
      }
      if (isLoggedIn) {
        if (pathname == "/dashboard" || pathname == "/dashboard/") {
          return;
        }
        window.location.href = "/dashboard";
      } else {
        window.localStorage.removeItem("at");
        if (pathname == "/dashboard/login.html") {
          return;
        }
        window.location.href = "/dashboard/login.html";
      }
    },

    logout: async () => {
      try {
        const res = await fetch(currentUrl + "/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + utils.getRefreshToken(),
          },
        });

        if (!res.ok) {
          const { message } = await res.json();
          return console.log(message);
        }
        utils.isLoggedIn();
        window.localStorage.removeItem("at");
      } catch (error) {
        console.log(error);
      }
    },
    setComponent: async (element, url) => {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.text();
          element.innerHTML = data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    mutationObserverElement: (element, callback, option) => {
      const mutationObserver = new MutationObserver(callback);
      mutationObserver.observe(element, option);
    },
    showNotification: ({ message, status }) => {
      const notification = document.getElementById("notification");
      const icons = {
        success: '<i class="bi bi-check-circle text-success mx-2"></i>',
        warning: '<i class="bi bi-exclamation-triangle text-warning mx-2"></i>',
      };
      notification.classList.add("show-notification", `alert-${status}`);
      notification.innerHTML = `
        ${icons[status]}
        ${message}
      `;
      setTimeout(() => {
        notification.classList.remove("show-notification");
      }, 2500);
    },
  };
})();
export default utils;
