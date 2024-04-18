'use client'
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, updateDoc, where } from 'firebase/firestore';
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
    price: string;
    imgshowcase:string;
    imgshowcase1:string
    imgshowcase2:string
    imgshowcase3:string
    imgshowcase4:string
    coverimage: string; 
    catorgory: string;

    timestamp: string;
  }

  function updateComment(postId: string, editedContent: string) {
    throw new Error('Function not implemented.');
  }
  
  function checkIfUserIsAdmin(user: User) {
    throw new Error('Function not implemented.');
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
  const [successMessage, setSuccessMessage] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<any>(null);
  const [unauthorizedModalOpen, setUnauthorizedModalOpen ] = useState<boolean>(false)
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
  const editPost = async (postId: string, userId: string, isAdmin: boolean) => {
    const listingToEdit = useArticle.find((listing) => listing.id === postId);
  
    if (listingToEdit) {
      const isAuthenticated = await userIsAuthenticated();
  
      if (isAdmin) {
        // Admin can edit any post
        setEditingComment(listingToEdit);
        setEditModalOpen(true);
      } else if (isAuthenticated) {
        const auth = getAuth();
        const currentUser = auth.currentUser;
  
        if (currentUser && currentUser.uid === listingToEdit.userId) {
          // Regular user can edit their own post
          setEditingComment(listingToEdit);
          setEditModalOpen(true);
        } else {
          // Show modal or error message for unauthorized access
          setUnauthorizedModalOpen(true);
        }
      } else {
        // User is not authenticated
        // Show modal or error message for unauthorized access
        setUnauthorizedModalOpen(true);
      }
    } else {
      setErrorMessage('Listing not found');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const handleEditModalSave = async (postId: string, editedContent: string) => {
    try {
      updateComment(postId, editedContent);

      setUseArticle((prevArticles) =>
        prevArticles.map((article) =>
          article.id === postId ? { ...article, content: editedContent, bodycontent: editedContent, endcontent: editedContent } : article
        )
      );

      setEditModalOpen(false); 

    } catch (error) {
      setErrorMessage('Error saving Listing. Please try again.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

return (
<>
<div className='hero-grid'>
  {useArticle
    .filter((post) => post.id === 'nKtChJP98OpNMPFX6Afn' || post.id === '662oluIkcGSgIqdhYJQc')
    .map((post) => (
      <>
        {post.id === 'nKtChJP98OpNMPFX6Afn' && (
          <div className='main-content'>
            <div className='mainflex'>
              <div style={{ display: 'grid' }}>
                <h2>{post.catorgory}</h2>
                <span style={{ fontSize: '24px', lineHeight: '40px' }}>{post.title}</span>
                <span style={{ lineHeight: '50px', fontSize: '24px' }}>{post.price}</span>
              </div>
              <Link href={`/pages/Articles/${post.id}`}>
                <img src={post.coverimage} className='main-content-img' />
              </Link>
            </div>
          </div>
        )}
        {post.id === '662oluIkcGSgIqdhYJQc' && (
          <div className='first-left-content'>
            <div>{post.catorgory}</div>
           <img src={post.coverimage} alt="" />
        <div>{post.title}</div>
            
           <div>{post.price}</div>
      <button>check it out</button>
      <button>Quick View</button>
      <button>Add to Cart</button>
           
          </div>
        )}
        <div className='second-left-content'>
          {/* Render content for another product */}
        </div>
        {/* Add more divs for additional products */}
      </>
    ))}
</div>
</>
)
}
