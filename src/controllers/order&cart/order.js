import { validationResult } from "express-validator";
import { getCartDishbyUserAndRestaurant } from "../../models/order&cart/cart.js";
import { calculatePrice } from "../../utils/calculatePrice.js";
import { getMessage } from "../../utils/getMessage.js";
import {
  saveNewOrder,
  getOrderById,
  updateOrderStatus,
} from "../../models/order&cart/order.js";
import { Router } from "express";

const router = Router();

//show checkout page
const showCheckoutPage = async (req, res, next) => {
  const userId = req.session.user.id;
  const resSlug = req.params.resSlug;

  const order = await getCartDishbyUserAndRestaurant(resSlug, userId);
  const price = calculatePrice(order);
  res.render("checkout", {
    title: "Checkout Page",
    order: order,
    price: price,
  });
};

const showOrderPage = async (req, res, next) => {
  const orderId = req.params.orderId;
  if (!orderId) return false;

  const userId = req.session.user.id;
  if (!userId) {
    req.flash("error", "Please sign in first.");
    return res.redirect("/login");
  }

  try {
    const order = await getOrderById(userId, orderId);
    if (!order) {
      req.flash("error", "Fail to get this order");
      return res.redirect("/");
    }
    const status = order.orderStatus;
    const { message, submessage } = getMessage(order);
    const arrivalTime = order.deliveryMinutes + 15;

    res.render("order", {
      title: `Order ${status}`,
      order: order,
      message: message,
      arrivalTime: arrivalTime,
      submessage: submessage,
    });
  } catch (error) {
    console.error("Error getting order page", error);
    req.flash(
      "error",
      "Unable to get order detail page. Please try again later!",
    );
    res.redirect(`/`);
  }
};

const processNewOrder = async (req, res, next) => {
  const resSlug = req.params.resSlug;
  if (!resSlug) return false;

  const userId = req.session.user.id;
  if (!userId) {
    req.flash("error", "Please sign in first.");
    return res.redirect("/login");
  }

  try {
    const orderId = await saveNewOrder(userId, resSlug);
    req.flash("success", "Your order has been confirmed.");
    return res.redirect(`/order/${orderId}`);
  } catch (error) {
    console.error("Error saving new order", error);
    req.flash("error", "Unable to process your order. Please try again later!");
    res.redirect(`/checkout/${resSlug}`);
  }
};

//update order status
const processOrderStatusUpdate = async (req, res, next) => {
  const orderId = req.params.orderId;
  const userId = req.session.user.id;

  try {
    const order = await getOrderById(userId, orderId);
    if (!order) {
      req.flash("error", "Fail to get this order");
      return res.redirect("/");
    }

    const orderCreatedTime = order.orderCreatedTime;
    const status = order.orderStatus;
    const deliveryMinutes = order.deliveryMinutes;
    const currentTime = new Date();
    const timeDifference = currentTime - orderCreatedTime;
    const minuteDiff = timeDifference / 60000;

    if (
      minuteDiff >= deliveryMinutes + 15 + 1 &&
      status !== "delivered"
    ) {
      await updateOrderStatus(orderId, "delivered");
    }
    else if (minuteDiff >= 15 + 1 && status !== "shipped") {
      await updateOrderStatus(orderId, "shipped");
    }
    else if (minuteDiff >= 1 && status !== "preparing") {
      await updateOrderStatus(orderId, "preparing");
    }

    const { message, submessage } = getMessage(order);
    const arrivalTime = order.deliveryMinutes + 15;

    return res.json({
      orderId: orderId,
      orderStatus: status,
      arrivalTime: arrivalTime,
      message: message,
      submessage: submessage
    });
  } catch (error) {
    console.error("Error updating order status", error);
    req.flash(
      "error",
      "Unable to update the order status. Please try again later!",
    );
    res.redirect(`/`);
  }
};

router.get("/:orderId", showOrderPage);
router.get("/:orderId/status", processOrderStatusUpdate);
router.post("/:resSlug", processNewOrder);

export { showCheckoutPage };
export default router;
