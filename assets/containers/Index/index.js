import React from 'react';
import { message } from 'antd';
import MovieItem from '../../components/Index/MovieItem/';
import PreviewModal from '../../components/Index/PreviewModal/';
import TrailerModal from '../../components/Index/TrailerModal/';
import styles from './index.scss';

import { getMovieList } from '../../service/movies';


export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      movieList: this.getInitialMovieList(20),
      descriptionModalVisible: false,
      currPreviewDescriptionMovie: {},
      trailerModalVisible: false,
      currViewTrailerMovie: {},
    };

    this.handlePreviewDescription = this.handlePreviewDescription.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
  }

  componentDidMount() {
    this.getMovieList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.url !== this.props.match.url) {
      this.getMovieList();
    }
  }

  async getMovieList() {
    const reqParams = this.getReqParams();

    this.setState({
      loading: true,
      movieList: this.getInitialMovieList(20),
    });

    try {
      const { data: movieList } = await getMovieList(reqParams);

      this.setState({
        loading: false,
        movieList,
      });
    } catch (err) {
      message.error('拉取电影列表失败');
    }
  }

  getReqParams() {
    const { type, params } = this.props.match.params;
    const res = {};

    if (!type) {
      return res;
    }

    res[type] = params;

    return res;
  }

  getInitialMovieList(length) {
    return new Array(length)
      .fill(true)
      .map((item, idx) => ({ doubanId: idx }));
  }

  handlePreviewDescription(doubanId) {
    const targetMovie = this.findMovieByDoubanId(doubanId);

    if (!targetMovie) {
      return message.error('找不到对应电影');
    }

    this.setState({
      currPreviewDescriptionMovie: targetMovie,
      descriptionModalVisible: true,
    });
  }

  handlePlay(doubanId) {
    const targetMovie = this.findMovieByDoubanId(doubanId);

    if (!targetMovie) {
      return message.error('找不到对应电影');
    }

    this.setState({
      trailerModalVisible: true,
      currTrailerMovie: targetMovie,
    });
  }

  findMovieByDoubanId(doubanId) {
    return this.state.movieList.find(item => item.doubanId === doubanId);
  }

  render() {
    const { state } = this;

    return (
      <div className={styles.container}>
        {state.movieList.map(movie => (
          <MovieItem
            key={movie.doubanId}
            data={movie}
            loading={state.loading}
            onPreviewDescription={this.handlePreviewDescription}
            onPlay={this.handlePlay}
          />
        ))}
        <PreviewModal
          visible={state.descriptionModalVisible}
          onHide={() => this.setState({ descriptionModalVisible: false })}
          data={state.currPreviewDescriptionMovie}
        />
        <TrailerModal
          visible={state.trailerModalVisible}
          onHide={() => this.setState({ trailerModalVisible: false })}
          data={state.currTrailerMovie}
        />
      </div>
    );
  }
}
