import mongoose, { Schema } from "mongoose";
const payment = new Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["paid", "unpaid"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("payment", payment);
