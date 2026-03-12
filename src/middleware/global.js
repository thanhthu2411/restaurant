import { getCartbyUser } from "../models/order&cart/cart.js";
import { isResOpen } from "../models/order&cart/order.js";

//handle loading css file and js file

const addLocalVariables = async (req, res, next) => {
  try {
    res.locals.currentYear = new Date().getFullYear();

    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";

    res.locals.queryParams = { ...req.query };

    res.locals.isLoggedIn = false;
    if (req.session && req.session.user) {
      res.locals.isLoggedIn = true;
      res.locals.user = req.session.user;
    }

    res.locals.cart = {};
    if (req.session && req.session.user) {
      const userId = req.session.user.id;
      const cart = await getCartbyUser(userId);
      res.locals.cart = cart;
    }

    // res.locals.isResOpen = false;
    // const resSlug = req.params.resSlug;
    // if (resSlug) {
    //   res.locals.isResOpen = await isResOpen(resSlug);
    // }
    // res.locals.resContainerClass = res.locals.isResOpen ? 'res-open' : 'res-closed';

    next();
  } catch (err) {
    next(err);
  }
};

export { addLocalVariables };
