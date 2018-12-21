import Koa from 'koa';
import useMiddlewares from './middlewares';
import db from './db/init';
import { SERVER_PORT } from './config';


async function main() {
  const app = new Koa();

  await db.connect();
  await db.loadSchemas();

  useMiddlewares(app);

  app.use(async (ctx, next) => {
    ctx.render('index', { userName: 'Felix' });
  });

  app.listen(SERVER_PORT, () => {
    console.log(`Server is running at port ${SERVER_PORT}...`);
  });
}

main();
