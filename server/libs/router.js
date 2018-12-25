import path from 'path';
import glob from 'glob';
import KoaRouter from 'koa-router';


const prefixSymbol = Symbol('prefix symbol');
const addStartSlash = raw => raw.startsWith('/') ? raw : `/${raw}`;
export const methods = {};
export const routeMap = new Map();

export default class Router {
  constructor(app, routesPath) {
    this.app = app;
    this.routesPath = routesPath;
    this.router = new KoaRouter();
  }

  init() {
    glob.sync(path.resolve(this.routesPath, '**/*.js')).forEach(require);

    for (let [config, controller] of routeMap) {
      let prefixPath = config.target[prefixSymbol];
      let routePath = config.path;

      prefixPath = prefixPath ? addStartSlash(prefixPath) : '';
      routePath = `${prefixPath}${routePath}`;
      this.router[config.method](routePath, controller);
    }

    this.app
      .use(this.router.routes())
      .use(this.router.allowedMethods());
  }
}

export function controller(prefix) {
  return function (target) {
    target.prototype[prefixSymbol] = prefix;
  };
}

const router = function (config) {
  return function (target, key) {
    config.path = addStartSlash(config.path);
    routeMap.set({ target, ...config }, target[key]);
  };
};

['get', 'post', 'put', 'delete'].forEach(method => {
  methods[method] = function (path) {
    return router({ method, path });
  };
});
