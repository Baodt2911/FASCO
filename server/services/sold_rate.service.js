import _soldRate from "../models/sold_rate.model.js";
import _review from "../models/review.model.js";
import _product from "../models/product.model.js";
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
    const isProduct = soldRate ? null : await _product.findById(idProduct);

    if (!soldRate && !isProduct) {
      return {
        status: 404,
        message: "Sold rate not found",
      };
    }

    return {
      status: 200,
      element: soldRate || {
        idProduct: isProduct._id,
        rate: 0,
        sold: 0,
      },
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

    const isSoldRate = await _soldRate.findOneAndUpdate(
      { idProduct },
      { $inc: { sold: 1 } },
      { new: true, upsert: true }
    );
    return {
      status: 200,
      message: "Add sold successfully",
    };
  } catch (error) {
    console.log(error);
  }
};

const addRateService = async ({ idProduct }) => {
  try {
    if (checkId(idProduct)) {
      return {
        status: 500,
        message: "_id product invalid",
      };
    }

    const [isSoldRate, totalReviews] = await Promise.all([
      _soldRate.findOne({ idProduct }),
      _review.find({ idProduct }),
    ]);

    if (!totalReviews.length) {
      return {
        status: 404,
        message: "Review not found",
      };
    }

    if (!isSoldRate) {
      return {
        status: 404,
        message: "Sold_rate not found",
      };
    }

    const totalRate = totalReviews.reduce((acc, { rate }) => acc + rate, 0);
    const newAverageRating = totalRate / totalReviews.length;

    await _soldRate.updateOne({ idProduct }, { rate: newAverageRating });

    return {
      status: 200,
      message: "Add rate successfully",
    };
  } catch (error) {
    console.log(error);
  }
};

const deleteSoldRateService = async (_id) => {
  try {
    const isSoldRate = await _soldRate.findByIdAndDelete(_id);
    if (!isSoldRate) {
      return {
        status: 404,
        message: "Sold rate not found",
      };
    }
    return {
      status: 200,
      message: "Deleted sold rate successfully",
    };
  } catch (error) {
    console.log(error);
  }
};
export {
  addSoldService,
  addRateService,
  getSoldRateService,
  deleteSoldRateService,
};
