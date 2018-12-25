import mongoose from 'mongoose';
import { methods, controller } from '../libs/router';


const { get, post } = methods;

@controller('/movie')
class MovieRoute {

  @get('/')
  async getAllMovies(ctx, next) {
    const Movie = mongoose.model('Movie');
    const res = await Movie.find({}).sort({ 'meta.createTime': -1 });

    ctx.body = res;
    await next();
  }

  @get('/:id')
  async getMovie(ctx, next) {
    const Movie = mongoose.model('Movie');
    const doubanId = ctx.params.id;
    const res = await Movie.findOne({ doubanId });

    ctx.body = res;
    await next();
  }

}

new MovieRoute();
