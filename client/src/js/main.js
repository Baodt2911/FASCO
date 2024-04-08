const headerElement = document.querySelector("header");
const footerElement = document.querySelector("footer");
const bannerElement = document.querySelector(".banner-middle");
const galleryElement = document.querySelector(".gallery");
const subscribeElement = document.querySelector(".subscribe");
const miniCartElement = document.querySelector(".mini-cart");
const btnShowMiniCart = document.querySelector(".btn-show-mini-cart");
const fetchElement = async (element, url) => {
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.text();
      element.innerHTML = data;
    }
  } catch (error) {
    console.error(error);
  }
};
fetchElement(headerElement, "../components/header.html");
fetchElement(footerElement, "../components/footer.html");
if (bannerElement) {
  fetchElement(bannerElement, "../components/banner_middle.html");
}
if (galleryElement) {
  fetchElement(galleryElement, "../components/gallery.html");
}
if (subscribeElement) {
  fetchElement(subscribeElement, "../components/subscribe.html");
}
if (miniCartElement) {
  fetchElement(miniCartElement, "../components/mini_cart.html");
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
