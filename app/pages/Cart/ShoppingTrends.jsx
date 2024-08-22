'use client'
import Link from 'next/link';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useCartState } from './utils/CartPageutils';

export default function BrowsingHistoryRecommendations() {
  const { 
    userViewedProducts, 
  } = useCartState();

  return (
    <div style={{ padding: '1rem' }}>
      <h2 className="shopping-trends-title">Your Browsing History</h2>
      <div className='shopping-trends-container'>
        {userViewedProducts.length > 0 ? (
          <ul className='shopping-trends-list'>
            {userViewedProducts.map((product) => (
              <li key={product.id && product.itemID} className='shopping-trends-card'>
                <Link href={`/pages/ProductDetails/${product.id}`}>
                  <img 
                    src={product.coverimage || product.selectedColorUrl}
                    alt={product.title} 
                    className='shopping-trends-image' 
                  />
                </Link>
                {/* Commented out section
                <div className='shopping-trends-content'>
                  <h3 className='shopping-trends-product-title'>
                    {product.title.length > 100 ? `${product.title.slice(0, 100)}...` : product.title}
                  </h3>
                  <p className='shopping-trends-category'>{product.category}</p>
                  <p className='shopping-trends-price'>Price: ${product.price}</p>
                  <button 
                    className='saved-item-add-to-cart' 
                    onClick={() => onAddToCart(product)}
                  >Add to Cart
                  </button>
                </div>
                */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recommendations available based on your browsing history.</p>
        )}
      </div>
    </div>
  );
}