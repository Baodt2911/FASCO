import mongoose, { Schema } from "mongoose";
const discount = new Schema(
  {
    discount_code: {
      type: String,
      required: true,
      unique: true,
    },
    discount_type: {
      type: String,
      enum: ["percent", "fixed"],
      required: true,
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_max_amount: {
      type: Number,
      default: null,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "inactive"],
      default: "active",
    },
    usage_limit: {
      type: Number,
    },
    usage_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("discounts", discount);
