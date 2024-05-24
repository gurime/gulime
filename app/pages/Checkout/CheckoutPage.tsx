'use client';

import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  title: string;
  price: string; // Note: price is a string in the database
  coverimage: string;
  quantity: number;
}

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [total, setTotal] = useState<number>(0);
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
            const items = cartData?.items || [];
            setCartItems(items);
            calculateTotal(items);
          })
          .catch((error) => {
            console.error('Error getting cart items:', error);
          });
      }
    });

    return unsubscribe;
  }, []);

  const calculateTotal = (items: CartItem[]) => {
    const totalAmount = items.reduce((acc, item) => {
      const priceNumber = parseFloat(item.price.replace(/[^0-9.-]+/g, "")); // Convert price string to number
      return acc + priceNumber * item.quantity;
    }, 0);
    setTotal(totalAmount);
  };

  // ... (previous code remains the same)

const handlePlaceOrder = async () => {
  if (currentUser) {
    const db = getFirestore();
    const ordersRef = doc(db, 'Orders', currentUser.uid);
    const cartRef = doc(db, 'Cart', currentUser.uid);
    const userRef = doc(db, 'users', currentUser.uid);

    // Get the user's last order timestamp
    const userDoc = await getDoc(userRef);
    const lastOrderTimestamp = userDoc.data()?.lastOrderTimestamp;

    // Check if the user is allowed to place an order
    const currentTimestamp = Date.now();
    const orderCooldownMs = 5 * 60 * 60 * 1000; // 7 hours in milliseconds

    if (lastOrderTimestamp && currentTimestamp - lastOrderTimestamp < orderCooldownMs) {
      // User is not allowed to place an order yet
      alert('You can only place an order after 5 hours from your last order.');
      return;
    }

    // Get the current cart items
    const cartDoc = await getDoc(cartRef);
    const cartItems = cartDoc.data()?.items ?? [];

    // Create a new order
    const newOrder = {
      items: cartItems,
      total: cartItems.reduce((acc: number, item: { price: string; quantity: number; }) => {
        const priceNumber = parseFloat(item.price.replace(/[^0-9.-]+/g, "")); // Convert price string to number
        return acc + priceNumber * item.quantity;
      }, 0),
      date: new Date(),
    };

    // Add the order to the user's orders collection
    await setDoc(ordersRef, { orders: [newOrder] }, { merge: true });

    // Update the user's last order timestamp
    await updateDoc(userRef, { lastOrderTimestamp: currentTimestamp });

    // Clear the cart
    await updateDoc(cartRef, { items: [] });

    // Redirect to the order confirmation page
    router.push('/pages/Checkout/OrderConfirmation');
  }
};

// ... (remaining code remains the same)

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
        calculateTotal(updatedCartItems);
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
      <div className="total-amount">
        <h2>Total: ${total.toFixed(2)}</h2>
      </div>
      <button className="place-order-button" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
};

export default CheckoutPage;
