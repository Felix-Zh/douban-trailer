import '@babel/polyfill';
import './styles/common.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './app';


ReactDOM.render((
  <Router>
    <App />
  </Router>
), document.querySelector('#app'));
