import {
  addDishtoCart,
  increaseDishQuantity,
  decreaseDishQuantity,
  getCartbyUser
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
    await addDishtoCart(dishSlug, userId)

    const cart = await getCartbyUser(userId)  // ← same try block
    let cartNumber = 0
    if (cart) {
        Object.values(cart).forEach((rest) => {
            rest.dishes.forEach((dish) => {
                cartNumber += dish.quantity
            })
        })
    }

    res.json({
        success: true,
        cart,
        cartNumber,
        message: 'Item added successfully'
    })

} catch (error) {
    console.error('Error adding item to cart:', error)
    res.status(500).json({
        success: false,
        error: { message: 'Something went wrong. Please try again.' }
    })
}
};

const getCart = async(req, res, next) => {
    const userId = req.session.user.id;

    try {
      const cart = await getCartbyUser(userId)  // ← same try block
      let cartNumber = 0
      if (cart) {
          Object.values(cart).forEach((rest) => {
              rest.dishes.forEach((dish) => {
                  cartNumber += dish.quantity
              })
          })
      }

      res.json({
        success: true,
        cartNumber: cartNumber,
        cart: cart || {}
      })
    } catch(error) {
      res.status(500).json({
        success: false,
        cart: {},
        cartNumber: 0
      })
    }
}

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
    // req.flash("success", "Quantity updated!");
    // return res.redirect(req.get("referer") || "/");
    const cart = await getCartbyUser(userId)
        let cartNumber = 0
        if (cart) {
            Object.values(cart).forEach(rest => {
                rest.dishes.forEach(dish => {
                    cartNumber += dish.quantity
                })
            })
        }

    res.json({
      success: true,
      message: "Cart quantity updated.",
      cart: cart,
      cartNumber: cartNumber
    })

  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again."
    })
    // req.flash("error", "Something went wrong. Please try again.");
    // return res.redirect(req.get("referer") || "/");
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
    // req.flash("success", "Quantity updated!");
    // return res.redirect(req.get("referer") || "/");
    const cart = await getCartbyUser(userId)
        let cartNumber = 0
        if (cart) {
            Object.values(cart).forEach(rest => {
                rest.dishes.forEach(dish => {
                    cartNumber += dish.quantity
                })
            })
        }

    res.json({
      success: true,
      message: "Cart quantity updated.",
      cart: cart,
      cartNumber: cartNumber
    })

  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again."
    })
    // req.flash("error", "Something went wrong. Please try again.");
    // return res.redirect(req.get("referer") || "/");
  }
};

//cart
router.post("/api/add/:resSlug/:dishSlug", requireLogin, processAddtoCart);
router.get('/api/', requireLogin, getCart)
router.post("/api/increase/:dishSlug", requireLogin, processIncreaseCart);
router.post("/api/decrease/:dishSlug", requireLogin, processDecreaseCart);

export default router;
