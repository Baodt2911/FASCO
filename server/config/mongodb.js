import mongoose from "mongoose";
const connMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("***Connect successfully***");
  } catch (error) {
    const { code } = error;
    if (code === 8000) {
      console.log("***Wrong database***");
    }
  }
};
export default connMongoDb;
