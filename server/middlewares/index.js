import path from 'path';

import logger from 'koa-logger';
import render from './render';


export default app => {

  // logger
  app.use(logger());

  // render
  app.use(render(
    path.resolve(__dirname, '../views'),
    { ext: 'pug' }
  ));

};
