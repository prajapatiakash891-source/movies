import mongoose from 'mongoose';
import Movie from '../models/Movie.js';
import Series from '../models/Series.js';
import slugify from 'slugify';

// @desc    Get all movies & series with pagination, sorting & filters
// @route   GET /api/movies
// @access  Public
export const getMovies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    const query = {};
    const seriesQuery = {};

    // Filter by genre
    if (req.query.genre) {
      const genreRegex = new RegExp(`^${req.query.genre}$`, 'i');
      query.genres = { $in: [genreRegex] };
      seriesQuery.genres = { $in: [genreRegex] };
    }

    // Filter by language
    if (req.query.language) {
      const langRegex = new RegExp(`^${req.query.language}$`, 'i');
      query.languages = { $in: [langRegex] };
      seriesQuery.languages = { $in: [langRegex] };
    }

    // Filter by industry (Bollywood, Hollywood, Tollywood, South Hindi Dubbed, Anime, Punjabi, etc.)
    if (req.query.industry) {
      const indRegex = new RegExp(`^${req.query.industry.replace('-', ' ')}$`, 'i');
      query.industry = indRegex;
      seriesQuery.industry = indRegex;
    }

    // Filter by release year
    if (req.query.year) {
      const yr = parseInt(req.query.year, 10);
      query.releaseYear = yr;
      seriesQuery.releaseYear = yr;
    }

    // Filter by rating
    if (req.query.minRating) {
      const minR = parseFloat(req.query.minRating);
      query.rating = { $gte: minR };
      seriesQuery.rating = { $gte: minR };
    }

    // Filter by content type (movie or series)
    const typeFilter = req.query.type;
    if (typeFilter && typeFilter !== 'all') {
      query.type = typeFilter;
    }

    // Search query filter if passed
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      query.title = regex;
      seriesQuery.title = regex;
    }

    // Sorting criteria
    let sort = { releaseYear: -1, createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'oldest':
          sort = { releaseYear: 1, createdAt: 1 };
          break;
        case 'popular':
        case 'most_popular':
          sort = { rating: -1, releaseYear: -1 };
          break;
        case 'highest_rated':
          sort = { rating: -1 };
          break;
        case 'title_asc':
        case 'a_z':
          sort = { title: 1 };
          break;
        case 'title_desc':
        case 'z_a':
          sort = { title: -1 };
          break;
        case 'latest':
        default:
          sort = { releaseYear: -1, createdAt: -1 };
          break;
      }
    }

    let results = [];
    let total = 0;

    if (typeFilter === 'movie') {
      total = await Movie.countDocuments(query);
      results = await Movie.find(query).sort(sort).skip(startIndex).limit(limit);
    } else if (typeFilter === 'series') {
      const [mSeries, sList] = await Promise.all([
        Movie.find(query).sort(sort),
        Series.find(seriesQuery).sort(sort),
      ]);
      const formattedSeries = sList.map((s) => ({ ...s.toObject(), type: 'series' }));
      const combined = [...mSeries.map((m) => m.toObject()), ...formattedSeries];
      total = combined.length;
      results = combined.slice(startIndex, startIndex + limit);
    } else {
      // Unspecified or All content search
      const [moviesList, seriesList] = await Promise.all([
        Movie.find(query).sort(sort),
        Series.find(seriesQuery).sort(sort),
      ]);
      const formattedSeries = seriesList.map((s) => ({ ...s.toObject(), type: 'series' }));
      const combined = [...moviesList.map((m) => m.toObject()), ...formattedSeries];

      // Custom in-memory sort for merged arrays
      if (req.query.sort === 'highest_rated' || req.query.sort === 'popular') {
        combined.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (req.query.sort === 'title_asc' || req.query.sort === 'a_z') {
        combined.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      } else if (req.query.sort === 'title_desc' || req.query.sort === 'z_a') {
        combined.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
      } else if (req.query.sort === 'oldest') {
        combined.sort((a, b) => (a.releaseYear || 0) - (b.releaseYear || 0));
      } else {
        combined.sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0));
      }

      total = combined.length;
      results = combined.slice(startIndex, startIndex + limit);
    }

    res.json({
      success: true,
      count: results.length,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search movies & series endpoint (Live autocomplete search)
// @route   GET /api/movies/search?q=query
// @access  Public
export const searchMovies = async (req, res, next) => {
  try {
    const searchQuery = req.query.q || '';
    if (!searchQuery.trim()) {
      return res.json({ success: true, count: 0, data: [] });
    }

    const regex = new RegExp(searchQuery, 'i');

    const [movies, series] = await Promise.all([
      Movie.find({
        $or: [
          { title: regex },
          { genres: regex },
          { languages: regex },
          { industry: regex },
          { director: regex },
          { cast: regex },
          { type: regex },
        ],
      })
        .sort({ rating: -1, releaseYear: -1 })
        .limit(20),
      Series.find({
        $or: [
          { title: regex },
          { genres: regex },
          { languages: regex },
          { industry: regex },
          { creator: regex },
          { cast: regex },
        ],
      })
        .sort({ rating: -1, releaseYear: -1 })
        .limit(20),
    ]);

    const formattedMovies = movies.map((m) => m.toObject());
    const formattedSeries = series.map((s) => ({
      ...s.toObject(),
      type: 'series',
    }));

    const combined = [...formattedMovies, ...formattedSeries].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0)
    );

    res.json({
      success: true,
      count: combined.length,
      data: combined.slice(0, 20),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID or slug
// @route   GET /api/movies/:slug
// @access  Public
export const getMovieBySlug = async (req, res, next) => {
  try {
    const param = req.params.slug;
    let movie = null;

    if (mongoose.Types.ObjectId.isValid(param)) {
      movie = await Movie.findById(param);
    }
    if (!movie) {
      movie = await Movie.findOne({ slug: param });
    }

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Get related movies (same genre or language)
    const related = await Movie.find({
      _id: { $ne: movie._id },
      $or: [
        { genres: { $in: movie.genres } },
        { languages: { $in: movie.languages } },
      ],
    }).limit(6);

    res.json({
      success: true,
      data: movie,
      related,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get homepage curated sections (Featured, Trending, Popular, Latest)
// @route   GET /api/movies/featured
// @access  Public
export const getHomepageData = async (req, res, next) => {
  try {
    const [featuredMovies, featuredSeries, trending, popularMovies, latestMovies, seriesFromModel, seriesFromMovieModel] = await Promise.all([
      Movie.find({ featured: true }).sort({ updatedAt: -1, createdAt: -1 }).limit(10),
      Series.find({ featured: true }).sort({ updatedAt: -1, createdAt: -1 }).limit(10),
      Movie.find({ trending: true }).sort({ updatedAt: -1, createdAt: -1 }).limit(10),
      Movie.find({ type: 'movie' }).sort({ rating: -1 }).limit(10),
      Movie.find({ type: 'movie' }).sort({ releaseYear: -1, createdAt: -1 }).limit(10),
      Series.find().sort({ rating: -1 }).limit(10),
      Movie.find({ type: 'series' }).sort({ rating: -1 }).limit(10),
    ]);

    const formattedFeaturedSeries = featuredSeries.map((s) => ({ ...s.toObject(), type: 'series' }));
    const combinedFeatured = [...featuredMovies.map((m) => m.toObject()), ...formattedFeaturedSeries]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 10);

    const formattedSeries = seriesFromModel.map((s) => ({ ...s.toObject(), type: 'series' }));
    const combinedSeries = [...formattedSeries, ...seriesFromMovieModel.map((m) => m.toObject())].slice(0, 10);

    res.json({
      success: true,
      featured: combinedFeatured.length > 0 ? combinedFeatured : latestMovies.slice(0, 5),
      trending,
      popularMovies,
      latestMovies,
      popularSeries: combinedSeries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new movie (Admin)
// @route   POST /api/movies
// @access  Private/Admin
export const createMovie = async (req, res, next) => {
  try {
    const movieData = { ...req.body };
    if (!movieData.slug) {
      movieData.slug = slugify(`${movieData.title}-${movieData.releaseYear || new Date().getFullYear()}`, {
        lower: true,
        strict: true,
      });
    }

    const movie = await Movie.create(movieData);
    res.status(201).json({ success: true, data: movie });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie (Admin)
// @route   PUT /api/movies/:id
// @access  Private/Admin
export const updateMovie = async (req, res, next) => {
  try {
    let movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    if (req.body.title && req.body.title !== movie.title) {
      req.body.slug = slugify(`${req.body.title}-${req.body.releaseYear || movie.releaseYear}`, {
        lower: true,
        strict: true,
      });
    }

    movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: movie });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie (Admin)
// @route   DELETE /api/movies/:id
// @access  Private/Admin
export const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    await movie.deleteOne();
    res.json({ success: true, message: 'Movie removed successfully' });
  } catch (error) {
    next(error);
  }
};
