import { getAccessToken, isLoggedIn, notification, url_api } from "./utils.js";
const isLogin = await isLoggedIn();
if (!isLogin) {
  window.location.href = "signIn.html";
}
const orderList = document.getElementById("orders-list");
const ItemProductOrder = ({
  orderId,
  _id,
  idProduct,
  name,
  url,
  color,
  size,
  quantity,
  price,
  status,
  isRate,
}) => {
  return `
        <div class="flex items-center justify-between">
            <div>
            <img
                src="${url}"
                alt="${color}"
                class="w-20 h-20 object-contain"
            />
            </div>
            <div class="flex-1 ml-4">
                <p class="font-medium text-gray-800">${name}</p>
                <p class="text-sm text-gray-600">
                Color: ${color} | Size: ${size} | Quantity: ${quantity}
                </p>
                <!-- Rate button -->
                <button
                onclick="openModalRating('${orderId}','${_id}','${idProduct}','${url}','${name}')"
                class="btn-rate-product text-sm text-blue-600 hover:underline ${
                  status === "completed" && !isRate ? "block" : "hidden"
                }"
                >
                Rate product
                </button>
            </div>
            <p class="text-gray-800 font-semibold">$${price}</p>
        </div>
    `;
};
function formatDate(dateString) {
  const date = new Date(dateString);

  const options = { month: "short", day: "2-digit", year: "numeric" };
  const formattedDate = date.toLocaleDateString("vi-VN", options);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const formattedTime = `${hours}:${minutes}`;

  return `${formattedDate} • ${formattedTime}`;
}
(async function () {
  try {
    const res = await fetch(url_api + "/order/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    });
    const { message, orders } = await res.json();
    const itemOrder = orders.map((order) => {
      return `
            <div class="bg-white shadow rounded-lg p-6">
              <!-- Order Header -->
              <div class="flex justify-between items-center border-b pb-4 mb-4">
                <div>
                  <p class="text-gray-700 text-sm">Order ID:</p>
                  <p class="text-lg font-semibold text-gray-800">#${
                    order.orderId
                  }</p>
                  <!-- Purchase Time -->
                  <div class="flex items-center space-x-2 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.5-12a.5.5 0 01.5.5V10h3a.5.5 0 010 1h-3.5a.5.5 0 01-.5-.5V6.5a.5.5 0 01.5-.5z" clip-rule="evenodd" />
                    </svg>
                    <div>
                      <p class="text-sm text-gray-700">Purchased on:</p>
                      <p class="text-sm font-medium text-gray-800">${formatDate(
                        order.createdAt
                      )}</p>
                    </div>
                  </div>
                </div>
                <span
                  class="capitalize text-sm font-medium px-5 py-2 rounded-full ${
                    order.status
                  }"
                >
                  ${order.status}
                </span>
              </div>
              <!-- Product List -->
              <div class="flex flex-col items-center">
              <div id="${
                order.orderId
              }" class="w-full max-h-72 overflow-hidden space-y-4">
                <!-- Product -->
                ${order.list
                  .map((item) =>
                    ItemProductOrder({
                      orderId: order.orderId,
                      _id: item._id,
                      idProduct: item.product._id,
                      name: item.product.name,
                      price: item.product.price,
                      color: item.color.color,
                      url: item.color.url,
                      quantity: item.quantity,
                      size: item.size,
                      status: order.status,
                      isRate: item.isRate,
                    })
                  )
                  .join("")}
              </div>
                <!-- View more button  -->
                <button
                  onclick="viewMore(this,'${order.orderId}')"
                  class="size-10 rounded-full shadow bg-white mt-5 ${
                    order.list.length > 3 ? "block" : "hidden"
                  }"
                >
                  <i class="fa-solid fa-chevron-down"></i>
                </button>
              </div>
              <!-- Total and Actions -->
              <div class="border-t pt-4 mt-4 flex justify-between items-center">
                <div>
                  <p class="font-semibold text-gray-800">Total:</p>
                  <p class="text-lg font-bold text-gray-800">$${order.total}</p>
                </div>
                <div class="flex space-x-4">
                  <!-- Cancel Button -->
                  <button
                    onclick="openModalCancel('${order.orderId}')"
                    class="${
                      order.status === "confirmed" ? "flex" : "hidden"
                    } items-center space-x-2 px-4 py-2 border rounded-md text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 10-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Cancel</span>
                  </button>
                  <!-- Repayment Button -->
                  <button 
                    onclick="openModalPayment()"
                    data-order_id = "${order.orderId}"
                    class="btn-repayment ${
                      ["pending", "canceled"].includes(order.status)
                        ? "flex"
                        : "hidden"
                    } items-center space-x-2 px-4 py-2 border rounded-md text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1a7 7 0 017 7 7 7 0 01-7 7 7 7 0 01-7-7 7 7 0 017-7zm0 2a5 5 0 100 10 5 5 0 000-10zm7 14h-2v1H7v-1H5v5h14v-5zm-3 3H8v-1h8v1z" />
                    </svg>
                    <span>Repayment</span>
                  </button>
                </div>
              </div>
            </div>
        `;
    });
    orderList.innerHTML = itemOrder.join("");
    const btnRepayment = document.querySelectorAll(".btn-repayment");
    btnRepayment.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const orderId = e.currentTarget.dataset.order_id;
        const orderResult = orders.find((item) => item.orderId === orderId);
        const { total, list } = orderResult;
        const cart = list.reduce((acc, current) => {
          acc.push({
            product: current.product._id,
            name: current.product.name,
            quantity: current.quantity,
            size: current.size,
            color: current.color._id,
            category: "PHYSICAL_GOODS",
            unit_amount: {
              currency_code: "USD",
              value: current.product.price,
            },
          });
          return acc;
        }, []);
        const shipping = 10;
        const subtotal = total - shipping;
        if (
          document
            .getElementById("paypal-button-container")
            .querySelector(".paypal-buttons")
        ) {
          return;
        }
        paypal
          .Buttons({
            style: {
              layout: "vertical",
              color: "white",
              shape: "rect",
            },
            async createOrder() {
              try {
                const response = await fetch(
                  "http://localhost:3000/order/create-order",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${await getAccessToken()}`,
                    },
                    body: JSON.stringify({
                      total,
                      subtotal,
                      shipping,
                      cart,
                    }),
                  }
                );

                const orderData = await response.json();
                console.log(orderData);

                return orderData?.element.id;
              } catch (error) {
                console.error("Paypal error: ", error);
                throw error;
              }
            },
            async onApprove(data) {
              // Capture the funds from the transaction.
              const response = await fetch(
                `http://localhost:3000/order/complete-order/${data.orderID}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${await getAccessToken()}`,
                  },
                }
              );
              const { message, element } = await response.json();
              notification({ message, status: "success" });
              window.location.reload();
            },
          })
          .render("#paypal-button-container");
      });
    });
  } catch (error) {
    console.log(error);
  }
})();
const btnConfirmCancel = document.getElementById("btn-confirm-cancel");
btnConfirmCancel.addEventListener("click", async (e) => {
  const orderId = e.currentTarget.dataset.order_id;
  try {
    const res = await fetch(url_api + `/payment/refund/${orderId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    });
    const { message } = await res.json();
    notification({ message, status: "success" });
    document
      .getElementById("cancelModal")
      .classList.add("opacity-0", "invisible");
  } catch (error) {
    console.log(error);
  }
});
// Submit Review
async function submitReview(e) {
  const reviewText = document.getElementById("reviewText").value;
  const orderId = e.target.dataset.order_id;
  const id_list_order = e.target.dataset.id;
  const idProduct = e.target.dataset.id_product;
  if (
    window.selectedRating &&
    reviewText.trim() &&
    orderId &&
    id_list_order &&
    idProduct
  ) {
    try {
      const res = await fetch(url_api + "/review/new-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAccessToken()}`,
        },
        body: JSON.stringify({
          rate: window.selectedRating,
          content: reviewText,
          orderId,
          idProduct,
          id_list_order,
        }),
      });
      const { message } = await res.json();
      notification({ message, status: "success" });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
    closeModalRating();
  } else {
  }
}
document.querySelector(".btn-submit").addEventListener("click", submitReview);
