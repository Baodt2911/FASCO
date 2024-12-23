import _payment from "../models/payment.model.js";
import _order from "../models/order.model.js";
const base = "https://api-m.sandbox.paypal.com";
import fetch from "node-fetch";
import {
  createOrderService,
  generateAccessTokenPaypal,
  updateOrderService,
} from "./order.service.js";
const getPaymentService = async ({ userId, orderId }) => {
  try {
    const payment = await _payment.findOne({ $and: [{ userId }, { orderId }] });
    if (!payment) {
      return {
        status: 404,
        message: "payment not found",
      };
    }
    return {
      status: 200,
      element: payment,
    };
  } catch (error) {
    console.log(error);
  }
};
const createPaymentService = async ({ userId, orderId, amount, method }) => {
  try {
    const payment = await _payment.create({
      userId,
      orderId,
      amount,
      method,
    });
    if (!payment) {
      return {
        status: 500,
        message: "Internal server error",
      };
    }
    return {
      status: 200,
      message: "Create order successfully",
    };
  } catch (error) {
    console.log(error);
  }
};
const updatePaymentService = async ({ userId, orderId, captureId, status }) => {
  try {
    const payment = await _payment.findOneAndUpdate(
      { $and: [{ userId }, { orderId }] },
      { captureId, status }
    );
    if (!payment) {
      return {
        status: 404,
        message: "payment not found",
      };
    }
    return {
      status: 200,
      message: "Update successfully",
    };
  } catch (error) {
    console.log(error);
  }
};
const refundPaymentService = async ({ userId, orderId }) => {
  try {
    const payment = await _payment.findOne({ $and: [{ userId }, { orderId }] });
    if (!payment) {
      return {
        status: 404,
        message: "payment not found",
      };
    }
    const { captureId, amount } = payment._doc;
    const url = `${base}/v2/payments/captures/${captureId}/refund`;
    const accessToken = await generateAccessTokenPaypal();
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        amount: { value: amount, currency_code: "USD" },
        note_to_payer: `Refund order: ${orderId}`,
      }),
    });
    const jsonRes = await res.json();
    if (res.ok) {
      await updateOrderService({ userId, orderId, status: "canceled" });
      await updatePaymentService({ userId, orderId, status: "refunded" });
    }
    return {
      status: res.status,
      message: `Refund order: ${orderId}`,
      element: jsonRes,
    };
  } catch (error) {
    console.log(error);
  }
};

export {
  createPaymentService,
  refundPaymentService,
  updatePaymentService,
  getPaymentService,
};
