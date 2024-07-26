import mongoose, { Schema } from "mongoose";
const order = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    list: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        name: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          enum: ["S", "M", "L", "XL", "XXL"],
        },
        quantity: {
          type: Number,
        },
        isRate: {
          type: Boolean,
          default: false,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "delivered",
        "canceled",
        "completed",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("order", order);
