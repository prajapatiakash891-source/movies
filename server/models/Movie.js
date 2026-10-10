import mongoose from 'mongoose';
import slugify from 'slugify';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    poster: {
      type: String,
      required: [true, 'Poster image URL is required'],
    },
    backdrop: {
      type: String,
      required: [true, 'Backdrop image URL is required'],
    },
    releaseYear: {
      type: Number,
      required: [true, 'Release year is required'],
      index: true,
    },
    genres: {
      type: [String],
      required: true,
      index: true,
    },
    languages: {
      type: [String],
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['movie', 'series'],
      default: 'movie',
      index: true,
    },
    industry: {
      type: String,
      default: 'Bollywood',
      index: true,
    },
    quality: {
      type: String,
      default: '1080p Full HD',
    },
    rating: {
      type: Number,
      default: 8.0,
      min: 0,
      max: 10,
    },
    duration: {
      type: String,
      default: '2h 15m',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    watchUrl: {
      type: String,
      default: '',
    },
    downloadUrl: {
      type: String,
      default: '',
    },
    cast: {
      type: [String],
      default: [],
    },
    director: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for fast search queries
movieSchema.index({ title: 'text', description: 'text', director: 'text' });
movieSchema.index({ title: 1, releaseYear: 1 });

// Slug generation before saving
movieSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    const slugBase = slugify(this.title, { lower: true, strict: true });
    this.slug = `${slugBase}-${this.releaseYear || new Date().getFullYear()}`;
  }
  next();
});

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
