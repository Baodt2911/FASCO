<div class="d-flex items-start gap-3">
          <div
            class="col-4 rounded-3 item-image-product"
            style="
              position: relative;
              height: 220px;
              cursor: pointer !important;
            "
          >
            <div style="height: 80%; margin-top: 5px">
              <img
                src=""
                alt=""
                class="image-photo col-12"
                style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  border-radius: 6px 6px 0 0;
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
              <input type="text" class="form-control item-color" />
            </div>
          </div>
          <!-- size && quantity  -->
          <div class="d-flex flex-column">
            <!-- list size, quantity -->
            <ol
              class="d-flex flex-column flex-fill row-gap-1"
              id="list-size-quantity"
            >
              <li>
                <span>Kích thước: <b class="item-size">S</b></span>
                <span class="mx-4"
                  >Số lượng: <b class="item-quantity">100</b></span
                >
                <span class="btn-remove-size-quantity" style="cursor: pointer">
                  <i class="bi bi-x text-danger fs-4"></i>
                </span>
              </li>
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
              <button type="button" class="btn btn-primary col-3">Thêm</button>
            </div>
          </div>
        </div>
