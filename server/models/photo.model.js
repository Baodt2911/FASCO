import mongoose, { Schema } from "mongoose";
const photos = new Schema({
  url: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  sizes: [
    {
      size: {
        type: String,
        enum: ["S", "M", "L", "XL", "XXL"],
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});
export default mongoose.model("photos", photos);
