import mongoose from 'mongoose';


const Genres = mongoose.model('Genres');

/**
 * 分类名映射到分类 ID
 * @param {String[]} genres 
 */
export async function mapGenreNameToId(genres) {
  genres = genres.filter(genre => genre);

  return (await Genres.find({ name: { $in: genres } }, { _id: 1 }))
    .map(item => item._id);
}

/**
 * 获得年查询对象
 * @param {String} year 
 */
export function getYearQuery(year) {
  const res = {};

  if (/^\d+$/.test(year)) {
    res.$eq = year;
  } else if (/^\d+s$/.test(year)) {
    const decade = Number.parseInt(year.replace('s', ''));

    res.$gte = decade;
    res.$lt = decade + 10;
  } else {
    throw new Error('param `year` is not valid');
  }

  return res;
}

/**
 * 获得评分查询对象
 * @param {String} rate 
 */
export function getRateQuery(rate) {
  const match = /^(\d+)-(\d+)$/.exec(rate);

  if (!match) {
    throw new Error('param `rate` is not valid');
  }

  const [, minRate, maxRate] = match;

  return { $gte: minRate, $lt: maxRate };
}
