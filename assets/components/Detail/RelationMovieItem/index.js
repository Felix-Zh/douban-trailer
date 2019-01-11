import React from 'react';
import cn from 'classnames';
import { Icon } from 'antd';
import { formatRate } from '../../../utils';
import { CDN_HOST } from '../../../constants';
import styles from  './relation-movie-item.scss';


export default ({ data, className }) => {
  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={styles['poster-container']}>
        <img
          className={styles.poster}
          src={`${CDN_HOST}/${data.posterURLKey}?imageView2/2/w/260/interlace/1`}
          alt={data.title}
        />
      </div>
      <div className={styles.title}>{data.title}</div>
      <div className={styles.rate}>
        <Icon type="star" theme="filled" /> {formatRate(data.rate)}
      </div>
    </div>
  );
};
