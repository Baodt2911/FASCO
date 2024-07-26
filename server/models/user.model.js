import moongoose, { Schema } from "mongoose";
const user = new Schema(
  {
    firstName: {
      type: String,
      minlength: 2,
      maxlength: 30,
    },
    lastName: {
      type: String,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) => `${props.value} không đủ 10 chữ số!`,
      },
    },
    address: {
      type: String,
    },
    password: {
      type: String,
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
export default moongoose.model("user", user);
