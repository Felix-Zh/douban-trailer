import React from 'react';
import Dplayer from 'dplayer';
import { Rate, Spin, message } from 'antd';
import { withData } from '../../components/HOCs/DataHOC';
import Layout from '../../components/common/Layout';
import { Link } from 'react-router-dom';
import RelationMovieItem from '../../components/Detail/RelationMovieItem';
import { CDN_HOST } from '../../constants';
import { formatRate } from '../../utils';
import styles from './detail.scss';

import { getMovie } from '../../service/movies';


class Detail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      movie: {},
      recommendMovies: [],
    };

    this.videoContainer = React.createRef();
    this.init();
  }

  init() {
    this.movieId = this.props.match.params.id;
  }

  componentDidMount() {
    this.init();
    this.getMovie();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id === prevProps.match.params.id) {
      return;
    }

    this.init();
    this.getMovie();
  }

  async getMovie() {
    if (!this.movieId) {
      return message.error('参数有误');
    }

    this.setState({ loading: true });

    try {
      const { data } = await getMovie(this.movieId);

      this.setState({
        loading: false,
        movie: data.movie,
        recommendMovies: data.recommendMovies,
      });

      this.player = new Dplayer({
        container: this.videoContainer.current,
        video: {
          url: `${CDN_HOST}/${data.movie.videoURLKey}`,
          pic: `${CDN_HOST}/${data.movie.videoCoverURLKey}`,
        }
      });
    } catch (err) {
      return message.error('获取电影信息失败');
    }
  }

  render() {
    const { state } = this;
    const { movie } = state;

    return (
        <Layout>
          <Spin spinning={state.loading}>
            <div className={styles.container}>
              <div className={styles['video-container']} ref={this.videoContainer} />
              <div className={styles.meta}>
                <div className={styles['meta-top']}>
                  <div className={styles.title}>
                    <h1>{movie.title}</h1>
                    <span className={styles['raw-title']}>{movie.rawTitle}</span>
                  </div>
                  <div className={styles['rate-container']}>
                    <Rate
                      className={styles.rate}
                      disabled
                      allowHalf
                      value={movie.rate / 2}
                    />
                    <span>{formatRate(movie.rate)}</span>
                  </div>
                </div>
                <div className={styles.genres}>
                  剧情 / 社会
                </div>
              </div>
              <div className={styles.description}>{movie.description}</div>
              <div>
                <h3>相关推荐</h3>
                <div className={styles['relation-wrapper']}>
                  <div className={styles['relation-scroller']}>
                    {
                      state.recommendMovies.map(movie => (
                        <Link to={`/movie/${movie._id}`} key={movie.doubanId} className={styles.link}>
                          <RelationMovieItem
                            className={styles['relation-movie-item']}
                            data={movie}
                          />
                        </Link>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </Spin>
        </Layout>
    );
  }
}

export default withData(Detail);
