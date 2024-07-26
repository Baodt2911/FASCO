import mongoose, { Schema } from "mongoose";
const sold_rate = new Schema({
  idProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
  rate: {
    type: Number,
    default: 0,
  },
});
export default mongoose.model("sold_rate", sold_rate);
