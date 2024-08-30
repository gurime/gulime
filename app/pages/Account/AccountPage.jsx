'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { User, Package, CreditCard, Settings, LogOut, Star, ShoppingCart, Clock } from 'lucide-react';
import { auth, db } from '../../Config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [cart, setCart] = useState([]);
  const [browsingHistory, setBrowsingHistory] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBrowsingHistory = useCallback(async (user) => {
    if (db && user) {
      try {
        const viewedProductsRef = doc(db, 'BrowsingHistory', user.uid);
        const viewedProductsSnap = await getDoc(viewedProductsRef);
        const viewedProductsData = viewedProductsSnap.data();
        const viewedProducts = viewedProductsData?.products || [];
        setBrowsingHistory(viewedProducts);

        // Assuming you have a function to get recommended products
        // const recommendedProductsData = await getRecommendedProducts(viewedProducts);
        // setRecommendedProducts(recommendedProductsData);
      } catch (error) {
        console.error("Error fetching browsing history:", error);
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
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
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
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to view your account.</div>;
  }

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