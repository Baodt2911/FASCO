import {
  completeOrderService,
  createOrderService,
  getDetailOrderService,
  getOrderService,
  updateOrderService,
} from "../services/order.service.js";
const getOrderController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { status, element, message } = await getOrderService({ userId });
    res.status(status).json({
      element,
      message,
    });
  } catch (error) {
    console.log(error);
  }
};
const getDetailOrderController = async (req, res) => {
  try {
    const { search_orderId, search_status } = req.query;
    const { status, element, message } = await getDetailOrderService({
      orderId: search_orderId,
      status: search_status,
    });
    res.status(status).json({
      element,
      message,
    });
  } catch (error) {
    console.log(error);
  }
};
const createOrderController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { cart, subtotal, total, shipping, discount_code } = req.body;
    const { status, element, message } = await createOrderService({
      userId,
      cart,
      subtotal,
      total,
      shipping,
      discount_code,
    });
    res.status(status).json({
      message,
      element,
    });
  } catch (error) {
    console.log(error);
  }
};
const updateOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { id_list_order, orderStatus } = req.body;
    const { status, element, message } = await updateOrderService({
      orderId,
      id_list_order,
      status: orderStatus,
    });
    res.status(status).json({
      message,
      element,
    });
  } catch (error) {
    console.log(error);
  }
};
const completeOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, element, message } = await completeOrderService(orderId);
    res.status(status).json({
      message,
      element,
    });
  } catch (error) {
    console.log(error);
  }
};
export {
  createOrderController,
  completeOrderController,
  getOrderController,
  updateOrderController,
  getDetailOrderController,
};
