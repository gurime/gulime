'use client'
import { Minus, Plus, Tag, ChevronUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import { RiseLoader } from 'react-spinners';
import { useCartState } from './utils/CartPageutils';
import { useEffect } from 'react';
import CartItemPrice from './CartItemPrice';
import BrowsingHistoryRecommendations from './ShoppingTrends';

const fadeInOut = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

const colorOptions = [
  'SolidBlackImage',
  'DeepBlueMetallicImage',
  'UltraRedImage',
  'PearlWhiteMultiCoatImage',
  'QuickSilverImage',
  'StealthGreyImage'
];

const getColorImage = (item) => {
  // Check if item.selectedColorUrl exists and is a string
  if (item.selectedColorUrl && typeof item.selectedColorUrl === 'string') {
    return item.selectedColorUrl;
  }
  
  // If selectedColorUrl is not available, try cardisplay
  if (item.cardisplay) {
    return item.cardisplay;
  }
  
  // If cardisplay is not available, try coverimage
  if (item.coverimage) {
    return item.coverimage;
  }
  
  // If no valid image URL is found, return a default image
};
export default function CartPage() {
  const {
    cartItems,
    savedItems,
    showConfirmation,
    cartCount,
    expandedCategories,
    loading,
    userViewedProducts,
    savedItemsByCategory,
    toggleCategory,
    handleQuantityChange,
    handleAddToCart,
    deleteFromCart,
    handleSaveForLater,
    deleteFromSaved,
    fetchRecommendations,
    handleProductView
  } = useCartState();

  useEffect(() => {
    cartItems.forEach((item) => {
      handleProductView(item);  
    });
    fetchRecommendations();
  }, [cartItems]);

  return (
    <>
      <div className="cart-page">
        {loading ? (
          <div className="loader-container">
            <RiseLoader color="blue" size={15} />
          </div>
        ) : (
          <>
            {cartItems.length === 0 ? (
              <>
                <h1 className="empty-cart">Your Gulime cart is empty</h1>
                <div style={{ textAlign: 'end' }}>
                  <h3>Total ({cartCount} items)</h3>
                </div>
              </>
            ) : (
              <motion.ul 
                className="cart-items" 
                initial="hidden" 
                animate="visible" 
                exit="exit"
              >
                <h1 className="empty-cart">Gulime Shopping Cart</h1>
                <div style={{ textAlign: 'end' }}>
                  <h3>Total ({cartCount} items)</h3>
                </div>
                {cartItems.map((item) => (
                  <motion.li 
                    key={item.itemID || item.id} 
                    variants={fadeInOut} 
                    className="cart-item"
                  >
                    <Link href={`/pages/ProductDetails/${item.id || item.itemID}`}>
                      <img src={getColorImage(item)} className="cart-image" alt={item.title} />
                    </Link>
                    <div className="cart-item-details">
                      <h2 className="cart-item-title">
                        {item.title || item.cartitle}
                      </h2>
                      <p className="cart-item-price">
                        <CartItemPrice item={item} />
                      </p> 
                      {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                      {item.selectedConfiguration && <p>Configuration: {item.selectedConfiguration}</p>}
                      <div className="cart-item-actions">
                        <button onClick={() => handleSaveForLater(item.itemID)} className="cart-item-save">Save for Later</button>
                        <button onClick={() => deleteFromCart(item.itemID)} className="cart-item-remove">Delete</button>
                        <button onClick={() => handleQuantityChange(item, -1)} className="quantity-btn"><Minus /></button>
                        <span className="quantity">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item, 1)} className="quantity-btn"><Plus /></button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}

            {cartCount > 0 && (
              <Link href="/pages/Checkout">
                <button className="checkout-button">Proceed to Checkout</button>
              </Link>
            )}

            <h2 className="saved-items-title">
              Saved for later ({savedItems.length})
            </h2>

            <div className="saved-items-by-category">
              {Object.entries(savedItemsByCategory).map(([category, items]) => (
                <div key={category} className="category-section">
                  <button 
                    className="category-button" 
                    onClick={() => toggleCategory(category)}
                  >
                    <Tag className="category-icon" />
                    <span className="category-name">{category}</span>
                    <span className="category-count">({items.length})</span>
                    {expandedCategories[category] ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {expandedCategories[category] && (
                    <motion.ul 
                      className="saved-list"
                      initial="hidden" 
                      animate="visible" 
                      exit="exit"
                    >
                      {items.map((item) => (
                        <motion.li 
                          key={item.itemID || uuidv4()} 
                          variants={fadeInOut} 
                          className="saved-item"
                        >
                          <Link href={`/pages/ProductDetails/${item.id || ''}`}>
                            <img src={getColorImage(item)} alt={item.title} className="cart-image" />
                          </Link>

                          <div className="saved-item-details">
                            <h2 className="saved-item-title">{item.title?.slice(0,100) || ''}...</h2>
                            <p className="saved-item-price">
                              ${item.configurationPrice !== undefined ? item.configurationPrice : item.price}
                            </p>
                            <div className="saved-item-actions">
                              <button onClick={() => handleAddToCart(item, 1)} className="saved-item-add-to-cart">Add to Cart</button>
                              <button onClick={() => deleteFromSaved(item.itemID)} className="saved-item-delete">Delete</button>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </div>
              ))}
            </div>

            {showConfirmation && (
              <motion.div 
                className="confirmation-message"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
              >
                <p style={{ color: '#000' }}>{showConfirmation}</p>
              </motion.div>
            )}
          </>
        )}
      </div>
      <BrowsingHistoryRecommendations 
        userViewedProducts={userViewedProducts}
      />  
    </>
  );
}