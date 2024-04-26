'use client'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Article {
  id: string;
  title: string;
  price: number;
  coverimage: string;
  savedForLater: boolean;
  quantity?: number;
}

export default function AddToCartBtn({ articleId, post }: { articleId: string; post: Article }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddToCart = async (article: Article) => {
    try {
      const db = getFirestore();

      if (currentUser) {
        const cartRef = doc(db, 'Cart', currentUser.uid);
        const cartDoc = await getDoc(cartRef);

        if (cartDoc.exists()) {
          // ...
        } else {
          // Check if the required fields are present and have valid values
          if (
            articleId &&
            article.title &&
            article.price !== undefined &&
            article.coverimage
          ) {
            await setDoc(cartRef, {
              items: [
                {
                  id: articleId,
                  title: article.title,
                  price: article.price,
                  coverimage: article.coverimage,
                  quantity: 1,
                },
              ],
            });
            router.push('/pages/Cart');
          } else {
            console.error('Invalid article data:', article);
            // Handle the case where the required fields are missing or invalid
            // You can display an error message to the user or take appropriate action
          }
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