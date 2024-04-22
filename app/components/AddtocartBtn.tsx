'use client'

import { getAuth } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React from 'react'

interface Article {
  userId: string;
  propertyType: string;
  id: string;
  title: string;
  content: string;
  price: string;
  imgshowcase: string;
  imgshowcase1: string
  imgshowcase2: string
  imgshowcase3: string
  imgshowcase4: string
  coverimage: string;
  catorgory: string;
  timestamp: string;
}

export default function AddToCartBtn({ post }: { post: Article }) {
  const router = useRouter();

  const handleAddToCart = async (article: Article) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const db = getFirestore();
        const cartRef = doc(db, 'Cart', currentUser.uid);
        const cartData = {
          userId: currentUser.uid,
          items: [
            {
              id: article.id || '',
              title: article.title || '',
              price: article.price || '',
              coverimage: article.coverimage || '',
              // Add any other relevant properties with default values
            }
          ]
        };

        await setDoc(cartRef, cartData, { merge: true });
        console.log('Item added to cart successfully!');
        router.push('/pages/Cart'); // Navigate to the cart page
      } else {
        console.log('User not authenticated');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  return (
    <>
      <button onClick={() => handleAddToCart(post)}>Add to cart</button>
    </>
  )
}