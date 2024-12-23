import utils from "./utils.js";

export function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
const deals = () => {
  const table = document.getElementById("dealList");
  const btnConfirmDelete = document.querySelector(".btn-confirm-delete");
  const dealTitle = document.getElementById("dealTitle");
  const dealDescription = document.getElementById("dealDescription");
  const dealType = document.getElementById("dealType");
  const dealValue = document.getElementById("dealValue");
  const startDate = document.getElementById("startDate");
  const endDate = document.getElementById("endDate");
  let appliedProducts = [];
  const minOrderValue = document.getElementById("minOrderValue");
  const maxDiscount = document.getElementById("maxDiscount");
  const usageLimit = document.getElementById("usageLimit");
  const priority = document.getElementById("priority");
  const saveDealButton = document.getElementById("btn-save-deal");
  const selectProductsButton = document.querySelector(
    '[data-bs-toggle="modal"][data-bs-target="#selectProductsModal"]'
  );
  const selectProductsModal = document.getElementById("selectProductsModal");
  const btnCreateDealShowModal = document.getElementById(
    "btn-create-deal-show-modal"
  );
  const createDealForm = document.getElementById("createDealForm");
  const productList = document.getElementById("productList");
  let currentProductModal = true;
  btnCreateDealShowModal.addEventListener("click", () => {
    createDealForm.reset();
  });
  const renderProductModal = async () => {
    try {
      const res = await fetch(utils.getCurrentUrl() + "/product/all");
      const { datas } = await res.json();
      if (!datas) return;
      const htmls = datas.products.map((item, index) => {
        return `
        <tr>
          <td>${index}</td>
          <td>
            <img
              src="${item.photos[0].url}"
              class="rounded object-fit-contain"
              alt="${item.photos[0].color}"
              width="50"
              height="50"
              loading="lazy"
            />
          </td>
          <td>${item.name}</td>
          <td>${item.brand}</td>
          <td>$${item.price}</td>
          <td>
            <input type="checkbox" class="form-check-input check-product" data-id="${item._id}"/>
          </td>
        </tr>`;
      });
      productList.innerHTML = htmls.join("");
      currentProductModal = false;
    } catch (error) {
      console.log(error);
    }
  };
  selectProductsButton.addEventListener("click", async () => {
    if (currentProductModal) await renderProductModal();
    const checkProduct = document.querySelectorAll(".check-product");
    checkProduct.forEach((item) => {
      const isChecked = appliedProducts.some((id) => id === item.dataset.id);
      if (isChecked) {
        item.checked = true;
      }
      item.addEventListener("change", (e) => {
        const checked = e.target.checked;
        const id = e.target.dataset.id;
        if (checked) {
          const isProduct = appliedProducts.some((item) => item === id);
          if (!isProduct) appliedProducts.push(id);
        } else {
          const index = appliedProducts.findIndex((item) => item === id);
          appliedProducts.splice(index, 1);
        }
      });
    });
  });
  const handleSaveDeal = async (e) => {
    e.preventDefault();
    const id = e.target.dataset.id;
    const create = e.target.dataset.create;
    let path = "/deal/create";
    if (create === "false") path = `/deal/update/${id}`;
    const newDeal = {
      title: dealTitle.value,
      description: dealDescription.value,
      discount_type: dealType.value,
      discount_value: dealValue.value,
      start_date: startDate.value,
      end_date: endDate.value,
      applied_products: appliedProducts,
      min_order_value: minOrderValue.value,
      max_discount: maxDiscount.value,
      usage_limit: usageLimit.value,
      priority: priority.value,
    };
    // Kiểm tra xem tất cả các giá trị có hợp lệ hay không
    const isValid = Object.keys(newDeal).every((key) => {
      // Check for empty string or null/undefined for required fields
      if (key === "applied_products")
        return Array.isArray(newDeal[key]) && newDeal[key].length > 0;
      return (
        newDeal[key] !== "" &&
        newDeal[key] !== null &&
        newDeal[key] !== undefined
      );
    });

    if (!isValid) {
      utils.showNotification({
        message: "Vui lòng điền đầy đủ thông tin",
        status: "warning",
      });
      return;
    }
    try {
      const res = await fetch(utils.getCurrentUrl() + path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await utils.getAccessToken()}`,
        },
        body: JSON.stringify(newDeal),
      });
      const { message } = await res.json();
      utils.showNotification({ message, status: "success" });
      utils.modalInstance(document.getElementById("createDealModal")).hide();
      createDealForm.reset();
      saveDealButton.setAttribute("data-id", "");
      await renderDeal();
    } catch (error) {
      console.log(error);
    }
  };
  saveDealButton.addEventListener("click", handleSaveDeal);
  const renderDeal = async () => {
    try {
      const res = await fetch(utils.getCurrentUrl() + "/deal/get-all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await utils.getAccessToken()}`,
        },
      });
      const { deals, message } = await res.json();
      const html = deals.map((item, index) => {
        return `
    <tr>
      <td>${index + 1}</td>
      <td class="fw-bold title">${item.title}</td>
      <td class="description" style="max-width: 250px; text-align: left">${
        item.description
      }</td>
      <td class="discount_type" data-type="${item.discount_type}">${
          item.discount_type === "percent" ? "Phần trăm" : "Số tiền"
        }</td>
      <td class="discount_value" data-value="${item.discount_value}">${
          item.discount_value
        }${item.discount_type === "percent" ? "%" : "$"}</td>
      <td><span class="start_date">${formatDate(
        item.start_date
      )}</span> - <span class="end_date">${formatDate(
          item.end_date
        )}</span></td>
      <td class="applied_products" data-products="[${item?.applied_products.map(
        (item) => item._id
      )}]">${
          item?.applied_products ? item.applied_products.length : "0"
        } sản phẩm</td>
      <td class="min_order_value">${item.min_order_value}</td>
      <td class="max_discount">${item.max_discount}</td>
      <td class="priority">${item.priority}</td>
      <td class="usage_limit ${
        item.usage_limit === 0 ? "text-danger fw-bold" : ""
      }">${item.usage_limit}</td>
      <td class="usage_count text-danger fw-bold">${item.usage_count}</td>
      <td>
        <div class="d-flex flex-column gap-2">
          <div class="form-check form-switch d-flex justify-content-center">
            <input class="form-check-input change-status" 
              data-id="${item._id}" type="checkbox" 
              ${item.status === "active" ? "checked" : ""} />
          </div>
          <button class="btn btn-sm btn-outline-secondary btn-edit" 
            data-bs-toggle="modal" data-bs-target="#createDealModal" 
            data-id="${item._id}">Sửa</button>
          <button class="btn btn-sm btn-outline-danger btn-delete" 
            data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" 
            data-id="${item._id}">Xóa</button>
        </div>
      </td>
    </tr>
  `;
      });

      table.innerHTML = html.join("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteDeal = async (id) => {
    try {
      const res = await fetch(utils.getCurrentUrl() + `/deal/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await utils.getAccessToken()}`,
        },
      });
      const { message } = await res.json();
      utils.showNotification({ message, status: "success" });
      await renderDeal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeStatus = async (id) => {
    try {
      const res = await fetch(
        utils.getCurrentUrl() + `/deal/change-status/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await utils.getAccessToken()}`,
          },
        }
      );
      const { message } = await res.json();
      utils.showNotification({ message, status: "success" });
    } catch (error) {
      console.error(error);
    }
  };

  table.addEventListener("click", (e) => {
    const target = e.target;
    const id = target.dataset.id;
    if (target.classList.contains("btn-delete")) {
      btnConfirmDelete.setAttribute("data-id", id);
    }
    if (target.classList.contains("btn-edit")) {
      saveDealButton.setAttribute("data-id", id);
      const card = e.target.parentElement.parentElement.parentElement;
      saveDealButton.dataset.create = "false";
      const convertDate = (date) => {
        const parts = date.split("/");
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      };
      dealTitle.value = card.querySelector(".title").textContent;
      dealDescription.value = card.querySelector(".description").textContent;
      dealType.value = card.querySelector(".discount_type").dataset.type;
      dealValue.value = card.querySelector(".discount_value").dataset.value;
      startDate.value = convertDate(
        card.querySelector(".start_date").textContent
      );
      endDate.value = convertDate(card.querySelector(".end_date").textContent);
      appliedProducts = card
        .querySelector(".applied_products")
        .dataset.products.replace(/[\[\]']/g, "") // Loại bỏ [ ] và '
        .split(",") // Tách chuỗi thành mảng bằng dấu phẩy
        .map((item) => item.trim());
      //Chuyển đổi "['2313','2131]" thành 1 array
      minOrderValue.value = card.querySelector(".min_order_value").textContent;
      maxDiscount.value = card.querySelector(".max_discount").textContent;
      usageLimit.value = card.querySelector(".usage_limit").textContent;
      priority.value = card.querySelector(".priority").textContent;
    }
  });

  table.addEventListener("change", (e) => {
    const target = e.target;
    if (target.classList.contains("change-status")) {
      const id = target.dataset.id;
      handleChangeStatus(id);
    }
  });

  btnConfirmDelete.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    handleDeleteDeal(id);
    btnConfirmDelete.setAttribute("data-id", "");
    utils.modalInstance(document.getElementById("confirmDeleteModal")).hide();
  });

  renderDeal();
};
export default deals;
