import express from 'express';
import { getSitemap } from '../controllers/sitemapController.js';

const router = express.Router();

// Handle GET /sitemap.xml and GET /api/sitemap.xml
router.get('/sitemap.xml', getSitemap);
router.get('/api/sitemap.xml', getSitemap);

export default router;
