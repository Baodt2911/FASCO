import mongoose, { Schema } from "mongoose";
const order = new Schema({
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
      color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "photos",
      },
      size: {
        type: String,
        enum: ["S", "M", "L", "XL", "XXL"],
      },
      quantity: {
        type: Number,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["paid", "process", "completed"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("order", order);
