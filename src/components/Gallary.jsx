import React from 'react';
import throttle from 'lodash/throttle';
import imagesJson from '../images.json'

class Gallary extends React.Component {
  static defaultProps = {
    gallaryWidth: 30,
    numOfVisiblePhotos: 3,
    photos: imagesJson,
    styles: {
      slides: {
        display: 'flex',
        width: '30rem',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'dimgray',
        boxShadow: '5px 5px 1px lightgrey'
      },
      slide: {
        flex: '1 0 30%',
        position: 'relative',
        transition: 'left 1s ease-in-out'
      },
      img: {
        width: '10rem'
      },
      caption: {
        position: 'absolute',
        bottom: 0,
        height: 0,
        transition: 'height 500ms ease-in-out'
      },
      controls: {
        display: 'flex',
        justifyContent: 'space-between'
      },
      button: {
        flex: '1 0 30%',
        lineHeight: '3em',
        border: 'none',
        background: 'white',
      }
    }
  }
  state = {
    currentPane: 0,
    currentImage: null,
  }
  getTotalPanes() {
    const {photos, numOfVisiblePhotos} = this.props;
    const plusOne = photos.length % numOfVisiblePhotos > 0;
    return Math.floor(photos.length/numOfVisiblePhotos) + (plusOne ? 1 : 0);
  }
  getIsSwipeable(direction = 'left') {
    const {currentPane} = this.state;
    const totalPanes = this.getTotalPanes();
    return direction == 'left'
      ? currentPane < totalPanes - 1
      : currentPane > 0;
  }
  handleImageClick = ({target}) => {
    const currentImage = target.getAttribute('data-image-id');
    this.setState({currentImage});
  }
  handleTouchStart = ({touches}) => {
    this.xDown = touches[0].clientX;
  }
  handleTouchMove = throttle(({touches}) => {
    if (this.xDown == null) return;
    const xUp = touches[0].clientX;
    const isSwipeLeft = xUp - this.xDown < 0;
    if (isSwipeLeft) this.createSwipeHandler()()
    else this.createSwipeHandler('right')()
  }, 500)
  createSwipeHandler = (direction = 'left') => event => {
    const isSwipeable = this.getIsSwipeable(direction);
    const {currentPane} = this.state;
    if (!isSwipeable) return
    this.setState({currentPane: direction === 'left' ? currentPane + 1 : currentPane - 1})
  }
  getSlideStyle() {
    const {gallaryWidth, styles: {slide: slideStyle}}= this.props;
    const {currentPane} = this.state;
    return {
      ...slideStyle,
      left: `${-1 * currentPane * gallaryWidth}rem`
    }
  }
  getCaptionStyle(image) {
    let {styles: {caption: captionStyle}} = this.props;
    const {currentImage} = this.state;
    if (image === currentImage) {
      captionStyle = {
        ...captionStyle,
        height: '12rem',
        background: 'white',
        width: '100%',
        textAlign: 'center',
        padding: '.5rem 0'
      }
    }
    return captionStyle
  }
  render() {
    const {photos, styles} = this.props;
    const handleLeftSwipe = this.createSwipeHandler('left');
    const hadnleRightSwipe = this.createSwipeHandler('right');

    return (
      <div className="gallary">
        <div onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove} style={styles.slides}>
        {photos.map(({url}, index) =>
          <div style={this.getSlideStyle()} className="gallary-slide">
            <img onClick={this.handleImageClick} data-image-id={index} style={styles.img} src={url} alt="marvel movie covers" />
            <figcaption style={this.getCaptionStyle(String(index))}>this was an image</figcaption>
          </div>
        )}
        </div>
        <hr/>
        <div style={styles.controls}>
          <button style={{...styles.button, marginRight: '1rem'}} onClick={handleLeftSwipe}>◀︎</button>
          <button style={{...styles.button, marginLeft: '1rem'}} onClick={hadnleRightSwipe}>▶︎</button>
        </div>
      </div>
    )
  }
}

export default Gallary;
