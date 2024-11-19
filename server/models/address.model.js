import mongoose, { Schema } from "mongoose";
const address = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  firstName: { type: String },
  lastName: { type: String },
  country: { type: String },
  postcode: { type: String },
  addressLine1: { type: String },
  addressLine2: { type: String },
  city: { type: String },
});
export default mongoose.model("address", address);
