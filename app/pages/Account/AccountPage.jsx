'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { User, Package, CreditCard, Settings, LogOut, Star, ShoppingCart, Clock, Trash2Icon, Trash2 } from 'lucide-react';
import { auth, db } from '../../Config/firebase';
import { collection, doc, getDoc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { RiseLoader } from 'react-spinners';

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [savedItems, setSavedItems] = useState([]);
  const [browsingHistory, setBrowsingHistory] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const router = useRouter();

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
        console.error("Error fetching cart and saved data:", error);
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsSignedIn(true);
        await fetchUserData(user);
        await fetchBrowsingHistory(user);
        // Uncomment and implement these functions as needed
        // await fetchOrders(user);
        // await fetchReviews(user);
        // await fetchCart(user);
      } else {
        setIsSignedIn(false);
        setUserData(null);
        setBrowsingHistory([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchBrowsingHistory]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsSignedIn(true);
        await fetchUserData(user);
        const unsubscribeCartAndSaved = await fetchCartAndSavedData(user);
        await fetchBrowsingHistory(user);
        // Implement these functions as needed
        // await fetchOrders(user);
        // await fetchReviews(user);
        return () => {
          if (unsubscribeCartAndSaved) unsubscribeCartAndSaved();
        };
      } else {
        setIsSignedIn(false);
        setUserData(null);
        setCart([]);
        setSavedItems([]);
        setBrowsingHistory([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchCartAndSavedData]);

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

  const updateFirestoreDocument = async (collection, items) => {
    if (auth.currentUser) {
      const docRef = doc(db, collection, auth.currentUser.uid);
      await updateDoc(docRef, { items });
    }
  };

  const updateCartCount = (items) => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  };

  const deleteFromCart = useCallback(async (itemID) => {
    const updatedCartItems = cart.filter((item) => item.id !== itemID && item.itemID !== itemID);
    setCart(updatedCartItems);
    updateCartCount(updatedCartItems);
    await updateFirestoreDocument('carts', updatedCartItems);
    setShowConfirmation('Product deleted from cart');
    setTimeout(() => setShowConfirmation(false), 3000);
  }, [cart]);

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
      console.error("Error fetching reviews:", error);
      setReviewsLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsSignedIn(true);
        await fetchUserData(user);
        const unsubscribeCartAndSaved = await fetchCartAndSavedData(user);
        const unsubscribeReviews = await fetchUserReviews(user.uid);
        await fetchBrowsingHistory(user);
        // Implement these functions as needed
        // await fetchOrders(user);
        return () => {
          if (unsubscribeCartAndSaved) unsubscribeCartAndSaved();
          if (unsubscribeReviews) unsubscribeReviews();
        };
      } else {
        setIsSignedIn(false);
        setUserData(null);
        setCart([]);
        setSavedItems([]);
        setBrowsingHistory([]);
        setReviews([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchCartAndSavedData, fetchUserReviews]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to view your account.</div>;
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
<img        
style={{width:'100%'}}             
src={item.coverimage || item.selectedColorUrl} 
alt={item.title} /> 
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
        <button className="AccountBtn AccountBtnPrimary">Checkout</button>
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
          <p><strong>Name:</strong> {userData?.firstName || 'Not set'}</p>
          <p><strong>Email:</strong> {userData?.email || 'Not set'}</p>
          <p><strong>Phone:</strong> {userData?.phone || 'Not set'}</p>
          <p><strong>Address:</strong> {userData?.address || 'Not set'}</p>
        </div>
        <button className="AccountBtn AccountBtnPrimary" onClick={() => {/* Implement edit profile logic */}}>Edit Profile</button>
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
            <div key={index} className="AccountHistoryItem">
              <p className="AccountHistoryProductName">   <img 
                    src={product.coverimage || product.selectedColorUrl}
                    alt={product.title} 
                    className='shopping-trends-image' 
                  /></p>
            
            </div>
          ))}
        </div>
      </div>
    </div>
  );




  return (
    <div className="AccountPage">
      <h1 className="AccountPageTitle">My Account</h1>
      {error && <div className="AccountError">{error}</div>}
      <div className="AccountTabs">
        <button className={`AccountTab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <User className="icon" /> Profile
        </button>
        <button className={`AccountTab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          <Package className="icon" /> Orders
        </button>
        <button className={`AccountTab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
          <Star className="icon" /> Reviews
        </button>
        <button className={`AccountTab ${activeTab === 'cart' ? 'active' : ''}`} onClick={() => setActiveTab('cart')}>
          <ShoppingCart className="icon" /> Cart
        </button>
        <button className={`AccountTab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          <Clock className="icon" /> History
        </button>
      </div>
      <div className="AccountTabContent">
       
        {activeTab === 'profile' && profileContent}
        {activeTab === 'orders' && ordersContent}
        {activeTab === 'reviews' && reviewsContent}
        {activeTab === 'cart' && cartContent}
        {activeTab === 'history' && historyContent}
      </div>
      <button className="AccountBtn AccountBtnOutline AccountLogoutBtn" onClick={handleLogout}>
        <LogOut className="icon" /> Log Out
      </button>
    </div>
  );
};

export default AccountPage;