import http from '../../utils/http';


/**
 * 获取电影分类列表
 */
export function getGenres(params) {
  return http.get('/api/genres', { params });
}
