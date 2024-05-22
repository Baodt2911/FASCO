import mongoose, { Schema } from "mongoose";
const reviews = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    idProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    rate: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("reviews", reviews);
