import React from 'react';
import { Modal, Row, Col, Icon } from 'antd';
import styles from './preview-modal.scss';


export default props => {
  const { data } = props;

  return (
    <Modal
      visible={props.visible}
      footer={null}
      title={data.title}
      onCancel={props.onHide}
      width="800px"
    >
      <Row type="flex">
        <Col span={8}>
          <img
            className={styles['preview-cover-img']}
            src={data.posterURL}
            alt={data.title}
          />
          <a
            target="_blank"
            className={styles['view-big-button']}
            href={data.posterURL}
          ><Icon type="search" /> 查看大图</a>
        </Col>
        <Col span={15} offset={1} className={styles.description}>
          {data.description}
        </Col>
      </Row>
    </Modal>
  );
};
