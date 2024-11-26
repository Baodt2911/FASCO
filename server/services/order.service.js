import _order from "../models/order.model.js";
import _cart from "../models/cart.model.js";
import _discount from "../models/discount.model.js";
const base = "https://api-m.sandbox.paypal.com";
import fetch from "node-fetch";
import { checkId } from "../utils/check_id.js";
import {
  createPaymentService,
  updatePaymentService,
} from "./payment.service.js";
import { getDiscountService } from "./discount.service.js";
//  Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
//  @see https://developer.paypal.com/api/rest/authentication/
const generateAccessTokenPaypal = async () => {
  try {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_CLIENT_SECRET
    ).toString("base64");
    const res = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await res.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};
const getDetailOrderService = async ({ orderId, status }) => {
  try {
    let orders = await _order
      .find()
      .populate({
        path: "userId",
        model: "user",
        select: ["firstName", "lastName", "email", "phone", "address"],
      })
      .populate({
        path: "list",
        populate: {
          path: "color",
          model: "photos",
          select: ["color", "url"],
        },
      });
    let query = {};

    if (orderId) {
      query.orderId = orderId;
    }

    if (status) {
      query.status = status;
    }
    if (orderId && status) {
      query = {};
      query.$and = [{ orderId }, { status }];
    }
    orders = await _order
      .find(query)
      .populate({
        path: "userId",
        model: "user",
        select: ["firstName", "lastName", "email", "phone", "address"],
      })
      .populate({
        path: "list",
        populate: {
          path: "product",
          model: "products",
          select: ["name", "price"],
        },
      })
      .populate({
        path: "list",
        populate: {
          path: "color",
          model: "photos",
          select: ["color", "url"],
        },
      });
    if (!orders) {
      return {
        status: 404,
        message: "orders not found",
      };
    }
    return {
      status: 200,
      element: orders,
    };
  } catch (error) {
    console.log(error);
  }
};
const getOrderService = async ({ userId }) => {
  try {
    const orders = await _order
      .find({ userId })
      .populate({
        path: "list",
        populate: {
          path: "product",
          model: "products",
          select: ["name", "price"],
        },
      })
      .populate({
        path: "list",
        populate: {
          path: "color",
          model: "photos",
          select: ["color", "url"],
        },
      });
    if (!orders) {
      return {
        status: 404,
        message: "orders not found",
      };
    }
    return {
      status: 200,
      element: orders,
    };
  } catch (error) {
    console.log(error);
  }
};
const updateOrderService = async ({ orderId, id_list_order, status }) => {
  try {
    let filter = { orderId };
    let query = {};
    if (id_list_order) {
      filter.orderId = orderId;
      filter.list = {
        $elemMatch: {
          _id: id_list_order,
        },
      };
    }
    if (status) {
      query.status = status;
    }
    if (id_list_order) {
      query.$set = { "list.$.isRate": true };
    }
    const order = await _order.findOneAndUpdate(filter, query);
    if (!order) {
      return {
        status: 404,
        message: "order not found",
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
/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrderService = async ({
  userId,
  cart,
  subtotal,
  total,
  shipping,
  discount_code,
}) => {
  try {
    let discount = 0;
    if (discount_code) {
      const { status, message, element } = await getDiscountService({
        discount_code,
      });
      if (!element) {
        return {
          status,
          message,
        };
      }
      if (element.discount_type === "percent") {
        discount = total * (element.discount_value / 100);
      } else {
        discount = total - element.discount_value;
      }
    }
    const accessToken = await generateAccessTokenPaypal();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          items: cart,
          amount: {
            currency_code: "USD",
            value: total - discount, //item_total + tax_total + shipping + handling + insurance - shipping_discount - discount.
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: subtotal,
              },
              shipping: {
                currency_code: "USD",
                value: shipping,
              },
              discount: {
                currency_code: "USD",
                value: discount,
              },
            },
          },
        },
      ],
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
    const jsonRes = await res.json();
    if (res.ok) {
      const checkIdCart = cart.some((item) => checkId(item.product));
      // Check id invalid
      if (checkIdCart) {
        return {
          status: 500,
          message: "_id product in carts invalid",
        };
      }
      await _discount.updateOne(
        { discount_code },
        { $inc: { usage_count: 1 } }
      );
      await _order.create({
        orderId: jsonRes.id,
        userId,
        list: cart,
        total: subtotal,
      });
      await createPaymentService({
        orderId: jsonRes.id,
        amount: total,
        method: "paypal",
      });
      await _cart.updateOne({ userId }, { $set: { carts: [] } });
    }
    return {
      element: jsonRes,
      status: res.status,
    };
  } catch (error) {
    console.log(error);
  }
};
const completeOrderService = async (orderId) => {
  try {
    const accessToken = await generateAccessTokenPaypal();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const jsonRes = await res.json();
    const captureId = jsonRes.purchase_units[0].payments.captures[0].id;
    if (res.ok) {
      await updatePaymentService({
        orderId,
        captureId,
        status: "captured",
      });
      await updateOrderService({ orderId, status: "confirmed" });
    }
    return {
      element: jsonRes,
      status: res.status,
    };
  } catch (error) {
    console.log(error);
  }
};
export {
  createOrderService,
  completeOrderService,
  generateAccessTokenPaypal,
  updateOrderService,
  getOrderService,
  getDetailOrderService,
};
