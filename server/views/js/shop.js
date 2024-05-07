const shop = () => {
  const uploadPhotos = document.getElementById("upload-photos");
  const cardPhotos = document.getElementById("card-photos-product");
  const color = document.getElementById("color-product");
  const quantity = document.getElementById("quantity-product");
  const size = document.getElementById("size-product");
  const btnEdit = document.getElementById("btn-edit");
  const objectURLs = [];
  const renderPhotos = (item) => {
    const files = item.target.files;
    if (!(files && files[0])) {
      return;
    }
    const url = URL.createObjectURL(files[0]);
    objectURLs.push(url);
    const div = document.createElement("div");
    div.classList.add("col-3");
    div.classList.add("rounded-3");
    div.classList.add("border");

    div.style = "position: relative; height: 250px";
    div.innerHTML = `
       <div style="height: 60%">
            <img
              src="${url}"
              alt=""
              class="image-photo col-12 rounded"
              style="width: 100%; height: 100%; object-fit: cover"
            />
          </div>
          <div
            class="btn-close-image order shadow rounded-circle bg-light text-center"
            style="
              width: 25px;
              height: 25px;
              cursor: pointer;
              position: absolute;
              top: -10px;
              right: 0;
            "
          >
            <i class="bi bi-x text-dark"></i>
          </div>
          <div class="col-12">
             <span class="fs-6">Màu: <b>${color.value}</b></span>
            <br/>
            <span class="fs-6">Số lượng: <b>${quantity.value}</b></span>
            <br/>
            <span class="fs-6">Kích thước: <b>${size.value}</b></span>
          </div>
        `;
    cardPhotos.appendChild(div);
    quantity.value = "";
    color.value = "";
    uploadPhotos.disabled = true;
  };
  uploadPhotos.addEventListener("change", renderPhotos);
  const cleanUpURLs = () => {
    objectURLs.forEach((url) => {
      URL.revokeObjectURL(url);
    });
  };
};
export default shop;
