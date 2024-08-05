import {
  getDaySaleService,
  getMonthSaleService,
} from "../services/sale.service.js";

const getMonthSaleController = async (req, res) => {
  try {
    const { start_date, end_date, status_order } = req.query;
    const { status, message, element } = await getMonthSaleService({
      start_date,
      end_date,
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
