import React, { useState, useEffect } from 'react';
import { useFirebaseFeaturedProducts } from '../hooks/CarouselHooks';
import Link from 'next/link';
import { MoveLeft, MoveRight } from 'lucide-react';

export default function HomeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { products, loading, error } = useFirebaseFeaturedProducts(5); 

  useEffect(() => {
    if (products.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [products.length, isPaused]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
    setIsPaused(true);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
    setIsPaused(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (products.length === 0) return <div>No featured products available</div>;
  const currentProduct = products[currentIndex];

  return (
    <div className="carousel">
      {products.map((product, index) => (
          <div className={`carousel-item ${index === currentIndex ? 'active' : ''}`}>
            <img 
              src={currentProduct.featcoverimage} 
            />
            <div className="carousel-content">
              <h2>{currentProduct.title}</h2>
              <Link href={`/pages/ProductDetails/${currentProduct.id}`}>
            <button className='add-to-cart-btn'>Shop Now</button>
          </Link>
            </div>
          </div>
      ))}

      {/* Navigation Buttons */}
      <button className="carousel-nav prev" onClick={goToPrevious}>
        <MoveLeft/> {/* Left arrow */}
      </button>
      <button className="carousel-nav next" onClick={goToNext}>
        <MoveRight/> {/* Right arrow */}
      </button>
    </div>
  );
}
