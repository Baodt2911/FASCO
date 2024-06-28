import {
  addToCartService,
  getCartService,
  removeFromCartService,
} from "../services/cart.service.js";
const getCartController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { status, message, element } = await getCartService({
      userId,
    });
    res.status(status).json({ message, carts: element });
  } catch (error) {
    console.log(error);
  }
};
const addToCartController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { carts } = req.body;
    const { status, message } = await addToCartService({
      userId,
      carts,
    });
    res.status(status).json({ message });
  } catch (error) {
    console.log(error);
  }
};
const removeFromCartController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { carts } = req.body;
    const { status, message } = await removeFromCartService({
      userId,
      carts,
    });
    res.status(status).json({ message });
  } catch (error) {
    console.log(error);
  }
};

export { addToCartController, getCartController, removeFromCartController };
