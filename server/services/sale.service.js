import _order from "../models/order.model.js";

const getMonthSaleService = async ({ start_date, end_date, status_order }) => {
  try {
    const sales = await _order
      .find({
        $and: [
          {
            status: status_order,
          },
          {
            createdAt: {
              $gte: new Date(start_date),
              $lt: new Date(end_date),
            },
          },
        ],
      })
      .select("total");
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
const getDaySaleService = async ({ day, month, year, status_order }) => {
  try {
    const sales = await _order.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$status", status_order] },
              { $eq: [{ $dayOfMonth: "$createdAt" }, day] },
              { $eq: [{ $month: "$createdAt" }, month] },
              { $eq: [{ $year: "$createdAt" }, year] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
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
