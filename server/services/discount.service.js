import _discount from "../models/discount.model.js";

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
    const isDiscount = await _discount.create({
      discount_code,
      discount_percent,
      discount_amount,
      discount_max_amount,
      start_date,
      end_date,
      quantity,
    });
    if (isDiscount) {
      return {
        status: 200,
        message: "Added successfully!",
      };
    }
    return {
      status: 500,
      message: "Internal server error",
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
export { createDiscountService, deleteDiscountService };
