import _discount from "../models/discount.model.js";
const getDiscountService = async ({ discount_code }) => {
  try {
    const discount = await _discount.findOne({
      discount_code,
      status: "active",
      end_date: { $gte: new Date() },
      $expr: { $gt: ["$usage_limit", "$usage_count"] },
    });
    if (!discount) {
      return {
        status: 400,
        message: "The discount code is invalid or expired.",
      };
    }
    return {
      status: 200,
      element: {
        discount_type: discount.discount_type,
        discount_value: discount.discount_value,
        discount_max_amount: discount.discount_max_amount || null,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
const createDiscountService = async ({
  discount_code,
  discount_type,
  discount_value,
  discount_max_amount,
  start_date,
  end_date,
  usage_limit,
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
      discount_type,
      discount_value,
      discount_max_amount,
      start_date,
      end_date,
      usage_limit,
    });

    return {
      status: 201,
      message: "Created successfully!",
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
