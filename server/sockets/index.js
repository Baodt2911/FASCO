import { verfifyAccessTokenSocket } from "../middleware/auth.socket.middleware.js";
import cartSocket from "./cart.socket.js";

const socketServer = (io) => {
  io.use(verfifyAccessTokenSocket);
  io.on("connection", (socket) => {
    console.log("...Connected to socket.io server...");
    cartSocket(socket);
    socket.on("disconnect", () => {
      console.log("...Disconnected to socket.io server...");
    });
  });
};
export default socketServer;
