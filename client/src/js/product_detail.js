import {
  getAccessToken,
  getProducts,
  notification,
  socket,
  params,
} from "./utils.js";

const btnReduce = document.querySelector(".btn-reduce");
const bntIncrease = document.querySelector(".btn-increase");
const quantity = document.querySelector(".quantity");
const productDetailName = document.getElementById("product-detail-name");
const productDetailPrice = document.getElementById("product-detail-price");
const productDetailSize = document.getElementById("product-detail-size");
const productDetailColor = document.getElementById("product-detail-color");
const cardListPhotos = document.getElementById("card-list-photos");
const cardActivePhotos = document.getElementById("card-active-photo");
const itemSize = document.querySelectorAll(".item-size");
const btnAddToCart = document.getElementById("btn-add-to-cart");
const carts = {
  product: "",
  color: "",
  size: "",
  quantity: 0,
};
bntIncrease.addEventListener("click", () => {
  if (quantity.value >= 0 && quantity.value < 100) {
    quantity.value++;
  }
});
btnReduce.addEventListener("click", () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
});
quantity.addEventListener("input", (e) => {
  if (e.target.value > 100 || e.target.value < 0) {
    e.target.value = 1;
  }
});

let id = params.id;
const { product } = await getProducts(`/detail?id=${id}`);
carts.product = id;

productDetailName.innerText = product.name;
productDetailPrice.innerText = `${product.price}.00`;
const htmlsPhoto = product.photos.map((photo) => {
  return `<div class="border cursor-pointer" >
                <img
                  class="w-full h-full item-photo"
                  src="${photo.url}"
                  alt="${photo.color}"
                  data-id="${photo._id}"
                  data-color="${photo.color}"
                />
              </div>`;
});
const htmlsColor = product.photos.map((photo) => {
  return `<li class="item-color" data-color="${photo.color}" data-id="${photo._id}" =>${photo.color}</li>`;
});
cardActivePhotos.src = product.photos[0].url;
cardListPhotos.innerHTML = htmlsPhoto.join("");
productDetailColor.innerHTML = htmlsColor.join("");
const itemPhoto = document.querySelectorAll(".item-photo");
const itemColor = document.querySelectorAll(".item-color");

itemPhoto[0].classList.add("active-item-photo");
itemPhoto.forEach((item) => {
  item.addEventListener("click", (e) => {
    itemPhoto.forEach((item) => {
      item.classList.remove("active-item-photo");
    });
    e.target.classList.add("active-item-photo");
    cardActivePhotos.src = e.target.src;
  });
});
itemSize.forEach((item) => {
  item.addEventListener("click", (e) => {
    itemSize.forEach((item) => {
      item.classList.remove("active-size");
    });
    e.target.classList.add("active-size");
    carts.size = e.target.textContent;
  });
});
itemColor.forEach((item) => {
  item.addEventListener("click", (e) => {
    itemColor.forEach((item) => {
      item.classList.remove("active-color");
    });
    e.target.classList.add("active-color");
    const id = e.target.dataset.id;
    const color = e.target.dataset.color;
    carts.color = id;
    itemPhoto.forEach((item) => {
      if (color == item.dataset.color) {
        itemPhoto.forEach((item) => {
          item.classList.remove("active-item-photo");
        });
        item.classList.add("active-item-photo");
        cardActivePhotos.src = item.src;
      }
    });
  });
});
btnAddToCart.addEventListener("click", async () => {
  carts.quantity = parseInt(quantity.value);
  socket.emit("add-to-cart", carts);
  socket.on("message", ({ message }) => {
    notification({
      message,
      status: "success",
    });
  });
  // try {
  //   const accessToken = await getAccessToken();
  //   const res = await fetch("http://localhost:3000/cart/add-to-cart", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + accessToken,
  //     },
  //     body: JSON.stringify({
  //       carts,
  //     }),
  //   });
  //   const { message } = await res.json();
  // } catch (error) {

  // }
});
