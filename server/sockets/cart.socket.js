import {
  addToCartService,
  getCartService,
  removeFromCartService,
} from "../services/cart.service.js";

const cartSocket = (socket) => {
  const { userId } = socket.decoded;
  socket.on("get-cart", async () => {
    try {
      const { element, message } = await getCartService({ userId });
      socket.emit("message", { message });
      socket.emit("get-cart", element);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("add-to-cart", async (carts) => {
    try {
      const { message } = await addToCartService({ userId, carts });
      const { element } = await getCartService({ userId });
      socket.emit("message", { message });
      socket.emit("get-cart", element);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("remove-from-cart", async (carts) => {
    try {
      const { message } = await removeFromCartService({ userId, carts });
      const { element } = await getCartService({ userId });
      socket.emit("message", { message });
      socket.emit("get-cart", element);
    } catch (error) {
      console.log(error);
    }
  });
};
export default cartSocket;
