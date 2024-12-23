import utils from "./utils.js";
import home from "./home.js";
import shop from "./shop.js";
import orders_sell from "./orders-sell.js";
import comments from "./comment.js";
import promotion from "./promotion.js";
import deals from "./deals.js";
// import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
await utils.isLoggedIn();
// const currentUrl = utils.getCurrentUrl();
// const socket = io(currentUrl, {
//   auth: {
//     token: utils.getAccessToken(),
//   },
// });
// click.addEventListener("click", () => {
//   const carts = {
//     product: "665f6a2fd2901d3d9c1cb79a",
//     color: "665f6a2fd2901d3d9c1cb79d",
//     size: "S",
//     quantity: 1,
//   };
//   socket.emit("add-to-cart", carts);
// });
const btnLogout = document.getElementById("btn-logout");
const navItems = document.querySelectorAll(".nav-item");
const content = document.getElementById("content");
let url = new URL(window.location.href);
const queryString = location.search;
let params = new URLSearchParams(queryString);
let pageActive = params.get("page") || "home";
const urls = {
  shop: "./components/shop.html",
  home: "./components/home.html",
  orders_sell: "./components/orders-sell.html",
  comments: "./components/comments.html",
  promotion: "./components/promotion.html",
  deals: "./components/deals.html",
};
utils.setComponent(content, urls[pageActive]);
const activeItemNav = (page) => {
  navItems.forEach((item) => {
    item.querySelector("a").classList.remove("active");
    const pageActive = item.dataset.page;
    if (page == pageActive) {
      item.querySelector("a").classList.add("active");
    }
  });
};
activeItemNav(pageActive);
btnLogout.addEventListener("click", async () => {
  try {
    await utils.logout();
  } catch (error) {
    console.log(error);
  }
});
const changePage = (e) => {
  e.preventDefault();
  const page = e.target.closest(".nav-item").dataset.page;
  if (!pageActive) {
    url.searchParams.append("page", page);
    window.history.pushState({}, "", url);
  }
  url.searchParams.set("page", page);
  window.history.pushState({}, "", url);

  pageActive = page;
  utils.setComponent(content, urls[page]);
  activeItemNav(page);
};
navItems.forEach((item) => {
  item.addEventListener("click", changePage);
});
// Xử lý các thay đổi của content
const mutationContent = (mutation) => {
  switch (pageActive) {
    case "home":
      home();
      break;
    case "shop":
      shop();
      break;
    case "orders_sell":
      orders_sell();
      break;
    case "comments":
      comments();
      break;
    case "promotion":
      promotion();
      break;
    case "deals":
      deals();
      break;
    default:
      home();
      break;
  }
};
utils.mutationObserverElement(content, mutationContent, {
  attributes: true,
  childList: true,
  attributeOldValue: true,
  characterDataOldValue: true,
});
