import {
  addDishtoCart,
  increaseDishQuantity,
  decreaseDishQuantity,
} from "../../models/cart/cart.js";
import { Router } from "express";
import { requireLogin } from "../../middleware/auth.js";

const router = Router();

const processAddtoCart = async (req, res, next) => {
  const dishSlug = req.params.dishSlug;
  const resSlug = req.params.resSlug;
  const userId = req.session.user.id;

  if (!dishSlug || !resSlug) {
    const err = new Error("Missing route parameters");
    err.status = 400;
    return next(err);
  }

  try {
    await addDishtoCart(dishSlug, userId);
    req.flash("success", "Item added to cart successfully.");
    return res.redirect(`/restaurant/${resSlug}`);
  } catch (error) {
    console.error("Error loading edit form:", error);

    req.flash("error", "Something went wrong. Please try again.");
    return res.redirect(`/restaurant/${resSlug}`);
  }
};

const processIncreaseCart = async (req, res, next) => {
  const dishSlug = req.params.dishSlug;
  const userId = req.session.user.id;

  if (!dishSlug) {
    const err = new Error("Missing route parameters");
    err.status = 400;
    return next(err);
  }

  try {
    await increaseDishQuantity(dishSlug, userId);
    req.flash("success", "Quantity updated!");
    return res.redirect(req.get("referer") || "/");
  } catch (error) {
    console.error("Error loading edit form:", error);

    req.flash("error", "Something went wrong. Please try again.");
    return res.redirect(req.get("referer") || "/");
  }
};

const processDecreaseCart = async (req, res, next) => {
  const dishSlug = req.params.dishSlug;
  const userId = req.session.user.id;

  if (!dishSlug) {
    const err = new Error("Missing route parameters");
    err.status = 400;
    return next(err);
  }

  try {
    await decreaseDishQuantity(dishSlug, userId);
    req.flash("success", "Quantity updated!");
    return res.redirect(req.get("referer") || "/");
  } catch (error) {
    console.error("Error loading edit form:", error);

    req.flash("error", "Something went wrong. Please try again.");
    return res.redirect(req.get("referer") || "/");
  }
};

//cart
router.post("/add/:resSlug/:dishSlug", requireLogin, processAddtoCart);
router.post("/increase/:dishSlug", requireLogin, processIncreaseCart);
router.post("/decrease/:dishSlug", requireLogin, processDecreaseCart);

export default router;
