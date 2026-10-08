import mongoose from 'mongoose';
import Series from '../models/Series.js';
import Movie from '../models/Movie.js';
import slugify from 'slugify';

// @desc    Get all web series with pagination & filter
// @route   GET /api/series
// @access  Public
export const getSeries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    const query = {};

    if (req.query.genre) {
      const genreRegex = new RegExp(`^${req.query.genre}$`, 'i');
      query.genres = { $in: [genreRegex] };
    }

    if (req.query.language) {
      const langRegex = new RegExp(`^${req.query.language}$`, 'i');
      query.languages = { $in: [langRegex] };
    }

    if (req.query.industry) {
      const indRegex = new RegExp(`^${req.query.industry.replace('-', ' ')}$`, 'i');
      query.industry = indRegex;
    }

    if (req.query.year) {
      query.releaseYear = parseInt(req.query.year, 10);
    }

    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: regex },
        { genres: regex },
        { languages: regex },
        { creator: regex },
        { cast: regex },
      ];
    }

    let sort = { releaseYear: -1, createdAt: -1 };
    if (req.query.sort === 'highest_rated') {
      sort = { rating: -1 };
    } else if (req.query.sort === 'popular') {
      sort = { rating: -1, totalEpisodes: -1 };
    }

    const total = await Series.countDocuments(query);
    const seriesList = await Series.find(query)
      .sort(sort)
      .skip(startIndex)
      .limit(limit);

    res.json({
      success: true,
      count: seriesList.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: seriesList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single series by ID or slug
// @route   GET /api/series/:slug
// @access  Public
export const getSeriesBySlug = async (req, res, next) => {
  try {
    const param = req.params.slug;
    let series = null;

    if (mongoose.Types.ObjectId.isValid(param)) {
      series = await Series.findById(param);
    }
    if (!series) {
      series = await Series.findOne({ slug: param });
    }

    if (!series) {
      // Fallback check if stored in Movie collection under type='series'
      if (mongoose.Types.ObjectId.isValid(param)) {
        series = await Movie.findById(param);
      }
      if (!series) {
        series = await Movie.findOne({ slug: param, type: 'series' });
      }
      if (series) {
        return res.json({
          success: true,
          data: series,
          related: [],
        });
      }
      return res.status(404).json({ success: false, message: 'Web Series not found' });
    }

    const related = await Series.find({
      _id: { $ne: series._id },
      genres: { $in: series.genres },
    }).limit(6);

    res.json({
      success: true,
      data: series,
      related,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific episode details
// @route   GET /api/series/:slug/season/:seasonNum/episode/:episodeNum
// @access  Public
export const getEpisode = async (req, res, next) => {
  try {
    const { slug, seasonNum, episodeNum } = req.params;
    const series = await Series.findOne({ slug });
    if (!series) {
      return res.status(404).json({ success: false, message: 'Web Series not found' });
    }

    const sNum = parseInt(seasonNum, 10);
    const eNum = parseInt(episodeNum, 10);

    const season = series.seasons.find((s) => s.seasonNumber === sNum);
    if (!season) {
      return res.status(404).json({ success: false, message: `Season ${seasonNum} not found` });
    }

    const episode = season.episodes.find((e) => e.episodeNumber === eNum);
    if (!episode) {
      return res.status(404).json({ success: false, message: `Episode ${episodeNum} not found` });
    }

    res.json({
      success: true,
      seriesTitle: series.title,
      seriesSlug: series.slug,
      poster: series.poster,
      backdrop: series.backdrop,
      seasonNumber: sNum,
      seasonTitle: season.seasonTitle,
      episode,
      allSeasons: series.seasons,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create series (Admin)
// @route   POST /api/series
// @access  Private/Admin
export const createSeries = async (req, res, next) => {
  try {
    const seriesData = { ...req.body };
    if (!seriesData.slug) {
      seriesData.slug = slugify(`${seriesData.title}-${seriesData.releaseYear || new Date().getFullYear()}`, {
        lower: true,
        strict: true,
      });
    }

    const series = await Series.create(seriesData);
    res.status(201).json({ success: true, data: series });
  } catch (error) {
    next(error);
  }
};

// @desc    Update series (Admin)
// @route   PUT /api/series/:id
// @access  Private/Admin
export const updateSeries = async (req, res, next) => {
  try {
    let series = await Series.findById(req.params.id);
    if (!series) {
      return res.status(404).json({ success: false, message: 'Series not found' });
    }

    series = await Series.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: series });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete series (Admin)
// @route   DELETE /api/series/:id
// @access  Private/Admin
export const deleteSeries = async (req, res, next) => {
  try {
    const series = await Series.findById(req.params.id);
    if (!series) {
      return res.status(404).json({ success: false, message: 'Series not found' });
    }

    await series.deleteOne();
    res.json({ success: true, message: 'Series removed successfully' });
  } catch (error) {
    next(error);
  }
};
