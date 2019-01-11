import http from '../../utils/http';


export function getMovieList(params) {
  return http.get('/api/movie', { params });
}

export function getMovie(movieId) {
  return http.get(`/api/movie/${movieId}`);
}
