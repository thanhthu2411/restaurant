import {Router} from 'express';
import { homePage, restaurantDetailPage } from './index.js';
import contactRouter from './forms/contact.js';
import registerRouter from './forms/registration.js';
import loginRouter from './forms/login.js';
import {processLogout} from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';

const router = Router();

router.get('/', homePage);
router.get('/restaurant/:resSlug', restaurantDetailPage);

router.use('/contact', contactRouter);
router.use('/register', registerRouter);
router.use('/login', loginRouter);
router.use('/logout', processLogout);

// search
export default router;