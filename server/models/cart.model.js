import mongoose, { Schema } from "mongoose";
const cart = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
  ],
});
export default mongoose.model("cart", cart);
