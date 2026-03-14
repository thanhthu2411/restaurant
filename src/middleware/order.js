import { isResOpen } from "../models/order&cart/order.js";

const canOrder = async (req, res, next) => {
  const resSlug = req.params.resSlug;
  const isOpen = await isResOpen(resSlug);
  
  if (isOpen === null) {
    const err = new Error(`Restaurant ${resSlug} not found`);
    err.status = 404;
    return next(err);
  }

  if (isOpen) {
    return next();
  }

  req.flash(
    "info",
    "The restaurant is currently closed. Please come back later.",
  );
  return res.redirect("/");
};

export { canOrder };
