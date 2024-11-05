import utils from "./utils.js";
const ItemComment = ({ photos, content, orderId, createdAt, rate }) => {
  return `
        <div class="row gap-2">
      <div class="col-2 shadow-sm rounded" style="height: 200px">
        <img
          src="${photos[0].url}"
          alt="..."
          style="width: 100%; height: 100%; object-fit: contain"
        />
      </div>
      <div class="col-8">
        <h6><b>Mã đơn hàng: </b> <a href="">${orderId}</a></h6>
        <p>
          <b>Nội dung: </b>
          <i class="fs-6"
            >${content}
          </i>
        </p>
        <p class="fs-6"><b>Ngày tạo: </b><i>${utils.convertTimeUTC(
          createdAt
        )}</i></p>
        <div class="d-flex align-item-center gap-2 text-warning">
        ${Array(rate).fill(`<i class="bi bi-star-fill fs-5"></i>`).join("")}
        </div>
      </div>
    </div>
    `;
};
const comments = () => {
  const cardComments = document.getElementById("card-comments");
  const getDataComment = async () => {
    try {
      const accessToken = await utils.getAccessToken();
      const res = await fetch(
        utils.getCurrentUrl() + `/review/get-review?to=popular`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      const htmls = data.reviews.map(
        ({ content, rate, orderId, createdAt, idProduct: { photos } }) =>
          ItemComment({ content, rate, orderId, createdAt, photos })
      );
      cardComments.innerHTML = htmls.join("");
    } catch (error) {
      console.log(error);
    }
  };
  getDataComment();
};
export default comments;
