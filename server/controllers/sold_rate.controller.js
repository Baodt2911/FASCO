import {
  addRateService,
  addSoldService,
  getSoldRateService,
} from "../services/sold_rate.service.js";

const addSoldController = async (req, res) => {
  try {
    const { id } = req.query;
    const { message, status, element } = await addSoldService({
      idProduct: id,
    });
    res.status(status).json({
      message,
      element,
    });
  } catch (error) {
    console.log(error);
  }
};
const addRateController = async (req, res) => {
  try {
    const { id } = req.query;
    const { message, status, element } = await addRateService({
      idProduct: id,
    });
    res.status(status).json({
      message,
      element,
    });
  } catch (error) {
    console.log(error);
  }
};
const getSoldRateController = async (req, res) => {
  try {
    const { id } = req.query;
    const { message, status, element } = await getSoldRateService({
      idProduct: id,
    });
    res.status(status).json({
      message,
      element,
    });
  } catch (error) {
    console.log(error);
  }
};
export { getSoldRateController, addRateController, addSoldController };
