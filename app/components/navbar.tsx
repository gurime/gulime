'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import navlogo from '../img/gulime.png'
import Footer from './footer';
import { FaShoppingCart } from 'react-icons/fa';
import { collectionRoutes, getArticle } from './HeroFormApi/api';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

type SearchResult = {
    title: string;
    collection: string;
    price:string;
    id: string;
  };

export default function Navbar() {
    const router = useRouter()
    const [forceRender, setForceRender] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isFooterVisible, setIsFooterVisible] = useState(false);
    const [isOverlayActive, setIsOverlayActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [names, setNames] = useState<string[]>([]);
    
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
            // Fetch user data from Firestore
            const userDocRef = doc(db, "users", user.uid);
    
            // Fetch the user's document data
            const userDocSnapshot = await getDoc(userDocRef);
    
            // Check if the document exists
            if (userDocSnapshot.exists()) {
              // Get the user data from the document
              const userData = userDocSnapshot.data();
              setNames([userData.firstName, userData.lastName]);
            }
          } catch (error) {
            // Handle errors here
          }
        }
      });
    
      const handleDocumentClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isClickOutsideSearch = !target.closest('.search-container');
        if (isClickOutsideSearch) {
          setIsOverlayActive(false);
          setSearchResults([]);
          setSearchTerm('');
        }
      };
    
      document.body.addEventListener('click', handleDocumentClick);
    
      // Get the users collection
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
return (
<>
<div className="nav">
<Image placeholder="blur" onClick={() => router.push('/')} src={navlogo} height={36} alt='...' />

<div style={{
position: 'fixed',
top: 0,
left: 0,
width: '100%',
height: '100%',
background: '#000',
opacity: 0.6,
display: isOverlayActive ? 'block' : 'none',
pointerEvents: 'none',
}
}>
</div>
<form style={{ width: '100%',position:'relative',  }} onSubmit={handleSearch}>
<input
placeholder="Search iTruth News"
type="search"
spellCheck="false"
dir="auto"
tabIndex={0}
value={searchTerm}
onChange={(e) => {
setSearchTerm(e.target.value);
{handleSearch}
{handleSearchInputChange}
setIsOverlayActive(e.target.value.trim().length > 0);
}}/>

{searchResults.length > 0 && searchTerm && !loading && (
  <div className="search-results-container">
    {searchResults.slice(0, 5).map((result) => (
      <div key={result.id} className="search-result-item">
        <Link key={result.id} href={getLink(result.collection, result.id)}>
          <p style={{fontWeight:'400'}}>Product: {result.title.length > 20 ? result.title.substring(0, 30)  : result.title}...</p>
          <p style={{fontWeight:'400'}}>Price: {result.price}</p>
        </Link>
      </div>
    ))}
  </div>
)}



</form>

<div className="navlinks">


{isSignedIn ? (
<Link  href='#!'>
{names.length === 2 && (
<>
<span className="sm-name" >{names[0]}</span>
<span className="sm-name">{names[1]}</span>
</>
)}
</Link>
) : (

<span className="sm-name">
Guest

</span>
)}

<Link href="/">Home</Link>
<Link href="/pages/Technology">Technology</Link>
<Link href="/pages/Music">Music</Link>
<Link href="/pages/Fashion">Fashion</Link>
<Link href="/pages/Sports">Sports</Link>
<Link href='#!' onClick={toggleFooter}>More:</Link>
<Link href='#!'><FaShoppingCart style={{fontSize:'24px',color:'#fff',padding:'0 5px 0 0'}}/>cart</Link>

</div>


</div>
<div style={{position:'relative',width:'100%'}}>
<div style={{position:'absolute',width:'100%'}}>
{isFooterVisible && <Footer />}</div>
</div>

</>
)
}
