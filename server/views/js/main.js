import utils from "./utils.js";
import home from "./home.js";
import shop from "./shop.js";
import orders_sell from "./orders-sell.js";
import comments from "./comment.js";
import promotion from "./promotion.js";
utils.isLoggedIn();
const currentUrl = utils.getCurrentUrl();
const btnLogout = document.getElementById("btn-logout");
const navItems = document.querySelectorAll(".nav-item");
const content = document.getElementById("content");
utils.setComponent(content, "./components/shop.html");
btnLogout.addEventListener("click", async () => {
  try {
    console.log(utils.getRefreshToken());

    await fetch(currentUrl + "/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + utils.getRefreshToken(),
      },
    });
    utils.isLoggedIn();
  } catch (error) {
    console.log(error);
  }
});
let pageActive = "shop";
const changePage = (e) => {
  e.preventDefault();
  const page = e.target.closest(".nav-item").dataset.page;
  pageActive = page;
  const urls = {
    shop: "./components/shop.html",
    home: "./components/home.html",
    orders_sell: "./components/orders-sell.html",
    comments: "./components/comments.html",
    promotion: "./components/promotion.html",
  };
  utils.setComponent(content, urls[page]);
  navItems.forEach((item) => {
    item.querySelector("a").classList.remove("active");
  });
  e.target.closest("a").classList.add("active");
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
      orders_sell;
      break;
    case "comments":
      comments;
      break;
    case "promotion":
      promotion();
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
