import { getAccessToken, notification, url_api } from "./utils.js";
const listProductsCheckOut = document.getElementById("list-products-checkout");
const subtotal = document.querySelector(".subtotal");
const shipping = document.querySelector(".shipping");
const discountElement = document.querySelector(".discount");
const total = document.querySelector(".total");
const discountCodeInput = document.querySelector(".discount-code-input");
const btnApplyDiscount = document.querySelector(".btn-apply-discount");
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
subtotal.textContent = carts.reduce((acc, current) => {
  return (acc += current.product.price * current.quantity);
}, 0);
total.textContent =
  parseFloat(subtotal.textContent) + parseFloat(shipping.textContent);
btnApplyDiscount.addEventListener("click", async (e) => {
  try {
    if (e.target.value) {
      return;
    }
    if (discountElement.textContent) {
      return;
    }
    const res = await fetch(
      url_api + `/discount/get-discount/${discountCodeInput.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await getAccessToken()),
        },
      }
    );
    const { message, discount } = await res.json();
    if (!discount) {
      console.log(message);
      return;
    }
    if (discount?.discount_type === "percent") {
      discountElement.textContent =
        parseFloat(total.textContent) * (discount.discount_value / 100);
      total.textContent =
        parseFloat(total.textContent) - parseFloat(discountElement.textContent);
    } else {
      discountElement.textContent = discount.discount_value;
      total.textContent =
        parseFloat(total.textContent) - discount.discount_value;
    }
  } catch (error) {
    console.log(error);
  }
});
const htms = carts.map((product) => {
  return `<div data-quantity="${product.quantity}" class="after-quantity-product-checkout flex items-center justify-evenly gap-x-10 shadow-md rounded-md p-2 pr-5">
                <div  class="size-32">
                  <img
                    class="w-full h-full object-contain"
                    src="${product.color.url}"
                    alt=""
                  />
                </div>
                <div class="flex-1">
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
const convertCartsOrder = carts.reduce((acc, current) => {
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
              total:
                parseFloat(subtotal.textContent) +
                parseFloat(shipping.textContent),
              subtotal: parseFloat(subtotal.textContent),
              shipping: parseFloat(shipping.textContent),
              discount_code: discountCodeInput.value,
              cart: convertCartsOrder,
            }),
          }
        );

        const orderData = await response.json();
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
    },
  })
  .render("#paypal-button-container");
