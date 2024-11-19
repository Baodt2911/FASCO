import _discount from "../models/discount.model.js";
const getDiscountService = async ({ code }) => {
  try {
    const discount = await _discount.findOne({ discount_code: code });
    if (!discount) {
      return {
        status: 404,
        message: "Discount not found!",
      };
    }
    const {
      discount_code,
      discount_percent,
      discount_amount,
      discount_max_amount,
    } = discount._doc;
    return {
      status: 200,
      element: {
        discount_code,
        discount_percent,
        discount_amount,
        discount_max_amount,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
const createDiscountService = async ({
  discount_code,
  discount_percent,
  discount_amount,
  discount_max_amount,
  start_date,
  end_date,
  quantity,
}) => {
  try {
    const isDiscount = await _discount.findOne({ discount_code });
    if (isDiscount) {
      return {
        status: 409,
        message: "Discount already exists!",
      };
    }
    await _discount.create({
      discount_code,
      discount_percent,
      discount_amount,
      discount_max_amount,
      start_date,
      end_date,
      quantity,
    });

    return {
      status: 200,
      message: "Added successfully!",
    };
  } catch (error) {
    console.log(error);
  }
};
const deleteDiscountService = async (_id) => {
  try {
    const isDiscount = await _discount.findByIdAndDelete(_id);
    if (!isDiscount) {
      return {
        status: 404,
        message: "Discount not found!",
      };
    }
    return {
      status: 200,
      message: "Delete discount successfully!",
    };
  } catch (error) {
    console.log(error);
  }
};
export { createDiscountService, deleteDiscountService, getDiscountService };
