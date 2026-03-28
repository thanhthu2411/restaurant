import { validationResult } from "express-validator";
import {
  getCartDishbyUserAndRestaurant,
  removeDishFromCart,
} from "../../models/cart/cart.js";
import { calculatePrice } from "../../utils/calculatePrice.js";
import { getMessage } from "../../utils/getMessage.js";
import {
  saveNewOrder,
  getOrderById,
  updateOrderStatus,
  getOrderByOrderId,
} from "../../models/order/order.js";
import { requireRole } from "../../middleware/auth.js";
import { statusUpdateValidation } from "../../middleware/validation/form.js";
import { canOrder } from "../../middleware/order.js";
import { Router } from "express";

const router = Router();

//show checkout page
const showCheckoutPage = async (req, res, next) => {
  const userId = req.session.user.id;
  const resSlug = req.params.resSlug;

  if (!resSlug) {
    const err = new Error("Missing route parameter");
    err.status = 400;
    return next(err);
  }

  try {
    const order = await getCartDishbyUserAndRestaurant(resSlug, userId);
    if (!order) {
      const err = new Error("Order not found");
      err.status = 404;
      return next(err);
    }

    const price = calculatePrice(order);
    res.render("checkout", {
      title: "Checkout Page",
      order: order,
      price: price,
    });
  } catch (error) {
    console.error("Error getting checkout page:", error);
    req.flash("error", "Something went wrong. Please try again.");
    return res.redirect(`/restaurant/${resSlug}`);
  }
};

const showOrderPage = async (req, res, next) => {
  const orderId = req.params.orderId;
  const userId = req.session.user.id;

  if (!orderId) {
    const err = new Error("Missing route parameter");
    err.status = 400;
    return next(err);
  }

  try {
    const order = await getOrderById(userId, orderId);
    if (!order) {
      req.flash("error", "Fail to get this order");
      return res.redirect("/");
    }
    const status = order.orderStatus;
    const { message, submessage, arrivalTime } = getMessage(order);

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
  const userId = req.session.user.id;

  if (!resSlug) {
    const err = new Error("Missing route parameter");
    err.status = 400;
    return next(err);
  }

  try {
    const orderId = await saveNewOrder(userId, resSlug);
    if (!orderId) {
      const error = new Error("Unable to process new order");
      error.status = 500;
      return next(err);
    }
    //remove items from cart
    await removeDishFromCart(resSlug, userId);
    req.flash("success", "Your order has been confirmed.");
    return res.redirect(`/order/${orderId}`);
  } catch (error) {
    console.error("Error saving new order", error);
    req.flash("error", "Unable to process your order. Please try again later!");
    res.redirect(`/checkout/${resSlug}`);
  }
};

//update order status (for owner)
const processOrderStatusUpdate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect("/");
  }

  const orderId = req.params.orderId;
  if(!orderId) {
    const err = new Error("Missing route parameter");
    err.status = 400;
    return next(err);
  }

  try {
    const order = await getOrderByOrderId(orderId);
    if (!order) {
      req.flash("error", "Fail to get this order");
      return res.redirect("/dashboard/owner");
    }
    const currentStatus = order.orderStatus;
    const updatedStatus = req.body.status;
    if (!updatedStatus) {
      req.flash("info", "Please choose a status");
      return res.redirect("/dashboard/owner");
    }

    // allowed status
    if (
      (currentStatus === "confirmed" && updatedStatus !== "preparing") ||
      (currentStatus === "preparing" && updatedStatus !== "shipped") ||
      (currentStatus === "shipped" && updatedStatus !== "delivered") ||
      currentStatus === "delivered"
    ) {
      req.flash("error", "Invalid status update");
      return res.redirect("/dashboard/owner");
    }

    await updateOrderStatus(orderId, updatedStatus);
    return res.redirect("/dashboard/owner");
  } catch (error) {
    console.error("Error updating order status", error);
    req.flash(
      "error",
      "Unable to update the order status. Please try again later!",
    );
    res.redirect(`/dashboard/owner`);
  }
};

//router handler
router.get("/:orderId", showOrderPage);
router.post(
  "/:orderId/status",
  requireRole("owner"),
  statusUpdateValidation,
  processOrderStatusUpdate,
);
router.post("/:resSlug", canOrder, processNewOrder);

export { showCheckoutPage };
export default router;
