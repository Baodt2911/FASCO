import mongoose, { Schema } from "mongoose";
const size = new Schema({
  idPhoto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "photos",
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
export default mongoose.model("size", size);
