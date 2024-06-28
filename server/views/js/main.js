import utils from "./utils.js";
import home from "./home.js";
import shop from "./shop.js";
import orders_sell from "./orders-sell.js";
import comments from "./comment.js";
import promotion from "./promotion.js";
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
utils.isLoggedIn();
const currentUrl = utils.getCurrentUrl();
const socket = io(currentUrl, {
  auth: {
    token: utils.getAccessToken(),
  },
});

socket.on("connect", () => {
  console.log("Connected to server");
  socket.on("get-cart", (data) => {
    console.log("data:", data);
  });
  socket.emit("get-cart");
  socket.on("message", ({ message }) => {
    console.log("message:", message);
  });
});
const click = document.querySelector(".click-me");
click.addEventListener("click", () => {
  const carts = {
    product: "665f6a2fd2901d3d9c1cb79a",
    color: "665f6a2fd2901d3d9c1cb79d",
    size: "S",
    quantity: 1,
  };
  socket.emit("add-to-cart", carts);
});
const btnLogout = document.getElementById("btn-logout");
const navItems = document.querySelectorAll(".nav-item");
const content = document.getElementById("content");
utils.setComponent(content, "./components/home.html");
btnLogout.addEventListener("click", async () => {
  try {
    await utils.logout();
    utils.isLoggedIn();
    window.localStorage.removeItem("at");
  } catch (error) {
    console.log(error);
  }
});
let pageActive = "home";
const changePage = (e) => {
  e.preventDefault();
  const page = e.target.closest(".nav-item").dataset.page;
  socket.emit("chat", page);
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
