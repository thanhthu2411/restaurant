import { Router } from "express";
import {
  getOrderByUserId,
  getOrderByRestaurantOwner,
} from "../../models/order&cart/order.js";
import { getReviewByUserId } from "../../models/review/review.js";
import { requireRole } from "../../middleware/auth.js";
import { getAllUsers } from "../../models/users/user.js";
import { getAllRestaurantsAndDishes } from "../../models/restaurant/restaurant.js";
import { getAllContactForms } from "../../models/forms/contact.js";

const router = Router();

const showDashboard = async (req, res, next) => {
  const userId = req.session.user.id;
  const userRole = req.session.user.roleName.toLowerCase();

  try {
    if (userRole === "user") {
      const userOrders = await getOrderByUserId(userId);
      const userReviews = await getReviewByUserId(userId);

      res.render("dashboard/user", {
        title: "User Dashboard",
        userOrders: userOrders,
        userReviews: userReviews,
      });
    } else if (userRole === "admin") {
      const allUsers = await getAllUsers();
      const allRestaurants = await getAllRestaurantsAndDishes();
      const allContactForms = await getAllContactForms();

      res.render("dashboard/admin", {
        title: "Admin Dashboard",
        users: allUsers,
        restaurants: allRestaurants,
        contactForms: allContactForms,
      });
    } else if (userRole === "owner") {
      const restaurantOrders = await getOrderByRestaurantOwner(userId);

      res.render("dashboard/owner", {
        title: "Owner Dashboard",
        orders: restaurantOrders,

      });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);
    req.flash("error", "Unable to load dashboard. Please try again later.");
    res.redirect("/");
  }
};

router.get("/user", requireRole("user"), showDashboard);
router.get("/admin", requireRole("admin"), showDashboard);
router.get("/owner", requireRole("owner"), showDashboard);

export default router;
