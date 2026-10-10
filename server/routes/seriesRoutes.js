import express from 'express';
import {
  getSeries,
  getSeriesBySlug,
  getEpisode,
  createSeries,
  updateSeries,
  deleteSeries,
} from '../controllers/seriesController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSeries);
router.get('/:slug', getSeriesBySlug);
router.get('/:slug/season/:seasonNum/episode/:episodeNum', getEpisode);

// Admin Routes
router.post('/', protect, admin, createSeries);
router.put('/:id', protect, admin, updateSeries);
router.delete('/:id', protect, admin, deleteSeries);

export default router;
