'use client';

import React, { useState } from 'react';

function ImageGallery({ images }) {
  const [coverimage, setMainImage] = useState(images[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleThumbnailClick = (image, index) => {
    setMainImage(image);
    setSelectedIndex(index);
  };

  const handleMouseEnter = (image, index) => {
    setMainImage(image);
    setSelectedIndex(index);
  };

  return (
    <div className="product-images"> 
      {coverimage && (
        <div className="main-image">
          <div className="main-image">
            <img src={coverimage} alt="Main product image" />
          </div>
        </div>
      )}
 
      <div className="thumbnails">
        {images.map((image, index) => (
          <div
            key={index}
            className={`thumbnail-wrapper ${index === selectedIndex ? 'selected' : ''}`}
            onMouseEnter={() => handleMouseEnter(image, index)}
            onClick={() => handleThumbnailClick(image, index)}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="thumbnail-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;