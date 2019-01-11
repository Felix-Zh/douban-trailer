import React from 'react';
import { Card, Icon } from 'antd';
import ImageFade from '../../common/ImageFade';
import { CDN_HOST } from '../../../constants';
import styles from './movie-item.scss';


const { Meta } = Card;

export default props => {
  const { loading, data } = props;

  if (loading) {
    return( 
      <div className={styles.container}>
        <Card
          loading
          className={styles.card}
          cover={<img src="http://pjpw4zz78.bkt.clouddn.com/loading.jpg" />}
        />
      </div>
    );
  }

  const title = (
    <React.Fragment>
      {data.title} <span className={styles.year}>{data.year}</span>
      <br />
      <span className={styles['raw-title']}>{data.rawTitle}</span>
    </React.Fragment>
  );
  const description = (
    <div
      className={styles.description}
      onClick={() => props.onPreviewDescription(data.doubanId)}
    >
      {data.description}
    </div>
  );
  const onPlay = () => props.onPlay(data.doubanId);

  return (
    <div className={styles.container}>
      <Card
        loading={loading}
        className={styles.card}
        cover={<Cover src={`${CDN_HOST}/${data.posterURLKey}`} alt="电影标题" onClick={onPlay} />}
        actions={[
          <Icon type="caret-right" onClick={onPlay} />,
          <Icon type="eye" onClick={() => props.onViewDetail(data._id)} />,
          <Icon type="star" onClick={() => props.onFavorite(data._id)} />,
        ]}
      >
        <Meta
          title={title}
          description={description}
        />
      </Card>
    </div>
  );
};


const Cover = ({ src, alt, onClick }) => (
  <div onClick={onClick} className={styles['cover-container']}>
    <Icon type="play-circle" theme="filled" className={styles['play-icon']} />
    <ImageFade className={styles['cover-image']} src={src} alt={alt} />
  </div>
);
