import {Router} from 'express';
import { restaurantPage, restaurantDetailPage } from './restaurant/restaurant.js';

const router = Router();

router.get('/', restaurantPage);
router.get('/restaurant/:resId', restaurantDetailPage);

// /dish/search
export default router;