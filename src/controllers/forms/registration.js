import {
  getAllUsers,
  getUserById,
  deleteUsser,
  saveUser,
  emailExist,
} from "../../models/forms/registration.js";
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
    console.error("Registration errors:", errors.array());
    return res.redirect("/register");
  }

  const { name, address, email, password } = req.body;

  try {
    const emailExists = await emailExist(email);
    if (emailExists) {
      console.log("Email already registered!");
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await saveUser(name, email, hashedPassword, address);
    console.log("Register successfully");
    res.redirect("/login");
  } catch (error) {
    console.error("Error saving user:", error);
    res.redirect("/register");
  }
};



router.get('/', showRegistrationForm);
router.post('/', registrationValidation, processRegistrationForm);

export default router;