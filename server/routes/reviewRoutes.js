import express from 'express';
import { getReviews, addReview, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:movieId', getReviews);
router.post('/', protect, addReview);
router.delete('/:id', protect, deleteReview);

export default router;
