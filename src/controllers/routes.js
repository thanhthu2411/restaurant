import {Router} from 'express';
import { homePage, restaurantPage } from './restaurant/restaurant.js';

const router = Router();

router.get('/', homePage);
router.get('/restaurant/:resId', restaurantPage);

// /dish/search
export default router;