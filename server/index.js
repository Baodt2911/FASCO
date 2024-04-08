import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
dotenv.config();
const app = express();
const PORT = 3000;
app.use(morgan("combined"));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Wellcome to FASCO");
});
await mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("***Connect successfully***");
  })
  .catch((error) => {
    const { code } = error;
    if (code === 8000) {
      console.log("***Wrong database***");
    }
  });
app.listen(PORT, () => {
  console.log(`PORT: http://localhost:${PORT}`);
});
