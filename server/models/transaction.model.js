import mongoose, { Schema } from "mongoose";

const transaction = new Schema({
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "payment",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["sucess,failure,process"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("transaction", transaction);
