'use client'

import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  title: string;
  price: number;
  coverimage: string;
  quantity: number;
}

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        const db = getFirestore();
        const cartRef = doc(db, 'Cart', user.uid);

        getDoc(cartRef)
          .then((snapshot) => {
            const cartData = snapshot.data();
            setCartItems(cartData?.items || []);
          })
          .catch((error) => {
            console.error('Error getting cart items:', error);
          });
      }
    });

    return unsubscribe;
  }, []);

  const handlePlaceOrder = () => {
    // Implement the logic to place the order
    console.log('Placing order...');
  };

  
  const handleQuantityChange = async (item: CartItem, change: number) => {
    if (currentUser) {
      const db = getFirestore();
      const cartRef = doc(db, 'Cart', currentUser.uid);
      const cartDoc = await getDoc(cartRef);
  
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const updatedCartItems = cartData.items.map((cartItem: CartItem) => {
          if (cartItem.id === item.id) {
            return { ...cartItem, quantity: cartItem.quantity + change };
          }
          return cartItem;
        });
  
        await updateDoc(cartRef, { items: updatedCartItems });
        setCartItems(updatedCartItems);
      }
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-items">
        {cartItems.map((item) => (
          <div key={item.id} className="checkout-item">
            <img src={item.coverimage} alt={item.title} className="checkout-item-image" />
            <div className="checkout-item-details">
              <h3 className="checkout-item-title">{item.title}</h3>
              <p className="checkout-item-price">Price: {item.price}</p>
              <p className="checkout-item-quantity">Quantity: {item.quantity}</p>
              <div className="quantity-controls">
          <button
            className="quantity-btn decrement"
            onClick={() => handleQuantityChange(item, -1)}
            disabled={item.quantity === 1}
          >
            -
          </button>
          <span className="quantity">{item.quantity}</span>
          <button
            className="quantity-btn increment"
            onClick={() => handleQuantityChange(item, 1)}
          >
            +
          </button>
        </div>
            </div>
          </div>
        ))}
      </div>
      <button className="place-order-button" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
};

export default CheckoutPage;