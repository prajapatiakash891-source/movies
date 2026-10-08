import Movie from '../models/Movie.js';
import Series from '../models/Series.js';
import User from '../models/User.js';
import Genre from '../models/Genre.js';

// @desc    Get admin statistics overview
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const [totalMovies, totalSeries, totalUsers, totalGenres, recentMovies, recentUsers] = await Promise.all([
      Movie.countDocuments({ type: 'movie' }),
      Series.countDocuments(),
      User.countDocuments(),
      Genre.countDocuments(),
      Movie.find().sort({ createdAt: -1 }).limit(5),
      User.find().select('-password').sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      success: true,
      stats: {
        totalMovies,
        totalSeries,
        totalUsers,
        totalGenres,
      },
      recentMovies,
      recentUsers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new Genre (Admin)
// @route   POST /api/genres
// @access  Private/Admin
export const createGenre = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Genre name is required' });
    }

    const genre = await Genre.create({ name, description });
    res.status(201).json({ success: true, data: genre });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Genre (Admin)
// @route   DELETE /api/genres/:id
// @access  Private/Admin
export const deleteGenre = async (req, res, next) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res.status(404).json({ success: false, message: 'Genre not found' });
    }

    await genre.deleteOne();
    res.json({ success: true, message: 'Genre deleted successfully' });
  } catch (error) {
    next(error);
  }
};
