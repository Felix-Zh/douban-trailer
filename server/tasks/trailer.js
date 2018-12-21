import path from 'path';
import cp from 'child_process';


const trailerCrawlerPath = path.resolve(__dirname, '../crawler/trailer');

export default function trailerTask (doubanId) {
  return new Promise((resolve, reject) => {
    const trailerCrawler = cp.fork(trailerCrawlerPath, [doubanId]);
    let invoked = false;
    
    trailerCrawler
      .on('message', msg => {
        resolve(msg);
      })
      .on('error', err => {
        if (invoked) return;
    
        invoked = true;
    
        reject(err);
      })
      .on('exit', code => {
        if (invoked) return;
    
        invoked = true;
    
        if (code !== 0) {
          console.log(`子进程错误退出，错误码：${code}`);
        }
      }); 
  });
}
