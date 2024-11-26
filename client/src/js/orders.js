import { getAccessToken, url_api } from "./utils.js";
const orderList = document.getElementById("orders-list");
const ItemProductOrder = ({ name, url, color, size, quantity, price }) => {
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
                onclick="openModal()"
                class="text-sm text-blue-600 hover:underline"
                >
                Rate product
                </button>
            </div>
            <p class="text-gray-800 font-semibold">$${price}</p>
        </div>
    `;
};
const orderStatusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  canceled: "bg-red-100 text-red-800",
  completed: "bg-purple-100 text-purple-800",
};
const getListOrders = async () => {
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
                </div>
                <div>
                  <p class="text-sm text-gray-700">Status:</p>
                  <span
                    class="capitalize text-sm font-medium px-3 py-1 rounded-full ${
                      orderStatusColors[order.status]
                    }"
                  >
                    ${order.status}
                  </span>
                </div>
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
                      name: item.product.name,
                      price: item.product.price,
                      color: item.color.color,
                      url: item.color.url,
                      quantity: item.quantity,
                      size: item.size,
                    })
                  )
                  .join("")}
              </div>
                <!-- View more button  -->
                <button
                  onclick="viewMore(this,'${order.orderId}')"
                  class="btn-view_more size-10 rounded-full shadow bg-white mt-5 ${
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
                    class="flex items-center space-x-2 px-4 py-2 border rounded-md text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
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
                </div>
              </div>
            </div>
        `;
    });
    orderList.innerHTML = itemOrder.join("");
    console.log(orders);
  } catch (error) {
    console.log(error);
  }
};
await getListOrders();
// Submit Review
function submitReview() {
  const reviewText = document.getElementById("reviewText").value;
  if (window.selectedRating && reviewText.trim()) {
    alert(`Rating: ${window.selectedRating} stars\nReview: ${reviewText}`);
    closeModal(); // Close the modal after submission
  } else {
    alert("Please provide both a rating and a review.");
  }
}
document.querySelector(".btn-submit").onclick = submitReview;
