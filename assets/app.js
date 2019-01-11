import React from 'react';
import { Spin, message } from 'antd';
import Routes from './routes';
import Layout from './layout';
import { DataContext } from './components/HOCs/DataHOC';
import './styles/common.scss';
import 'antd/dist/antd.css';

import { getGenres } from './service/common';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      genres: [],
    };
  }

  async componentDidMount() {
    try {
      const { data } = await getGenres();

      this.setState({
        loading: false,
        genres: data,
      });
    } catch (err) {
      message.error('获取电影分类信息失败');
    }
  }

  getData() {
    return {
      genres: this.state.genres,
    };
  }

  render() {
    return (
      <DataContext.Provider value={this.getData()}>
        <Routes />
      </DataContext.Provider>
    );
  }
}
