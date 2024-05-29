const utils = (function () {
  const currentUrl = window.location.href
    .toString()
    .split(window.location.pathname)[0];
  return {
    getCurrentUrl: () => currentUrl,
    checkCookie: (cookieName) => {
      return document.cookie.split(";").some((cookie) => {
        return cookie.trim().startsWith(cookieName + "=");
      });
    },
    getRefreshToken: () => {
      let token = document.cookie.split(";").find((token) => {
        return token.trim().startsWith("rt" + "=");
      });
      return token.split("=")[1];
    },
    isLoggedIn: () => {
      const isCookie = utils.checkCookie("rt");
      const pathname = window.location.pathname;
      if (isCookie) {
        if (pathname == "/dashboard" || pathname == "/dashboard/") {
          return;
        }
        window.location.href = "/dashboard";
      } else {
        if (pathname == "/dashboard/login.html") {
          return;
        }
        window.location.href = "/dashboard/login.html";
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
