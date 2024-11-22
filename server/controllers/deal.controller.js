import {
  createDealService,
  getDealService,
  updateDealService,
} from "../services/deal.service.js";

const createDealController = async (req, res) => {
  try {
    const {
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
    } = req.body;
    const { status, message, element } = await createDealService({
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
    res.status(status).json({
      message,
    });
  } catch (error) {
    console.log(error);
  }
};
const getDealController = async (req, res) => {
  try {
    const { status, message, element } = await getDealService();
    res.status(status).json({
      message,
      deals: element,
    });
  } catch (error) {
    console.log(error);
  }
};
const updateDealController = async (req, res) => {
  try {
    const _id = req.params._id;
    const { status, message, element } = await updateDealService({ _id });
    res.status(status).json({
      message,
    });
  } catch (error) {
    console.log(error);
  }
};
export { createDealController, getDealController, updateDealController };
