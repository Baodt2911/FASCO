import mongoose, { Schema } from "mongoose";
const finished_products = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
  ],
});
export default mongoose.model("finished_products", finished_products);
