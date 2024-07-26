import {
  getDaySaleService,
  getMonthSaleService,
} from "../services/sale.service.js";

const getMonthSaleController = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const { status, message, element } = await getMonthSaleService({
      start_date,
      end_date,
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
    const { day, month, year } = req.query;
    console.log({ day, month, year });
    const { status, message, element } = await getDaySaleService({
      day: +day,
      month: +month,
      year: +year,
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
