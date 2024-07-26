import _order from "../models/order.model.js";

const getMonthSaleService = async ({ start_date, end_date }) => {
  try {
    const sales = await _order.find({
      createdAt: {
        $gte: new Date(start_date),
        $lt: new Date(end_date),
      },
    });
    if (!sales) {
      return {
        status: 404,
        message: "sales not found",
      };
    }
    return {
      status: 200,
      element: sales,
    };
  } catch (error) {
    console.log(error);
  }
};
const getDaySaleService = async ({ day, month, year }) => {
  try {
    const sales = await _order.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $dayOfMonth: "$createdAt" }, day] },
              { $eq: [{ $month: "$createdAt" }, month] },
              { $eq: [{ $year: "$createdAt" }, year] },
            ],
          },
        },
      },
    ]);
    if (!sales) {
      return {
        status: 404,
        message: "sales not found",
      };
    }
    return {
      status: 200,
      element: sales,
    };
  } catch (error) {
    console.log(error);
  }
};
export { getMonthSaleService, getDaySaleService };
