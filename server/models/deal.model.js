import mongoose, { Schema } from "mongoose";
const deal = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    discount_type: { type: String, enum: ["percent", "fixed"], required: true },
    discount_value: { type: Number, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "expired", "inactive"],
      default: "active",
    },
    applied_products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "products" },
    ],
    min_order_value: { type: Number, default: 0 },
    max_discount: { type: Number },
    usage_limit: { type: Number },
    usage_count: { type: Number, default: 0 },
    priority: { type: Number, default: 1 },
  },
  { timestamps: true }
);
export default mongoose.model("deals", deal);
