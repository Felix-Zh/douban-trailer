import { methods, controller } from '../libs/router';
import movieService from '../services/movie';


const { get } = methods;

@controller('/api/movie')
class MovieController {

  @get('/')
  async getAllMovies(ctx, next) {
    try {
      const { data, pagination } = await movieService.getAllMovies(ctx.query);

      await ctx.assertApi(data, pagination);
    } catch (err) {
      await ctx.assertApi(null, null, 1000, err.message);
    }

    await next();
  }

  @get('/:id')
  async getMovie(ctx, next) {
    const movie = await movieService.getMovie(ctx.params.id);
    const recommendMovies = await movieService.getRecommendMoviesOfMovie(movie, 10);

    await ctx.assertApi({ movie, recommendMovies });
    await next();
  }

}

new MovieController();
