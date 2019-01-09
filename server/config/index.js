export const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

export const SERVER_PORT = 9999;

export const QINIU_CONFIG = {
  BUCKET: 'study',
  CDN_HOST: 'http://pjpw4zz78.bkt.clouddn.com',
  AK: 'XgUg4FArKJqtLpIrjAHDAujKMHLcM7XUzusaaqms',
  SK: '1uYMZzFJi0hIqpvZDfo_QE2SiVsjYmjyvTBydjxG'
};

export const LOGIN = {
  PASSWORD_SALT_ROUNDS: 20,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCK_TIME: 2 * 60 * 60 * 1000
};

export * from '../../config';
