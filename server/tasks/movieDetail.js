import request from 'request-promise-native';


export default async function getSingleMovieData(doubanId) {
  const url = `https://api.douban.com/v2/movie/subject/${doubanId}`;
  const res = await request(url);

  return JSON.parse(res);
}
