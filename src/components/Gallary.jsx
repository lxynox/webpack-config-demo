import React from "react";
import { string, shape, arrayOf, object } from "prop-types";
import throttle from "lodash/throttle";
import "./gallary.scss";
import { runInThisContext } from "vm";

class Gallary extends React.Component {
  state = {
    currentPane: 0,
    currentImage: null,
    canMeasureDOM: false
  };

  componentDidMount() {
    this.setState({ canMeasureDOM: true });
  }

  getTotalPanes() {
    const { photos } = this.props;
    const { canMeasureDOM } = this.state;
    if (!canMeasureDOM) return;
    const numOfVisiblePhotos =
      this.slidesRef.clientWidth / this.imageRef.clientWidth;
    const plusOne = photos.length % numOfVisiblePhotos > 0;
    return Math.floor(photos.length / numOfVisiblePhotos) + (plusOne ? 1 : 0);
  }

  getIsSwipeable(direction = "left") {
    const { currentPane } = this.state;
    const totalPanes = this.getTotalPanes();
    return direction == "left" ? currentPane < totalPanes - 1 : currentPane > 0;
  }

  getSlideStyle() {
    const {
      styles: { slide: slideStyle }
    } = this.props;
    const { canMeasureDOM, currentPane } = this.state;
    if (!canMeasureDOM) return slideStyle;
    return {
      ...slideStyle,
      left: `${-1 * currentPane * this.slidesRef.clientWidth}px`
    };
  }

  getCaptionStyle(image) {
    let {
      styles: { caption: captionStyle }
    } = this.props;
    const { currentImage } = this.state;
    if (image === currentImage) {
      captionStyle = {
        ...captionStyle,
        height: "8rem",
        cursor: "auto"
      };
    }
    return captionStyle;
  }

  handleImageClick = ({ target }) => {
    let { currentImage } = this.state;
    const nextImage = target.getAttribute("data-image-id");
    currentImage = currentImage !== nextImage ? nextImage : null;
    this.setState({ currentImage });
  };

  handleTouchStart = ({ touches }) => {
    this.xDown = touches[0].clientX;
  };

  handleTouchMove = throttle(({ touches }) => {
    if (this.xDown == null) return;
    const xUp = touches[0].clientX;
    const isSwipeLeft = xUp - this.xDown < 0;
    if (isSwipeLeft) this.createSwipeHandler()();
    else this.createSwipeHandler("right")();
  }, 500);

  createSwipeHandler = (direction = "left") => event => {
    const isSwipeable = this.getIsSwipeable(direction);
    const { currentPane } = this.state;
    if (!isSwipeable) return;
    this.setState({
      currentPane: direction === "left" ? currentPane + 1 : currentPane - 1
    });
  };

  renderSlides() {
    const { photos } = this.props;
    return (
      <div
        className="gallary-slides"
        ref={node => (this.slidesRef = node)}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
      >
        {photos.map(({ url, caption }, index) => (
          <div style={this.getSlideStyle()}>
            <img
              onClick={this.handleImageClick}
              ref={node => (this.imageRef = node)}
              data-image-id={index}
              src={url}
              alt="marvel movie covers"
            />
            <figcaption style={this.getCaptionStyle(String(index))}>
              {caption}
            </figcaption>
          </div>
        ))}
      </div>
    );
  }

  renderControls() {
    const handleLeftSwipe = this.createSwipeHandler("left");
    const hadnleRightSwipe = this.createSwipeHandler("right");
    return (
      <div className="gallary-controls">
        <button
          disabled={!this.getIsSwipeable("left")}
          onClick={handleLeftSwipe}
        >
          ◀︎
        </button>
        <button
          disabled={!this.getIsSwipeable("right")}
          onClick={hadnleRightSwipe}
        >
          ▶︎
        </button>
      </div>
    );
  }

  render() {
    return (
      <div className="gallary">
        {this.renderSlides()}
        <hr />
        {this.renderControls()}
      </div>
    );
  }
}

Gallary.propTypes = {
  photos: arrayOf(
    shape({
      url: string.isRequired,
      caption: string.isRequired
    })
  ).isRequired,
  styles: object
};

Gallary.defaultProps = {
  styles: {
    slide: {
      flex: "1 0 30%",
      left: 0,
      position: "relative",
      transition: "left 1s ease-in-out"
    },
    caption: {
      position: "absolute",
      bottom: 0,
      height: 0,
      background: "white",
      padding: ".5rem 0 0 0",
      overflow: "hidden",
      width: "100%",
      textAlign: "center",
      transition: "height 500ms ease-in-out"
    }
  }
};

export default Gallary;
