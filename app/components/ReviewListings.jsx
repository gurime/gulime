'use client'

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import moment from 'moment';
import { db } from '../Config/firebase';
import { RiseLoader } from 'react-spinners';
import { Star, StarHalf } from 'lucide-react';

const ReviewListing = ({ articleId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    const reviewsCollection = collection(db, 'reviews');
    const reviewsQuery = query(
      reviewsCollection,
      where('productId', '==', articleId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(reviewsQuery, (querySnapshot) => {
      const fetchedReviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      setReviews(fetchedReviews);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [articleId]);

  const toggleShowAllReviews = () => setShowAllReviews(!showAllReviews);

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 5);

  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="star-rating">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return <Star key={index} className="star filled" />;
          } else if (index === fullStars && hasHalfStar) {
            return <StarHalf key={index} className="star half-filled" />;
          } else {
            return <Star key={index} className="star" />;
          }
        })}
        <span className="rating-text ml-2">{rating.toFixed(1)} out of 5</span>
      </div>
    );
  };

  return (
    <>
      <h2 className="reviews-title">Customer Reviews</h2>
      <div className="reviews-section">
        {loading ? (
          <div className="loader-container"><RiseLoader color='blue'/></div>
        ) : reviews.length > 0 ? (
          <>
            <div className="reviews-container">
              {displayedReviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <span className="reviewer-name">{review.reviewerName}</span>
                    <StarRating rating={review.rating} />
                  </div>
                  <div className="review-date">
                    Reviewed on {moment(review.createdAt).format("MMMM D, YYYY")}
                  </div>
                  <p className="review-text">{review.reviewText}</p>
                </div>
              ))}
            </div>
            {reviews.length > 5 && (
              <button onClick={toggleShowAllReviews} className="show-more-btn">
                {showAllReviews ? 'Show Less' : 'Show All Reviews'}
              </button>
            )}
          </>
        ) : (
          <p className="no-reviews">No reviews yet.</p>
        )}
      </div>
    </>
  );
}

export default ReviewListing;