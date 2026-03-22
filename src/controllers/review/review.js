import { Router } from "express";
import { deleteReviewById } from "../../models/review/review.js";

const router = Router();

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

export default router;
