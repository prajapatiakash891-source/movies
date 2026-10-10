import User from '../models/User.js';

// @desc    Get logged in user's favorites list
// @route   GET /api/favorites
// @access  Private
export const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      model: 'Movie',
    });

    res.json({
      success: true,
      count: user.favorites ? user.favorites.length : 0,
      data: user.favorites || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add movie to user's favorites
// @route   POST /api/favorites/:movieId
// @access  Private
export const addFavorite = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user._id);

    if (user.favorites.includes(movieId)) {
      return res.status(400).json({ success: false, message: 'Movie is already in your favorites' });
    }

    user.favorites.push(movieId);
    await user.save();

    res.json({
      success: true,
      message: 'Movie added to favorites',
      favorites: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove movie from user's favorites
// @route   DELETE /api/favorites/:movieId
// @access  Private
export const removeFavorite = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter((fav) => fav.toString() !== movieId);
    await user.save();

    res.json({
      success: true,
      message: 'Movie removed from favorites',
      favorites: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};
