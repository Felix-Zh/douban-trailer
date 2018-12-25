import path from 'path';

import logger from 'koa-logger';
import render from './render';
import Router from '../libs/router';


export default app => {

  // logger
  app.use(logger());

  // render
  app.use(render(
    path.resolve(__dirname, '../views'),
    { ext: 'pug' }
  ));

  // router
  new Router(
    app,
    path.resolve(__dirname, '../routes')
  ).init();

};
