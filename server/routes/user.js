import { methods, controller } from '../libs/router';
import { checkPassword } from '../services/user';


const { post } = methods;

@controller('/user')
class UserController {

  @post('/login')
  async login(ctx, next) {
    const { email, password } = ctx.request.body;
    const { match, user } = await checkPassword(email, password);

    if (match) {
      await ctx.assertApi(user, 0);
    } else if (!user) {
      await ctx.assertApi(null, 10000);
    } else {
      await ctx.assertApi(null, 10001);
    }

    await next();
  }

}

new UserController();
