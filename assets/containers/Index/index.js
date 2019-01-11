import React from 'react';
import { Pagination, Empty, Affix, BackTop, message } from 'antd';
import { withData } from '../../components/HOCs/DataHOC';
import Layout from '../../components/common/Layout';
import MovieItem from '../../components/Index/MovieItem/';
import PreviewModal from '../../components/Index/PreviewModal/';
import TrailerModal from '../../components/Index/TrailerModal/';
import { getDefaultPagination } from '../../utils';
import styles from './index.scss';

import { getMovieList } from '../../service/movies';


class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      movieList: this.makeSkeletonMovieList(20),
      descriptionModalVisible: false,
      currPreviewDescriptionMovie: {},
      trailerModalVisible: false,
      currViewTrailerMovie: {},
    };

    this.backTop = React.createRef();

    this.handlePreviewDescription = this.handlePreviewDescription.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    this.getMovieList();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.match.url !== this.props.match.url) {
      await this.resetPagination();
      this.getMovieList();
    }
  }

  resetPagination() {
    return new Promise(resolve => {
      this.setState({ pagination: getDefaultPagination() }, resolve);
    });
  }

  async getMovieList() {
    const reqParams = this.getReqParams();

    this.setState({
      loading: true,
      movieList: this.makeSkeletonMovieList(20),
    });

    try {
      const { data: movieList, meta: pagination } = await getMovieList(reqParams);

      this.setState({
        loading: false,
        movieList,
        pagination,
      });

      this.backTop.current.scrollToTop();
    } catch (err) {
      message.error('拉取电影列表失败');
    }
  }

  getReqParams() {
    const { type, params } = this.props.match.params;
    let res = {
      pageNo: this.state.pagination.pageNo,
      pageSize: this.state.pagination.pageSize,
    };

    if (!type) return res;
    res[type] = params;

    return res;
  }

  makeSkeletonMovieList(length) {
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

  handlePageChange(pageNo) {
    this.setState({
      pagination: {
        ...this.state.pagination,
        pageNo,
      },
    }, this.getMovieList);
  }

  render() {
    const { state } = this;
    const { pagination } = state;

    return (
      <Layout>
        <div className={styles.container}>
          {
            state.movieList.length ?
              state.movieList.map(movie => (
                <MovieItem
                  key={movie.doubanId}
                  data={movie}
                  loading={state.loading}
                  onPreviewDescription={this.handlePreviewDescription}
                  onPlay={this.handlePlay}
                  onViewDetail={id => this.props.history.push(`/movie/${id}`)}
                />
              )) :
              <div className={styles.empty}>
                <Empty description="暂无数据" />
              </div>
          }
        </div>
        <Affix offsetBottom={0}>
          <div className={styles.pagination}>
            {
              !!state.movieList.length &&
              <Pagination
                showQuickJumper
                pageSize={pagination.pageSize}
                current={pagination.pageNo}
                total={pagination.total}
                onChange={this.handlePageChange}
              />
            }
          </div>
        </Affix>
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
        <BackTop ref={this.backTop} />
      </Layout>
    );
  }
}

export default withData(Index);
