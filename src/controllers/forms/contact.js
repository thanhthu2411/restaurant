import {
  insertContactForm,
  getContactFormById,
  updateReadStatus,
} from "../../models/forms/contact.js";
import { contactValidation } from "../../middleware/validation/form.js";
import { validationResult } from "express-validator";
import { Router } from "express";
import { requireRole } from "../../middleware/auth.js";

const router = Router();

const showContactForm = (req, res) => {
  res.render("forms/contact/contact", {
    title: "Contact Us",
  });
};

const processContactSubmission = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect("/contact");
  }

  const { subject, message } = req.body;
  const userId = req.session.user ? req.session.user.id : null;

  try {
    await insertContactForm(subject, message, userId, "unread");
    req.flash("success", "Thank you for contacting us! We will respond soon.");
    res.redirect("/contact");
  } catch (error) {
    console.error("Error saving contact form:", error);
    req.flash(
      "error",
      "Unable to submit your message. Please try again later.",
    );
    res.redirect("/contact");
  }
};

//for admin
const showContactFormDetail = async (req, res, next) => {
  const contactId = req.params.contactId;
  const form = await getContactFormById(contactId);
  if (!form) {
    const err = new Error(`Form not found`);
    err.status = 404;
    return next(err);
  }

  res.render("forms/contact/detail", {
    title: "Contact Form",
    form: form,
  });
};

const processReadStatus = async (req, res) => {
  const contactId = req.params.contactId;
  try {
    await updateReadStatus(contactId);
    res.redirect(`/contact/${contactId}`);
  } catch (error) {
    console("Eror updating read status", error);
    req.flash("error", "Something went wrong. Please try again later.");
    res.redirect(`/contact/${contactId}`);
  }
};

router.get("/", showContactForm);
router.get("/:contactId", requireRole("admin"), showContactFormDetail);
router.post("/", contactValidation, processContactSubmission);
router.post("/:contactId/read", requireRole("admin"), processReadStatus);

export default router;
