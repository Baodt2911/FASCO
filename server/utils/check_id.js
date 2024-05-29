import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
const checkId = (_id) => {
  return !ObjectId.isValid(_id);
};
export { checkId };
