import path from 'path';

import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import render from './render';
import assertApi from './assertApi';
import Router from '../libs/router';


export default app => {

  // logger
  app.use(logger());

  // body parser
  app.use(bodyParser());

  // render
  app.use(render(
    path.resolve(__dirname, '../views'),
    { ext: 'pug' }
  ));

  // assert body
  app.use(assertApi);

  // router
  new Router(
    app,
    path.resolve(__dirname, '../routes')
  ).init();

};
