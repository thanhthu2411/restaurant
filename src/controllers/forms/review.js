import { validationResult } from "express-validator";
import {
  insertNewReview,
  deleteReviewById,
  getReviewById,
  updateReview,
} from "../../models/forms/review.js";
import { requireRole } from "../../middleware/auth.js";
import { Router } from "express";
import { reviewValidation } from "../../middleware/validation/form.js";

const router = Router();

const processReviewForm = async (req, res, next) => {
  const resSlug = req.params.resSlug;

  if (!resSlug) {
    const err = new Error("Missing route parameter");
    err.status = 400;
    return next(err);
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect(`/restaurant/${resSlug}`);
  }

  const { rating, review } = req.body;
  const userId = req.session.user.id;

  try {
    await insertNewReview(resSlug, userId, rating, review);
    req.flash("success", "Your review has been saved successfully");
    return res.redirect(`/restaurant/${resSlug}`);
  } catch (error) {
    console.error("Error submitting review", error);
    req.flash("error", "Unable to save your review. Please try again later!");
    return res.redirect(`/restaurant/${resSlug}`);
  }
};

//for user
const processDeleteReview = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const userId = req.session.user.id;

  if (!reviewId) {
    const err = new Error("Missing route parameter");
    err.status = 400;
    return next(err);
  }

  try {
    await deleteReviewById(reviewId, userId);
    req.flash("success", "Review deleted successfully");
    return res.redirect("/dashboard/user");
  } catch (error) {
    console.error("Error deleting review:", error);
    req.flash("error", "Something went wrong. Please try again.");
    return res.redirect("/dashboard/user");
  }
};

const showUserReviewEditForm = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const currentUserId = req.session.user.id;
  const currentUserRole = req.session.user.roleName;

  if (!reviewId) {
    const err = new Error("Missing route parameter");
    err.status = 400;
    next(err);
  }

  try {
    const review = await getReviewById(reviewId);
    if (!review) {
      const err = new Error(`Review not found`);
      err.status = 404;
      return next(err);
    }

    // if (currentUserRole !== "user") {
    //   req.flash("error", "You don't have permission for this page");
    //   res.redirect(`/dashboard/${currentUserRole}`);
    // }

    if (review.userId !== currentUserId) {
      req.flash("error", "You don't have permission to edit this review");
      return res.redirect(`/dashboard/${currentUserRole}`);
    }

    res.render("forms/review/edit", {
      title: "Review Edit Form",
      review: review,
    });
  } catch (error) {
    console.error("Error loading review edit form:", error);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect(`/dashboard/${currentUserRole}`);
  }
};

const processEditReview = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
  }

  const currentUserRole = req.session.user.roleName;
  const reviewId = req.params.reviewId;
  if (!reviewId) {
    const err = new Error("Missing route parameter");
    err.status = 400;
    next(err);
  }

  const { rating, review } = req.body;
  // console.log(review);
  try {
    const result = await updateReview(reviewId, rating, review);
    if (!result) {
      req.flash("error", "Failed to update this review");
      return res.redirect(`/dashboard/${currentUserRole}`);
    }

    //update successfully
    req.flash("success", "Update your review successfully");
    res.redirect(`/dashboard/${currentUserRole}`);
  } catch (error) {
    console.error("Error updating your review:", error);
    req.flash("error", "Something went wrong. Please try later.");
    return res.redirect(`/dashboard/${currentUserRole}`);
  }
};

router.post("/:reviewId/delete", processDeleteReview);
router.get("/:reviewId/edit", requireRole("user"), showUserReviewEditForm);
router.post(
  "/:reviewId/edit",
  requireRole("user"),
  reviewValidation,
  processEditReview,
);

export { processReviewForm };
export default router;
