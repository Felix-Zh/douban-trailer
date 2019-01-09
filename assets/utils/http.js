import axios from 'axios';


const http = axios.create();
let auth = '';

http.setAuth = auth => auth = auth;

http.interceptors.request.use(config => {
  if (config.auth) {
    if (auth) {
      config.headers['Access-Token'] = auth;
    } else {
      throw new Error('No auth has been set.');
    }
  }

  return config;
});

http.interceptors.response.use(response => {
  if (response.data.status === 0) return response.data;
  return Promise.reject(response.message);
}, err => Promise.reject(err));

export default http;
