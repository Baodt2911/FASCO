import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connMongoDb from "./config/mongodb.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import createHttpError from "http-errors";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import {
  userRouter,
  otpRouter,
  productRouter,
  photoRouter,
  cartRouter,
  reviewRouter,
  saleRouter,
  orderRouter,
  paymentRouter,
  soldRateRouter,
  discountRouter,
  addressRouter,
  dealRouter,
} from "./routes/index.js";
import socketServer from "./sockets/index.js";
dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WHITELIST_DOMAINS = [
  `http://localhost:${PORT}`,
  "http://localhost:5500",
  "https://fasco-sp.vercel.app",
  "https://fasco-nu.vercel.app",
];
const io = new Server(server, {
  cors: {
    origin: WHITELIST_DOMAINS,
    credentials: true,
  },
});
socketServer(io);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: WHITELIST_DOMAINS,
    credentials: true,
  })
);
app.use(cookieParser());
app.get("/", (req, res) => {
  res.redirect("/dashboard");
});
app.use("/dashboard", express.static(path.join(__dirname, "views")));
app.use("/auth", userRouter);
app.use("/address", addressRouter);
app.use("/otp", otpRouter);
app.use("/product", productRouter);
app.use("/photo", photoRouter);
app.use("/cart", cartRouter);
app.use("/review", reviewRouter);
app.use("/sale", saleRouter);
app.use("/order", orderRouter);
app.use("/payment", paymentRouter);
app.use("/sold_rate", soldRateRouter);
app.use("/discount", discountRouter);
app.use("/deal", dealRouter);
app.use((req, res, next) => {
  next(createHttpError.NotFound("Not Found!"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message,
  });
});
// Connect mongodb
server.listen(PORT, async () => {
  await connMongoDb();
  console.log(`PORT: http://localhost:${PORT}`);
});
