import Koa from 'koa';
import useMiddlewares from './middlewares';
import { SERVER_PORT } from './config';


const app = new Koa();

useMiddlewares(app);

app.use(async (ctx, next) => {
  ctx.render('index', { userName: 'Felix' });
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is running at port ${SERVER_PORT}...`);
});
