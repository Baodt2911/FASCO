import { getProducts, url_api } from "./utils.js";
const productNewArrivals = document.getElementById("product-new-arrivals");
const slideElement = document.querySelector(".slider");
const nextSlide = document.querySelector(".btn-next-slide");
const prevSlide = document.querySelector(".btn-prev-slide");
const saleOffElement = document.querySelector(".sale-off");
const listDots = document.querySelector(".dots");
const ItemCategory = document.querySelectorAll(".bdt-item-category");
const title_deal = document.querySelector(".title-deal");
const description_deal = document.querySelector(".description-deal");
const days_deal = document.querySelector(".days-deal");
const hours_deal = document.querySelector(".hours-deal");
const minutes_deal = document.querySelector(".minutes-deal");
const seconds_deal = document.querySelector(".seconds-deal");
const months_deal = document.querySelector(".months-deal");
const season_deal = document.querySelector(".season-deal");
const percent_deal = document.querySelector(".percent-deal");
const renderSlider = async () => {
  try {
    const res = await fetch(url_api + "/deal/get");
    const { message, deals } = await res.json();
    title_deal.textContent = deals[0].title;
    description_deal.textContent = deals[0].description;
    months_deal.textContent = new Date(deals[0].end_date).getMonth();
    percent_deal.textContent = deals[0].discount_value;
    const dotHtmls = Array.from(
      { length: deals[0]?.applied_products.length },
      (_, i) => {
        return `<li class="${i === 0 ? "bdt-active-dot" : ""}" data-id="${i}">
                    <i
                      class="fa-solid fa-circle text-[#484848] text-[10px]"
                    ></i>
                  </li>`;
      }
    );

    listDots.innerHTML = dotHtmls.join("");
    const htmls = deals[0]?.applied_products.map((product, index) => {
      return `<a href="../pages/productDetail.html?id=${
        product._id
      }" class="bdt-item-slide ${
        index === 0 ? "slide-active" : ""
      }" data-id="${index}">
                    <img
                      class="w-full h-full object-contain"
                      src="${product.photos[0].url}"
                      alt=""
                    />
                  </a>`;
    });
    slideElement.innerHTML = htmls.join("");
    setInterval(() => {
      const now = new Date().getTime();
      const endDate = new Date(deals[0].end_date).getTime();
      const timeRemaining = endDate - now;
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
      days_deal.textContent = days.toString().padStart(2, "0");
      hours_deal.textContent = hours.toString().padStart(2, "0");
      minutes_deal.textContent = minutes.toString().padStart(2, "0");
      seconds_deal.textContent = seconds.toString().padStart(2, "0");
    }, 1000);
  } catch (error) {
    console.log(error);
  }
};
await renderSlider();
const itemsSilde = document.querySelectorAll(".bdt-item-slide");
const itemsDot = document.querySelectorAll(".dots li");
let lenghtItems = itemsSilde.length - 1;
let active_slider = 0;
const showSaleOff = () => {
  saleOffElement.style = "opacity: 0;";
  setTimeout(() => {
    saleOffElement.style = "opacity: 1;";
  }, 500);
};

const activeDot = () => {
  itemsSilde.forEach((item) => {
    if (item.classList.contains("slide-active")) {
      itemsDot.forEach((dot) => {
        dot.classList.remove("bdt-active-dot");
        if (dot.dataset.id == item.dataset.id) {
          dot.classList.add("bdt-active-dot");
        }
      });
    }
  });
};
const nextSlider = () => {
  const firstSlide = slideElement.firstElementChild;
  slideElement.appendChild(firstSlide);
  itemsSilde[
    active_slider == 0 ? lenghtItems : active_slider - 1
  ].classList.remove("slide-active");
  itemsSilde[active_slider].classList.add("slide-active");
};
const prevSlider = () => {
  const lastSlide = slideElement.lastElementChild;
  slideElement.prepend(lastSlide);
  itemsSilde[
    active_slider == lenghtItems ? 0 : active_slider + 1
  ].classList.remove("slide-active");
  itemsSilde[active_slider].classList.add("slide-active");
};
nextSlide.addEventListener("click", () => {
  active_slider = active_slider < lenghtItems ? active_slider + 1 : 0;
  nextSlider();
  showSaleOff();
  activeDot();
});
prevSlide.addEventListener("click", () => {
  active_slider = active_slider > 0 ? active_slider - 1 : lenghtItems;
  prevSlider();
  showSaleOff();
  activeDot();
});
const renderProduct = async (path) => {
  productNewArrivals.innerHTML = Array(4)
    .fill(
      `<div class="rounded-xl flex flex-col px-10 py-5">
        <div
        class="h-[315px] rounded-xl animate-pulse bg-slate-300"
        ></div>
        <div class="mt-3 mb-6 title flex flex-col gap-2">
        <!-- name -->
        <p class="h-2 rounded-xl animate-pulse bg-slate-300"></p>
        <!-- branch -->
        <p class="h-2 rounded-xl animate-pulse bg-slate-300"></p>
        </div>
        <!-- customer reviewer -->
        <p class="w-10 h-2 rounded-xl animate-pulse bg-slate-300"></p>
        <div class="mt-5 flex items-center justify-between gap-10">
        <p class="flex-1 h-2 rounded-xl animate-pulse bg-slate-300"></p>
        <p class="flex-1 h-2 rounded-xl animate-pulse bg-slate-300"></p>
        </div>
    </div>`
    )
    .join("");
  const {
    datas: { products },
  } = await getProducts(path);
  const htms = products.map(async (product) => {
    const res = await fetch(url_api + `/sold_rate/get?id=${product._id}`);
    const data = await res.json();
    return `
   <a
        href="./productDetail.html?id=${product._id}"
        style="box-shadow: 0 5px 30px 0 #cfcfcfcc"
        class="rounded-xl shadow-xl flex flex-col px-10 py-5"
    >
        <div class="h-2/3 mx-auto">
        <img
            class="w-full h-full object-cover rounded-xl"
            src="${product.photos[0].url}"
            alt=""
            loading="lazy"
        />
        </div>
        <div class="mt-3 mb-6 flex items-center justify-between">
        <div class="title">
            <!-- name -->
            <p class="text-[#484848] text-xl font-poppins">${product.name}</p>
            <!-- branch -->
            <p class="text-[#8A8A8A] text-xs font-poppins">${product.brand}</p>
        </div>
        </div>
        <!-- customer reviewer -->
        <p class="reviewer mb-6 text-[#484848] text-xs font-poppins">
        (${data?.element.sold}) Sold
        </p>
        <div class="flex items-center justify-between">
        <div class="price font-poppins text-2xl font-medium">
            $${product.price}
        </div>
        <div class="rate flex items-center gap-x-1">
        ${Array(data?.element.rate)
          .fill(`<i class="fa-solid fa-star text-yellow-400"></i>`)
          .join("")}
        </div>
        </div>
    </a>
  `;
  });
  const allHtml = await Promise.all(htms);
  productNewArrivals.innerHTML = allHtml.join("");
};
await renderProduct("/all?sex=women&type=clothes");
const changeCategory = async (e) => {
  const sex = e.target.dataset.sex;
  const category = e.target.dataset.category;
  ItemCategory.forEach((item) => {
    item.classList.remove("bdt-active-category");
  });
  e.target.classList.add("bdt-active-category");
  await renderProduct(`/all?sex=${sex}&type=${category}`);
};
ItemCategory.forEach((item) => {
  item.addEventListener("click", changeCategory);
});
