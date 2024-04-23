import mongoose, { Schema } from "mongoose";
const refreshToken = new Schema({
  userId: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("refreshToken", refreshToken);
