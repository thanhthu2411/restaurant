import db from "../../models/db.js";
import { Router } from "express";
import { validationResult } from "express-validator";
// import { isResOpen } from "../../models/order&cart/order.js";
import { getCartDishbyUserAndRestaurant } from "../../models/order&cart/cart.js";
import { calculatePrice } from "../../utils/calculatePrice.js";

//show checkout page
const showCheckoutPage = async (req, res, next) => {
    const userId = req.session.user.id;
    const resSlug = req.params.resSlug;

    const order = await getCartDishbyUserAndRestaurant(resSlug, userId);
    const price = calculatePrice(order);
    res.render("checkout", {
        title: "Checkout Page",
        order: order,
        price: price
    })
};

// process order form


export {showCheckoutPage};

