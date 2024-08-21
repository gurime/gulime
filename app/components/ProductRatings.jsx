'use client';
import { collection, addDoc, getDocs, query, where, getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Config/firebase";
import { Star } from "lucide-react";

const ProductRatings = ({ productId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isnotModalOpen, setIsnotModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsSignedIn(!!user);
  
      if (productId) {
        const db = getFirestore();
        try {
          const ratingsQuery = query(
            collection(db, "ratings"),
            where("productId", "==", productId)
          );
          const ratingsSnapshot = await getDocs(ratingsQuery);
          const productRatings = ratingsSnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            productId,
            userId: doc.data().userId,
          }));
          setRatings(productRatings);
  
          if (user) {
            const userRatingDoc = productRatings.find((rating) => rating.userId === user.uid);
            setUserRating(userRatingDoc ? userRatingDoc.rating : null);
          } else {
            setUserRating(null);
          }
        } catch (error) {
          // Handle error
        }
      }
    });
  
    return () => unsubscribe();
  }, [productId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
        setUserData({
          id: user.uid,
          firstName: user.displayName || 'User'
        });
      } else {
        setIsSignedIn(false);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRating = async (rating) => {
    if (!isSignedIn) {
      setIsnotModalOpen(true);
      return;
    }

    const user = auth.currentUser;
    if (user && productId) {
      const db = getFirestore();
      try {
        const userRatingDoc = ratings.find((r) => r.userId === user.uid);
        if (userRatingDoc) {
          await updateDoc(doc(db, "ratings", userRatingDoc.id), {
            rating,
          });
          setRatings(ratings.map(r => r.userId === user.uid ? {...r, rating} : r));
        } else {
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
          } else {
            // Handle case where new document doesn't exist
          }
        }
        setUserRating(rating);
      } catch (error) {
        // Handle error
      }
    } else {
      // Handle case where user is not signed in or productId is not available
    }
  };

  const handleSubmitReview = async (e) => {
    if (!isSignedIn) {
      setIsnotModalOpen(true);
      return;
    }
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
  
    const user = auth.currentUser;
    if (user && productId) {
      const db = getFirestore();
      try {
        await addDoc(collection(db, "reviews"), {
          productId,
          rating,
          reviewText,
          reviewerName,
          userId: user.uid,
          createdAt: new Date(),
        });
        
        setShowConfirmation(true);
        setRating(0);
        setReviewText('');
        setReviewerName('');
        setSuccessMessage('');
        setTimeout(() => {
          setShowConfirmation(false);
          closeModal();
        }, 3000);  
      } catch (error) {
        setErrorMessage("There was an error submitting your review. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage("You must be signed in to leave a review.");
      setIsLoading(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const closeNotSignedInModal = () => setIsnotModalOpen(false);

  const renderStars = (value, size = 16, interactive = false) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <Star
          key={index}
          size={size}
          color={starValue <= value ? "#ffc107" : "#e4e5e9"}
          fill={starValue <= value ? "#ffc107" : "none"}
          onMouseEnter={() => interactive && setHover(starValue)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && handleRating(starValue)}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        />
      );
    });
  };

  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
    : 0;

  const renderNotSignedInModal = () => (
    <div className="modal-overlay" onClick={closeNotSignedInModal}>
      <div className="modal-content" style={{ background: 'teal' }} onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title" style={{ marginBottom: '20px', borderBottom: 'solid 1px', lineHeight: '2' }}>
          Login Required
        </h2>
        <p>You must be logged in to submit a review. Please log in and try again.</p>
        <button onClick={closeNotSignedInModal} className="close-button">Close</button>
      </div>
    </div>
  );

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          margin: '5px 16px 3px 0',
          paddingLeft: '10px',
          fontWeight: '300',
        }}
      >
        {renderStars(averageRating)}
        <span style={{ marginLeft: '5px', fontSize: '0.9em', color: '#000' }}>
          ({averageRating.toFixed(1)}) {ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'}
        </span>
        {isSignedIn && (
          <span
            onClick={openModal}
            style={{
              marginLeft: '10px',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Leave a Review
          </span>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" style={{ background: 'teal' }} onClick={e => e.stopPropagation()}>
            <h2 className="modal-title" style={{ marginBottom: '20px', borderBottom: 'solid 1px', lineHeight: '2' }}>
              {userData?.firstName}
            </h2>
            
            {showConfirmation ? (
              <div className="confirmation-message">
                <p>Thank you for your review.</p>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmitReview} className="review-form">
                  <div className="form-group">
                    <div className="star-rating">
                      {renderStars(hover || rating, 20, true)}
                    </div>
                  </div>

                  <div className="form-group">
                    <textarea
                      style={{ marginBottom: '1rem' }}
                      id="reviewText"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                      className="form-input"
                      placeholder="Write your review here..."
                      rows={5}
                      cols={50}
                    />
                  </div>

                  <button type="submit" disabled={isLoading} className="submit-button">
                    {isLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
                {errorMessage && <p className="message error-message">{errorMessage}</p>}
                {successMessage && <p className="message success-message">{successMessage}</p>}
                <button onClick={closeModal} className="close-button">Close</button>
              </>
            )}
          </div>   
          {isnotModalOpen && renderNotSignedInModal()}
        </div>
      )}
    </>
  );
};

export default ProductRatings;