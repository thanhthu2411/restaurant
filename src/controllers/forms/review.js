import { validationResult } from "express-validator";
import { insertNewReview } from "../../models/forms/review.js";

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

export {processReviewForm};
