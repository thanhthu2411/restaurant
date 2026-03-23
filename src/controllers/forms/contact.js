import { insertContactForm} from "../../models/forms/contact.js";
import { contactValidation } from "../../middleware/validation/form.js";
import { validationResult } from "express-validator";
import { Router } from "express";

const router = Router();

const showContactForm = (req, res) => {
    res.render('forms/contact/contact', {
        title: 'Contact Us'
    })
}


const processContactSubmission = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        })
        return res.redirect('/contact');
    }

    const {subject, message} = req.body;
    const userId = req.session.user ? req.session.user.id  : null;

    try {
        await insertContactForm (subject, message, userId, "unread");
        req.flash('success', 'Thank you for contacting us! We will respond soon.');        
        res.redirect('/contact');
    } catch(error) {
        console.error('Error saving contact form:', error);
        req.flash('error', 'Unable to submit your message. Please try again later.');
        res.redirect('/contact');
    }
};


router.get('/', showContactForm);
router.post('/', contactValidation, processContactSubmission);

export default router;



