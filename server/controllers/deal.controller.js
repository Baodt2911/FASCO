import {
  createDealService,
  getDealService,
  updateDealService,
} from "../services/deal.service.js";

const createDealController = async (req, res) => {
  try {
    const { status, message, element } = await createDealService();
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
      element,
    });
  } catch (error) {
    console.log(error);
  }
};
const updateDealController = async (req, res) => {
  try {
    const { status, message, element } = await updateDealService();
    res.status(status).json({
      message,
    });
  } catch (error) {
    console.log(error);
  }
};
export { createDealController, getDealController, updateDealController };
