import { validationResult } from "express-validator";
import { insertNewReview, deleteReviewById } from "../../models/forms/review.js";
import { Router } from "express";

const router = Router();

const processReviewForm = async (req, res, next) => {
  const resSlug = req.params.resSlug;

  if (!req.session || !req.session.user) {
    req.flash("error", "You must log in to review");
    return res.redirect("/login");
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

const processDeleteReview = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const userId = req.session.user.id;

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

router.post("/:reviewId", processDeleteReview);

export {processReviewForm};
export default router;