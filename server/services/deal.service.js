import _deal from "../models/deal.model.js";

const createDealService = async ({
  title,
  description,
  discount_type,
  discount_value,
  start_date,
  end_date,
  applied_products,
  min_order_value,
  max_discount,
  usage_limit,
}) => {
  try {
    await _deal.create({
      title,
      description,
      discount_type,
      discount_value,
      start_date,
      end_date,
      applied_products,
      min_order_value,
      max_discount,
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
const getDealService = async () => {
  try {
    const deals = await _deal
      .find({ status: "active" })
      .populate({
        path: "applied_products",
        model: "products",
        select: ["name", "photos"],
        populate: {
          path: "photos",
          model: "photos",
          select: ["url"],
        },
      })
      .select([
        "title",
        "description",
        "discount_type",
        "discount_value",
        "start_date",
        "end_date",
        "applied_products",
      ]);

    return {
      status: 200,
      element: deals,
    };
  } catch (error) {
    console.log(error);
  }
};
const updateDealService = async ({ _id }) => {
  try {
    const isDeal = await _deal.findByIdAndUpdate(_id, {
      status: "inactive",
    });
    if (!isDeal) {
      return {
        status: 404,
        message: "Deal is not found",
      };
    }
    return {
      status: 200,
      message: "Updated successfully!",
    };
  } catch (error) {
    console.log(error);
  }
};
export { createDealService, getDealService, updateDealService };
