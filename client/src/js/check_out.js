import { getAccessToken } from "./utils.js";
const listProductsCheckOut = document.getElementById("list-products-checkout");
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
const { carts } = await getCart();
console.log(carts);
const htms = carts.map((product) => {
  return `<div class="flex items-center gap-x-10">
                <div class="size-32">
                  <img
                    class="w-full h-full object-cover"
                    src="${product.color.url}"
                    alt=""
                  />
                </div>
                <div>
                  <!-- name product  -->
                  <p class="font-volkhov text-lg">
                    ${product.product.name}
                  </p>
                  <!-- size  -->
                  <p class="font-poppins text-[#484848]">Size: ${product.size}</p>
                  <!-- color  -->
                  <p class="font-poppins text-[#484848]">Color: ${product.color.color}</p>
                </div>
                <!-- price -->
                <p class="font-poppins text-[#484848]">$${product.product.price}.00</p>
              </div>`;
});
listProductsCheckOut.innerHTML = htms.join("");
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
              total: 107.5,
              subtotal: 100,
              shipping: 10,
              discount: 2.5,
              cart: [
                {
                  product: "bao",
                  quantity: 1,
                  size: "S",
                  color: "M",
                  category: "PHYSICAL_GOODS",
                  unit_amount: {
                    currency_code: "USD",
                    value: 100,
                  },
                },
              ],
            }),
          }
        );

        const orderData = await response.json();
        console.log(orderData);
        return orderData.message.id;
      } catch (error) {
        console.error("Paypal error: ", error);
        throw error;
      }
    },
    async onApprove(data) {
      // Capture the funds from the transaction.
      const response = await fetch(
        "http://localhost:3000/order/complete-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getAccessToken()}`,
          },
          body: JSON.stringify({
            orderId: data.orderID,
          }),
        }
      );
      const details = await response.json();
      console.log(data, details);
    },
  })
  .render("#paypal-button-container");
