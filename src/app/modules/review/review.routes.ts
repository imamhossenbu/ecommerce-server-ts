import express from 'express';
import * as reviewControllers from './review.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/add-review', protect, reviewControllers.addReview);
router.get('/get-reviews/:productId', reviewControllers.getProductReviews);
router.get('/home-reviews', reviewControllers.getHomeReviews);

export const reviewRoutes = router;