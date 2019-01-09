import path from 'path';
import serve from 'koa-static';


export default async app => {
  app.use(serve(path.resolve(__dirname, '../../../dist')));

  app.use(async (ctx, next) => {
    ctx.render('index');
    await next();
  });
};
