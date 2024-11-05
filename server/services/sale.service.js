import _order from "../models/order.model.js";

const getMonthSaleService = async ({ year, month, status_order }) => {
  try {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
    const sales = await _order.aggregate([
      {
        $match: {
          $and: [
            {
              status: status_order,
            },
            {
              createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth,
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        // Sắp xếp theo ngày để dữ liệu hiển thị đúng thứ tự
        $sort: { "_id.day": 1 },
      },
    ]);
    // Tạo mảng với dữ liệu của từng ngày, nếu ngày nào không có dữ liệu thì gán doanh thu = 0
    const daysInMonth = new Date(year, month, 0).getDate(); // Lấy số ngày trong tháng
    const dailyRevenue = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      totalRevenue: 0,
      totalOrders: 0,
    }));

    // Ghép dữ liệu từ aggregation vào đúng ngày
    sales.forEach((r) => {
      dailyRevenue[r._id.day - 1].totalRevenue = r.totalRevenue;
      dailyRevenue[r._id.day - 1].totalOrders = r.totalOrders;
    });
    if (!sales) {
      return {
        status: 404,
        message: "sales not found",
      };
    }
    return {
      status: 200,
      element: dailyRevenue,
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
