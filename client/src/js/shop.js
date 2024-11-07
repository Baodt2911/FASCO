import { params, getProducts, url_api } from "./utils.js";
const btnCollapseBrand = document.querySelector(".btn-collapse-brands");
const brandsElement = document.querySelector(".brands ul");
const pagination = document.querySelector(".pagination");
const prevPage = document.querySelector(".prev-page");
const nextPage = document.querySelector(".next-page");
const loading = document.querySelector(".loading");
const listProducts = document.getElementById("list-products");
const inputNameProduct = document.querySelector(".input-name-product");
const btnSearchProduct = document.querySelector(".btn-search-product");
const cardSuggest = document.querySelector(".suggest");
const btnViewStyle = document.querySelectorAll(".btn-view-style");
const queryString = window.location.search;

btnSearchProduct.addEventListener("click", async (e) => {
  const data = await getProducts(`/search?q=${inputNameProduct.value}`);
  handleRenderProduct(data?.products);
});
inputNameProduct.addEventListener("input", async (e) => {
  try {
    if (!e.target.value) {
      return;
    }
    const res = await fetch(
      url_api + `/product/search?q=${e.target.value}` + "&order=suggest"
    );
    const suggest = await res.json();
    const htmls = suggest?.products.map(
      (suggets) =>
        `<li>
            <a
              class="item-suggest block shadow-sm px-5 py-2 hover:text-red-500 rounded-lg hover:bg-gray-50"
              href=""
              >${suggets.name}</a
            >
          </li>`
    );
    cardSuggest.innerHTML = htmls.join("");
    const itemSuggest = document.querySelectorAll(".item-suggest");
    itemSuggest.forEach((item) => {
      item.addEventListener("click", async (e) => {
        e.preventDefault();
        inputNameProduct.value = e.target.textContent;
        const data = await getProducts(`/search?q=${e.target.textContent}`);
        handleRenderProduct(data?.products);
      });
    });
  } catch (error) {
    console.log(error);
  }
});

const { datas } = await getProducts("/all" + queryString);
const { products, currentPage, totalItem, totalPage } = datas;
let page = params.page || currentPage;
let pageSize = 10;
btnCollapseBrand.addEventListener("click", () => {
  brandsElement.classList.toggle("hidden");
  if (brandsElement.classList.contains("hidden")) {
    btnCollapseBrand.innerHTML = ' <i class="fa-solid fa-angle-down"></i>';
  } else {
    btnCollapseBrand.innerHTML = ' <i class="fa-solid fa-angle-up"></i>';
  }
});
const btnCollapseCollection = document.querySelector(
  ".btn-collapse-collections"
);
const collectionsElement = document.querySelector(".collections ul");
btnCollapseCollection.addEventListener("click", () => {
  collectionsElement.classList.toggle("hidden");
  if (collectionsElement.classList.contains("hidden")) {
    btnCollapseCollection.innerHTML = ' <i class="fa-solid fa-angle-down"></i>';
  } else {
    btnCollapseCollection.innerHTML = ' <i class="fa-solid fa-angle-up"></i>';
  }
});
if (products) {
  loading.classList.add("hidden");
}
const handleRenderPagination = (pageCount) => {
  const count = Math.ceil(pageCount / pageSize);
  if (count <= 1) {
    pagination.parentElement.classList.add("hidden");
  }
  pagination.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const li = document.createElement("li");
    li.classList.add("item-pagination");
    li.innerHTML = `<a href="#" onclick="addQueryParams({page:${i},pageSize:${pageSize}})">${i}</a>`;
    if (i == page) {
      li.classList.add("active-page");
    }
    pagination.appendChild(li);
  }
};
const { min_price, max_price, type, brand } = params;
if (min_price || max_price || type || brand) {
  handleRenderPagination(products.length);
} else {
  handleRenderPagination(totalItem);
}

if (+page == 1) {
  prevPage.classList.add("hidden");
}
if (+page >= totalPage) {
  nextPage.classList.add("hidden");
}
prevPage.onclick = (e) => {
  e.preventDefault();
  const url = new URL(window.location.href);
  url.searchParams.set("page", +page - 1);
  window.location.href = url.toString();
};
nextPage.onclick = (e) => {
  e.preventDefault();
  const url = new URL(window.location.href);
  url.searchParams.set("page", +page + 1);
  window.location.href = url.toString();
};
const handleRenderProduct = (products) => {
  console.log(products);
  if (products.length == 0) {
    listProducts.innerHTML = `<p class="font-volkhov text-gray-500 text-xl">No results</p>`;
    listProducts.classList.remove("grid");
    return;
  }
  const htmls = products.map((product) => {
    return `
      <div class="item-product h-[500px]">
        <a href="./productDetail.html?id=${product._id}" class="block w-full h-3/4">
          <img
            class="w-full h-full object-contain rounded-md"
            src="${product.photos[0].url}"
            alt="${product.photos[0].color}"
            loading="lazy"
          />
        </a>
        <div class="mt-5 flex flex-col gap-y-3 h-1/4">
          <!-- name  -->
          <div class="flex justify-between flex-col">
            <p class="font-volkhov text-xl">${product.name}</p>
            <p class="font-poppins text-gray-400">${product.brand}</p>
          </div>
          <!-- price  -->
          <p class="font-volkhov tracking-wider text-lg">$${product.price}.00</p>
        </div>
      </div>
    `;
  });
  listProducts.innerHTML = htmls.join("");
};
handleRenderProduct(products);
btnViewStyle.forEach((item) => {
  item.addEventListener("click", (e) => {
    const { col } = e.currentTarget.dataset;
    listProducts.classList.remove(
      `grid-cols-2`,
      `grid-cols-3`,
      `grid-cols-4`,
      `grid-cols-5`
    );
    listProducts.classList.add(`grid-cols-${col}`);
  });
});
