'use client'
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";

interface Rating {
  productId: string;
  rating: number;
}

interface ProductRatingsProps {
  productId: string;
}

const ProductRatings: React.FC<ProductRatingsProps> = ({ productId }) => {
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [averageRating, setAverageRating] = useState<number>(0);
  
    const fetchRatings = async () => {
      if (!productId) return; // Check if productId is undefined or empty
  
      const ratingsCollection = collection(db, 'rating');
      const querySnapshot = await getDocs(query(ratingsCollection, where('productId', '==', productId)));
  
      const ratingsList: Rating[] = [];
      let totalRating = 0;
  
      querySnapshot.forEach((doc) => {
        const rating = doc.data() as Rating;
        ratingsList.push(rating);
        totalRating += rating.rating;
      });
  
      setRatings(ratingsList);
      setAverageRating(ratingsList.length > 0 ? totalRating / ratingsList.length : 0);
    };
  
    useEffect(() => {
      fetchRatings();
    }, [productId, fetchRatings]);
  


  return (
    <>
      <div className="product-ratings">
        <span className="rating-stars">
          {Array(5)
            .fill(0)
            .map((_, index) => (index < averageRating ? '★' : '☆'))}
        </span>
        <span className="rating-count">({ratings.length} reviews)</span>
      </div>

    </>
  );
};

export default ProductRatings;
