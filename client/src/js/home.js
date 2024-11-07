import { getProducts, url_api } from "./utils.js";
const productNewArrivals = document.getElementById("product-new-arrivals");
const slideElement = document.querySelector(".slider");
const slideActive = document.querySelector(".slide-active");
const slideTestimonial = document.querySelector(".slide-testimonial");
const testimonialActive = document.querySelector(".active-card-testimonial");
const itemsTestimonial = document.querySelectorAll(".item-card-testimonial");
const itemsSilde = document.querySelectorAll(".bdt-item-slide");
const listItemSilde = document.querySelectorAll(".bdt-item-slide");
const nextSlide = document.querySelector(".btn-next-slide");
const prevSlide = document.querySelector(".btn-prev-slide");
const saleOffElement = document.querySelector(".sale-off");
const itemsDot = document.querySelectorAll(".dots li");
const ItemCategory = document.querySelectorAll(".bdt-item-category");
const btnPrevSlideTestimonial = document.querySelector(
  ".btn-prev-slide-testimonial"
);
const btnNextSlideTestimonial = document.querySelector(
  ".btn-next-slide-testimonial"
);
let lenghtItems = itemsSilde.length - 1;
let active_slider = 0;
const showSaleOff = () => {
  saleOffElement.style = "opacity: 0;";
  setTimeout(() => {
    saleOffElement.style = "opacity: 1;";
  }, 500);
};
const nextDot = () => {
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
  nextDot();
});
prevSlide.addEventListener("click", () => {
  active_slider = active_slider > 0 ? active_slider - 1 : lenghtItems;
  prevSlider();
  showSaleOff();
  nextDot();
});
let activeTestimonial = 0;
let lenghtTestimonial = itemsTestimonial.length;
btnNextSlideTestimonial.addEventListener("click", () => {
  activeTestimonial =
    activeTestimonial >= lenghtTestimonial - 1
      ? lenghtTestimonial - 1
      : activeTestimonial + 1;
  if (activeTestimonial >= 3) {
    slideTestimonial.scrollLeft += slideTestimonial.offsetWidth;
  }
  itemsTestimonial[activeTestimonial - 1].classList.remove(
    "active-card-testimonial"
  );
  itemsTestimonial[activeTestimonial].classList.add("active-card-testimonial");
});
btnPrevSlideTestimonial.addEventListener("click", () => {
  activeTestimonial = activeTestimonial <= 0 ? 0 : activeTestimonial - 1;
  if (activeTestimonial < 3) {
    slideTestimonial.scrollLeft -= slideTestimonial.offsetWidth;
  }
  itemsTestimonial[activeTestimonial + 1].classList.remove(
    "active-card-testimonial"
  );
  itemsTestimonial[activeTestimonial].classList.add("active-card-testimonial");
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
