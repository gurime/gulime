'use client'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { arrayUnion, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function ProductCartBtn({ 
  articleId, 
  product
}) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []); // Remove dependency on product

  const handleAddToCart = async () => {
    if (!currentUser) {
      router.push('/pages/Login');
      return;
    }
  
    if (!articleId || !product) {
      return;
    }
  
    const db = getFirestore();
    const userCartRef = doc(db, 'carts', currentUser.uid);
  
    try {
      const cartDoc = await getDoc(userCartRef);
     
      const newItem = {
        id: articleId,
        itemID: `${articleId}_${Date.now()}`,
        quantity: 1,
        title: product.title || "",
        content: product.content || "",
        content1: product.content1 || "",
        content2: product.content2 || "",
        content3: product.content3 || "",
        content4: product.content4 || "",
        content5: product.content5 || "",
        content6: product.content6 || "",
        price: product.price || 0,
        coverimage: product.coverimage || "",
        imgshowcase: product.imgshowcase || "",
        imgshowcase1: product.imgshowcase1 || "",
        imgshowcase2: product.imgshowcase2 || "",
        category: product.category || ""
      };

      // Ensure all fields are defined
      Object.keys(newItem).forEach(key => {
        if (newItem[key] === undefined) {
          newItem[key] = ''; // Use empty string as default
        }
      });
  
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const cartItems = cartData.items || [];
        const existingItemIndex = cartItems.findIndex(
          (item) => item.id === articleId 
        );
  
        if (existingItemIndex !== -1) {
          // Item already exists, update quantity and price
          cartItems[existingItemIndex].quantity += 1;
          cartItems[existingItemIndex].price = (
            parseFloat(cartItems[existingItemIndex].price) * cartItems[existingItemIndex].quantity
          ).toFixed(2);
  
          await updateDoc(userCartRef, { items: cartItems });
        } else {
          // New item, add to cart
          await updateDoc(userCartRef, {
            items: arrayUnion(newItem),
          });
        }
      } else {
        // Cart doesn't exist, create new cart with the item
        await setDoc(userCartRef, {
          items: [newItem],
        });
      }
  
      router.push('/pages/Cart/');
    } catch (error) {
      console.error("Error adding item to cart:", error);
      // You might want to show an error message to the user here
    }
  };

  const formattedPrice = formatNumber(parseFloat(product.price || 0).toFixed(2));

  return (
    <button className='add-to-cart-btn' onClick={handleAddToCart}>
      Add to cart ${formattedPrice}
    </button>
  );
}