import mongoose, { Schema } from "mongoose";
const cart = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  carts: [
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
});
export default mongoose.model("cart", cart);
