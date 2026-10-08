import mongoose from 'mongoose';
import slugify from 'slugify';

const episodeSchema = new mongoose.Schema({
  episodeNumber: { type: Number, required: true },
  title: { type: String, required: true },
  duration: { type: String, default: '45m' },
  description: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  watchUrl: { type: String, default: '' },
  downloadUrl: { type: String, default: '' },
});

const seasonSchema = new mongoose.Schema({
  seasonNumber: { type: Number, required: true },
  seasonTitle: { type: String, default: 'Season 1' },
  episodes: [episodeSchema],
});

const seriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Series title is required'],
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
      required: true,
    },
    poster: {
      type: String,
      required: true,
    },
    backdrop: {
      type: String,
      required: true,
    },
    releaseYear: {
      type: Number,
      required: true,
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
    industry: {
      type: String,
      default: 'Bollywood',
      index: true,
    },
    quality: {
      type: String,
      default: '4K Ultra HD',
    },
    rating: {
      type: Number,
      default: 8.5,
    },
    seasonsCount: {
      type: Number,
      default: 1,
    },
    totalEpisodes: {
      type: Number,
      default: 10,
    },
    trailerUrl: {
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
    creator: {
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
    seasons: [seasonSchema],
  },
  {
    timestamps: true,
  }
);

seriesSchema.index({ title: 'text', description: 'text' });

seriesSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    const slugBase = slugify(this.title, { lower: true, strict: true });
    this.slug = `${slugBase}-${this.releaseYear || new Date().getFullYear()}`;
  }
  next();
});

const Series = mongoose.model('Series', seriesSchema);
export default Series;
