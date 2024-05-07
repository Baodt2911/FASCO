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
  };
})();
export default utils;
