import { formatDate } from "./deals.js";
import utils from "./utils.js";

const promotion = () => {
  const table = document.getElementById("discountList");
  const btnConfirmDelete = document.querySelector(".btn-confirm-delete");
  const discountCode = document.getElementById("discountCode");
  const discountType = document.getElementById("discountType");
  const discountValue = document.getElementById("discountValue");
  const maxDiscount = document.getElementById("maxDiscount");
  const startDate = document.getElementById("startDate");
  const endDate = document.getElementById("endDate");
  const usageLimit = document.getElementById("usageLimit");
  const btnCreateDiscount = document.getElementById("btn-create-discount");
  const createDiscountForm = document.getElementById("createDiscountForm");
  const handleCreateDiscount = async (e) => {
    e.preventDefault();
    const newDiscount = {
      discount_code: discountCode.value,
      discount_type: discountType.value,
      discount_value: discountValue.value,
      discount_max_amount: maxDiscount.value,
      start_date: startDate.value,
      end_date: endDate.value,
      usage_limit: usageLimit.value,
    };

    // Kiểm tra xem tất cả các giá trị có hợp lệ hay không
    const isValid = Object.keys(newDiscount).every((key) => {
      return (
        newDiscount[key] !== "" &&
        newDiscount[key] !== null &&
        newDiscount[key] !== undefined
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
      const res = await fetch(utils.getCurrentUrl() + "/discount/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await utils.getAccessToken()}`,
        },
        body: JSON.stringify(newDiscount),
      });
      const { message } = await res.json();
      utils.showNotification({ message, status: "success" });
      utils
        .modalInstance(document.getElementById("createDiscountModal"))
        .hide();
      createDiscountForm.reset();
      await renderDiscount();
    } catch (error) {
      console.log(error);
    }
  };

  // Gắn sự kiện cho nút lưu
  btnCreateDiscount.addEventListener("click", handleCreateDiscount);

  const renderDiscount = async () => {
    try {
      const res = await fetch(utils.getCurrentUrl() + "/discount/get-all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await utils.getAccessToken()}`,
        },
      });
      const { discounts, message } = await res.json();
      const htmls = discounts.map((item, index) => {
        return `<tr>
            <td>${index + 1}</td>
            <td class="fw-bold">${item.discount_code}</td>
            <td class="discount_type" data-type="${item.discount_type}">${
          item.discount_type === "percent" ? "Phần trăm" : "Số tiền"
        }</td>
          <td class="discount_value" data-value="${item.discount_value}">${
          item.discount_value
        }${item.discount_type === "percent" ? "%" : "$"}</td>
            <td class="discount_max_amount">${item.discount_max_amount}</td>
            <td><span class="start_date">${formatDate(
              item.start_date
            )}</span> - <span class="end_date">${formatDate(
          item.end_date
        )}</span></td>
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
                <button
                  class="btn btn-sm btn-outline-danger btn-delete"
                  data-id="${item._id}"
                  data-bs-toggle="modal"
                  data-bs-target="#confirmDeleteModal"
                >
                  Xóa
                </button>
              </div>
            </td>
          </tr>`;
      });
      table.innerHTML = htmls.join("");
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteDiscount = async (id) => {
    try {
      const res = await fetch(
        utils.getCurrentUrl() + `/discount/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await utils.getAccessToken()}`,
          },
        }
      );
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
        utils.getCurrentUrl() + `/discount/change-status/${id}`,
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
  table.addEventListener("change", (e) => {
    const target = e.target;
    if (target.classList.contains("change-status")) {
      const id = target.dataset.id;
      handleChangeStatus(id);
    }
  });
  table.addEventListener("click", (e) => {
    const target = e.target;
    const id = target.dataset.id;
    if (target.classList.contains("btn-delete")) {
      btnConfirmDelete.setAttribute("data-id", id);
    }
  });
  btnConfirmDelete.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    handleDeleteDiscount(id);
    btnConfirmDelete.setAttribute("data-id", "");
    utils.modalInstance(document.getElementById("confirmDeleteModal")).hide();
  });
  renderDiscount();
};
export default promotion;
