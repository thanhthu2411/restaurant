import {Router} from 'express';
import { homePage, restaurantDetailPage } from './index.js';
import contactRouter from './forms/contact.js';
import registerRouter from './forms/registration.js';
import loginRouter from './forms/login.js';
import {processLogout} from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';
import { reviewValidation } from '../middleware/validation/form.js';
import { processReviewForm } from './forms/review.js';
import cartRouter  from './order&cart/cart.js';
import { showCheckoutPage } from './order&cart/order.js';
import { canOrder } from '../middleware/order.js';
const router = Router();

router.get('/', homePage);
router.get('/restaurant/:resSlug', restaurantDetailPage);
router.post('/restaurant/:resSlug/review', requireLogin, reviewValidation, processReviewForm);

router.use('/contact', contactRouter);
router.use('/register', registerRouter);
router.use('/login', loginRouter);
router.use('/logout', processLogout);
router.use('/cart', cartRouter);

//add canOrder middleware
router.get('/checkout/:resSlug', showCheckoutPage);
// search
export default router;