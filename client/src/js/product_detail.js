import {
  getAccessToken,
  getProducts,
  notification,
  socket,
  params,
  url_api,
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
const productSold = document.getElementById("product-sold");
const countReviews = document.getElementById("count-reviews");
const reviewsList = document.getElementById("reviews-list");
const averageRate = document.getElementById("average-rate");
const paginationReviews = document.getElementById("pagination-reviews");
const btnSelectRateNumber = document.querySelectorAll(
  ".btn-select-rate-number"
);
const carts = {
  product: "",
  color: "",
  size: "",
  quantity: 1,
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

// Render Product
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
cardActivePhotos.querySelector("img").src = product.photos[0].url;
cardActivePhotos.style.setProperty("--url", `url("${product.photos[0].url}")`);

cardActivePhotos.addEventListener("mousemove", (e) => {
  cardActivePhotos.style.setProperty("--display", "block");
  let pointer = {
    x: (e.offsetX * 100) / cardActivePhotos.offsetWidth,
    y: (e.offsetY * 100) / cardActivePhotos.offsetHeight,
  };
  cardActivePhotos.style.setProperty("--zoom-x", pointer.x + "%");
  cardActivePhotos.style.setProperty("--zoom-y", pointer.y + "%");
});
cardActivePhotos.addEventListener("mouseout", (e) => {
  cardActivePhotos.style.setProperty("--display", "none");
});
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
    cardActivePhotos.querySelector("img").src = e.target.src;
    cardActivePhotos.style.setProperty("--url", `url("${e.target.src}")`);
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
        cardActivePhotos.querySelector("img").src = item.src;
        cardActivePhotos.style.setProperty("--url", `url("${item.src}")`);
      }
    });
  });
});
btnAddToCart.addEventListener("click", async () => {
  carts.quantity = parseInt(quantity.value) || 1;
  const isValid = Object.keys(carts).every((key) => {
    return carts[key] !== "" && carts[key] !== null && carts[key] !== undefined;
  });
  if (!isValid) {
    notification({
      message: "Please choose color and size",
      status: "warning",
    });
    return;
  }
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

// Render Reviews
let query = {
  id,
  page: 1,
  pageSize: 2,
  rate: 5,
};
let totalPageReview;
let currentPageReview;
const btnPrevReview = document.getElementById("btn-prev-review");
const btnNextReview = document.getElementById("btn-next-review");
const totalPageElement = document.querySelector(".total-page");
const handleRenderPagination = ({ totalPage, currentPage }) => {
  const htmls = Array.from({ length: totalPage }, (_, index) => {
    return `<button class="item-page size-8  
    ${
      currentPage === index + 1
        ? "bg-blue-600 text-white"
        : "bg-gray-200 text-gray-800"
    } 
    rounded-full text-sm transition-all">${index + 1}</button>`;
  });
  totalPageElement.innerHTML = htmls.join("");
};

const renderReviews = async (query) => {
  const queryString = new URLSearchParams(query).toString();
  try {
    const res = await fetch(url_api + `/review/get-review?${queryString}`);
    const { message, datas } = await res.json();
    const { totalPage, totalItem, currentPage, reviews } = datas;
    query.page = currentPage;
    totalPageReview = totalPage;
    currentPageReview = currentPage;
    handleRenderPagination({ totalPage, currentPage });
    if (message) console.error(message);
    if (reviews.length === 0) {
      reviewsList.innerHTML = `<p class="text-gray-500 leading-relaxed text-center font-semibold">No Review</p>`;
      return;
    }
    const htmls = reviews?.map((item) => {
      return `<div class="flex items-start mb-4">
              <!-- User Avatar -->
              <div
                class="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-semibold"
              >
                ${item.userId.firstName.charAt(0).toUpperCase()}
              </div>
              <!-- Review Content -->
              <div class="ml-4 flex-1">
                <p class="font-semibold text-gray-800 ">
                ${item.userId.firstName} ${item.userId.lastName}</p>
                <p class="text-gray-500 text-sm mb-2">${new Date(
                  item.createdAt
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>
                <div class="flex items-center mb-2">
                ${Array(item.rate)
                  .fill(`<span class="text-yellow-400 text-xl">★</span>`)
                  .join("")}
                ${Array(5 - item.rate)
                  .fill(`<span class="text-gray-300 text-xl">★</span>`)
                  .join("")}
                </div>
                <p class="text-gray-700 leading-relaxed ">
                  "${item.content}"
                </p>
              </div>
            </div>`;
    });
    reviewsList.innerHTML = htmls.join("");
    countReviews.textContent = totalItem;
  } catch (error) {
    console.log(error);
  }
};
totalPageElement.addEventListener("click", (e) => {
  if (e.target.classList.contains("item-page")) {
    query.page = e.target.textContent;
    renderReviews(query);
  }
});
btnPrevReview.addEventListener("click", () => {
  if (currentPageReview === 1) {
    return;
  }
  query.page--;
  renderReviews(query);
});
btnNextReview.addEventListener("click", () => {
  if (currentPageReview === totalPageReview) {
    return;
  }
  query.page++;
  renderReviews(query);
});
btnSelectRateNumber.forEach((item) => {
  item.addEventListener("click", (e) => {
    const rate = e.currentTarget.dataset.rate;
    query.page = 1;
    query.rate = rate;
    renderReviews(query);
  });
});
await renderReviews(query);
const renderSoldRate = async () => {
  try {
    const res = await fetch(url_api + `/sold_rate/get?id=${id}`);
    const { message, element } = await res.json();
    if (message) console.error(message);
    productSold.textContent = element.sold;
    averageRate.textContent = element.rate;
  } catch (error) {
    console.log(error);
  }
};
await renderSoldRate();
