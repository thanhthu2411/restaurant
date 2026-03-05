import { Router } from "express";
import { verifyPassword, findUserbyEmail } from "../../models/forms/login.js";
import { validationResult } from "express-validator";
import { loginValidation } from "../../middleware/validation/form.js";

const router = Router();

const showLoginForm = (req, res) => {
    res.render('forms/login/login', {
        title: 'User Login'
    })
};

const processLogin = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        console.log('Error', errors.array());
        return res.redirect('/login');
    }

    const {email, password} = req.body;

    try {
        const user = await findUserbyEmail(email);
        if(!user) {
            console.log("User not found. Invalid email or password.");
            return res.redirect('/login');
        }

        const isMatched = verifyPassword(password, user.password);
        if (!isMatched) {
            console.log("Invalid email or password");
            return res.redirect('/login');
        };

        delete user.password;

        req.session.user = user;
        console.log('welcome back');
        res.redirect('/');
    } catch(error) {
        console.error("Error logging in", error);
        res.redirect("/login");

    }
};

const processLogout = (req, res) => {
    if(!req.session) {
        return res.redirect('/login');
    }

    // remove session from store
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            res.clearCookie("connect.sid");
            return res.redirect("/login");
            }

        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
};


router.get('/', showLoginForm);
router.post('/', loginValidation, processLogin);

export default router;
export {processLogout};