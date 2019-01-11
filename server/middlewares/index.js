import path from 'path';

import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import render from './render';
import assertApi from './assertApi';
import Router from '../libs/router';
import proxy from 'koa-proxy';
import parcel from './parcel';
import { proxyApi, proxyApiHost } from '../config';


export default app => {

  // logger
  app.use(logger());

  // body parser
  app.use(bodyParser());

  // render
  app.use(render(
    path.resolve(__dirname, '../../dist'),
    { ext: 'html' }
  ));

  // assert body
  app.use(assertApi);

  // router
  new Router(
    app,
    path.resolve(__dirname, '../controllers')
  ).init();

  // proxy
  if (proxyApi) {
    app.use(proxy({
      host: proxyApiHost,
      match: /^\/api\//
    }));
  }

  // bundler
  parcel(app);

};
