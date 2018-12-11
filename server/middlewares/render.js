import path from 'path';
import pug from 'pug';


export default (templatePath, options) => async (ctx, next) => {
  ctx.render = (fileName, renderData) => {
    const resolvedPath = path.resolve(templatePath, `${fileName}.${options.ext}`);

    ctx.type = 'text/html; charset=utf-8';
    ctx.body = pug.renderFile(resolvedPath, renderData);
  };

  await next();
};
