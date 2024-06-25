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
} from "./routes/index.js";
dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("...Connected to socket.io server...");
  socket.on("chat", async (data) => {
    console.log("mess", data);
  });
});
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: `http://localhost:${PORT}`,
    credentials: true,
  })
);
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Wellcome to FASCO");
});
app.use("/dashboard", express.static(path.join(__dirname, "views")));

app.use("/auth", userRouter);
app.use("/otp", otpRouter);
app.use("/product", productRouter);
app.use("/photo", photoRouter);
app.use("/cart", cartRouter);
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
await connMongoDb();
server.listen(PORT, () => {
  console.log(`PORT: http://localhost:${PORT}`);
});
