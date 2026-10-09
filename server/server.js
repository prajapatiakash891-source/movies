import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import seriesRoutes from './routes/seriesRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for external embedded images/iframes (YouTube trailers, Unsplash posters)
}));

// Dynamic CORS configuration for local development & deployed frontends
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || !process.env.CLIENT_URL || process.env.CLIENT_URL === '*' || origin === process.env.CLIENT_URL || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive CORS for deployed API
    }
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', limiter);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AakashMovies API is running smoothly' });
});

// Serve static assets in production if client/dist exists (Fullstack deployment mode)
const clientBuildPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  // Root welcome endpoint for Standalone API Backend deployment (Option 2)
  app.get('/', (req, res) => {
    res.json({
      status: 'OK',
      message: '🎬 Welcome to AakashMovies Backend API Server',
      healthCheck: '/api/health',
      endpoints: {
        movies: '/api/movies',
        series: '/api/series',
        categories: '/api/categories',
        auth: '/api/auth'
      }
    });
  });
}

// Central Error Handler
app.use(errorHandler);

// Connect Database & Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[AakashMovies Server] Running on http://localhost:${PORT}`);
  });
};

startServer();
