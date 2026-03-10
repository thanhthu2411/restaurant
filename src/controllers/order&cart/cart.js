import {
  addDishtoCart,
  increaseDishQuantity,
  decreaseDishQuantity,
} from "../../models/order&cart/cart.js";
import { Router } from "express";
import { requireLogin } from "../../middleware/auth.js";

const router = Router();

const processAddtoCart = async (req, res, next) => {
  const dishSlug = req.params.dishSlug;
  const resSlug = req.params.resSlug;
  const userId = req.session.user.id;

  await addDishtoCart(dishSlug, userId);
  return res.redirect(`/restaurant/${resSlug}`);
};

const processIncreaseCart = async (req, res, next) => {
  const dishSlug = req.params.dishSlug;
  const userId = req.session.user.id;
  await increaseDishQuantity(dishSlug, userId);
  return res.redirect(req.get('referer') || '/');
};

const processDecreaseCart = async (req, res, next) => {
  const dishSlug = req.params.dishSlug;
  const userId = req.session.user.id;
  await decreaseDishQuantity(dishSlug, userId);
  return res.redirect(req.get('referer') || '/');
};

//cart
router.post("/add/:resSlug/:dishSlug", requireLogin, processAddtoCart);
router.post("/increase/:dishSlug", requireLogin, processIncreaseCart);
router.post("/decrease/:dishSlug", requireLogin, processDecreaseCart);


export default router;
