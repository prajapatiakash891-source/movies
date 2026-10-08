import Movie from '../models/Movie.js';
import Series from '../models/Series.js';
import Genre from '../models/Genre.js';

// Category mapping helper for language/industry categories
const CATEGORY_MAP = {
  bollywood: { type: 'industry', query: { $or: [{ industry: /^bollywood$/i }, { languages: { $in: [/hindi/i] } }] }, title: 'Bollywood Cinema' },
  hollywood: { type: 'industry', query: { $or: [{ industry: /^hollywood$/i }, { languages: { $in: [/english/i] } }] }, title: 'Hollywood Cinema' },
  tollywood: { type: 'industry', query: { $or: [{ industry: /^tollywood$/i }, { languages: { $in: [/telugu/i, /tamil/i] } }] }, title: 'Tollywood Cinema' },
  'south-hindi-dubbed': { type: 'industry', query: { $or: [{ industry: /^south hindi dubbed$/i }, { languages: { $in: [/tamil/i, /telugu/i, /malayalam/i, /kannada/i] } }] }, title: 'South Hindi Dubbed' },
  anime: { type: 'industry', query: { industry: /^anime$/i }, title: 'Anime Series & Movies' },
  punjabi: { type: 'industry', query: { industry: /^punjabi$/i }, title: 'Punjabi Cinema' },
  'south-indian': { type: 'industry', query: { $or: [{ industry: /^(tollywood|south hindi dubbed)$/i }, { languages: { $in: [/tamil/i, /telugu/i, /malayalam/i, /kannada/i] } }] }, title: 'South Indian Cinema' },
  hindi: { type: 'language', query: { languages: { $in: [/hindi/i] } }, title: 'Hindi Content' },
  tamil: { type: 'language', query: { languages: { $in: [/tamil/i] } }, title: 'Tamil Cinema' },
  telugu: { type: 'language', query: { languages: { $in: [/telugu/i] } }, title: 'Telugu Cinema' },
};

// @desc    Get all categories/genres
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const genres = await Genre.find().sort({ name: 1 });
    res.json({
      success: true,
      data: genres,
      regionalCategories: [
        { name: 'Bollywood', slug: 'bollywood' },
        { name: 'Hollywood', slug: 'hollywood' },
        { name: 'Tollywood', slug: 'tollywood' },
        { name: 'South Hindi Dubbed', slug: 'south-hindi-dubbed' },
        { name: 'Anime', slug: 'anime' },
        { name: 'Punjabi', slug: 'punjabi' },
        { name: 'South Indian', slug: 'south-indian' },
      ],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get content for specific category slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase();
    let query = {};
    let categoryTitle = slug.charAt(0).toUpperCase() + slug.slice(1);

    if (CATEGORY_MAP[slug]) {
      query = CATEGORY_MAP[slug].query;
      categoryTitle = CATEGORY_MAP[slug].title;
    } else {
      // Treat as Genre slug
      const genreRegex = new RegExp(`^${slug.replace('-', ' ')}$`, 'i');
      query = { genres: { $in: [genreRegex] } };
      categoryTitle = `${slug.replace('-', ' ').toUpperCase()} Movies & Series`;
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    const [moviesTotal, movies, seriesList] = await Promise.all([
      Movie.countDocuments(query),
      Movie.find(query).sort({ releaseYear: -1, rating: -1 }).skip(startIndex).limit(limit),
      Series.find(query).sort({ releaseYear: -1, rating: -1 }).limit(6),
    ]);

    res.json({
      success: true,
      categoryName: categoryTitle,
      slug,
      total: moviesTotal,
      totalPages: Math.ceil(moviesTotal / limit),
      currentPage: page,
      movies,
      series: seriesList,
    });
  } catch (error) {
    next(error);
  }
};
