import mongoose from 'mongoose';


const Movie = mongoose.model('Movie');

/**
 * 所有电影
 * @param {String} genres 
 * @param {Number} year 
 */
export function getAllMovies(genres = '', year = 0) {
  const query = {};

  if (genres) {
    genres = Array.isArray(genres) ? genres : Array.of(genres);
    query.genres = { $in: genres };
  }

  if (year) {
    query.year = year;
  }

  return Movie.find(query).sort({ 'meta.createTime': -1 });
}

/**
 * 根据 ID 查找单个电影
 * @param {String} id 
 */
export function getMovie(id) {
  return Movie.findOne({ _id: id });
}

/**
 * 根据电影查找推荐电影
 * @param {Movie} movie 
 * @param {Number} limit 
 */
export function getRecommendMoviesOfMovie(movie, limit = 12) {
  const { genres } = movie;

  return Movie
    .find({ genres: { $in: genres } })
    .sort({ year: -1, rate: -1 })
    .limit(limit);
}
