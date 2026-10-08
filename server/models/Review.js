import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'onModel',
      index: true,
    },
    onModel: {
      type: String,
      required: true,
      enum: ['Movie', 'Series'],
      default: 'Movie',
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 10'],
      min: 1,
      max: 10,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ movieId: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
