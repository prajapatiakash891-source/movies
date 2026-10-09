import dotenv from 'dotenv';
import slugify from 'slugify';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Series from '../models/Series.js';
import Genre from '../models/Genre.js';
import Review from '../models/Review.js';
import { initialGenres, initialMovies, initialSeries } from './seedData.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany(),
      Movie.deleteMany(),
      Series.deleteMany(),
      Genre.deleteMany(),
      Review.deleteMany(),
    ]);

    console.log('[Seed] Seeding genres...');
    const genresWithSlug = initialGenres.map((g) => ({
      ...g,
      slug: slugify(g.name, { lower: true, strict: true }),
    }));
    const createdGenres = await Genre.insertMany(genresWithSlug);
    console.log(`[Seed] Successfully seeded ${createdGenres.length} genres.`);

    console.log('[Seed] Seeding admin and default user...');
    const adminUser = await User.create({
      name: 'Aakash Admin',
      email: 'admin@aakashmovies.com',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    });

    const defaultUser = await User.create({
      name: 'John Doe',
      email: 'user@aakashmovies.com',
      password: 'user123',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    });

    console.log('[Seed] Seeding movies...');
    const moviesWithSlug = initialMovies.map((m) => ({
      ...m,
      slug: slugify(`${m.title}-${m.releaseYear}`, { lower: true, strict: true }),
    }));
    const createdMovies = await Movie.insertMany(moviesWithSlug);
    console.log(`[Seed] Successfully seeded ${createdMovies.length} movies.`);

    console.log('[Seed] Seeding web series...');
    const seriesWithSlug = initialSeries.map((s) => ({
      ...s,
      slug: slugify(`${s.title}-${s.releaseYear}`, { lower: true, strict: true }),
    }));
    const createdSeries = await Series.insertMany(seriesWithSlug);
    console.log(`[Seed] Successfully seeded ${createdSeries.length} web series.`);

    // Link a sample favorite to default user
    defaultUser.favorites.push(createdMovies[0]._id);
    defaultUser.favorites.push(createdMovies[1]._id);
    await defaultUser.save();

    // Create a sample review
    await Review.create({
      user: defaultUser._id,
      movieId: createdMovies[0]._id,
      onModel: 'Movie',
      rating: 10,
      comment: 'Absolute masterpiece! The visuals and storytelling are top-notch on AakashMovies.',
    });

    console.log('----------------------------------------------------');
    console.log(' AAKASHMOVIES DATABASE SEEDED SUCCESSFULLY! ');
    console.log('----------------------------------------------------');
    console.log(`Admin Account:  admin@aakashmovies.com / admin123`);
    console.log(`User Account:   user@aakashmovies.com / user123`);
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Failed to seed database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
