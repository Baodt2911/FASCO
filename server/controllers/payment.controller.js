import {
  getPaymentService,
  refundPaymentService,
} from "../services/payment.service.js";

const getPaymentController = async (req, res) => {
  try {
    const { orderId } = req.body;
    const { status, message, element } = await getPaymentService({ orderId });
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
    const { orderId } = req.body;
    const { status, message, element } = await refundPaymentService({
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
