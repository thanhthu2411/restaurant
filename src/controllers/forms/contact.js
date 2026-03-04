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
        console.error('Validation errors:', errors.array());
        return res.redirect('/contact');
    }

    const {subject, message} = req.body;

    try {
        await insertContactForm (subject, message);
        console.log('Contact form submitted successfully. Please log in to enjoy Foodie');
        res.redirect('/contact');
    } catch(error) {
        console.error('Error saving contact form:', error);
        res.redirect('/contact');
    }
};


router.get('/', showContactForm);
router.post('/', contactValidation, processContactSubmission);

export default router;



