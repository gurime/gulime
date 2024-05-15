'use client'
import { useState, Key } from 'react';

interface ImageGalleryProps {
  images: (string | undefined)[];

}

function ImageGallery({ images }: ImageGalleryProps) {
const [mainImage, setMainImage] = useState<string | undefined>(images[0]);
return (
<div className="product-images">
  
  <div className="thumbnails">
    {images.map((image: string | undefined, index: Key | null | undefined) => (
      <img
        key={index}
        src={image}
        alt={`Thumbnail ${index}`}
        onClick={() => setMainImage(image)}
      />
    ))} 
  </div>
  <div className="main-image">
    <img className="cover_image" src={mainImage} alt="Main" />
  </div>
</div>

);
}

export default ImageGallery;