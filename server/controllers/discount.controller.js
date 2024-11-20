import {
  createDiscountService,
  deleteDiscountService,
  getDiscountService,
} from "../services/discount.service.js";
const getDiscountController = async (req, res) => {
  try {
    const code = req.params.code;
    const { status, element, message } = await getDiscountService({
      code,
    });
    res.status(status).json({
      message,
      discount: element,
    });
  } catch (error) {
    console.log(error);
  }
};
const createDiscountController = async (req, res) => {
  try {
    const {
      discount_code,
      discount_type,
      discount_value,
      discount_max_amount,
      start_date,
      end_date,
      usage_limit,
    } = req.body;
    const { status, message } = await createDiscountService({
      discount_code,
      discount_type,
      discount_value,
      discount_max_amount,
      start_date,
      end_date,
      usage_limit,
    });
    res.status(status).json({
      message,
    });
  } catch (error) {
    console.log(error);
  }
};
const deleteDiscountController = async (req, res) => {
  try {
    const _id = req.params._id;
    const { status, message } = await deleteDiscountService(_id);
    res.status(status).json({
      message,
    });
  } catch (error) {
    console.log(error);
  }
};
export {
  getDiscountController,
  createDiscountController,
  deleteDiscountController,
};
