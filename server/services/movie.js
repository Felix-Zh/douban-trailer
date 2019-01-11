import mongoose from 'mongoose';
import { mapGenreNameToId, getYearQuery, getRateQuery } from './utils';
import Service from './index';


const Movie = mongoose.model('Movie');

class MovieService extends Service {
  /**
   * 所有电影
   * @param {String} genres 
   * @param {Number} year 
   */
  async getAllMovies({ genres, year, rate, pageNo, pageSize }) {
    const query = {};

    if (genres !== undefined) {
      genres = Array.isArray(genres) ? genres : Array.of(genres);
      query.genres = { $in: await mapGenreNameToId(genres) };
    }

    if (year) {
      query.year = getYearQuery(year);
    }

    if (rate) {
      query.rate = getRateQuery(rate);
    }

    return await this.paginate(Movie, query, pageNo, pageSize);
  }

  /**
   * 根据 ID 查找单个电影
   * @param {String} id 
   */
  getMovie(id) {
    return Movie.findOne({ _id: id });
  }

  /**
   * 根据电影查找推荐电影
   * @param {Movie} movie 
   * @param {Number} limit 
   */
  getRecommendMoviesOfMovie(movie, limit = 10) {
    const { genres } = movie;

    return Movie
      .find({ genres: { $in: genres } })
      .sort({ year: -1, rate: -1 })
      .limit(limit);
  }

}

MovieService.getInstance = function(...args) {
  if (!MovieService.instance) {
    MovieService.instance = new MovieService(...args);
  };

  return MovieService.instance;
}

export default MovieService.getInstance();
