import mongoose, { Schema } from "mongoose";
const photos = new Schema({
  idProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});
export default mongoose.model("photos", photos);
