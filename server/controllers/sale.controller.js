import {
  getDaySaleService,
  getMonthSaleService,
} from "../services/sale.service.js";

const getMonthSaleController = async (req, res) => {
  try {
    const { year, month, status_order } = req.query;
    console.log(year, month);

    const { status, message, element } = await getMonthSaleService({
      year,
      month,
      status_order,
    });
    res.status(status).json({
      message,
      sales: element,
    });
  } catch (error) {
    console.log(error);
  }
};
const getDaySaleController = async (req, res) => {
  try {
    const { day, month, year, status_order } = req.query;
    const { status, message, element } = await getDaySaleService({
      day: +day,
      month: +month,
      year: +year,
      status_order,
    });
    res.status(status).json({
      message,
      sales: element,
    });
  } catch (error) {
    console.log(error);
  }
};
export { getMonthSaleController, getDaySaleController };
