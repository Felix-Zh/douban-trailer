import Koa from 'koa';
import db from './db/init';
import useMiddlewares from './middlewares';
import { SERVER_PORT } from './config';


async function main() {
  const app = new Koa();

  await db.connect();
  await db.loadSchemas();

  useMiddlewares(app);

  app.listen(SERVER_PORT, () => {
    console.log(`Server is running at port ${SERVER_PORT}...`);
  });
}

main();
