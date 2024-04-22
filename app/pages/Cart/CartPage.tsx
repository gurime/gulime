'use client'

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import Link from 'next/link';

interface CartItem {
  id: string;
  title: string;
  price: string;
  coverimage: string;
  savedForLater: boolean;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (currentUser) {
        const db = getFirestore();
        const cartRef = doc(db, 'Cart', currentUser.uid);
        const cartDoc = await getDoc(cartRef);
        if (cartDoc.exists()) {
          const cartData = cartDoc.data();
          setCartItems(cartData.items || []);
        }
      }
    };
    fetchCartItems();
  }, [currentUser]);

const handleDelete = async (itemId: string) => {
try {
if (currentUser) {
const db = getFirestore();
const cartRef = doc(db, 'Cart', currentUser.uid);
await deleteDoc(cartRef);
setCartItems([]);
}
} catch (error) {
console.error('Error deleting cart item:', error);
}
};

  useEffect(() => {
    const fetchSavedItems = async () => {
      if (currentUser) {
        const db = getFirestore();
        const savedRef = doc(db, 'Saved', currentUser.uid);
        const savedDoc = await getDoc(savedRef);
        if (savedDoc.exists()) {
          const savedData = savedDoc.data();
          setSavedItems(savedData.items || []);
        }
      }
    };
    fetchSavedItems();
  }, [currentUser]);

  const handleSaveForLater = async (itemId: string) => {
    if (currentUser) {
      const db = getFirestore();
      const cartRef = doc(db, 'Cart', currentUser.uid);
      const cartDoc = await getDoc(cartRef);
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const updatedItems = cartData.items.map((item: { id: string; }) => {
          if (item.id === itemId) {
            return { ...item, savedForLater: true };
          }
          return item;
        });
        const newCartItems = updatedItems.filter((item: { savedForLater: any; }) => !item.savedForLater);
        await updateDoc(cartRef, { items: newCartItems });
        setCartItems(newCartItems);
  
        const savedRef = doc(db, 'Saved', currentUser.uid);
        const savedDoc = await getDoc(savedRef);
        if (!savedDoc.exists()) {
          await setDoc(savedRef, { items: [] }); // Create the "Saved" collection if it doesn't exist
        }
        const savedData = (await getDoc(savedRef)).data();
        if (savedData) { // Add this check to ensure savedData is not undefined
          const updatedSavedItems = [
            ...savedData.items,
            cartData.items.find((item: { id: string; }) => item.id === itemId),
          ];
          await updateDoc(savedRef, { items: updatedSavedItems });
          setSavedItems(updatedSavedItems);
        }
      }
    }
  };

  const handleAddToCart = async (article: CartItem) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        const db = getFirestore();
        const cartRef = doc(db, 'Cart', currentUser.uid);
        const cartDoc = await getDoc(cartRef);
        const cartData = cartDoc.data();
  
        if (cartData) {
          const existingItem = cartData.items.find((item: { id: string; }) => item.id === article.id);
  
          if (existingItem) {
            // Update quantity if item already exists in cart
            const updatedItems = cartData.items.map((item: { id: string; quantity: any; }) => {
              if (item.id === article.id) {
                return { ...item, quantity: (item.quantity || 0) + 1 };
              }
              return item;
            });
            await updateDoc(cartRef, { items: updatedItems });
            setCartItems(updatedItems); // Update the cartItems state
          } else {
            // Add item to cart if it doesn't exist
            const newItems = [...cartData.items, article];
            await updateDoc(cartRef, { items: newItems });
            setCartItems(newItems); // Update the cartItems state
          }
        } else {
          // Create cart document if it doesn't exist
          const newCartData = {
            userId: currentUser.uid,
            items: [article],
          };
          await setDoc(cartRef, newCartData);
          setCartItems([article]); // Update the cartItems state
        }
  
        // Remove item from "Saved" collection
        const savedRef = doc(db, 'Saved', currentUser.uid);
        const savedDoc = await getDoc(savedRef);
        if (savedDoc.exists()) {
          const savedData = savedDoc.data();
          const updatedSavedItems = savedData.items.filter((item: { id: string; }) => item.id !== article.id);
          await updateDoc(savedRef, { items: updatedSavedItems });
          setSavedItems(updatedSavedItems);
        }
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="cart-page">
      <h1>Your Items</h1>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <ul className="cart-list">
          {cartItems.map((item) => (
            <li key={item.id} className="cart-item">
              <Link href={`/Details/${item.id}`} key={`${item.id}-link`}>
                <div className="cart-item-inner">
                  <img
                    src={item.coverimage}
                    alt={item.title}
                    width="100"
                    height="100"
                    className="cart-image"
                  />
                  <div className="cart-item-details">
                    <h3 className="cart-item-title">{item.title}</h3>
                    <p className="cart-item-price">Price: {item.price}</p>
                  </div>
                </div>
              </Link>
              <button onClick={() => handleDelete(item.id)}>Delete</button>
              <button onClick={() => handleSaveForLater(item.id)}>Save for later</button>
            </li>
          ))}
        </ul>
      )}
      <h2>Saved for later</h2>
<ul className="saved-list">
  {savedItems.map((item) => (
    <span key={item.id} className="saved-item">
      <Link href={`/Details/${item.id}`} key={`${item.id}-link`}>
        <div className="saved-item-inner">
          <img
            src={item.coverimage}
            alt={item.title}
            width="100"
            height="100"
            className="saved-image"
          />
          <div className="saved-item-details">
            <h3 className="saved-item-title">{item.title}</h3>
            <p className="saved-item-price">Price: {item.price}</p>
          </div>
        </div>
      </Link>
      <div >   
        
        <span style={{
          cursor:'pointer',
          padding:'0 10px 0 0',
          color:'blue'

        }} onClick={() => handleDelete(item.id)}>Delete</span>
      <span
      style={{
        cursor:'pointer',
        color:'blue'
      }}
      onClick={() => handleAddToCart(item)}>Add to cart</span>
      </div>
   

    </span>
    
  ))}
</ul>
    </div>
  );
};

export default CartPage;