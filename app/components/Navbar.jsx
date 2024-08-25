'use client'
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import Footer from './Footer';
import Image from 'next/image';
import navlogo from '../img/gulime.png'
import axios from 'axios';
import Link from 'next/link';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { auth, db } from '../Config/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { uuid } from 'uuidv4';

export default function Navbar() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'visible';
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isOpen]);

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#000',
    opacity: 0.6,
    display: isOverlayActive ? 'block' : 'none',
    pointerEvents: 'none',
  };

  const fetchUserData = async (user) => {
    try {
      const userDoc = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        setUserData(userSnapshot.data());
      } else {
        setUserData(null);
      }
    } catch (error) {
      setUserData(null);
    }
  };

  const fetchCartAndSavedData = async (user) => {
    const cartRef = doc(db, "carts", user.uid);
    const savedRef = doc(db, "saved", user.uid);

    // Fetch cart data
    const cartSnapshot = await getDoc(cartRef);
    const cartData = cartSnapshot.data();
    let totalCartItems = 0;
    if (cartData && cartData.items) {
      totalCartItems = cartData.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    }
    setCartCount(totalCartItems);

    // Fetch saved data
    const savedSnapshot = await getDoc(savedRef);
    const savedData = savedSnapshot.data();
    // Handle saved data

    // Subscribe to updates
    const unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
      const updatedCartData = snapshot.data();
      let updatedTotalCartItems = 0;
      if (updatedCartData && updatedCartData.items) {
        updatedTotalCartItems = updatedCartData.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      }
      setCartCount(updatedTotalCartItems);
    });

    const unsubscribeSaved = onSnapshot(savedRef, (snapshot) => {
      const updatedSavedData = snapshot.data();
      // Update saved items state if needed
    });

    return () => {
      unsubscribeCart();
      unsubscribeSaved();
    };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsSignedIn(true);
        setUserData({
          id: user.uid,
          firstName: user.displayName || 'User'
        });
        await fetchUserData(user);
        await fetchCartAndSavedData(user);
      } else {
        setIsSignedIn(false);
        setUserData(null);
        setCartCount(0);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleFooter = () => {
    setIsFooterVisible(!isFooterVisible);
  };

  const handleSearch = async () => {
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get('/api/search', {
        params: { term: trimmedTerm },
      });
      setSearchResults(response.data.results || []);
      setIsOverlayActive(true);
    } catch (error) {
      setSearchResults([]);
      setIsOverlayActive(false);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
    setIsOverlayActive(event.target.value.length > 0);
  };

  const handleDocumentClick = useCallback((e) => {
    const target = e.target;
    const searchContainer = document.querySelector('.search-results-container');
    const searchInput = document.querySelector('input[type="search"]');

    if (searchContainer && !searchContainer.contains(target) && target !== searchInput) {
      setIsOverlayActive(false);
      setSearchResults([]);
      setSearchTerm('');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [handleDocumentClick]);

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      setSearchResults([]);
      setIsOverlayActive(false);
    }
  }, [searchTerm]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/pages/Login');
    } catch (error) {
      // Handle error
    }
  };

  return (
    <>
      <div className={`nav ${isOpen ? 'nav-open' : ''}`}>
        <div className='small-nav'>
          <div className="burger" onClick={toggleMenu}>
            {isOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
          </div>
          <Image
            onClick={() => router.push('/')}
            src={navlogo}
            width={140}
            alt="Doctor Care Logo"
          />
        </div>
        <div style={overlayStyle}></div>

        <form style={{ width: '100%', position: 'relative' }} onSubmit={(e) => e.preventDefault()}>
          <input
            placeholder="Search Gulime"
            aria-label="Search Gulime"
            type="search"
            spellCheck={false}
            dir="auto"
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
          {isOverlayActive && (
            <div className="search-results-container">
              <div className="search-results">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div key={product.id || uuid()} className="search-result-item">
                      <Link href={`/pages/ProductDetails/${product.id}`}>
                        <div className="product-card">
                          <img className="product-image" src={product.coverimage} alt={product.title} />
                          <div className="product-info">
                            <h3 className="product-title" style={{textAlign:'center'}}>{product.title}</h3>
                            <p className="product-price">${product.price}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p>No Results Found...</p>
                )}
              </div>
            </div>
          )}
        </form>

        <div className={`navlinks ${isOpen ? 'open' : ''}`}>
          <Link href="/" onClick={toggleMenu}>Home</Link>
          <Link href="/pages/Technology" onClick={toggleMenu}>Technology</Link>
          <Link href="/pages/Music" onClick={toggleMenu}>Music</Link>
          <Link href="/pages/Fashion" onClick={toggleMenu}>Fashion</Link>
          <Link href="/pages/Sports" onClick={toggleMenu}>Sports</Link>

          {isSignedIn && userData ? (
            <>
              <Link href="/pages/Account">Account</Link>
              <span className="sm-name">{userData.firstName}</span>
              <span style={{color:'#fff',cursor:'pointer'}} onClick={handleLogout}>Logout</span>
            </>
          ) : (
            <>
              <Link href='/pages/Register' className="sm-name">Guest</Link>
              <Link href="/pages/Login">Login</Link>
            </>
          )}

          <Link href='/pages/Cart' className="cart-link">
            <div className="cart-icon-container">
              <ShoppingCart style={{ fontSize: '24px', color: '#fff', padding: '0 0.3rem 0 0' }} />
              <span className="cart-count">{cartCount !== undefined ? cartCount : ''}</span>
            </div>
          </Link>
          <Link href="#" onClick={toggleFooter}>More:</Link>
        </div>
        {isOpen && <div className="overlay" onClick={toggleMenu}></div>}
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <div style={{ position: 'absolute', width: '100%' }}>
          {isFooterVisible && <Footer />}
        </div>
      </div>
    </>
  );
}