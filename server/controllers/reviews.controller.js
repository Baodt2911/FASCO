import {
  createNewReviewService,
  getReviewProductService,
} from "../services/reviews.service.js";
const getReviewProductController = async (req, res) => {
  try {
    const { id, page = 1, pageSize = 10, rate = 5, to } = req.query;
    const { status, message, element } = await getReviewProductService({
      id,
      page: +page,
      pageSize: +pageSize,
      rate: +rate,
      to,
    });
    res.status(status).json({
      message,
      datas: element,
    });
  } catch (error) {
    console.log(error);
  }
};
const createNewReviewController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { idProduct, id_list_order, orderId, rate, content } = req.body;
    // "id_list_order" is _id in list from _orders
    const { status, message, element } = await createNewReviewService({
      userId,
      idProduct,
      id_list_order,
      orderId,
      rate,
      content,
    });
    res.status(status).json({
      message,
    });
  } catch (error) {
    console.log(error);
  }
};
export { createNewReviewController, getReviewProductController };
