import _soldRate from "../models/sold_rate.model.js";
const createSoldRate = async () => {
  try {
    const soldRate = await _soldRate.create({
      sold: 0,
      rate: 0,
    });
    return soldRate._doc._id;
  } catch (error) {
    console.log(error);
  }
};
export { createSoldRate };
