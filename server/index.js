import Koa from 'koa';
import useMiddlewares from './middlewares';
import { port } from '../config';


const app = new Koa();

useMiddlewares(app);

app.use(async (ctx, next) => {
  ctx.render('index', { userName: 'Felix' });
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}...`);
});
