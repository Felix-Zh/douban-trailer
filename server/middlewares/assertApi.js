import apiStatus from '../constants/apiStatus';


export default async (ctx, next) => {
  ctx.assertApi = (data, meta = null, status = 0, message = '') => {
    const targetStatus = apiStatus[status];

    if (!targetStatus) throw new Error(`Unknown status code: ${status}`);

    message = message || targetStatus.message;
    ctx.body = { data, meta, status, message };
  };

  await next();
};
