import http from '../../utils/http';
import { GET_MOVIE } from './constants';


export function getMovieList(params) {
  return http.get(GET_MOVIE, { params });
}
