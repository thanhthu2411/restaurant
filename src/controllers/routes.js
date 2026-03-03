import {Router} from 'express';
import { homePage, restaurantDetailPage } from './index.js';

const router = Router();

router.get('/', homePage);
router.get('/restaurant/:resSlug', restaurantDetailPage);
// router.get('')

// /dish/search
export default router;