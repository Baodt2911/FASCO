import _soldRate from "../models/sold_rate.model.js";
import _review from "../models/review.model.js";
import { checkId } from "../utils/check_id.js";

const getSoldRateService = async ({ idProduct }) => {
  try {
    if (checkId(idProduct)) {
      return {
        status: 500,
        message: "_id product invalid",
      };
    }
    const soldRate = await _soldRate.findOne({ idProduct });
    if (!soldRate) {
      return {
        status: 404,
        message: "sold rate not found",
      };
    }
    return {
      status: 200,
      element: soldRate,
    };
  } catch (error) {
    console.log(error);
  }
};
const addSoldService = async ({ idProduct }) => {
  try {
    if (checkId(idProduct)) {
      return {
        status: 500,
        message: "_id product invalid",
      };
    }
    const isSoldRate = await _soldRate.findOne({ idProduct });
    if (!isSoldRate) {
      await _soldRate.create({
        idProduct,
        sold: 1,
      });
    } else {
      await isSoldRate.updateOne({ $inc: { sold: 1 } });
    }
    return {
      status: 200,
      message: "add sold successfully",
    };
  } catch (error) {
    console.log(error);
  }
};
const addRateService = async ({ idProduct }) => {
  try {
    // Check id invalid
    if (checkId(idProduct)) {
      return {
        status: 500,
        message: "_id product invalid",
      };
    }
    const isSoldRate = await _soldRate.findOne({ idProduct });
    const totalReviews = await _review.find({ idProduct });
    const countReviews = await _review.countDocuments({ idProduct });
    if (!totalReviews) {
      return {
        status: 404,
        message: "review not found",
      };
    }
    if (!isSoldRate) {
      return {
        status: 404,
        message: "sold_rate not found",
      };
    }
    const totalRate = totalReviews.reduce(
      (acc, current) => acc + current.rate,
      0
    );
    const newAverageRating = totalRate / countReviews;
    await isSoldRate.updateOne({ rate: newAverageRating });
    return {
      status: 200,
      message: "add rate successfully",
    };
  } catch (error) {
    console.log(error);
  }
};
export { addSoldService, addRateService, getSoldRateService };
