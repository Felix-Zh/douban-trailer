import path from 'path';
import cp from 'child_process';


const movieCrawlerPath = path.resolve(__dirname, '../crawler/movie');

export default function movieListTask () {
  return new Promise((resolve, reject) => {
    const movieCrawler = cp.fork(movieCrawlerPath, []);
    let invoked = false;
    
    movieCrawler
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
