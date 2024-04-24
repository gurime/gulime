'use client';
import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase'; // Assuming this import is correct
import Link from 'next/link';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface CartItem {
  id: string;
  title: string;
  price: string;
  coverimage: string;
  savedForLater: boolean;
  quantity:number;
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

  useEffect(() => {
    const fetchCartItems = async () => {
      if (currentUser) {
        const db = getFirestore();
        const cartRef = doc(db, 'Saved', currentUser.uid);
        const cartDoc = await getDoc(cartRef);
        if (cartDoc.exists()) {
          const cartData = cartDoc.data();
          setSavedItems(cartData.items || []);
        }
      }
    };
    fetchCartItems();
  }, [currentUser]);
  const handleAddToCart = async (newItem: CartItem) => {
    if (currentUser) {
      const db = getFirestore();
      const cartRef = doc(db, 'Cart', currentUser.uid);
      const savedRef = doc(db, 'Saved', currentUser.uid);
      const cartDoc = await getDoc(cartRef);
      const savedDoc = await getDoc(savedRef);
  
      let updatedCartItems: CartItem[] = [];
      let updatedSavedItems: CartItem[] = [];
  
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        updatedCartItems = cartData.items || [];
      }
  
      if (savedDoc.exists()) {
        const savedData = savedDoc.data();
        updatedSavedItems = savedData.items || [];
      }
  
      // Remove the item from the "Saved for later" list
      const index = updatedSavedItems.findIndex((item) => item.id === newItem.id);
      if (index !== -1) {
        updatedSavedItems.splice(index, 1);
      }
  
      // Add the item to the cart
      updatedCartItems.push({ ...newItem, quantity: 1 });
  
      await setDoc(cartRef, { items: updatedCartItems });
      await setDoc(savedRef, { items: updatedSavedItems });
      setCartItems(updatedCartItems);
      setSavedItems(updatedSavedItems);
    }
  };
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
        if (savedData) {
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
  const handleDelete = async (itemId: string) => {
    if (currentUser) {
      const db = getFirestore();
      const cartRef = doc(db, 'Cart', currentUser.uid);
      const cartDoc = await getDoc(cartRef);
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const updatedItems = cartData.items.filter((item: { id: string; }) => item.id !== itemId);
        await updateDoc(cartRef, { items: updatedItems });
        setCartItems(updatedItems);
      }
    }
  };

  const Delete = async (itemId: string) => {
    try {
    if (currentUser) {
    const db = getFirestore();
    const cartRef = doc(db, 'Saved', currentUser.uid);
    await deleteDoc(cartRef);
    setCartItems([]);
    }
    } catch (error) {
    console.error('Error deleting cart item:', error);
    }
    };
  return (
    <>
       <div className="cart-page">
  <h1 style={{
    fontWeight: '400',
    fontSize: '28px',
    lineHeight: '36px'
  }}>Shopping Cart</h1>
  {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
    <ul className="cart-items">
      {cartItems.map((item) => (
        <li key={item.id}>
          <div className="cart-item">
            <img
              src={item.coverimage}
              alt={item.title}
      width={170}
              className="cart-image"
            />
            <div className="cart-item-details">
              <h3 className="cart-item-title">{item.title.slice(0, 100)}...</h3>
              <p className="cart-item-price">Price: {item.price}</p>
              <p className="cart-item-quantity">Quantity: 1</p>
            </div>
          </div>
          <div className="cart-item-actions">           
          <button className="cart-item-remove" onClick={() => Delete(item.id)}>Delete</button>


            <button className="cart-item-remove" onClick={() => handleSaveForLater(item.id)}>Save for Later</button>
          </div>
        </li>
      ))}
    </ul>
  )}
  <h2 style={{
    fontWeight: '400',
    fontSize: '28px',
    lineHeight: '36px'
  }}>Saved for later</h2>
  <ul className="saved-list">
    {savedItems.map((item) => (
      <li key={item.id}>
        <div className="saved-item">
          <img
            src={item.coverimage}
            alt={item.title}
         
            className="saved-image"
          />
          <div className="saved-item-details">
            <h3 className="saved-item-title">{item.title}</h3>
            <p className="saved-item-price">Price: {item.price}</p>
          </div>
        </div>
        <div className="saved-item-actions">
          <button className="saved-item-delete" onClick={() => Delete(item.id)}>Delete</button>
          <button className="saved-item-add-to-cart" onClick={() => handleAddToCart(item)}>Add to cart</button>
        </div>
      </li>
    ))}
  </ul>
</div>
    </>
  ); 
}

export default CartPage;
