'use client';
import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import Link from 'next/link';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface CartItem {
  id: string;
  title: string;
  price: number;
  coverimage: string;
  savedForLater: boolean;
  quantity: number;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        const db = getFirestore();
        const cartRef = doc(db, 'Cart', user.uid);
        const savedRef = doc(db, 'Saved', user.uid);

        // Listen for changes in the "Cart" collection
        const unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
          const cartData = snapshot.data();
          setCartItems(cartData?.items || []);
        });

        // Listen for changes in the "Saved" collection
        const unsubscribeSaved = onSnapshot(savedRef, (snapshot) => {
          const savedData = snapshot.data();
          setSavedItems(savedData?.items || []);
        });

        // Clean up the listeners when the component unmounts
        return () => {
          unsubscribeCart();
          unsubscribeSaved();
        };
      }
    });

    return unsubscribe;
  }, []);

  const handleAddToCart = async (newItem: CartItem, quantity: number) => {
    if (currentUser) {
      const db = getFirestore();
      const cartRef = doc(db, 'Cart', currentUser.uid);
      const cartDoc = await getDoc(cartRef);
  
      let updatedCartItems: CartItem[] = [];
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        updatedCartItems = cartData.items || [];
      }
  
      const existingItemIndex = updatedCartItems.findIndex((item) => item.id === newItem.id);
      if (existingItemIndex !== -1) {
        updatedCartItems[existingItemIndex].quantity += quantity;
      } else {
        updatedCartItems.push({ ...newItem, quantity });
      }
  
      await setDoc(cartRef, { items: updatedCartItems });
      setCartItems(updatedCartItems);
  
      deleteFromSaved(newItem.id);
    }
  };
  

  const deleteFromCart = async (itemId: string) => {
    if (currentUser) {
      const db = getFirestore();
      const cartRef = doc(db, 'Cart', currentUser.uid);
      const cartDoc = await getDoc(cartRef);

      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const updatedCartItems = cartData.items.filter((item: CartItem) => item.id !== itemId);

        await updateDoc(cartRef, { items: updatedCartItems });
        setCartItems(updatedCartItems);
      }
    }
  };

  const handleSaveForLater = async (itemId: string) => {
    if (currentUser) {
      const db = getFirestore();
      const cartRef = doc(db, 'Cart', currentUser.uid);
      const savedRef = doc(db, 'Saved', currentUser.uid);
      const cartDoc = await getDoc(cartRef);
      const savedDoc = await getDoc(savedRef);
  
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const itemToSave = cartData.items.find((item: CartItem) => item.id === itemId);
  
        if (itemToSave) {
          const updatedCartItems = cartData.items.filter((item: CartItem) => item.id !== itemId);
          const updatedSavedItems = savedDoc.exists() ? [...savedDoc.data().items, itemToSave] : [itemToSave];
  
          await updateDoc(cartRef, { items: updatedCartItems });
          await setDoc(savedRef, { items: updatedSavedItems });
          setCartItems(updatedCartItems);
          setSavedItems(updatedSavedItems);
        }
      }
    }
  };
  const deleteFromSaved = async (itemId: string) => {
    if (currentUser) {
      const db = getFirestore();
      const savedRef = doc(db, 'Saved', currentUser.uid);
      const savedDoc = await getDoc(savedRef);

      if (savedDoc.exists()) {
        const savedData = savedDoc.data();
        const updatedSavedItems = savedData.items.filter((item: CartItem) => item.id !== itemId);

        await updateDoc(savedRef, { items: updatedSavedItems });
        setSavedItems(updatedSavedItems);
      }
    }
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
<div className="cart-page">
  <h1 style={{ fontWeight: '400', fontSize: '28px', lineHeight: '36px' }}>Shopping Cart</h1>
  {cartItems.length === 0 ? (
    <p className="empty-cart">Your cart is empty.</p>
  ) : (
    <ul className="cart-items">
      {cartItems.map((item) => (
        <span key={item.id}>
          <div className="cart-item">
            <Link href={`/pages/Details/${item.id}`} className="hero-btn">
              <img src={item.coverimage} alt={item.title} className="cart-image" />
            </Link>
            <div className="cart-item-details">
              <h3 className="cart-item-title">{item.title.slice(0, 100)}...</h3>
              <p className="cart-item-price">Price: {item.price}</p>
              <p className="cart-item-quantity">Quantity: {item.quantity}</p>
            </div>
          </div>
          <div className="cart-item-actions">
            <button className="cart-item-remove" onClick={() => deleteFromCart(item.id)}>
              Delete
            </button>
            <button className="cart-item-save" onClick={() => handleSaveForLater(item.id)}>
              Save for Later
            </button>
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
        </span>
      ))}
    </ul>
  )}
  {cartItems.length > 0 && (
  <Link href="/pages/Checkout">
    <button className="checkout-button">Proceed to Checkout</button>
  </Link>
)}

      <h2 style={{ fontWeight: '400', fontSize: '28px', lineHeight: '36px' }}>Saved for later</h2>
      <ul className="saved-list">
        {savedItems.map((item) => (
          <span key={item.id}>
            <div className="saved-item">
              <Link href={`/pages/Details/${item.id}`} className="hero-btn">
                <img src={item.coverimage} alt={item.title} className="saved-image" />
              </Link>
              <div className="saved-item-details">
                <h3 className="saved-item-title">{item.title}</h3>
                <p className="saved-item-price">Price: {item.price}</p>
              </div>
            </div>
            <div className="saved-item-actions">
              <button className="saved-item-delete" onClick={() => deleteFromSaved(item.id)}>
                Delete
              </button>
              <button className="saved-item-add-to-cart" onClick={() => handleAddToCart(item,1)}>
                Add to cart
              </button>
            </div>
          </span>
        ))}
      </ul>

  
</div>
  );
};

export default CartPage;