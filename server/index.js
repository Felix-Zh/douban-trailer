import Koa from 'koa';
import { port } from '../config';

const app = new Koa();

app.use(async (ctx, next) => {
  ctx.body = 'Hello World!';
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}...`);
});
