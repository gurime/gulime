'use client'

import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import React from 'react'

interface Article {
  id: string;
  title: string;
  price: number;
  coverimage: string;
  savedForLater: boolean;
  quantity?: number; // Make quantity optional
}

export default function AddToCartBtn({ post }: { post: Article }) {
  const router = useRouter();

  const handleAddToCart = async (article: Article) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const db = getFirestore();
  
      if (currentUser) {
        const cartRef = doc(db, 'Cart', currentUser.uid);
        const cartDoc = await getDoc(cartRef);
  
        if (cartDoc.exists()) {
          const cartData = cartDoc.data();
          let items = cartData.items || [];
  
          const existingItemIndex = items.findIndex(
            (item: Article) => item.id === article.id
          );
  
          if (existingItemIndex !== -1) {
            items[existingItemIndex].quantity = (items[existingItemIndex].quantity || 0) + 1;
          } else {
            const newItemId = article.id || uuidv4();
            items.push({
              id: newItemId,
              title: article.title || '',
              price: article.price || 0,
              coverimage: article.coverimage || '',
              quantity: 1,
            });
          }
  
          await updateDoc(cartRef, { items });
          router.push('/pages/Cart');
        } else {
          const newItemId = article.id || uuidv4();
          await setDoc(cartRef, {
            items: [
              {
                id: newItemId,
                title: article.title || '',
                price: article.price || 0,
                coverimage: article.coverimage || '',
                quantity: 1,
              },
            ],
          });
          router.push('/pages/Cart');
        }
      } else {
        // Handle the case where the user is not logged in
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  return (
    <>
      <button onClick={() => handleAddToCart(post)}>Add to cart</button>
    </>
  );
}