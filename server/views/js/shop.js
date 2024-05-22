import utils from "./utils.js";

const shop = () => {
  const uploadPhotos = document.getElementById("upload-photos");
  const cardPhotos = document.getElementById("card-photos-product");
  const color = document.getElementById("color-product");
  const quantity = document.getElementById("quantity-product");
  const size = document.getElementById("size-product");
  const colorModal = document.getElementById("color-product-modal");
  const quantityModal = document.getElementById("quantity-product-modal");
  const sizeModal = document.getElementById("size-product-modal");
  const imageProductModal = document.getElementById("image-product-modal");
  const btnSaveChanges = document.getElementById("btn-save_changes");
  const name = document.getElementById("name-product");
  const brand = document.getElementById("brand-product");
  const price = document.getElementById("price-product");
  const sex = document.getElementById("sex-product");
  const type = document.getElementById("type-product");
  const description = document.getElementById("description-product");
  const btnAddNew = document.getElementById("btn-add-new-product");
  const listProducts = document.getElementById("list-products");
  const objectURLs = [];
  const dataImageProduct = [];
  const handleRenderProduct = async () => {
    try {
      const res = await fetch(utils.getCurrentUrl() + "/product/all");
      const { products } = await res.json();
      if (!res.ok) {
        console.log("Không lấy được danh sách sản phẩm");
        return;
      }
      const htmls = products.map(
        (product) => `
        <tr data-id=${product._id}>
          <td data-name=${product.name} >${product.name}</td>
              <td data-brand=${product.brand} >${product.brand}</td>
              <td data-price=${product.price} >${product.price}</td>
              <td data-sex=${product.sex} >${product.sex}</td>
              <td data-type=${product.type} >${product.type}</td>
              <td data-description=${product.description} >${product.description}</td>
              <td>
                <div class="d-flex justify-content-end column-gap-3">
                <button class="rounded border item-btn-remove-product bg-danger text-white px-2">Xóa</button>
                  <button class="bg-primary rounded border text-white item-btn-edit-product px-2" data-bs-toggle="modal"
                  data-bs-target="#modal-edit-product">Sửa</button>
                </div>
              </td>
        </tr>`
      );
      listProducts.innerHTML = htmls.join("");
    } catch (error) {
      console.log(error);
    }
  };
  handleRenderProduct();

  const uploadPhoto = async (_id) => {
    const formData = new FormData();
    for (const file of dataImageProduct) {
      const metadata = {
        color: "đỏ",
        quantity: 12,
        size: "XL",
      };
      const blobWithMetadata = new Blob([file], {
        type: file.type,
        metadata,
      });

      formData.append("files", blobWithMetadata); // Append file with metadata to FormData
      formData.append("metadata", JSON.stringify(metadata)); // Append metadata as separate data (optional)
    }
    try {
      const response = await fetch(
        utils.getCurrentUrl() + `/product/upload/${_id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        console.log("Files uploaded successfully!");
        const data = await response.json();
        console.log(data);
      } else {
        console.log("File upload failed!");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      console.log("Error uploading files!");
    }
  };
  const onAddNewProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(utils.getCurrentUrl() + "/product/add-new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.value,
          brand: brand.value,
          price: price.value,
          type: type.value,
          sex: sex.value,
          description: description.value,
        }),
      });
      if (!res.ok) {
        utils.showNotification({
          message: "Thêm thất bại",
          status: "warning",
        });
        return;
      }
      const data = await res.json();
      await uploadPhoto(data.element._id);
      utils.showNotification({
        message: "Thêm thành công",
        status: "success",
      });
      document.getElementById("form-product").reset(); //reset form
      handleRenderProduct();
    } catch (error) {
      console.log(error);
    }
  };
  btnAddNew.addEventListener("click", onAddNewProduct);
  const onRenderPhotos = (item) => {
    const files = item.target.files;
    if (!(files && files[0])) {
      return;
    }
    const url = URL.createObjectURL(files[0]);
    objectURLs.push(url);
    const div = document.createElement("div");
    div.classList.add("col-4", "rounded-3", "item-image-product");
    div.style =
      "position: relative; height: 220px; cursor: pointer !important;";
    div.innerHTML = `
          <div style="height: 60%; margin-top:5px" 
          data-bs-toggle="modal"
          data-bs-target="#modal-show_image" >
            <img
              src="${url}"
              alt=""
              class="image-photo col-12"
              style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px 6px 0 0 "
            />
          </div>
          <div
            class="btn-close-image shadow rounded-circle bg-light text-center"
            style="
              width: 30px;
              height: 30px;
              cursor: pointer;
              position: absolute;
              top: -10px;
              right: 0;">
            <i class="fs-5 bi bi-x text-dark"></i>
          </div>
          <div class="col-12  px-3 py-2" 
          style="border-radius: 0 0 6px 6px; 
          box-shadow: 0 10px 25px 0 #8383834d";
          data-bs-toggle="modal"
          data-bs-target="#modal-show_image">
             <span  style="font-size:12px">Màu: <b id="color-image-product">
             ${color.value}</b></span>
             <br/>
            <span  style="font-size:12px">Số lượng: <b id="quantity-image-product">${quantity.value}</b></span>
            <br/>
            <span  style="font-size:12px">Kích thước: <b id="size-image-product">${size.value}</b></span>
          </div>
        `;
    dataImageProduct.push(files[0]);

    cardPhotos.appendChild(div);
    quantity.value = "";
    color.value = "";
    // uploadPhotos.disabled = true;
  };
  uploadPhotos.addEventListener("change", onRenderPhotos);
  const cleanUpURLs = () => {
    objectURLs.forEach((url) => {
      URL.revokeObjectURL(url);
    });
  };

  const mutationCardPhotosProduct = () => {
    const itemImageProducts = document.querySelectorAll(".item-image-product");
    const itemBtnCloseImages = document.querySelectorAll(".btn-close-image");
    btnSaveChanges.addEventListener("click", () => {
      utils.showNotification({
        message: "Đã thay đổi",
        status: "success",
      });
    });
    itemBtnCloseImages.forEach((item) => {
      item.onclick = () => {
        item.parentElement.remove();
        const imgUrl = item.parentElement.querySelector("img").src;
        URL.revokeObjectURL(imgUrl);
      };
    });
    itemImageProducts.forEach((item) => {
      item.onclick = () => {
        const imageUrl = item.querySelector("img").src;
        const color = item.querySelector("#color-image-product");
        const quantity = item.querySelector("#quantity-image-product");
        const size = item.querySelector("#size-image-product");
        // set info for modal
        imageProductModal.src = imageUrl;
        colorModal.value = color.textContent;
        quantityModal.value = quantity.textContent;
        sizeModal.value = size.textContent;
        // save changes
        btnSaveChanges.onclick = () => {
          color.innerText = colorModal.value;
          quantity.innerText = quantityModal.value;
          size.innerText = sizeModal.value;
        };
      };
    });
  };
  const mutationListProduct = () => {
    const itemBtnEditProducts = document.querySelectorAll(
      ".item-btn-edit-product"
    );
    itemBtnEditProducts.forEach((item) => {
      item.onclick = (e) => {
        const { id } = e.target.closest("tr").dataset;
        console.log(e.target.closest("tr"));
      };
    });
    const itemBtnRemoveProducts = document.querySelectorAll(
      ".item-btn-remove-product"
    );
    itemBtnRemoveProducts.forEach((item) => {
      item.onclick = async (e) => {
        const { id } = e.target.closest("tr").dataset;
        const res = await fetch(utils.getCurrentUrl() + "/product/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: id }),
        });
        if (res.ok) {
          utils.showNotification({
            message: "Đã xóa sản phẩm",
            status: "success",
          });
          handleRenderProduct();
        }
      };
    });
  };
  utils.mutationObserverElement(listProducts, mutationListProduct, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true,
  });
  utils.mutationObserverElement(cardPhotos, mutationCardPhotosProduct, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true,
  });
};
export default shop;
