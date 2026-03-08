import { body } from "express-validator";

const contactValidation = [
  body("subject")
    .trim()
    .isLength({ min: 2, max: 255 })
    .matches(/^[a-zA-Z0-9\s\-.,!?]+$/)
    .withMessage("Subject contains invalid characters"),
  body("message")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Message must be between 10 and 2000 characters")
    .custom((value) => {
      const words = value.split(/\s+/);
      const uniqueWords = new Set(words);
      if (words.length > 20 && uniqueWords.size / words.length < 0.3) {
        throw new Error("Message appears to be spam");
      }
      return true;
    })
];

const registrationValidation = [
  body('name')
    .trim()
    .isLength({min:2, max:100})
    .withMessage('Name must be at least 2 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid email address")
    .isLength({ max: 255 })
    .withMessage("Email address is too long"),
  
  body('emailConfirm')
    .trim()
    .custom((value, {req}) => value === req.body.email)
    .withMessage('Email addresses must match'),
  
  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least uppercase letter")
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage("Password must contain at least one special character"),

  body("passwordConfirm")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords must match"),
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address')
    .isLength({ max: 255 })
    .withMessage("Email address is too long"),
  
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({min:8, max:128})
      .withMessage("Password must be between 8 and 128 characters"),
];

const reviewValidation = [
  body('rating')
    .toInt()
    .isInt({min:1, max:5})
    .withMessage('Rating must be an integer between 1 and 5'),
  body('review')
    .trim()
    .isLength({min: 1, max:2000})
    .withMessage('Review must be between 1 and 2000 characters.')
    .escape()
    .custom((value) => {
      const words = value.trim().split(/\s+/);
      const uniqueWords = new Set(words);
      if (words.length > 20 && uniqueWords.size / words.length < 0.3) {
        throw new Error("Message appears to be spam");
      }
      return true;
    })
];

export {contactValidation, registrationValidation, loginValidation, reviewValidation};
