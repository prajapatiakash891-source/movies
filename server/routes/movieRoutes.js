import express from 'express';
import {
  getMovies,
  searchMovies,
  getMovieBySlug,
  getHomepageData,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movieController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getMovies);
router.get('/featured', getHomepageData);
router.get('/search', searchMovies);
router.get('/:slug', getMovieBySlug);

// Protected Admin CRUD routes
router.post('/', protect, admin, createMovie);
router.put('/:id', protect, admin, updateMovie);
router.delete('/:id', protect, admin, deleteMovie);

export default router;
