import { isResOpen } from "../models/order&cart/order.js";

const canOrder = async (req, res, next) => {
    const resSlug = req.params.resSlug;
    const isOpen = await isResOpen(resSlug);

    if(isOpen) {
        return next();
    }
    console.log(isOpen);
    console.log(resSlug);
    req.flash('info', 'The restaurant is currently closed. Please come back later.');
    return res.redirect('/');
}

export {canOrder};