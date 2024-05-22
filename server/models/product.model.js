import mongoose, { Schema } from "mongoose";
const products = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      enum: ["men", "women"],
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("products", products);
