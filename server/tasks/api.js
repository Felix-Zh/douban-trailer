import request from 'request-promise-native';
import movieTask from '../tasks/movie';
import { sleep, getRandomInt } from '../utils';


class Api {
  constructor() {
    this.main();
  }

  async main() {
    const movieList = await movieTask();
    const res = await this.getMovieListData(movieList);

    console.log(res);
  }

  async getMovieListData(movieList) {
    const length = movieList.length;
    const res = [];

    console.log('开始获取电影列表数据...');

    for (let i = 0; i < length; i += 1) {
      try {
        console.log(`获取第 ${i + 1}/${length} 条电影数据...`);
        res.push(await this.getMovieData(movieList[i].id));
      } catch (err) {
        console.log(`第 ${i + 1} 条电影数据获取失败。错误信息：${err.message}`);
      }

      await sleep(getRandomInt(1000, 2000));
    }

    return res;
  }

  async getMovieData(id) {
    const url = `https://api.douban.com/v2/movie/subject/${id}`;
    const res = await request(url);

    return JSON.parse(res);
  }
}

new Api();
