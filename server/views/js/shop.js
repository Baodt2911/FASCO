import utils from "./utils.js";
const ItemProductElement = (url) => {
  return ` <div
            class="col-4 rounded-3"
            style="
              position: relative;
              height: 220px;
              cursor: pointer !important;
            "
          >
            <div style="
            height: 80%;
            margin-top: 5px; 
            border:1px solid #f5f5f5;
            border-bottom:none;
            border-radius: 6px 6px 0 0; 
            box-shadow: 0 -5px 15px 0 #f5f5f5">
              <img
                src="${url}"
                alt=""
                class="image-photo col-12"
                style="
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                "
              />
            </div>
            <!-- btn close image  -->
            <div
              class="btn-close-image shadow rounded-circle bg-light text-center"
              style="
                width: 30px;
                height: 30px;
                cursor: pointer;
                position: absolute;
                top: -10px;
                left: -10px;
              "
            >
              <i class="fs-5 bi bi-x text-dark"></i>
            </div>
            <div
              class="input-group input-group-sm col-12 px-3 py-2"
              style="
                border-radius: 0 0 6px 6px;
                box-shadow: 0 10px 25px 0 #8383834d;
              "
            >
              <span class="input-group-text">Màu</span>
              <input type="text" class="form-control color-product" />
            </div>
          </div>
          <!-- size && quantity  -->
          <div class="d-flex flex-column">
            <!-- list size, quantity -->
            <ol
              class="d-flex flex-column flex-fill  list-size-quantity"
            >
            </ol>
            <!-- add -->
            <div class="d-flex align-items-end gap-2">
              <div class="d-flex flex-column col-3">
                <select class="form-select mt-1 size-product">
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>
              <div class="col-6">
                <input
                  type="number"
                  class="form-control quantity-product"
                  placeholder="Số lượng"
                />
              </div>
              <button type="button" class="btn btn-primary btn-add-size-quantity col-3">Thêm</button>
            </div>
          </div>
        `;
};
const ItemPhotoProduct = ({ _id, url, color, sizes }) => {
  const sizeQuantityHtmls = sizes.map(({ _id, size, quantity }) => {
    return `
      <div class="input-group col-2 size_quantity-edit" data-id_size="${_id}">
          <span class="input-group-text size-edit" style="width:50px">${size}</span>
          <input type="number" class="form-control quantity-edit" value="${quantity}"/>
        </div>
    `;
  });
  return `
    <div class=" d-flex align-items-start gap-3 item-product-edit" data-id_photo="${_id}">
      <div class="col-4 shadow-sm rounded">
        <div style="width: 100%; height: 200px" class="photo-edit">
          <img
            src=${url}
            width="100%"
            height="100%"
            style="object-fit: contain"
          />
        </div>
        <div class="input-group shadow-sm mt-1">
          <span class="input-group-text border-0 shadow-sm">Màu</span>
          <input type="text" class="form-control border-0 fw-semibold color-edit" value="${color}"/>
        </div>
      </div>
      <!-- Card left  -->
      <div class="col-6 d-flex flex-wrap gap-2">
      ${sizeQuantityHtmls.join("")}
      </div>
      <button type="button" class="btn border btn-remove-photo-product-edit"><i class="bi bi-x-lg text-danger"></i></button>
    </div>
`;
};
const shop = () => {
  const uploadPhotosFile = document.getElementById("upload-photos-file");
  const cardPhotos = document.getElementById("card-photos-product");
  const cardPhotosModalEdit = document.getElementById(
    "card-photos-product-modal-edit"
  );
  const btnSaveChanges = document.getElementById("btn-save_changes");
  const name = document.getElementById("name-product");
  const brand = document.getElementById("brand-product");
  const price = document.getElementById("price-product");
  const sex = document.getElementById("sex-product");
  const type = document.getElementById("type-product");
  const description = document.getElementById("description-product");
  const nameProductModalEdit = document.getElementById(
    "name-product-modal-edit"
  );
  const brandProductModalEdit = document.getElementById(
    "brand-product-modal-edit"
  );
  const priceProductModalEdit = document.getElementById(
    "price-product-modal-edit"
  );
  const sexProductModalEdit = document.getElementById("sex-product-modal-edit");
  const typeProductModalEdit = document.getElementById(
    "type-product-modal-edit"
  );
  const descriptionProductModalEdit = document.getElementById(
    "description-product-modal-edit"
  );
  const uploadNewPhotosFile = document.getElementById("upload-new-photos-file");

  const btnAddNew = document.getElementById("btn-add-new-product");
  const listProducts = document.getElementById("list-products");
  const btnConfirmDelete = document.getElementById("btn-confirm-delete");
  const countProducts = document.querySelector(".count-product");
  const pagination = document.querySelector(".pagination");
  const filterSex = document.getElementById("filter-sex");
  const filterType = document.getElementById("filter-type");
  const minPrice = document.querySelector(".min-price");
  const maxPrice = document.querySelector(".max-price");
  const searchProduct = document.querySelector(".search-product");
  const btnSearch = document.getElementById("btn-search-product");
  const objectURLs = [];
  const dataImageProduct = [];
  const dataImageProductEdit = [];
  const query = {};
  const cleanUpURLsAndCardImage = () => {
    cardPhotos.innerHTML = "";
    objectURLs.forEach((url) => {
      URL.revokeObjectURL(url);
    });
  };
  const handleRenderPagination = ({ currentPage, totalPage }) => {
    pagination.innerHTML = "";
    const li_prev = document.createElement("li");
    const a_prev = document.createElement("p");
    li_prev.classList.add("page-item");
    a_prev.classList.add("page-link", "prev");
    a_prev.innerHTML = '<i class="bi bi-arrow-left"></i>';
    li_prev.appendChild(a_prev);
    pagination.appendChild(li_prev);
    for (let i = 1; i <= totalPage; i++) {
      const li = document.createElement("li");
      const a = document.createElement("p");
      if (i === currentPage) {
        li.classList.add("page-item", "active");
      }
      a.classList.add("page-link");
      a.textContent = i;
      li.appendChild(a);
      pagination.appendChild(li);
    }
    const li_next = document.createElement("li");
    const a_next = document.createElement("a");
    li_next.classList.add("page-item");
    a_next.classList.add("page-link", "next");
    a_next.innerHTML = '<i class="bi bi-arrow-right"></i>';
    li_next.appendChild(a_next);
    pagination.appendChild(li_next);
    li_next.addEventListener("click", () => {
      if (currentPage === totalPage) {
        return;
      }
      query.page = currentPage + 1;
      handleRenderProduct("/all", query);
    });
    li_prev.addEventListener("click", () => {
      if (currentPage === 1) {
        return;
      }
      query.page = currentPage - 1;
      handleRenderProduct("/all", query);
    });
  };

  const handleRenderProduct = async (path, query) => {
    try {
      const params = new URLSearchParams(query || {}).toString();
      const path_query = path + (params ? `?${params}` : "");
      const { datas } = await utils.getProducts(path_query);
      if (!datas) {
        return;
      }
      const { products, totalItem, currentPage, totalPage } = datas;
      countProducts.innerHTML = totalItem;
      handleRenderPagination({ currentPage, totalPage });
      const sex = {
        men: "Nam",
        women: "Nữ",
      };
      const types = {
        clothes: "Quần áo",
        hats: "Mũ",
        sandal: "Dép Sandal",
        belt: "Thắt lưng",
        bags: "Túi",
        shoe: "Giày",
        sunglasses: "Kính",
        beachwear: "Đồ bơi",
        other: "Khác",
      };

      const htmls = products.map(
        (product) => `
        <tr data-id=${product._id} >
              <td>
                <img src=${product.photos[0]?.url} 
                alt=${product.photos[0]?.color} 
                width="100%" height="50%" 
                style="object-fit:contain"/>
              </td>
              <td style="font-weight:600">${product?.name}</td>
              <td style="font-style: italic">${product?.brand}</td>
              <td>${product?.price}</td>
              <td>${sex[product?.sex]}</td>
              <td>${types[product?.type]}</td>
              <td>
                <div class="d-flex justify-content-end column-gap-3">
                <button class="rounded border item-btn-remove-product bg-danger text-white px-2" data-bs-toggle="modal"
                  data-bs-target="#modal-delete-product">Xóa</button>
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
  handleRenderProduct("/all", null);
  filterSex.onchange = async (e) => {
    try {
      query.sex = e.target.value;
      await handleRenderProduct("/all", query);
    } catch (error) {
      console.log(error);
    }
  };
  filterType.onchange = async (e) => {
    try {
      query.type = e.target.value;
      await handleRenderProduct("/all", query);
    } catch (error) {
      console.log(error);
    }
  };
  minPrice.addEventListener("input", async (e) => {
    try {
      query.min_price = e.target.value;
    } catch (error) {
      console.log(error);
    }
  });
  maxPrice.addEventListener("input", async (e) => {
    try {
      query.max_price = e.target.value;
      await handleRenderProduct("/all", query);
    } catch (error) {
      console.log(error);
    }
  });
  btnSearch.addEventListener("click", async (e) => {
    try {
      await handleRenderProduct(`/search?q=${searchProduct.value}`, null);
    } catch (error) {
      console.log(error);
    }
  });
  const uploadPhotoProduct = async (_id) => {
    const upload = async (data) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("metadata", JSON.stringify(data.metadata));
      try {
        const accessToken = await utils.getAccessToken();
        const response = await fetch(
          utils.getCurrentUrl() + `/photo/add/${_id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
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
      }
    };
    const uploadAllPhoto = dataImageProduct.map((data) => upload(data));
    await Promise.all(uploadAllPhoto);
  };
  const onAddNewProduct = async (e) => {
    if (!(name.value || price.value || brand.value)) {
      return;
    }
    e.preventDefault();
    if (dataImageProduct.length == 0) {
      return utils.showNotification({
        message: "Vui lòng thêm ảnh cho sản phẩm",
        status: "warning",
      });
    }
    try {
      const accessToken = await utils.getAccessToken();
      const res = await fetch(utils.getCurrentUrl() + "/product/add-new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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
      await uploadPhotoProduct(data.element._id);
      utils.showNotification({
        message: "Thêm thành công",
        status: "success",
      });
      document.getElementById("form-product").reset(); //reset form
      await handleRenderProduct("/all", null);
      cleanUpURLsAndCardImage();
    } catch (error) {
      console.log(error);
    }
  };
  btnAddNew.addEventListener("click", onAddNewProduct);
  const onRenderPhotos = (e) => {
    const sizes = [
      {
        size: "S",
        quantity: 0,
      },
      {
        size: "M",
        quantity: 0,
      },
      {
        size: "L",
        quantity: 0,
      },
      {
        size: "XL",
        quantity: 0,
      },
      {
        size: "XXL",
        quantity: 0,
      },
    ];
    const files = e.target.files;
    if (!(files && files[0])) {
      return;
    }
    const url = URL.createObjectURL(files[0]);
    objectURLs.push(url);
    const div = document.createElement("div");
    div.classList.add("d-flex", "items-start", "gap-3", "item-image-product");
    div.setAttribute("data-name", files[0].name);
    div.innerHTML = ItemProductElement(url);
    console.log(sizes);

    dataImageProduct.push({
      metadata: {
        sizes,
      },
      file: files[0],
    });
    cardPhotos.appendChild(div);
  };
  uploadPhotosFile.addEventListener("change", onRenderPhotos);
  uploadNewPhotosFile.addEventListener("change", (e) => {
    const sizes = [
      {
        size: "S",
        quantity: 0,
      },
      {
        size: "M",
        quantity: 0,
      },
      {
        size: "L",
        quantity: 0,
      },
      {
        size: "XL",
        quantity: 0,
      },
      {
        size: "XXL",
        quantity: 0,
      },
    ];
    const files = e.target.files;
    if (!(files && files[0])) {
      return;
    }
    const url = URL.createObjectURL(files[0]);
    objectURLs.push(url);
    const div = document.createElement("div");
    div.setAttribute("data-nameFile", files[0].name);
    div.innerHTML = ItemPhotoProduct({ url, sizes, color: "" });
    dataImageProductEdit.push({
      metadata: {
        sizes,
      },
      file: files[0],
    });
    cardPhotosModalEdit.prepend(div);
    console.log(dataImageProductEdit);
  });
  btnConfirmDelete.onclick = async () => {
    try {
      const { id } = btnConfirmDelete.dataset;
      const accessToken = await utils.getAccessToken();
      const res = await fetch(utils.getCurrentUrl() + `/product/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        console.error(res.statusText);
        return;
      }
      utils.showNotification({
        message: "Đã xóa sản phẩm",
        status: "success",
      });
      await handleRenderProduct("/all", null);
    } catch (error) {
      console.log(error);
    }
  };
  const mutationCardPhotosProduct = () => {
    const itemBtnCloseImages = document.querySelectorAll(".btn-close-image");
    const itemBtnAddSizeQuantity = document.querySelectorAll(
      ".btn-add-size-quantity"
    );
    const itemBtnRemoveSizeQuantity = document.querySelectorAll(
      ".btn-remove-size-quantity"
    );
    itemBtnRemoveSizeQuantity.forEach((item) => {
      item.onclick = () => {
        const nameFile = item.closest(".item-image-product").dataset.name;
        const size = item.parentElement.querySelector(".item-size");
        const quantity = item.parentElement.querySelector(".item-quantity");
        dataImageProduct.forEach((data) => {
          if (data.file.name == nameFile) {
            data.metadata.sizes.forEach((ItemSize, index) => {
              if (
                size.textContent == ItemSize.size &&
                quantity.textContent == ItemSize.quantity
              ) {
                data.metadata.sizes[index].quantity = 0;
                item.parentElement.remove(); //remove item in list size quantity
              }
            });
          }
        });
        console.log(dataImageProduct);
      };
    });
    itemBtnAddSizeQuantity.forEach((item) => {
      item.onclick = () => {
        const listSizeQuantity = item.parentElement.parentElement.querySelector(
          ".list-size-quantity"
        );
        const color =
          item.parentElement.parentElement.parentElement.querySelector(
            ".color-product"
          );
        const size = item.parentElement.querySelector(".size-product");
        const quantity = item.parentElement.querySelector(".quantity-product");
        let countList = listSizeQuantity.childElementCount;
        const li = document.createElement("li");
        const nameFile = item.closest(".item-image-product").dataset.name;
        li.innerHTML = `
          <span>Kích thước: <b class="item-size">${size.value}</b></span>
          <span class="mx-2">Số lượng: <b class="item-quantity">${quantity.value}</b></span>
          <span class="btn-remove-size-quantity bg-danger fs-6 text-center rounded-circle" style="cursor: pointer">
              <i class="bi bi-x text-white fs-5"></i>
          </span>
        `;
        if (!color.value) {
          utils.showNotification({
            message: "Bạn cần phải thêm màu cho sản phẩm",
            status: "warning",
          });
          return;
        }
        if (!quantity.value) {
          utils.showNotification({
            message: "Bạn cần phải thêm số lượng cho sản phẩm",
            status: "warning",
          });
          return;
        }
        if (!(countList >= 5)) {
          dataImageProduct.forEach((item) => {
            console.log("test:", item.file.name, nameFile);
            if (item.file.name == nameFile) {
              item.metadata.color = color.value;
              let isSize = false;
              //check size in dataImageProduct already exists
              isSize = item.metadata.sizes.some(
                (s) => s.size == size.value && s.quantity != 0
              );
              if (isSize) {
                return utils.showNotification({
                  message: "Bạn không thể thêm trùng kích thước",
                  status: "warning",
                });
              }
              const index = item.metadata.sizes.findIndex(
                (item) => item.size == size.value
              );
              console.log("test:", index, item.metadata.sizes[index]);

              item.metadata.sizes[index].quantity = parseInt(quantity.value);
              listSizeQuantity.appendChild(li);
            }
          });
          color.readOnly = true;
          quantity.value = null;
        } else {
          utils.showNotification({
            message: "Chỉ có thể thêm tối đa 5 kích thước",
            status: "warning",
          });
        }
      };
    });
    itemBtnCloseImages.forEach((item) => {
      item.onclick = () => {
        item.parentElement.parentElement.remove();
        const imgUrl =
          item.parentElement.parentElement.querySelector("img").src;
        URL.revokeObjectURL(imgUrl);
      };
    });
  };
  const mutationListProduct = () => {
    const itemBtnEditProducts = document.querySelectorAll(
      ".item-btn-edit-product"
    );
    itemBtnEditProducts.forEach((item) => {
      item.onclick = async (e) => {
        const { id } = e.target.closest("tr").dataset;
        console.log(id);

        const {
          product: { _id, photos, name, brand, type, description, price, sex },
        } = await utils.getProducts(`/detail?id=${id}`);
        nameProductModalEdit.value = name;
        brandProductModalEdit.value = brand;
        typeProductModalEdit.value = type;
        priceProductModalEdit.value = price;
        sexProductModalEdit.value = sex;
        descriptionProductModalEdit.value = description;
        const htmls = photos.map(({ _id, url, color, sizes }) => {
          return ItemPhotoProduct({ _id, url, color, sizes });
        });
        cardPhotosModalEdit.innerHTML = htmls.join("");
        cardPhotosModalEdit.setAttribute("data-id", id);
      };
    });
    const itemBtnRemoveProducts = document.querySelectorAll(
      ".item-btn-remove-product"
    );
    itemBtnRemoveProducts.forEach((item) => {
      item.onclick = async (e) => {
        const { id } = e.target.closest("tr").dataset;
        btnConfirmDelete.dataset.id = id;
      };
    });
  };
  const mutationCardEditProduct = () => {
    const itemProductsEdit = document.querySelectorAll(".item-product-edit");
    const btnRemovePhotoProductEdit = document.querySelectorAll(
      ".btn-remove-photo-product-edit"
    );
    const newColorPhoto = document.querySelectorAll(".color-edit");
    const dataProductEdit = [];
    const listPhotosRemove = [];
    const getDataProductElement = () => {
      itemProductsEdit.forEach((item) => {
        const { id_photo: _id } = item.dataset;
        const color = item.querySelector(".color-edit").value;
        const url = item.querySelector("img").src;
        const sizesElement = item.querySelectorAll(".size_quantity-edit");
        const sizes = [];
        sizesElement.forEach((item_size) => {
          const { id_size } = item_size.dataset;
          const size = item_size.querySelector(".size-edit").textContent;
          const quantity = item_size.querySelector(".quantity-edit").value;
          sizes.push({ _id: id_size, size, quantity });
        });
        dataProductEdit.push({
          _id,
          url,
          color,
          sizes,
        });
      });
    };
    newColorPhoto.forEach((item) => {
      item.addEventListener("input", (e) => {
        console.log(e.currentTarget.parentElement.parentElement.parentElement);
      });
    });
    btnRemovePhotoProductEdit.forEach((item) => {
      item.addEventListener("click", (e) => {
        const { id_photo } = e.currentTarget.parentElement.dataset;
        const index = dataProductEdit.findIndex((item) => item._id == id_photo);
        dataProductEdit.splice(index, 1);
        listPhotosRemove.push(id_photo);
        e.currentTarget.parentElement.remove();
        console.log(dataProductEdit);
      });
    });
    const handleUpdateSizeQuantity = async (data) => {
      try {
        const accessToken = await utils.getAccessToken();
        const res = await fetch(
          utils.getCurrentUrl() + `/photo/update/${data._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
          }
        );
      } catch (error) {
        console.log(error);
      }
    };
    const handleUpdateInfoProduct = async (id) => {
      try {
        const accessToken = await utils.getAccessToken();
        const res = await fetch(
          utils.getCurrentUrl() + `/product/update/${id}?is_delete_photo=true`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              name: nameProductModalEdit.value,
              brand: brandProductModalEdit.value,
              type: typeProductModalEdit.value,
              price: priceProductModalEdit.value,
              sex: sexProductModalEdit.value,
              description: descriptionProductModalEdit.value,
              photo: listPhotosRemove,
            }),
          }
        );
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          utils.showNotification({
            message: "Đã cập nhật",
            status: "success",
          });
          await handleRenderProduct("/all", null);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const handleAddNewPhoto = async (id) => {
      const uploadNewPhoto = async (data) => {
        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("metadata", JSON.stringify(data.metadata));
        try {
          const accessToken = await utils.getAccessToken();
          const response = await fetch(
            utils.getCurrentUrl() + `/photo/add/${id}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
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
        }
      };
      const uploadAllPhoto = dataImageProductEdit.map((data) =>
        uploadNewPhoto(data)
      );
      await Promise.all(uploadAllPhoto);
    };
    btnSaveChanges.addEventListener("click", async () => {
      try {
        getDataProductElement();
        const id = cardPhotosModalEdit.dataset.id;
        await handleUpdateInfoProduct(id);
        await handleAddNewPhoto(id);
        const listUpadteSizeQuantity = dataProductEdit.map(
          async (data) => await handleUpdateSizeQuantity(data)
        );
        await Promise.all(listUpadteSizeQuantity);
      } catch (error) {
        console.log(error);
      }
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
  utils.mutationObserverElement(cardPhotosModalEdit, mutationCardEditProduct, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true,
  });
};
export default shop;
