import { methods, controller } from '../libs/router';
import { getAllGenres } from '../services/common';


const { get } = methods;

@controller('/api')
class CommonController {

  @get('/genres')
  async getAllGenres(ctx, next) {
    const res = await getAllGenres();

    await ctx.assertApi(res, 0);
    await next();
  }

}

new CommonController();
