import {
  getAllUsers,
  getUserById,
  deleteUsser,
  saveUser,
  emailExist,
} from "../../models/forms/registration.js";
import { createCartforUser } from "../../models/cart/cart.js";

import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { registrationValidation } from "../../middleware/validation/form.js";
import { Router } from "express";

const router = Router();

// show form
const showRegistrationForm = (req, res) => {
  res.render("forms/registration/registration", {
    title: "Register",
  });
};
// process form
const processRegistrationForm = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    // console.error("Registration errors:", errors.array());
    return res.redirect("/register");
  }

  const { name, address, email, password } = req.body;

  try {
    const emailExists = await emailExist(email);
    if (emailExists) {
      req.flash('warning', 'Email already registered!');
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await saveUser(name, email, hashedPassword, address);
    const cart = await createCartforUser(newUser.id);
    // console.log(cart);
    req.flash('success', 'Register successfully');
    res.redirect("/login");
  } catch (error) {
    console.error("Error saving user:", error);
    req.flash('error', 'Unable to register your account. Please try again.');
    res.redirect("/register");
  }
};

router.get("/", showRegistrationForm);
router.post("/", registrationValidation, processRegistrationForm);

export default router;
