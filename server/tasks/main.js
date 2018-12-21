import db from '../db/init';
import movieTask from './movie';
import getSingleMovieDetail from './movieDetail';
import trailerTask from './trailer';
import transferToQiniuTask from './qiniu';
import Movie from '../db/schema/movie';
import Genres from '../db/schema/genres';


class MainTask {
  async run() {
    console.log('开始拉取豆瓣数据...');
    await this.saveMoviesToDB();
    console.log('开始获取电影详细数据...');
    await this.saveMovieDetailToDB();
  }

  async saveMoviesToDB() {
    const data = await movieTask(2);
    let newItems = 0;
    let skipItems = 0;

    console.log('拉取豆瓣数据完成，正在存入数据库...');
    const saveTasks = data.map(item => (async () => {
      let movie = await Movie.findOne({ doubanId: item.id });

      if (movie) {
        skipItems += 1;

        return console.log(`豆瓣 ID 为 ${item.id} 的电影已存在，跳过...`);
      };
  
      movie = new Movie({ ...item, doubanId: item.id });
      await movie.save();
      newItems += 1;
      console.log(`豆瓣 ID 为 ${item.id} 的电影插入数据库成功！`);
    })());

    await Promise.all(saveTasks);
    console.log(`豆瓣电影数据存入数据库完成，本次新增 ${newItems} 条数据，跳过 ${skipItems} 条数据！`);
  }

  async saveMovieDetailToDB() {
    console.log('正在查找需要获取详情的电影...');
    const movieList = await Movie.find({ hasDetail: false });

    console.log(`找到 ${movieList.length} 条需要增加详情数据的电影...`);

    for (let i = 0; i < movieList.length; i += 1) {
      console.log(`开始存入第 ${i + 1}/${movieList.length} 条电影详细数据...`);
      const { doubanId } = movieList[i];

      console.log('正在从豆瓣 api 获取电影详细数据...');
      const item = await getSingleMovieDetail(doubanId);

      console.log('获取电影详细数据完成！');
      const movieInstance = await Movie.findOne({ doubanId });
      const genresInstances = [];
      let updates = this.getMovieCommonDetail(item);

      // 流派
      console.log('正在更新流派...');
      if (item.genres && item.genres.length) {
        for (let genresInstance of item.genres) {
          genresInstances.push(await this.getGenresInstance(genresInstance));
        }

        genresInstances.forEach(genres => {
          if (!genres.movies.includes(movieInstance._id)) {
            genres.movies.push(movieInstance._id);
          }
        });
      }

      // 预告片和预告片海报
      console.log('正在获取电影预告片和预告片海报...');
      const trailerData = await this.getTrailerData(doubanId);

      // 预告片、预告片海报、电影海报转存七牛云
      console.log('正在将预告片和预告片海报转存七牛云...');
      const qiniuKeysData = await this.transforBetchResourcesToQiniu({
        videoURLKey: trailerData.videoURL,
        videoCoverURLKey: trailerData.videoCoverURL,
        posterURLKey: updates.posterURL
      });

      updates = { ...updates, ...trailerData, ...qiniuKeysData };

      // 保存
      console.log('正在保存到数据库...');
      for (let genres of genresInstances) {
        await genres.save();
      }

      movieInstance.set(updates);
      await movieInstance.save();
      console.log(`第 ${i + 1}/${movieList.length} 条详细数据存入数据库完成！`);
    }
  }

  getMovieCommonDetail(movieDetail) {
    const schema = {
      rate: movieDetail.rating.average || -1,
      title: movieDetail.title || '',
      description: movieDetail.summary || '',
      rawTitle: movieDetail.original_title || '',
      year: movieDetail.year || -1,
      hasDetail: true
    }

    schema.posterURL = movieDetail.images.large.replace('s_ratio_poster', 'l_ratio_poster');

    return schema;
  }

  async getGenresInstance(genresName) {
    const genres = await Genres.findOne({ name: genresName });

    if (genres) {
      return genres;
    }

    return new Genres({ name: genresName });
  }

  async getTrailerData(doubanId) {
    const { cover: videoCoverURL, src: videoURL } = await trailerTask(doubanId);

    return { videoURL, videoCoverURL };
  }

  async transforBetchResourcesToQiniu(resourceList) {
    const res = {};
    const tasks = Object.entries(resourceList).map(([key, url]) => (async () => {
      res[key] = await transferToQiniuTask(url);
    })());

    await Promise.all(tasks);

    return res;
  }

}

async function main() {
  await db.connect();
  await db.loadSchemas();
  await new MainTask().run();
  
  console.log('全部任务完成！');
  process.exit(0);
}

main();
