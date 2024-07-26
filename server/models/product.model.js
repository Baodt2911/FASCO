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
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("products", products);
