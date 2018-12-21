import qiniu from 'qiniu';
import mime from 'mime';
import nanoId from 'nanoid';
import { QINIU_CONFIG } from '../config';


const mac = new qiniu.auth.digest.Mac(QINIU_CONFIG.AK, QINIU_CONFIG.SK);
const bucketManagerConfig = new qiniu.conf.Config();
const bucketManager = new qiniu.rs.BucketManager(mac, bucketManagerConfig);

export default async function transferToQiniu(url) {
  // url = 'https://img1.doubanio.com/view/photo/l/public/p2541280047.jpg';
  url = url.replace(/\?.*$/, '');
  const extEntity = mime.getExtension(mime.getType(url));
  const extName = extEntity ? `.${extEntity}` : '';
  const key = `${nanoId()}${extName}`;
  console.log(`正在转存资源 ${url}...`);
  try {
    const res = await transfer(url, key);

    console.log(`资源 ${url} 转存完成！`);
    return res.key;
  } catch (err) {

    console.log(`资源 ${url} 转存失败！错误信息为：${err.message}。`);
    return '';
  }
}

function transfer(resourceURL, key) {
  return new Promise((resolve, reject) => {
    bucketManager.fetch(resourceURL, QINIU_CONFIG.BUCKET, key, (err, resBody, resInfo) => {
      if (err) return reject(err);

      if (resInfo.statusCode === 200) {
        resolve(resBody);
      } else {
        reject(new Error(`resInfo.statusCode is ${resInfo.statusCode} rather than 200.`));
      }
    });
  });
}
