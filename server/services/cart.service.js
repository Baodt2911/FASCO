import _cart from "../models/cart.model.js";
import { checkId } from "../utils/check_id.js";
const getCartService = async ({ userId }) => {
  try {
    const carts = await _cart
      .findOne({ userId })
      .populate({
        path: "carts",
        populate: {
          path: "product",
          model: "products",
          select: ["name", "brand", "price"],
        },
      })
      .populate({
        path: "carts",
        populate: {
          path: "color",
          model: "photos",
          select: ["url", "color"],
        },
      });
    if (!carts) {
      return {
        status: 404,
        message: "Not found cart!",
      };
    }
    return {
      status: 200,
      element: carts,
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
const addToCartService = async ({ userId, carts }) => {
  try {
    // Check id invalid
    if (checkId(carts.product)) {
      return {
        status: 500,
        message: "_id products invalid",
      };
    }
    const cart = await _cart.findOne({ userId });
    const incQuantity = await _cart.findOneAndUpdate(
      {
        userId,
        carts: {
          $elemMatch: {
            product: carts.product,
            color: carts.color,
            size: carts.size,
          },
        },
      },
      {
        $inc: { "carts.$.quantity": carts.quantity || 1 },
        // $inc  increment or decrement
        // $: The positional operator in MongoDB, which represents the matched element in the array based on the previous query condition $elemMatch
      }
    );
    if (!cart) {
      return {
        status: 404,
        message: "Not found cart!",
      };
    }
    if (!incQuantity) {
      await cart.updateOne({ $push: { carts } });
    }
    return {
      status: 200,
      message: "Added to cart!",
    };
  } catch (error) {
    console.log(error);
  }
};
const removeFromCartService = async ({ userId, carts }) => {
  try {
    const isRemove = await _cart.findOneAndUpdate(
      {
        userId,
      },
      {
        $pull: {
          carts: {
            product: carts.product,
            color: carts.color,
            size: carts.size,
          },
        },
      }
    );
    if (!isRemove) {
      return {
        status: 404,
        message: "Not found cart!",
      };
    }
    return {
      status: 200,
      message: "Removed from cart!",
    };
  } catch (error) {
    console.log(error);
  }
};
export {
  getCartService,
  createCartService,
  addToCartService,
  removeFromCartService,
};
