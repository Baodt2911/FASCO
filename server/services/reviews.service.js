import _review from "../models/review.model.js";
import _order from "../models/order.model.js";
import { checkId } from "../utils/check_id.js";
import { addRateService } from "./sold_rate.service.js";
import { updateOrderService } from "./order.service.js";
const getReviewProductService = async ({ id, page, pageSize, rate, to }) => {
  try {
    const skip = (page - 1) * pageSize;
    let resultReview = await _review
      .find({ rate })
      .skip(skip)
      .limit(pageSize)
      .sort({ createAt: -1 })
      .populate({
        path: "userId",
        model: "user",
        select: ["firstName", "lastName"],
      })
      .populate({
        path: "idProduct",
        model: "products",
        select: "photos",
        populate: {
          path: "photos",
          model: "photos",
          select: ["url"],
        },
      });
    if (to != "popular") {
      // Check id invalid
      if (checkId(id)) {
        return {
          status: 500,
          message: "_id products invalid",
        };
      }
      resultReview = await _review
        .find({ idProduct: id, rate })
        .skip(skip)
        .limit(pageSize)
        .populate({
          path: "userId",
          model: "user",
          select: ["firstName", "lastName"],
        });
    }

    if (!resultReview) {
      return {
        status: 404,
        message: "No result is found",
      };
    }
    return {
      status: 200,
      element: resultReview,
    };
  } catch (error) {
    console.log(error);
  }
};

const createNewReviewService = async ({
  userId,
  orderId,
  idProduct,
  id_list_order,
  rate,
  content,
}) => {
  try {
    const checkIsRate = ({ id_list_order, list }) => {
      // "id_list_order" is _id in list from _orders
      const isRate = list.some(
        (item) => item._id == id_list_order && item.isRate
      );
      return isRate;
    };
    // "id_list_order" is _id in list from _orders
    // Check id invalid
    if (checkId(idProduct) && checkId(id_list_order)) {
      return {
        status: 500,
        message: "_id products invalid",
      };
    }
    const orders = await _order.findOne({ orderId, status: "completed" });
    if (!orders) {
      return {
        status: 404,
        message: "orders not found",
      };
    }
    const { list } = orders._doc;
    if (checkIsRate({ id_list_order, list })) {
      return {
        status: 409,
        message: "The product has been previously reviewed",
      };
    }
    await _review.create({
      userId,
      orderId,
      idProduct,
      rate,
      content,
    });

    await addRateService({ idProduct });
    await updateOrderService({ orderId, id_list_order });
    return {
      status: 200,
      message: "The product has been evaluated",
    };
  } catch (error) {
    console.log(error);
  }
};
export { createNewReviewService, getReviewProductService };
