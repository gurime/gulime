import React, { useState, useEffect } from 'react';
import { useFirebaseFeaturedProducts } from '../hooks/CarouselHooks';
import Link from 'next/link';
import Image from 'next/image';

export default function HomeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { products, loading, error } = useFirebaseFeaturedProducts(5); // Fetch up to 5 featured products

  useEffect(() => {
    if (products.length === 0) return; // Don't set up interval if there are no products

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [products.length]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (products.length === 0) return <div>No featured products available</div>;

  return (
<div className="carousel">
  {products.map((product, index) => (
    <Link href={`/pages/ProductDetails/${product.id}`} key={product.id} passHref>
      <div className={`carousel-item ${index === currentIndex ? 'active' : ''}`}>
        <img 
          src={product.featuredimage} 
          alt={product.featuredtitle} 
        />
        <div className="carousel-content">
          <h2>{product.title}</h2>
          <p>{product.description}</p>
        </div>
      </div>
    </Link>
  ))}
</div>
  );
}