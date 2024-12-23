import mongoose, { Schema } from "mongoose";
const address = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  list: [
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      country: { type: String, required: true },
      postcode: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      isDefault: { type: Boolean, required: true },
    },
  ],
});
export default mongoose.model("address", address);
