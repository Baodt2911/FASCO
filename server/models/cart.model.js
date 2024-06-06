import mongoose, { Schema } from "mongoose";
const cart = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
        },
        size: {
          type: String,
          enum: ["S", "M", "L", "XL", "XXL"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("cart", cart);
