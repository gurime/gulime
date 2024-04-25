'use client'
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '@/app/firebase/firebase';
import { useRouter } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

interface Article {
    userId: string;
    propertyType:string;
    id: string;
    title: string;
    content: string;
    price: number;
    imgshowcase:string;
    imgshowcase1:string
    imgshowcase2:string
    imgshowcase3:string
    imgshowcase4:string
    coverimage: string; 
    catorgory: string;

    timestamp: string;
  }


  
  async function getArticles(): Promise<Article[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "Dashboard"));
      const data: Article[] = [];
  
      querySnapshot.forEach((doc) => {
        const articleData = doc.data();
        data.push({
          id: doc.id,
          title: articleData.title || '', 
          content: articleData.content || '', 
          userId: articleData.userId || '',
          coverimage: articleData.coverimage || '',
          imgshowcase: articleData.imgshowcase || '',
          imgshowcase1: articleData.imgshowcase1 || '',
          imgshowcase2: articleData.imgshowcase2 || '',
          imgshowcase3: articleData.imgshowcase3 || '',
          imgshowcase4: articleData.imgshowcase4 || '',
          catorgory: articleData.catorgory || '',
          price: articleData.price || '',
          timestamp: articleData.timestamp || '',
          propertyType:articleData.propertyType || ''
        });
      });
  
      return data;
    } catch (error) {
      console.error("Error fetching articles:", error);
      throw error; // Rethrow the error for handling in the component
    }
  }
  

export default function Dashboard() {
  const [IsAdmin, setIsAdmin] = useState<boolean>(false)
  const [fetchError, setFetchError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);
  const [useArticle, setUseArticle] = useState<any[]>([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();
  const commentsRef = useRef<HTMLDivElement>(null);

  const fetchComments = async (articleId: string) => {
    try {
      const db = getFirestore();
      const commentsRef = collection(db, 'Dashboard');
      const queryRef = query(commentsRef, where('articleId', '==', articleId), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(queryRef);
      const newComments = querySnapshot.docs.map((doc) => {
        const commentData = doc.data();
        return { id: doc.id, ...commentData, timestamp: commentData.timestamp.toDate() };
      });
      setComments(newComments);
      setLoading(false);
    } catch (error) {
      setErrorMessage('Error fetching Listing. Please try again.');
      setLoading(false);
    }
  };

  const userIsAuthenticated = async () => {
    return new Promise<boolean>((resolve) => {
      const authInstance = getAuth();
      onAuthStateChanged(authInstance, (user) => {
        const isAuthenticated = !!user;
        resolve(isAuthenticated);
      });
    });
  };

  async function checkIfUserIsAdmin(user: User): Promise<boolean> {
    const db = getFirestore();
    const adminUserDocRef = doc(db, 'adminusers', user.uid);
  
    try {
      const adminUserDoc = await getDoc(adminUserDocRef);
      return adminUserDoc.exists();
    } catch (error) {
      console.error('Error checking admin user:', error);
      return false; // Return false in case of an error
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articles = await getArticles();
        const currentUser = getAuth().currentUser;
        if (currentUser) {
          const userArticles = articles.filter((article) => article.userId === currentUser.uid);
          const otherArticles = articles.filter((article) => article.userId !== currentUser.uid);
          const combinedListings = userArticles.concat(otherArticles);
          setUseArticle(combinedListings);
        } else {
          setUseArticle(articles);
        }
      } catch (error) {
        setFetchError('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        const isUserAdmin = checkIfUserIsAdmin(user); // Implement this function based on your authentication system
        setIsAdmin(await isUserAdmin);
      } else {
        setIsAdmin(false);
      }
      const checkAuthState = (user: any) => {
        setIsSignedIn(!!user);
      };
    });

    fetchData();

    return () => {
      unsubscribe();
    };
  }, []); 


  const handleAddToCart = async (article: Article) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const db = getFirestore();
  
      if (currentUser) {
        const cartRef = doc(db, 'Cart', currentUser.uid);
        const cartDoc = await getDoc(cartRef);
  
        if (cartDoc.exists()) {
          const cartData = cartDoc.data();
          let items = cartData.items || [];
  
          // Check if the item already exists in the cart
          const existingItemIndex = items.findIndex(
            (item: Article) => item.id === article.id
          );
  
          if (existingItemIndex !== -1) {
            // If the item already exists, update its quantity
            items[existingItemIndex].quantity += 1;
          } else {
            // If the item doesn't exist, add it to the items array
            items.push({
              id: article.id,
              title: article.title,
              price: article.price,
              coverimage: article.coverimage,
              quantity: 1,
            });
          }
  
          await updateDoc(cartRef, { items });
          router.push('/pages/Cart');
        } else {
          // If the cart document doesn't exist, create a new one with the first item
          await setDoc(cartRef, {
            items: [
              {
                id: article.id,
                title: article.title,
                price: article.price,
                coverimage: article.coverimage,
                quantity: 1,
              },
            ],
          });
          router.push('/pages/Cart');
        }
      } else {
        // Handle the case where the user is not logged in
      }
    } catch (error) {
      // Handle any errors that occur
      console.error('Error adding item to cart:', error);
    }
  };
return (
<>
<div className='hero-grid'>
  {loading ? (
    <>
      <div className="main-content">
        <div className="mainflex">
          <div style={{ display: 'grid' }}>
            <Skeleton height={30} />
            <Skeleton height={40} />
            <Skeleton height={40} />
          </div>
          <Skeleton height={200} width={300} />
        </div>
      </div>
      <div className="first-left-content">
        <Skeleton height={30} />
        <Skeleton height={200} width={300} />
        <Skeleton height={30} />
        <Skeleton height={40} />
      </div>
      <div className="second-left-content">
        {/* Render skeleton loaders for another product */}
      </div>
    </>
  ) : (
useArticle
.filter((post) => post.id === 'aNvAEn3uhvs9BDUhbikF' || post.id === '662oluIkcGSgIqdhYJQc' || post.id  === 'kVO4Bvo3xiG8Plw9rx2n')
.map((post) => (
<React.Fragment key={post.id}>
{post.id === 'aNvAEn3uhvs9BDUhbikF' && (
<div className="main-content" key={`${post.id}-main-content`}>
<div className="mainflex">
<div style={{ display: 'grid' }}>
<h2>{post.catorgory}</h2>
<span style={{ fontSize: '17px', lineHeight: '40px' }}>{post.title}</span>
<span style={{ lineHeight: '50px', fontSize: '24px', color: '#464646' }}>{post.price}</span>
</div>
<Link href={`/pages/Details/${post.id}`} key={`${post.id}-link`}>
<img src={post.coverimage} className="main-content-img" alt="" />
</Link>
</div>
</div>
)}

{post.id === '662oluIkcGSgIqdhYJQc' && (
<div className="first-left-content" key={`${post.id}-first-left-content`}>
<h2>{post.catorgory}</h2>
<div>
<Link href={`/pages/Details/${post.id}`} key={`${post.id}-link`}>
<img src={post.coverimage} alt="" />
</Link>
</div>
<span style={{ fontSize: '20px', lineHeight: '40px' }}>{post.title}</span>
<div style={{ lineHeight: '50px', fontSize: '24px', color: '#464646' }}>{post.price}</div>
<div>
<button onClick={() => handleAddToCart(post)}>Add to cart</button>
</div>
</div>
)}
{post.id === 'kVO4Bvo3xiG8Plw9rx2n' && (

<div className="second-left-content" key={`${post.id}-second-left-content`}>
<h2>{post.catorgory}</h2>
<div>
<Link href={`/pages/Details/${post.id}`} key={`${post.id}-link`}>
<img src={post.coverimage} alt="" />
</Link>
</div>
<span style={{ fontSize: '20px', lineHeight: '40px' }}>{post.title}</span>
<div style={{ lineHeight: '50px', fontSize: '24px', color: '#464646' }}>{post.price}</div>
<div>
<button onClick={() => handleAddToCart(post)}>Add to cart</button>
</div>
</div>
)}





{/* Add more divs for additional products */}
</React.Fragment>
))
)}
</div>
</>
)
}
