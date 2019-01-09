import path from 'path';
import Bundler from 'parcel-bundler';
import serve from 'koa-static';


const bundler = new Bundler(path.resolve(__dirname, '../../../assets/index.html'));

export default async app => {
  await bundler.bundle();

  app.use(serve(path.resolve(__dirname, '../../../dist')));

  app.use(async (ctx, next) => {
    if (!ctx.path.startsWith('/api')) {
      ctx.render('index');
    }

    await next();
  });
};
