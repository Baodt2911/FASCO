import mongoose, { Schema } from "mongoose";
const deal = new Schema(
  {
    idProduct: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    discount_percent: {
      type: Number,
    },
    discount_amount: {
      type: Number,
    },
    price: {
      type: Number,
    },
    final_price: {
      type: Number,
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
    image_url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("deals", deal);
