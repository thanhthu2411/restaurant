import { validationResult } from "express-validator";
import { getCartDishbyUserAndRestaurant } from "../../models/order&cart/cart.js";
import { calculatePrice } from "../../utils/calculatePrice.js";
import { saveNewOrder, getOrderById, updateOrderStatus } from "../../models/order&cart/order.js";
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
    const message = status === "confirmed" ? "Confirming your order"
        : status === "preparing" ? "Preparing your order"
        : status === "shipped" ? "Picking up your order"
        : status === "delivered" ? "Order Complete"
        : "Checking your order status...";
    
    const arrivalTime = order.deliveryMinutes + 15;

    const submessage = status === "confirmed" ? `We sent your order to ${order.restaurantName} for final confirmation.`
        : status === "preparing" ? `${order.restaurantName} is preparing your order.`
        : status === "shipped" ? "Your shipper is heading to your location."
        : status === "delivered" ? "Your order has arrived!"
        : "";

    res.render("order", {
      title: `Order ${status}`,
      order: order,
      message: message,
      arrivalTime: arrivalTime,
      submessage: submessage
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
  
}




router.get("/:orderId", showOrderPage);
router.post("/:resSlug", processNewOrder);

export { showCheckoutPage };
export default router;
