'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { User, Package, CreditCard, Settings, LogOut, Star, ShoppingCart, Clock, Trash2Icon, Trash2 } from 'lucide-react';
import { auth, db } from '../../Config/firebase';
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { RiseLoader } from 'react-spinners';
import EditProfileModal from './Editprofile'
import Link from 'next/link';
const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [savedItems, setSavedItems] = useState([]);
  const [browsingHistory, setBrowsingHistory] = useState([]);
  const [userRatings, setUserRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  const tabVariants = {
    inactive: { opacity: 0.6, y: 5 },
    active: { opacity: 1, y: 0 },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };


  const fetchUserData = async (user) => {
    try {
      const userDoc = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        setUserData({
          id: user.uid,
          email: user.email,
          ...userSnapshot.data()
        });
      } else {
        setUserData({
          id: user.uid,
          email: user.email,
          firstName: user.displayName || 'User'
        });
      }
    } catch (error) {
      setError("Failed to fetch user data. Please try again.");
    }
  };

  const fetchCartAndSavedData = useCallback(async (user) => {
    if (db && user) {
      const cartRef = doc(db, "carts", user.uid);
      const savedRef = doc(db, "saved", user.uid);

      try {
        // Fetch initial cart data
        const cartSnapshot = await getDoc(cartRef);
        const cartData = cartSnapshot.data();
        if (cartData && cartData.items) {
          setCart(cartData.items);
          setCartCount(cartData.items.reduce((sum, item) => sum + item.quantity, 0));
        }

        // Fetch initial saved data
        const savedSnapshot = await getDoc(savedRef);
        const savedData = savedSnapshot.data();
        if (savedData && savedData.items) {
          setSavedItems(savedData.items);
        }


        // Subscribe to cart updates
        const unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
          const updatedCartData = snapshot.data();
          if (updatedCartData && updatedCartData.items) {
            setCart(updatedCartData.items);
            setCartCount(updatedCartData.items.reduce((sum, item) => sum + item.quantity, 0));
          }
        });

        // Subscribe to saved items updates
        const unsubscribeSaved = onSnapshot(savedRef, (snapshot) => {
          const updatedSavedData = snapshot.data();
          if (updatedSavedData && updatedSavedData.items) {
            setSavedItems(updatedSavedData.items);
          }
        });

        return () => {
          unsubscribeCart();
          unsubscribeSaved();
        };
      } catch (error) {
        setError("Failed to fetch cart and saved items. Please try again.");
      }
    }
  }, [db]);

  const fetchBrowsingHistory = useCallback(async (user) => {
    if (db && user) {
      try {
        const viewedProductsRef = doc(db, 'BrowsingHistory', user.uid);
        const viewedProductsSnap = await getDoc(viewedProductsRef);
        const viewedProductsData = viewedProductsSnap.data();
        const viewedProducts = viewedProductsData?.products || [];
        setBrowsingHistory(viewedProducts);
      } catch (error) {
        setError("Failed to fetch browsing history. Please try again.");
      }
    }
  }, [db]);

  const fetchUserRatings = useCallback(async (userId) => {
    setRatingsLoading(true);
    const ratingsCollection = collection(db, 'ratings');
    const ratingsQuery = query(
      ratingsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    try {
      const ratingsSnapshot = await getDocs(ratingsQuery);
      const fetchedRatings = ratingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      setUserRatings(fetchedRatings);
    } catch (error) {
      // Handle error (e.g., show error message to user)
    } finally {
      setRatingsLoading(false);
    }
  }, []);

  const fetchUserReviews = useCallback(async (userId) => {
    const reviewsCollection = collection(db, 'reviews');
    const reviewsQuery = query(
      reviewsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(reviewsQuery, (querySnapshot) => {
      const fetchedReviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      setReviews(fetchedReviews);
      setReviewsLoading(false);
    }, (error) => {
      setReviewsLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsSignedIn(true);
        try {
          await fetchUserData(user);
          const unsubscribeCartAndSaved = await fetchCartAndSavedData(user);
          const unsubscribeReviews = await fetchUserReviews(user.uid);
          await fetchBrowsingHistory(user);
          await fetchUserRatings(user.uid);
          // Implement fetchOrders function as needed
          // await fetchOrders(user);
          setLoading(false);
          return () => {
            if (unsubscribeCartAndSaved) unsubscribeCartAndSaved();
            if (unsubscribeReviews) unsubscribeReviews();
          };
        } catch (error) {
          setError("An error occurred while loading your account data. Please try again.");
          setLoading(false);
        }
      } else {
        setIsSignedIn(false);
        setUserData(null);
        setCart([]);
        setSavedItems([]);
        setBrowsingHistory([]);
        setReviews([]);
        setUserRatings([]);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [fetchCartAndSavedData, fetchUserReviews, fetchBrowsingHistory, fetchUserRatings]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/pages/Login');
    } catch (error) {
      setError("Failed to sign out. Please try again.");
    }
  };

  const handleEditProfile = async (updatedData) => {
    if (!userData || !userData.id) return;
    try {
      const userDoc = doc(db, 'users', userData.id);
      await updateDoc(userDoc, updatedData);
      setUserData({ ...userData, ...updatedData });
      setIsEditModalOpen(false);
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    }
  };

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
        <span className="rating-text ml-2">
          {fullStars === 5 ? "5 out of 5" : `${rating.toFixed(1)} out of 5`}
        </span>
      </div>
    );
  };




  if (loading) {
    return (
      <div className="loading-container">
        <RiseLoader color='blue' loading={loading} />
        <p>Loading your account data...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return <div>Please sign in to view your account.</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }
  const reviewsContent = (
    <div className="AccountCard">
      <div className="AccountCardHeader">
        <h3 className="AccountCardTitle">My Reviews</h3>
      </div>
      <div className="AccountCardContent">
        {reviewsLoading ? (
          <div className="loader-container"><RiseLoader color='blue'/></div>
        ) : reviews.length > 0 ? (
          <div className="order-list">
            {reviews.map((review) => (
              <div key={review.id} className="Accountorder-item">
                <div className="review-header">
                  <span className="reviewer-name">{review.productName}</span>
                  <StarRating rating={review.rating} />
                </div>
                <div className="review-date">
                  Reviewed on {moment(review.createdAt).format("MMMM D, YYYY")}
                </div>
                <p className="review-text">{review.reviewText}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-reviews">You haven't written any reviews yet.</p>
        )}
      </div>
    </div>
  );

  const cartContent = (
    <div className="AccountCard">
      <div className="AccountCardHeader">
        <h3 className="AccountCardTitle">My Cart ({cartCount} items)</h3>
      </div>
      <div className="AccountCardContent">
        <div className="Accountorder-list">
          {cart.map(item => (
            <div key={item.id} className="Accountorder-item">
              <div>
                <p>{item.name}</p>
                <p className="Accountorder-date">Quantity: {item.quantity}</p>
              </div>
<div style={{width:'140px',display:'flex',alignItems:'center'}}> 
<Link href='/pages/Cart'>
<img        
style={{width:'100%'}}             
src={item.coverimage || item.selectedColorUrl} 
alt={item.title} /> </Link>   

 <button onClick={() => deleteFromCart(item.id)} className="AccountBtn AccountBtnOutline">
<Trash2 className="icon" />
</button>
</div>
</div>
))}
</div>
{cart.length > 0 ? (
<div className="order-item">
<strong>Total</strong>
<strong>${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</strong>
</div>
) : (
<p>Your cart is empty.</p>
)}
<button className="AccountBtn ">Checkout</button>
</div>
</div>
);


const profileContent = (
<div className="AccountCard">
<div className="AccountCardHeader">
<h3 className="AccountCardTitle">Personal Information</h3>
</div>
<div className="AccountCardContent">
<div className="AccountInfoList">
<p><strong>First name:</strong> {userData?.firstName || 'Not set'}</p>
<p><strong>Last name:</strong> {userData?.lastName || 'Not set'}</p>
<p><strong>Email:</strong> {userData?.email || 'Not set'}</p>
<p><strong>Phone:</strong> {userData?.phone || 'Not set'}</p>
<p><strong>Address:</strong> {userData?.address || 'Not set'}</p>
</div>
<button className="AccountBtn" onClick={() => setIsEditModalOpen(true)}>Edit Profile</button>
{isEditModalOpen && (
<EditProfileModal 
userData={userData} 
onSave={handleEditProfile} 
onClose={() => setIsEditModalOpen(false)} 
/>
)}
</div>
</div>
);

const historyContent = (
<div className="AccountCard">
<div className="AccountCardHeader">
<h3 className="AccountCardTitle">Browsing History</h3>
</div>
<div className="AccountCardContent">
<div className="AccountHistoryList">
{browsingHistory.map((product, index) => (
<div key={product.id} className="AccountHistoryItem">
<p className="AccountHistoryProductName">   
<Link href={`/pages/ProductDetails/${product.id}`}>

<img 
src={product.coverimage || product.selectedColorUrl}
alt={product.title} 
className='shopping-trends-image' 
/>
</Link>
</p>
            
</div>
))}
</div>
</div>
</div>
);




  return (
<motion.div 
className="AccountPage"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.5 }}>
{error && <div className="AccountError">{error}</div>}
<div className="AccountTabs">
{['profile', 'orders', 'reviews', 'cart', 'history'].map((tab) => (
<motion.button
key={tab}
className={`AccountTab ${activeTab === tab ? 'active' : ''}`}
onClick={() => setActiveTab(tab)}
variants={tabVariants}
initial="inactive"
animate={activeTab === tab ? "active" : "inactive"}
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
>
{tab === 'profile' && <User className="icon" />}
{tab === 'orders' && <Package className="icon" />}
{tab === 'reviews' && <Star className="icon" />}
{tab === 'cart' && <ShoppingCart className="icon" />}
{tab === 'history' && <Clock className="icon" />}
{tab.charAt(0).toUpperCase() + tab.slice(1)}
</motion.button>
))}
</div>
<AnimatePresence mode="wait">
<motion.div
key={activeTab}
className="AccountTabContent"
variants={contentVariants}
initial="hidden"
animate="visible"
exit="hidden"
transition={{ duration: 0.3 }}
>
{activeTab === 'profile' && profileContent}
{activeTab === 'orders' && ordersContent}
{activeTab === 'reviews' && reviewsContent}
{activeTab === 'cart' && cartContent}
{activeTab === 'history' && historyContent}
</motion.div>
</AnimatePresence>
<motion.button
className="AccountBtn AccountBtnOutline AccountLogoutBtn"
onClick={handleLogout}
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
>
<LogOut className="icon" /> Log Out
</motion.button>
</motion.div>
);
};

export default AccountPage;