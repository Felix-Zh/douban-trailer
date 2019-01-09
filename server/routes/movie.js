import { methods, controller } from '../libs/router';
import { getAllMovies, getMovie, getRecommendMoviesOfMovie } from '../services/movie';


const { get } = methods;

@controller('/api/movie')
class MovieController {

  @get('/')
  async getAllMovies(ctx, next) {
    const { genres, year } = ctx.query;
    const res = await getAllMovies(genres, year);

    await ctx.assertApi(res, 0);
    await next();
  }

  @get('/:id')
  async getMovie(ctx, next) {
    const movie = await getMovie(ctx.params.id);
    const recommendMovies = await getRecommendMoviesOfMovie(movie);

    await ctx.assertApi({ movie, recommendMovies }, 0);
    await next();
  }

}

new MovieController();
