import mongoose, { Schema } from "mongoose";
const payment = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    captureId: {
      type: String,
    },
    method: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "captured", "failed", "refunded", "canceled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("payment", payment);
