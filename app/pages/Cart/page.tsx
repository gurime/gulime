'use client'
import AdminHeader from '@/app/components/AdminHeader';
import Footer from '@/app/components/footer';
import Navbar from '@/app/components/navbar';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface CartItem {
id: string;
title: string;
price: string;
coverimage: string;
// Add any other relevant properties
}

const CartPage = () => {
const [cartItems, setCartItems] = useState<CartItem[]>([]);

useEffect(() => {
const fetchCartItems = async () => {
try {
const auth = getAuth();
const currentUser = auth.currentUser;
if (currentUser) {
const db = getFirestore();
const cartRef = doc(db, 'Cart', currentUser.uid);
const cartDoc = await getDoc(cartRef);
if (cartDoc.exists()) {
const cartData = cartDoc.data();
setCartItems(cartData.items || []);
} else {
setCartItems([]);
}
}
} catch (error) {
console.error('Error fetching cart items:', error);
}
};

fetchCartItems();
}, []);

  return (
    <>
    <AdminHeader/>
    <Navbar />
    <div className="cart-page">
          <h1>Cart</h1>
          {cartItems.length === 0 ? (
              <p className="empty-cart">Your cart is empty.</p>
          ) : (
              <ul className="cart-list">
                  {cartItems.map((item) => (
                      <li key={item.id} className="cart-item">
                          <img
                              src={item.coverimage}
                              alt={item.title}
                              width="100"
                              height="100"
                              className="cart-image" />
                          <div className="cart-item-details">
                              <h3 className="cart-item-title">{item.title}</h3>
                              <p className="cart-item-price">Price: {item.price}</p>
                          </div>
                      </li>
                  ))}
              </ul>
          )}
      </div>
      <Footer/>
      </>
  );
};

export default CartPage;