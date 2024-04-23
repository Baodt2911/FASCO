import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connMongoDb from "./config/mongodb.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import createHttpError from "http-errors";
import { userRouter, otpRouter } from "./routes/index.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5500",
    credentials: true,
  })
);
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Wellcome to FASCO");
});
app.use("/auth", userRouter);
app.use("/otp", otpRouter);
app.get("/set-cookie", (req, res) => {
  res.setHeader("Set-Cookie", `email= dobao2911bs@gmail.com;`);
  res.json({ message: "SET COOKIE" });
});
app.get("/get-cookie", (req, res) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    res.json({ message: "Đã lấy cookies", data: cookies?.email });
    return;
  }
  res.json({ message: "Không lấy được cookies" });
});
app.use((req, res, next) => {
  next(createHttpError.NotFound("Not Found!"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message,
  });
});
// Connect mongodb
await connMongoDb();
app.listen(PORT, () => {
  console.log(`PORT: http://localhost:${PORT}`);
});
