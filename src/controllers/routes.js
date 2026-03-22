import {Router} from 'express';
import { homePage, restaurantDetailPage } from './index.js';
import contactRouter from './forms/contact.js';
import registerRouter from './forms/registration.js';
import loginRouter from './forms/login.js';
import {processLogout} from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';
import { reviewValidation } from '../middleware/validation/form.js';
import { processReviewForm } from './forms/review.js';
import cartRouter  from './cart/cart.js';
import orderRouter from './order/order.js';
import { showCheckoutPage } from './order/order.js';
import { canOrder } from '../middleware/order.js';
import dashboardRouter from './dashboard/dashboard.js';
import reviewRouter from './review/review.js';

const router = Router();

// Add catalog-specific styles to all catalog routes
router.use('/', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/main.css">');
    next();
});
router.use('/restaurant', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/restaurant.css">');
    next();
});
router.use('/restaurant', (req, res, next) => {
    res.addScript('<script src="/js/restaurant.js" type="module"></script>');
    next();
});
router.use('/contact', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
    next();
});
router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
    next();
});
router.use('/login', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/login.css">');
    next();
});
router.use('/cart', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/cart.css">');
    next();
});
router.use('/order', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/order.css">');
    next();
});
router.use('/checkout', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/checkout.css">');
    next();
});
router.use('/dashboard', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/dashboard.css">');
    next();
});

router.get('/', homePage);
router.get('/restaurant/:resSlug', restaurantDetailPage);
router.post('/restaurant/:resSlug/review', requireLogin, reviewValidation, processReviewForm);

router.use('/contact', contactRouter);
router.use('/register', registerRouter);
router.use('/login', loginRouter);
router.use('/logout', processLogout);
router.use('/cart', requireLogin, cartRouter);
router.use('/order', requireLogin, orderRouter);
//add canOrder middleware
router.get('/checkout/:resSlug', requireLogin, canOrder, showCheckoutPage);
//dashboard
router.use('/dashboard', requireLogin, dashboardRouter);
//review
router.use('/review', requireLogin, reviewRouter);
// search
export default router;