import mongoose, { Schema } from "mongoose";
const review = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    idProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    rate: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("review", review);
