import qiniu from 'qiniu';
import mime from 'mime';
import nanoId from 'nanoid';
import { QINIU_CONFIG } from '../config';


const mac = new qiniu.auth.digest.Mac(QINIU_CONFIG.AK, QINIU_CONFIG.SK);
const bucketManagerConfig = new qiniu.conf.Config();
const bucketManager = new qiniu.rs.BucketManager(mac, bucketManagerConfig);

export default function transferToQiniu(resourceURL, key) {
  return new Promise((resolve, reject) => {
    bucketManager.fetch(resourceURL, QINIU_CONFIG.BUCKET, key, (err, resBody, resInfo) => {
      if (err) return reject(err);

      if (resInfo.statusCode === 200) {
        resolve(resBody);
      } else {
        reject({ code: resInfo, body: resBody });
      }
    });
  });
}

async function main() {
  const url = 'https://img1.doubanio.com/view/photo/l/public/p2541280047.jpg';
  const extEntity = mime.getExtension(mime.getType(url));
  const extName = extEntity ? `.${extEntity}` : '';

  try {
    const res = await transferToQiniu(url, `${nanoId()}${extName}`);

    console.log(res);
  } catch (err) {
    console.log(err);
  }

}

main();
