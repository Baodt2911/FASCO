import {
  getPaymentService,
  refundPaymentService,
} from "../services/payment.service.js";

const getPaymentController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { orderId } = req.params;
    const { status, message, element } = await getPaymentService({
      userId,
      orderId,
    });
    res.status(status).json({
      message,
      element,
    });
  } catch (error) {
    console.log(error);
  }
};
const refundPaymentController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { orderId } = req.params;
    const { status, message, element } = await refundPaymentService({
      userId,
      orderId,
    });
    res.status(status).json({
      message,
      element,
    });
  } catch (error) {
    console.log(error);
  }
};
export { refundPaymentController, getPaymentController };
