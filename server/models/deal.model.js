import mongoose, { Schema } from "mongoose";
const deal = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    discountType: {
      type: String,
      enum: ["percentage", "fixedAmount", "freeShipping"],
      required: true,
    },
    discountValue: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "expired", "inactive"],
      default: "inactive",
    },
    minimumOrderValue: { type: Number, default: 0 },
    applicableProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "products" },
    ],
    maximumUsagePerUser: { type: Number, default: 1 },
    maximumUsageOverall: { type: Number },
    code: { type: String },
    image: { type: String },
    priority: { type: Number, default: 1 },
  },
  { timestamps: true }
);
export default mongoose.model("deals", deal);
