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
      required: true,
    },
    description: {
      type: String,
    },
    photos: [{ type: mongoose.Schema.Types.ObjectId, ref: "photos" }],
    sold_rate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sold_rate",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("products", products);
