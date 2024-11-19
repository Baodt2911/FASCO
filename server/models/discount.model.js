import mongoose, { Schema } from "mongoose";
const discount = new Schema(
  {
    discount_code: {
      type: String,
      required: true,
      unique: true,
    },
    discount_percent: {
      type: Number,
    },
    discount_amount: {
      type: Number,
    },
    discount_max_amount: {
      type: Number,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("discounts", discount);
