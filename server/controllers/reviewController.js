import Review from '../models/Review.js';
import Movie from '../models/Movie.js';

// @desc    Get reviews for a movie or series
// @route   GET /api/reviews/:movieId
// @access  Public
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update review for movie/series
// @route   POST /api/reviews
// @access  Private
export const addReview = async (req, res, next) => {
  try {
    const { movieId, rating, comment, onModel } = req.body;

    if (!movieId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide movieId, rating, and comment' });
    }

    // Check if user already reviewed this content
    let existingReview = await Review.findOne({
      movieId,
      user: req.user._id,
    });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();

      const populated = await Review.findById(existingReview._id).populate('user', 'name avatar');
      return res.json({
        success: true,
        message: 'Review updated successfully',
        data: populated,
      });
    }

    const review = await Review.create({
      user: req.user._id,
      movieId,
      onModel: onModel || 'Movie',
      rating,
      comment,
    });

    // Update movie rating average if applicable
    const allReviews = await Review.find({ movieId });
    const avgRating = (allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1);
    
    if (onModel === 'Movie' || !onModel) {
      await Movie.findByIdAndUpdate(movieId, { rating: parseFloat(avgRating) });
    }

    const populated = await Review.findById(review._id).populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review posted successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};
