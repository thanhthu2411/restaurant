import {Router} from 'express';
import { homePage, restaurantDetailPage } from './index.js';
import contactRouter from './forms/contact.js';

const router = Router();

router.get('/', homePage);
router.get('/restaurant/:resSlug', restaurantDetailPage);

router.use('/contact', contactRouter);
// /dish/search
export default router;