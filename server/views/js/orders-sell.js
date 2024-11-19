import utils from "./utils.js";
const ItemProductOrder = ({ name, color, size, quantity }) => {
  return ` <div class="row row-cols-2 d-flex align-items-start">
              <div class="col-4">
                <img
                  src="${color.url}"
                  alt=""
                  width="100%"
                  height="100%"
                  style="object-fit: contain"
                />
              </div>
              <div class="col-8 lh-1">
                <h6 style="font-size: 14px">${name}</h6>
                <h6 style="font-size: 14px">Màu: ${color.color}</h6>
                <h6 style="font-size: 14px">Kích thước: ${size}</h6>
                <h6 style="font-size: 14px">Số lượng: ${quantity}</h6>
              </div>
            </div>
    `;
};
const ordersSell = () => {
  const cardOrders = document.querySelector(".card-orders");
  const btnSearchOrders = document.querySelector(".btn-search-orders");
  const orderIdInput = document.getElementById("orderId-input");
  const statusSelect = document.getElementById("status-select");
  let query = {};
  const statusOrder = {
    pending: "Đang chờ",
    confirmed: "Đã xác nhận",
    processing: "Đang xử lý",
    delivered: "Đã giao hàng",
    canceled: "Đã hủy",
    completed: "Đã hoàn thành",
  };
  const getDataOrders = async (query) => {
    try {
      const accessToken = await utils.getAccessToken();
      let convertQuery = "";
      if (query?.search_orderId) {
        convertQuery = `search_orderId=${query.search_orderId}`;
      } else if (query?.search_orderId && query?.search_status) {
        convertQuery = `search_orderId=${query.search_orderId}&search_status=${query.search_status}`;
      } else if (query?.search_status) {
        convertQuery = `search_status=${query.search_status}`;
      }
      const res = await fetch(
        utils.getCurrentUrl() + `/order/get-detail?${convertQuery}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      const status = ["completed", "canceled"];
      const htmls = data.element.map((item) => {
        return `<tr class="text-left" data-orderId="${item.orderId}">
          <td class="text-primary fw-medium">${item.orderId}</td>
          <td>
            <div class="row">
              <span>${utils.convertTimeUTC(item.createdAt)}</span>
            </div>
          </td>
          <td>
            <div class="row">
              <span>Họ và tên: ${item.userId.firstName} ${
          item.userId.lastName
        }</span>
              <span>Email: ${item.userId.email}</span>
              <span>SĐT: ${item.userId.phone}</span>
              <span>Địa chỉ: ${item.userId?.address}</span>
            </div>
          </td>
          <td class="row gap-3">${item.list
            .map(({ name, color, size, quantity }) =>
              ItemProductOrder({ name, color, size, quantity })
            )
            .join("")}</td>
          <td>${item.total}$</td>
          <td>0$</td>
          <td>
           <div class="row gap-2 px-3">
              <p>${statusOrder[item.status]}</p>
              <button type="button" class="btn btn-primary btn-completed-order ${
                status.includes(item.status) ? "d-none" : ""
              }">
                Hoàn thành</button
              ><button type="button" class="btn btn-danger ${
                status.includes(item.status) ? "d-none" : ""
              } btn-cancel-order">Hủy</button>
            </div>
          </td>
        </tr>
        `;
      });
      cardOrders.innerHTML = htmls.join("");
    } catch (error) {
      console.log(error);
    }
  };
  getDataOrders();
  statusSelect.addEventListener("change", async (e) => {
    const search_status = e.target.value;
    query.search_status = search_status;
    await getDataOrders(query);
  });
  btnSearchOrders.addEventListener("click", async () => {
    query.search_orderId = orderIdInput.value;
    await getDataOrders(query);
  });
  const mutationCardOrder = () => {
    const btnCompletedOrder = document.querySelectorAll(".btn-completed-order");
    const btnCancelOrder = document.querySelectorAll(".btn-cancel-order");
    const completedOrder = async (orderId) => {
      try {
        const accessToken = await utils.getAccessToken();
        const res = await fetch(
          utils.getCurrentUrl() + `/order/update-order/${orderId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ orderStatus: "completed" }),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          return utils.showNotification({
            message: "Có lỗi xảy ra",
            status: "warning",
          });
        }
        utils.showNotification({
          message: "Đã hoàn thành đơn hàng",
          status: "success",
        });
        await getDataOrders();
      } catch (error) {
        console.log(error);
      }
    };
    const cancelOrder = async (orderId) => {
      try {
        const accessToken = await utils.getAccessToken();
        const res = await fetch(
          utils.getCurrentUrl() + `/order/update-order/${orderId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ orderStatus: "canceled" }),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          return utils.showNotification({
            message: "Có lỗi xảy ra",
            status: "warning",
          });
        }
        utils.showNotification({
          message: "Đã hủy đơn hàng",
          status: "success",
        });
        await getDataOrders();
      } catch (error) {
        console.log(error);
      }
    };
    btnCompletedOrder.forEach((item) => {
      item.addEventListener("click", async (e) => {
        const orderId =
          e.target.parentElement.parentElement.parentElement.dataset.orderid;
        await completedOrder(orderId);
      });
    });
    btnCancelOrder.forEach((item) => {
      item.addEventListener("click", async (e) => {
        const orderId =
          e.target.parentElement.parentElement.parentElement.dataset.orderid;
        await cancelOrder(orderId);
      });
    });
  };
  utils.mutationObserverElement(cardOrders, mutationCardOrder, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true,
  });
};
export default ordersSell;
