import moongoose, { Schema } from "mongoose";
const user = new Schema({
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
  password: {
    type: String,
  },
  isNewUser: {
    type: Boolean,
    default: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});
export default moongoose.model("user", user);
