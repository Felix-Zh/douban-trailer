import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


const STATUS_TYPES = {
  LOADING: Symbol('loading'),
  LOAD: Symbol('load'),
  ERROR: Symbol('error'),
};

class ImageFade extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: STATUS_TYPES.LOADING,
    };

    this.img = new Image();

    this.handleImgLoad = this.handleImgLoad.bind(this);
    this.handleImgError = this.handleImgError.bind(this);
  }

  componentDidMount() {
    this.img.addEventListener('load', this.handleImgLoad);
    this.img.addEventListener('error', this.handleImgError);
    this.img.src = this.props.src;
  }

  componentWillUnmount() {
    this.img.removeEventListener('load', this.handleImgLoad);
    this.img.removeEventListener('error', this.handleImgError);
    this.img = null;
  }

  handleImgLoad() {
    this.setState({ status: STATUS_TYPES.LOAD });
  }

  handleImgError() {
    this.setState({ status: STATUS_TYPES.ERROR });
  }

  render() {
    const { props, state } = this;
    const { status } = state;

    return (
      <TransitionGroup>
        {
          status === STATUS_TYPES.ERROR &&
          <CSSTransition classNames="fade" timeout={3000}>
            <img src={props.errorSrc} className={props.className} alt={props.alt} />
          </CSSTransition>
        }
        {
          status === STATUS_TYPES.LOADING &&
          <CSSTransition classNames="fade" timeout={3000}>
            <img src={props.placeholderSrc} className={props.className} alt={props.alt} />
          </CSSTransition>
        }
        {
          status === STATUS_TYPES.LOAD &&
          <CSSTransition classNames="fade" timeout={3000}>
            <img src={props.src} className={props.className} alt={props.alt} />
          </CSSTransition>
        }
      </TransitionGroup>
    );
  }
}

ImageFade.defaultProps = {
  placeholderSrc: 'http://pjpw4zz78.bkt.clouddn.com/loading.jpg',
  errorSrc: 'http://pjpw4zz78.bkt.clouddn.com/loading.jpg',
};

export default ImageFade;
