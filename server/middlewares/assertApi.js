import apiStatus from '../constants/apiStatus';


export default async (ctx, next) => {
  ctx.assertApi = (data, status = 0, message = '') => {
    const targetStatus = apiStatus[status];

    if (!targetStatus) throw new Error(`Unknown status code: ${status}`);

    message = targetStatus.message || message;
    ctx.body = { data, status, message };
  };

  await next();
};
