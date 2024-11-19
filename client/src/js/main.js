import {
  isLoggedIn,
  socket,
  getAccessToken,
  notification,
  url_api,
} from "../../src/js/utils.js";

const isLogin = await isLoggedIn();
const headerElement = document.querySelector("header");
const footerElement = document.querySelector("footer");
const bannerElement = document.querySelector(".banner-middle");
const galleryElement = document.querySelector(".gallery");
const subscribeElement = document.querySelector(".subscribe");
const miniCartElement = document.querySelector(".mini-cart");
const btnShowMiniCart = document.querySelector(".btn-show-mini-cart");
import BannerMiddle from "../../public/components/banner_middle.js";
import Footer from "../../public/components/footer.js";
import Gallery from "../../public/components/gallery.js";
import Header from "../../public/components/header.js";
import MiniCart from "../../public/components/mini_cart.js";
import Subcribe from "../../public/components/subscribe.js";
import { auth, onAuthStateChanged } from "./firebase.js";
headerElement.innerHTML = Header(isLogin);
footerElement.innerHTML = Footer();
const iconUser = document.querySelector(".icon-user");
const cardUser = document.querySelector(".card-user");
if (isLogin) {
  iconUser.addEventListener("mousemove", () => {
    cardUser.classList.remove("opacity-0", "visible");
  });
  iconUser.addEventListener("mouseout", () => {
    cardUser.classList.add("opacity-0", "visible");
  });
  cardUser.addEventListener("mousemove", () => {
    cardUser.classList.remove("opacity-0", "visible");
  });
  cardUser.addEventListener("mouseout", () => {
    cardUser.classList.add("opacity-0", "visible");
  });
}
const getCart = async () => {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch("http://localhost:3000/cart/get-cart", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    });
    const { carts, message } = await res.json();
    if (message) {
      console.log(message);
    }
    return carts;
  } catch (error) {
    console.log(error);
  }
};
const removeFromCart = (carts) => {
  socket.emit("remove-from-cart", carts);
  socket.on("message", ({ message }) => {
    notification({
      message,
      status: "success",
    });
  });
  // try {
  //   const accessToken = await getAccessToken();
  //   const res = await fetch("http://localhost:3000/cart/remove-from-cart", {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + accessToken,
  //     },
  //     body: JSON.stringify({ carts }),
  //   });
  //   const { message } = await res.json();
  //   if (message) {
  //     console.log(message);
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
};

const { carts } = await getCart();

// if (bannerElement) {
//   bannerElement.innerHTML = BannerMiddle();
// }
if (galleryElement) {
  galleryElement.innerHTML = Gallery();
}
if (subscribeElement) {
  subscribeElement.innerHTML = Subcribe();
}
if (miniCartElement) {
  miniCartElement.innerHTML = MiniCart();
  const renderMiniCart = (carts) => {
    const miniCartProducts = document.querySelector(".mini-cart-products");
    const htmls = carts.map((product) => {
      return `<div class="flex gap-x-5">
      <div class="w-40 h-56">
        <img
          class="w-full h-full object-cover"
          src="${product.color.url}"
          alt=""
          loading="lazy"
        />
      </div>
      <div class="flex-1 flex flex-col gap-y-3">
        <!-- name product  -->
        <p class="font-volkhov text-xl font-bold name-product">${product.product.name}</p>
        <!-- color  -->
        <p class="font-poppins text-lg text-[#8A8A8A] color-product">Color: ${product.color.color}</p>
        <!-- size  -->
        <p class="font-poppins text-lg text-[#8A8A8A] ">Size: <span>${product.size}</span></p>
        <!-- price  -->
        <p class="font-poppins text-lg ">$${product.product.price}.00</p>
        <!-- quantity & remove -->
        <div class="w-full flex items-center justify-between pr-10">
          <!-- quantity  -->
          <div
            class="flex items-center w-40 h-12 border border-[#EEEEE] justify-around p-x-5 rounded-sm"
          >
            <button class="btn-reduce w-5 h-full text-xl">-</button>
            <input
              type="number"
              class="quantity-product w-10 h-full outline-none font-jost text-center"
              value="${product.quantity}"
            />
            <button class="btn-increase w-5 h-full text-xl">+</button>
          </div>
          <!-- remove  -->
          <button data-id="${product._id}" class="btn-remove-product-mini-cart font-poppins text-md text-[#DA3F3F] hover:underline">
            Remove
          </button>
        </div>
      </div>
    </div>
  `;
    });
    miniCartProducts.innerHTML = htmls.join("");
    const btnRemoveProductMiniCart = document.querySelectorAll(
      ".btn-remove-product-mini-cart"
    );

    btnRemoveProductMiniCart.forEach((item) => {
      item.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        removeFromCart({ id });
      });
    });
  };
  const cartLenght = document.getElementById("cart-length");
  socket.on("get-cart", (data) => {
    const { carts } = data;
    renderMiniCart(carts);
    cartLenght.innerText = carts.length;
  });
  renderMiniCart(carts);
  cartLenght.innerText = carts.length;
  socket.on("message", (message) => {
    console.log(message);
  });
}
if (!isLogin) {
  btnShowMiniCart?.classList.add("hidden");
}
// Show mini cart
btnShowMiniCart?.addEventListener("click", () => {
  miniCartElement.style = "transform:translateX(0);opacity:1;";
});
// Hide mini cart
document.addEventListener("click", function (event) {
  const target = event.target;
  const btnHideMiniCart = target.parentNode.matches(".btn-hide-mini-cart");
  const overlayMiniCart = target.matches(".overlay-mini-cart");
  if (btnHideMiniCart || overlayMiniCart) {
    miniCartElement.style = "transform:translateX(100%);opacity:0;";
  }
});

const cartsProduct = document.getElementById("carts-product");
if (cartsProduct) {
  const renderCart = (carts) => {
    const htmls = carts.map((product) => {
      return `
         <tr>
            <td class="flex gap-x-5">
              <div class="w-40 h-56">
                <img
                  class="w-full h-full object-cover"
                  src="${product.color.url}"
                  alt=""
                  loading="lazy"
                />
              </div>
              <div>
                <!-- name product  -->
                <p>${product.product.name}</p>
                <!-- Color  -->
                <p class="font-poppins text-[#8A8A8A]">Color: ${product.color.color}</p>
                <!-- size  -->
                <p class="font-poppins text-[#8A8A8A]">Size: ${product.size}</p>
                <!-- remove  -->
                <button data-id="${product._id}"
                  class="btn-remove-product-cart font-poppins text-[#DA3F3F] text-sm underline"
                >
                  Remove
                </button>
              </div>
            </td>
            <!-- price  -->
            <td class="text-center">$${product.product.price}.00</td>
            <!-- quantity  -->
            <td class="">
              <div
                class="flex items-center w-32 h-12 mx-auto border border-[#EEEEE] justify-around p-x-5 rounded-sm"
              >
                <button class="btn-reduce w-5 h-full text-xl">-</button>
                <input
                  type="number"
                  class="quantity w-10 h-full outline-none font-jost text-center"
                  value="${product.quantity}"
                />
                <button class="btn-increase w-5 h-full text-xl">+</button>
              </div>
            </td>
            <!-- total  -->
            <td class="text-center">$14.90</td> 
        </tr>`;
    });
    cartsProduct.innerHTML = htmls.join("");
    const btnRemoveProductCart = document.querySelectorAll(
      ".btn-remove-product-cart"
    );
    btnRemoveProductCart.forEach((item) => {
      item.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        removeFromCart({ id });
      });
    });
  };
  renderCart(carts);
  socket.on("get-cart", (data) => {
    const { carts } = data;
    renderCart(carts);
  });
}
const btnLogout = document.querySelector(".btn-logout");
if (isLogin) {
  btnLogout.onclick = async () => {
    auth.signOut();
    const res = await fetch(url_api + "/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    const jsonRes = await res.json();
    window.location.reload();
    console.log(jsonRes);
  };
  onAuthStateChanged(auth, (user) => {
    console.log(user);
  });
}
