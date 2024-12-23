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
      .find({ status: "active", end_date: { $gt: new Date() } })
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
        "priority",
      ]);

    return {
      status: 200,
      element: deals,
    };
  } catch (error) {
    console.log(error);
  }
};
const getAllDealService = async () => {
  try {
    const deals = await _deal.find().populate({
      path: "applied_products",
      model: "products",
      select: ["name", "photos"],
      populate: {
        path: "photos",
        model: "photos",
        select: ["url"],
      },
    });
    return {
      status: 200,
      element: deals,
    };
  } catch (error) {
    console.log(error);
  }
};
const updateDealService = async ({ _id, data }) => {
  try {
    const updatedDeal = await _deal.findByIdAndUpdate(_id, data);
    if (!updatedDeal) {
      return {
        status: 404,
        message: "Deal not found!",
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

const changeStatusDealService = async ({ _id }) => {
  try {
    const isDeal = await _deal.findById(_id);
    if (!isDeal) {
      return {
        status: 404,
        message: "Deal is not found",
      };
    }
    await isDeal.updateOne({
      $set: { status: isDeal.status === "active" ? "inactive" : "active" },
    });
    return {
      status: 200,
      message: "Changed successfully!",
    };
  } catch (error) {
    console.log(error);
  }
};
const deleteDealService = async ({ _id }) => {
  try {
    const isDeal = await _deal.findByIdAndDelete(_id);
    if (!isDeal) {
      return {
        status: 404,
        message: "Deal is not found",
      };
    }

    return {
      status: 200,
      message: "Deleted successfully!",
    };
  } catch (error) {
    console.log(error);
  }
};
export {
  createDealService,
  getDealService,
  getAllDealService,
  changeStatusDealService,
  deleteDealService,
  updateDealService,
};
