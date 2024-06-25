import { addToCartService, getCartService } from "../services/cart.service.js";
const getCartController = async (req, res) => {
  try {
    const { userId } = req.body;
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
    const { userId, products } = req.body;
    const { status, message } = await addToCartService({
      userId,
      products,
    });
    res.status(status).json({ message });
  } catch (error) {
    console.log(error);
  }
};
export { addToCartController, getCartController };
