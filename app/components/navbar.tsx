'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import navlogo from  '../img/gulime.png'
import Footer from './footer';
import { FaShoppingCart } from 'react-icons/fa';
import { collectionRoutes, getArticle } from './HeroFormApi/api';
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { getAuth } from 'firebase/auth';

type SearchResult = {
    title: string;
    collection: string;
    price:string;
    id: string;
  };



export default function Navbar() {
    const router = useRouter()
const [isSignedIn, setIsSignedIn] = useState(false);
const [isFooterVisible, setIsFooterVisible] = useState(false);
const [isOverlayActive, setIsOverlayActive] = useState(false);
const [searchTerm, setSearchTerm] = useState<string>('');
const [names, setNames] = useState<string[]>([]);
const [cartCount, setCartCount] = useState<number>(0);
const [loading, setLoading] = useState<boolean>(true);
const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    
const overlayStyle: React.CSSProperties = {
position: 'fixed',
top: 0,
left: 0,
width: '100%',
height: '100%',
background: '#000',
opacity: '.6',
display: isOverlayActive ? 'block' : 'none',
pointerEvents: 'none',
};

useEffect(() => {
const unsubscribe = auth.onAuthStateChanged(async (user) => {
setIsSignedIn(!!user);
if (user) {
try {
const userDocRef = doc(db, "users", user.uid);
const userDocSnapshot = await getDoc(userDocRef);
if (userDocSnapshot.exists()) {
const userData = userDocSnapshot.data(); setNames([userData.firstName, userData.lastName]);}
} catch (error) {
}
}
});
    
const handleDocumentClick = (e: MouseEvent) => {
const target = e.target as HTMLElement;
const isClickOutsideSearch = !target.closest('search-container');
if (isClickOutsideSearch) {
setIsOverlayActive(false);
setSearchResults([]);
setSearchTerm('');
}
};
document.body.addEventListener('click', handleDocumentClick);
const usersCollectionRef = collection(db, "users");
const unsubscribeUsers = onSnapshot(usersCollectionRef, (snapshot) => {
const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});
return () => {
document.body.removeEventListener('click', handleDocumentClick);
unsubscribe();
unsubscribeUsers(); // Unsubscribe from the users collection
};
}, [searchTerm, isOverlayActive]);
    
      
type InputChangeEvent = ChangeEvent<HTMLInputElement>;
type FormSubmitEvent = FormEvent<HTMLFormElement>;  
const handleSearchInputChange = (event: InputChangeEvent) => {
setSearchTerm(event.target.value);
if (event.target.value) {
handleSearch();
}
};

const handleSearch = async (event?: FormSubmitEvent) => {
if (event) {
event.preventDefault();
}
try {
setLoading(true);
const results = await getArticle(searchTerm);
setSearchResults(results);
    } catch (error) {
console.error('Error searching articles:', error);
    } finally {
    setLoading(false);
    }
    };
    
    
    useEffect(() => {
    if (searchTerm) {
    handleSearch();
    }
    }, [searchTerm]);
      
    const getLink = (collection: string, id: string) => {
    const formattedCollection = collection.replace(/\s+/g, '');
    const route = collectionRoutes[formattedCollection];
    return route ? `${route}/${id}` : '/';
    };
    
    const toggleFooter = () => {
    setIsFooterVisible(!isFooterVisible);
    };
    useEffect(() => {
      const fetchCartData = async () => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
          const db = getFirestore();
          const cartRef = doc(db, "Cart", currentUser.uid);
          const snapshot = await getDoc(cartRef);
          const cartData = snapshot.data();
          let totalItems = 0;
          if (cartData && cartData.items) {
            totalItems = cartData.items.reduce(
              (sum: number, item: { quantity: number }) => sum + item.quantity,
              0
            );
          }
          setCartCount(totalItems);
    
          const unsubscribe = onSnapshot(cartRef, (snapshot) => {
            const updatedCartData = snapshot.data();
            let updatedTotalItems = 0;
            if (updatedCartData && updatedCartData.items) {
              updatedTotalItems = updatedCartData.items.reduce(
                (sum: number, item: { quantity: number }) => sum + item.quantity,
                0
              );
            }
            setCartCount(updatedTotalItems);
          });
    
          return unsubscribe;
        }
      };
    
      fetchCartData();
    }, []);

    const handleLogout = async () => {
      try {
      await auth.signOut();
      router.push('/pages/Login');
      } catch (error) {
      }
      };
return (
<>
<div className="nav">
  <Image placeholder="blur" onClick={() => router.push('/')} src={navlogo} height={36} alt='...' />
  
  <div style={overlayStyle}></div>
  
  <form style={{ width: '100%', position: 'relative' }} onSubmit={handleSearch}>
    <input
      placeholder="Search Gulime"
      type="search"
      spellCheck="false"
      dir="auto"
      tabIndex={0}
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        handleSearch();
        handleSearchInputChange(e);
        setIsOverlayActive(e.target.value.trim().length > 0);
      }}
    />
    {searchResults.length > 0 && searchTerm && !loading && (
      <div className="search-results-container">
        {searchResults.slice(0, 5).map((result) => (
          <div key={result.id} className="search-result-item">
            <Link key={result.id} href={getLink(result.collection, result.id)}>
              <p style={{ fontWeight: '400' }}>Product: {result.title.length > 20 ? result.title.substring(0, 30) : result.title}...</p>
              <p style={{ fontWeight: '400' }}>Price: {result.price}</p>
            </Link>
          </div>
        ))}
      </div>
    )}
  </form>

  <div className="navlinks">
    {isSignedIn ? (
      <Link href='#!' style={{ cursor: 'default' }}>
        {names.length === 2 && (
          <>
            <span className='sm-name'>
              {names.map((name, index) => (
                <span key={index} className='name-item'>{name}</span>
              ))}
            </span>
            <span className="sm-name" style={{ cursor: 'pointer' }} onClick={handleLogout}>
              Log Out
            </span>
          </>
        )}
      </Link>
    ) : (
      <div className="commentreg-box">
        <span style={{ color: '#fff' }}>Guest</span>
        <span style={{ color: '#fff', cursor: 'pointer' }} onClick={() => router.push('/pages/Login')}>
          Login
        </span>
        <span style={{ color: '#fff', cursor: 'pointer' }} onClick={() => router.push('/pages/Register')}>
          Register
        </span>
      </div>
    )}
    <Link href="/">Home</Link>
    <Link href="/pages/Technology">Technology</Link>
    <Link href="/pages/Music">Music</Link>
    <Link href="/pages/Fashion">Fashion</Link>
    <Link href="/pages/Sports">Sports</Link>
    <Link href='#!' onClick={toggleFooter}>More:</Link>
    <Link href='/pages/Cart' className="cart-link">
      <div className="cart-icon-container">
        <FaShoppingCart style={{ fontSize: '24px', color: '#fff', padding: '0 5px 0 0' }} />
        <span className="cart-count">{cartCount !== undefined ? cartCount : ''}</span>
      </div>
    </Link>
  </div>
</div>




<div style={{position:'relative',width:'100%'}}>
<div style={{position:'absolute',width:'100%'}}>
{isFooterVisible && <Footer />}</div>
</div>

</>
)
}
