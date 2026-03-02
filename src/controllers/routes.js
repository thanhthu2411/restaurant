import {Router} from 'express';
import { homePage } from './index.js';

const router = Router();

router.get('/', homePage);
// router.get('/restaurant/:resId', restaurantPage);
// router.get('')

// /dish/search
export default router;