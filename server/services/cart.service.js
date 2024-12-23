import mongoose from "mongoose";
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
const addToCartService = async ({ userId, carts }) => {
  try {
    // Check id invalid
    if (checkId(carts.product)) {
      return {
        status: 500,
        message: "_id products invalid",
      };
    }
    if (checkId(carts.color)) {
      return {
        status: 500,
        message: "_id color invalid",
      };
    }
    await _cart.updateOne(
      { userId },
      { $setOnInsert: { userId, carts: [] } },
      { upsert: true }
    );
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
        $inc: { "carts.$.quantity": carts?.quantity || 1 },
        // $inc  increment or decrement
        // $: The positional operator in MongoDB, which represents the matched element in the array based on the previous query condition $elemMatch
      }
    );
    if (!incQuantity) {
      await _cart.updateOne({ userId }, { $push: { carts } });
    }
    return {
      status: 200,
      message:
        carts.quantity === -1
          ? "The quantity has been reduced successfully!"
          : "Added to cart!",
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
            _id: new mongoose.Types.ObjectId(carts.id),
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
export { getCartService, addToCartService, removeFromCartService };
