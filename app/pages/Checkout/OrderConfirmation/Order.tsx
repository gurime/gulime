'use client';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface CartItem {
  id: string;
  title: string;
  price: string;
  coverimage: string;
  quantity: number;
}

interface Order {
  items: CartItem[];
  total: number;
  date: any;
}

export default function Order() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderDate, setOrderDate] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const db = getFirestore();
        const ordersRef = doc(db, 'Orders', user.uid);
        // Listen for changes in the "Orders" collection
        const unsubscribeOrders = onSnapshot(ordersRef, (snapshot) => {
          const orderData = snapshot.data();
          if (orderData && orderData.orders && orderData.orders.length > 0) {
            const latestOrder: Order = orderData.orders[orderData.orders.length - 1];
            setCartItems(latestOrder.items);
            setOrderTotal(latestOrder.total);
            setOrderDate(latestOrder.date.toDate().toLocaleString());
          }
        });

        // Clean up the listeners when the component unmounts
        return () => {
          unsubscribeOrders();
        };
      }
    });

    return unsubscribe;
  }, []);

  return (
<div className="order-container">
  <h1 className="order-title">Order Confirmation</h1>
  <div className="order-summary">
    <h2>Order Summary</h2>
    <div className="order-details">
      <p><strong>Order Date:</strong> {orderDate}</p>
      <p><strong>Order Total:</strong> ${orderTotal.toFixed(2)}</p>
    </div>
    {cartItems.map((item) => (
      <div key={item.id} className="order-item">
        <Link href={`/pages/Details/${item.id}`} className="order-link">
          <img src={item.coverimage} alt={item.title} className="order-image" />
        </Link>
        <div className="item-details">
          <p><strong>Title:</strong> {item.title}</p>
          <p><strong>Quantity:</strong> {item.quantity}</p>
        </div>
      </div>
    ))}
    <div className="order-actions">
      <button className="order-button">Print Order</button>
      <button className="order-button">View Order History</button>
    </div>
  </div>
</div>

  );
}
