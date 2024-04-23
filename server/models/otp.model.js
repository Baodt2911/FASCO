import mongoose, { Schema } from "mongoose";
const otp = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  time: { type: Date, default: Date.now, index: { expires: 60 } },
});
export default mongoose.model("otp", otp);
