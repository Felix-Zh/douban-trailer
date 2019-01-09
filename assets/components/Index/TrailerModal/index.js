import React from 'react';
import { Modal } from 'antd';
import DPlayer from 'dplayer';
import { CDN_HOST } from '../../../constants';
import 'dplayer/dist/DPlayer.min.css';
import styles from './trailer-modal.scss';


class TrailerModal extends React.Component {
  constructor(props) {
    super(props);

    this.player = null;
    this.playerDOM = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      if (!this.player) {
        this.initPlayer();
        this.switchVideo(this.props.data);
      }
    }

    if (prevProps.data.videoURLKey !== this.props.data.videoURLKey) {
      this.switchVideo(this.props.data);
    }

    if (prevProps.visible && !this.props.visible) {
      if (this.player) this.player.pause();
    }
  }

  initPlayer() {
    this.player = new DPlayer({
      container: this.playerDOM.current,
    });
  }

  switchVideo(data) {
    if (!this.player) return;

    this.player.switchVideo({
      url: `${CDN_HOST}/${data.videoURLKey}`,
      pic: `${CDN_HOST}/${data.videoCoverURLKey}`,
    });

    setTimeout(() => this.player.play(), 50);
  }

  render() {
    const { props, data = {} } = this;

    return (
      <Modal
        visible={props.visible}
        onCancel={props.onHide}
        title={data.title}
        closable={false}
        bodyStyle={{ background: '#000' }}
        width="90%"
        footer={null}
        forceRender
      >
        <div className={styles.player} ref={this.playerDOM} />
      </Modal>
    );
  }
}

TrailerModal.defaultProps = {
  data: {},
};

export default TrailerModal;
