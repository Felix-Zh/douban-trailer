import Koa from 'koa';
import { port } from '../config';
import { normal } from './templates';

const app = new Koa();

app.use(async (ctx, next) => {
  ctx.type = 'text/html; charset=utf-8';
  ctx.body = normal;
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}...`);
});
