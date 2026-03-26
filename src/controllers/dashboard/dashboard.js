import { Router } from "express";
import {
  getOrderByUserId,
  getOrderByRestaurantOwner,
} from "../../models/order/order.js";
import { getReviewByUserId } from "../../models/review/review.js";
import { requireRole } from "../../middleware/auth.js";
import {
  getAllUsers,
  getUserById,
  emailExist,
  updateUser,
} from "../../models/forms/registration.js";
import { getAllRestaurantsAndDishes, getRestaurantByOwner } from "../../models/restaurant/restaurant.js";
import { getAllContactForms } from "../../models/forms/contact.js";
import { editProfileValidation } from "../../middleware/validation/form.js";
import { validationResult } from "express-validator";

const router = Router();

const showDashboard = async (req, res) => {
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
      // console.log(allContactForms[0].);
      res.render("dashboard/admin", {
        title: "Admin Dashboard",
        users: allUsers,
        restaurants: allRestaurants,
        contactForms: allContactForms,
      });
    } else if (userRole === "owner") {
      const restaurantOrders = await getOrderByRestaurantOwner(userId);
      const restaurant = await getRestaurantByOwner(userId);
      // console.log(restaurant.dealId);
      res.render("dashboard/owner", {
        title: "Owner Dashboard",
        orders: restaurantOrders,
        restaurant: restaurant
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

const showProfileEditForm = async (req, res) => {
  const userId = req.session.user.id;
  const userRole = req.session.user.roleName.toLowerCase();

  try {
    const targetUser = await getUserById(userId);

    if (!targetUser) {
      req.flash("error", "User not found.");
      return res.redirect(`/dashboard/${userRole}`);
    }

    return res.render("dashboard/edit", {
      title: "Profile Update",
      targetUser: targetUser,
      isSelf: true,
    });
  } catch (error) {
    console.error("Error loading edit form:", error);
    req.flash("error", "Unable to load edit form. Please try again later.");
    return res.redirect(`/dashboard/${userRole}`);
  }
};

const showAdminEditForm = async (req, res) => {
  const targetUserId = parseInt(req.params.userId);
  const currentUserRole = req.session.user.roleName.toLowerCase();

  try {
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
      targetUser: targetUser,
      isSelf: false,
    });
  } catch (error) {
    console.error("Error loading edit form:", error);

    req.flash("error", "Something went wrong. Please try again.");
    return res.redirect(`/dashboard/${currentUserRole}`);
  }
};

const processProfileEditForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect(`/dashboard/profile/edit`);
  }

  const currentUser = req.session.user;
  const roleName = currentUser.roleName.toLowerCase();
  const { name, email, address } = req.body;
  
  try {
    const emailTaken = await emailExist(email);
    if (emailTaken && currentUser.email !== email) {
      req.flash("error", "An account with this email already exists.");
      return res.redirect(`/dashboard/profile/edit`);
    }

    await updateUser(currentUser.id, name, email, address);
    //update session
    req.session.user = {
      ...req.session.user,
      name,
      email,
      address,
    };

    req.flash("success", "Account updated successfully.");
    return res.redirect(`/dashboard/${roleName}`);
  } catch (error) {
    console.error("Error updating account:", error);
    req.flash("error", "An error occurred while updating the account.");
    return res.redirect(`/dashboard/${roleName}`);
  }
};

const processAdminEditForm = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect(`/dashboard/admin`);
  }

  const targetUserId = parseInt(req.params.userId);
  const currentUser = req.session.user;
  const { name, email, address } = req.body;

  try {
    const targetUser = await getUserById(targetUserId);

    if (!targetUser) {
      req.flash("error", "User not found.");
      return res.redirect(`/dashboard/admin`);
    }

    if (targetUserId === currentUser.id) {
      req.flash("info", "Please edit your profile from profile page.");
      return res.redirect("/dashboard/profile/edit");
    }
    // Check permissions
    const canEdit = currentUser.roleName === "admin";

    if (!canEdit) {
      req.flash("error", "You do not have permission to edit this account.");
      return res.redirect(`/dashboard/admin`);
    }

    const emailTaken = await emailExist(email);
    if (emailTaken && targetUser.email !== email) {
      req.flash("error", "An account with this email already exists.");
      return res.redirect(`/dashboard/admin/${targetUserId}/edit`);
    }

    // Update the user
    await updateUser(targetUserId, name, email, address);

    req.flash("success", "Account updated successfully.");
    return res.redirect(`/dashboard/admin`);
  } catch (error) {
    console.error("Error updating account:", error);
    req.flash("error", "An error occurred while updating the account.");
    return res.redirect(`/dashboard/admin`);
  }
};

router.get("/user", requireRole("user"), showDashboard);
router.get("/admin", requireRole("admin"), showDashboard);
router.get("/owner", requireRole("owner"), showDashboard);
router.get("/profile/edit", showProfileEditForm);
router.post("/profile/edit", editProfileValidation, processProfileEditForm);
router.get("/admin/:userId/edit", requireRole("admin"), showAdminEditForm);
router.post(
  "/admin/:userId/edit",
  requireRole("admin"),
  editProfileValidation,
  processAdminEditForm,
);

export default router;
