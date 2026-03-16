import { Router } from "express";
import { getOrderByUserId } from "../../models/order&cart/order.js";
import { getReviewByUserId } from "../../models/review/review.js";

const router = Router();

const showDashboard = async (req, res, next) => {
    const userId = req.session.user.id;
    const userRole = req.session.user.roleName.toLowerCase();

    try {
    const userOrders = await getOrderByUserId(userId);
    const userReviews = await getReviewByUserId(userId);
    if(userRole === "user") {
        res.render("dashboard/user", {
            title: "User Dashboard",
            userOrders: userOrders,
            userReviews: userReviews
        })
    } else {
      res.redirect("/");
    }

  } catch (error) {
    console.error("Error loading dashboard:", error);
    req.flash("error", "Unable to load dashboard. Please try again later.");
    res.redirect("/");
  }

}




router.get('/user', showDashboard);

export default router;