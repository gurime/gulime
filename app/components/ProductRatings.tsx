'use client'
import { collection, addDoc, getDocs, query, where, getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { User } from "firebase/auth";

interface Rating {
  id: string;
  
  productId: string;
  rating: number;
  userId: string;
}

interface ProductRatingsProps {
  productId: string;
}

const ProductRatings: React.FC<ProductRatingsProps> = ({ productId }) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      setIsSignedIn(!!user);
      if (user && productId) { // Add check for productId
        const db = getFirestore();
        const ratingsQuery = query(
          collection(db, "ratings"),
          where("productId", "==", productId),
          where('userId', '==', user.uid)
        );
        const ratingsSnapshot = await getDocs(ratingsQuery);
        const productRatings = ratingsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          productId, // add this
          userId: user.uid, // add this
        })) as unknown as Rating[];
        setRatings(productRatings);
  
        const userRatingDoc = productRatings.find((rating) => rating.userId === user.uid);
        setUserRating(userRatingDoc ? userRatingDoc.rating : 0);
      }
    });
    return unsubscribe;
  }, [productId]);
  
  const handleRating = async (rating: number) => {
    if (!isSignedIn) {
      // Handle sign-in prompt
      return;
    }
  
    const user = auth.currentUser;
    if (user) {
      const db = getFirestore();
      if (productId) { // Check if productId is truthy
        const userRatingDoc = ratings.find((rating) => rating.userId === user.uid);
        if (userRatingDoc) {
          // User has already rated this product, update the existing rating
          await updateDoc(doc(db, "ratings", userRatingDoc.id), {
            rating,
          });
          // Update the state
          setRatings(ratings.map(r => r.userId === user.uid ? {...r, rating} : r));
          setUserRating(rating);
        } else {
          // User hasn't rated this product yet, add a new rating
          const newRatingDoc = await addDoc(collection(db, "ratings"), {
            productId,
            rating,
            userId: user.uid,
          });
          
          const newRatingDocSnapshot = await getDoc(newRatingDoc);
          
          if (newRatingDocSnapshot.exists()) {
            setRatings((prevRatings) => [
              ...prevRatings,
              {
                id: newRatingDoc.id,
                productId: productId,
                rating: rating,
                userId: user.uid,
              },
            ]);
            setUserRating(rating);
          } else {
            console.error("Error getting new rating document");
          }
        }
      } else {
        // Handle the case where productId is undefined
        console.error("Product ID is undefined.");
      }
    }
  };
  

  const averageRating =
    ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length || 0;

  return (
    <>
      <div className="product-ratings">
        <span className="rating-stars">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <span
                key={index}
                onClick={() => handleRating(index + 1)}
                style={{ cursor: "pointer" }}
              >
                {index < userRating ? "★" : "☆"}
              </span>
            ))}
        </span>
        <span className="rating-count">({ratings.length} reviews)</span>
      </div>
      <div>Average Rating: {averageRating.toFixed(1)}</div>
    </>
  );
};

export default ProductRatings;