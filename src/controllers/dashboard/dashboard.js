import { Router } from "express";
import {
  getOrderByUserId,
  getOrderByRestaurantOwner,
} from "../../models/order&cart/order.js";
import { getReviewByUserId } from "../../models/review/review.js";
import { requireRole } from "../../middleware/auth.js";
import { getAllUsers, getUserById } from "../../models/forms/registration.js";
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

const showProfileEditForm = async (req, res, next) => {
  const userId = req.session.user.id;
  const userRole = req.session.user.roleName.toLowerCase();
  const targetUser = await getUserById(userId);

  if (!targetUser) {
    req.flash("error", "User not found.");
    return res.redirect(`/dashboard/${userRole}`);
  }

  return res.render("dashboard/edit", {
    title: "Profile Update",
    user: targetUser,
    isSelf: true
  })
};


const showAdminEditForm = async (req, res, next) => {
  const targetUserId = parseInt(req.params.id);
  const currentUserRole = req.session.user.roleName.toLowerCase();

  const targetUser = await getUserById(targetUserId);

  if (!targetUser) {
    req.flash("error", "User not found.");
    return res.redirect(`/dashboard/${currentUserRole}`);
  }

  const canEdit = currentUserRole === "admin";

  if (!canEdit) {
    req.flash("error", "You do not have permission to edit this account.");
    return res.redirect(`/dashboard/${currentUserRole}`);
  }

  res.render("dashboard/edit", {
    title: "Edit Account",
    user: targetUser,
    isSelf: false
  });
};

router.get("/user", requireRole("user"), showDashboard);
router.get("/admin", requireRole("admin"), showDashboard);
router.get("/owner", requireRole("owner"), showDashboard);
router.get("/profile/edit", showProfileEditForm);
router.get("/admin/:userId/edit", requireRole("admin"), showAdminEditForm);

export default router;
