import _cart from "../models/cart.model.js";
import { checkId } from "../utils/check_id.js";
const getCartService = async ({ userId }) => {
  try {
    const carts = await _cart.findOne({ userId }).populate("products");
    if (!carts) {
      return {
        status: 404,
        message: "Not found cart!",
      };
    }
    return {
      status: 200,
      element: carts._doc.products.reverse(),
    };
  } catch (error) {
    console.log(error);
  }
};
const createCartService = async ({ userId }) => {
  try {
    await _cart.create({ userId });
    return {
      status: 200,
      message: "Created cart successfully!",
    };
  } catch (error) {
    console.log(error);
  }
};
const addToCartService = async ({ userId, products }) => {
  try {
    // Check id invalid
    if (checkId(products[0])) {
      return {
        status: 500,
        message: "_id products invalid",
      };
    }
    const cart = await _cart.findOneAndUpdate(
      { userId },
      { $push: { products } }
    );
    if (!cart) {
      return {
        status: 404,
        message: "Not found cart!",
      };
    }
    return {
      status: 200,
      message: "Added to cart!",
    };
  } catch (error) {
    console.log(error);
  }
};
export { getCartService, createCartService, addToCartService };
