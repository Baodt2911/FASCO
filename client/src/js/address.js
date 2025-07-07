import { getAccessToken, isLoggedIn, notification, url_api } from "./utils.js";
const isLogin = await isLoggedIn();
if (!isLogin) {
  window.location.href = "signIn.html";
}
const listAddress = document.getElementById("list-address");
const firstNameForm = document.getElementById("firstNameAddressForm");
const lastNameForm = document.getElementById("lastNameAddressForm");
const postcodeForm = document.getElementById("postcodeAddressForm");
const countryForm = document.getElementById("countryAddressForm");
const cityForm = document.getElementById("cityAddressForm");
const addressLine1Form = document.getElementById("addressLine1Form");
const addressLine2Form = document.getElementById("addressLine2Form");
const isDefault = document.getElementById("isDefault");
const btnSaveModalAddress = document.getElementById("btn-save-modal-address");
const btnConfirmRemoveAddress = document.getElementById("btn-confirm-remove");
const getAddress = async () => {
  try {
    const res = await fetch(url_api + "/address/get", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    });
    const { message, address } = await res.json();
    if (message) console.error(message);
    if (address) {
      address.sort((a, b) => b.isDefault - a.isDefault); // Sắp xếp isDefault: true lên đầu
    }
    const htmls = address?.map((item) => {
      return `
             <div
              class="bg-white border border-gray-200 rounded-lg shadow-md p-6 w-full max-w-md"
            >
              <!-- Card Header -->
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-gray-800">
                  Delivery Address
                </h2>
                <span
                  class="${
                    item.isDefault ? "block" : "hidden"
                  } text-sm text-blue-600 bg-blue-100 rounded-full px-2 py-1"
                  >Default</span
                >
              </div>
              <!-- Address Details -->
              <div class="text-sm text-gray-700 space-y-2">
                <p><strong>Name:</strong> 
                <span class="item-firstName">${
                  item.firstName
                }</span> <span class="item-lastName">${item.lastName}</span></p>
                <p><strong>Address1:</strong> <span class="item-address1">${
                  item.addressLine1
                }</span></p>
                <p><strong>Address2:</strong> <span class="item-address2">${
                  item.addressLine2
                }</span></p>
                <p><strong>City:</strong> <span class="item-city">${
                  item.city
                }</span></p>
                <p><strong>Postal Code:</strong> <span class="item-postcode">${
                  item.postcode
                }</span></p>
                <p><strong>Country:</strong> <span class="item-country">${
                  item.country
                }</span></p>
              </div>
              <!-- Actions -->
              <div class="flex justify-between mt-4">
                <button
                  data-id="${item._id}"
                  onclick="openModalAddress()"
                  class="btn-edit-address px-4 py-2 text-sm text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-100"
                >
                  Edit
                </button>
                <button
                  data-id="${item._id}"
                  onclick="openRemoveAddressModal()"
                  class="btn-remove-address px-4 py-2 text-sm text-red-700 border border-red-300 rounded-lg hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            </div>
        `;
    });
    listAddress.innerHTML = htmls?.join("");
    const btnEditAddress = document.querySelectorAll(".btn-edit-address");
    const btnRemoveAddress = document.querySelectorAll(".btn-remove-address");
    btnRemoveAddress.forEach((item) => {
      item.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        btnConfirmRemoveAddress.dataset.id = id;
      });
    });
    btnEditAddress.forEach((item) => {
      item.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const card = e.target.parentElement.parentElement;
        btnSaveModalAddress.dataset.create = "false";
        btnSaveModalAddress.dataset.id = id;
        firstNameForm.value = card.querySelector(".item-firstName").textContent;
        lastNameForm.value = card.querySelector(".item-lastName").textContent;
        postcodeForm.value = card.querySelector(".item-postcode").textContent;
        countryForm.value = card.querySelector(".item-country").textContent;
        cityForm.value = card.querySelector(".item-city").textContent;
        addressLine1Form.value =
          card.querySelector(".item-address1").textContent;
        addressLine2Form.value =
          card.querySelector(".item-address1").textContent;
      });
    });
  } catch (error) {
    console.log(error);
  }
};
await getAddress();

const handleRemoveAddress = async (e) => {
  const id = btnConfirmRemoveAddress.dataset.id;
  try {
    const res = await fetch(url_api + `/address/remove/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    });
    const { message } = await res.json();
    notification({ message, status: "success" });
    isDefault.checked = false;
    await getAddress();
    closeRemoveAddressModal();
  } catch (error) {
    console.log(error);
  }
};
const handleSaveAddress = async (e) => {
  const id = btnSaveModalAddress.dataset.id;
  let path = "/address/add-new";
  if (btnSaveModalAddress.dataset.create === "false") {
    path = `/address/edit/${id}`;
  }
  const newAddress = {
    firstName: firstNameForm.value,
    lastName: lastNameForm.value,
    postcode: postcodeForm.value,
    country: countryForm.value,
    city: cityForm.value,
    addressLine1: addressLine1Form.value,
    addressLine2: addressLine2Form.value,
    isDefault: isDefault.checked,
  };
  // Kiểm tra nếu tất cả trường đều hợp lệ
  const isValid = Object.keys(newAddress).every((key) => {
    if (key === "isDefault") return true; // Không cần kiểm tra checkbox
    return (
      newAddress[key] !== "" &&
      newAddress[key] !== null &&
      newAddress[key] !== undefined
    );
  });

  if (!isValid) {
    notification({
      message: "Vui lòng điền đầy đủ thông tin",
      status: "warning",
    });
    return;
  }
  try {
    const res = await fetch(url_api + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify(newAddress),
    });
    const { message } = await res.json();
    notification({ message, status: "success" });
    isDefault.checked = false;
    await getAddress();
    closeModalAddress();
    document.getElementById("addressForm").reset();
  } catch (error) {
    console.log(error);
  }
};
btnSaveModalAddress.addEventListener("click", handleSaveAddress);
btnConfirmRemoveAddress.addEventListener("click", handleRemoveAddress);
