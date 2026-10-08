import connectDB from '../config/db.js';
import Movie from '../models/Movie.js';
import Series from '../models/Series.js';

const backfill = async () => {
  await connectDB();
  
  const movies = await Movie.find();
  for (const m of movies) {
    if (!m.industry) {
      let ind = 'Bollywood';
      if (m.languages?.includes('English')) ind = 'Hollywood';
      else if (m.languages?.includes('Telugu') || m.languages?.includes('Tamil')) ind = 'Tollywood';
      m.industry = ind;
      await m.save();
    }
  }

  const series = await Series.find();
  for (const s of series) {
    if (!s.industry) {
      let ind = 'Bollywood';
      if (s.languages?.includes('English')) ind = 'Hollywood';
      else if (s.languages?.includes('Telugu') || s.languages?.includes('Tamil')) ind = 'Tollywood';
      s.industry = ind;
      await s.save();
    }
  }

  console.log('Successfully backfilled industry for all existing Movies and Web Series!');
  process.exit(0);
};

backfill();
