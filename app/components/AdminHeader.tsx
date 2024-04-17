'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { doc, getDoc, getFirestore } from 'firebase/firestore';
import Link from 'next/link';
import { auth } from '../firebase/firebase';
import Footer from './footer';

interface UserData {
  firstName: string;
  lastName: string;
}

export default function AdminHeader(): JSX.Element {
  const [adminisSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [isFooterVisible, setIsFooterVisible] = useState<boolean>(false);
  const [adminnames, setNames] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Fetch user data from Firestore
          const userData = await getUserData(user.uid);
          if (userData) {
            setNames([userData.firstName, userData.lastName]);
            setIsSignedIn(true);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setIsSignedIn(false);
        setNames([]); // Clear names when no user is signed in
      }
    });

    const getUserData = async (userId: string): Promise<UserData | null> => {
      try {
        const db = getFirestore();
        const userDocRef = doc(db, 'adminusers', userId);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data() as UserData;
          return userData;
        } else {
          return null;
        }
      } catch (error) {
        throw error;
      }
    };

    return () => {
      unsubscribe(); // Assuming you have an unsubscribe function
    };
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/pages/AdminLogin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleFooter = () => {
    setIsFooterVisible(!isFooterVisible);
  };

  return (
    <>
      <div className='adminnav'>
        <ul className='navlinks sm-navlinks12'>
          <Link href='/'>Home</Link>
          {adminisSignedIn ? (
            <Link href='/pages/Admin'>
              {adminnames.length === 2 && (
                <>
                  <span className="sm-name" style={{padding:'0'}}>
                    {adminnames[0]}  {adminnames[1]}
                    <Link href='#!' onClick={toggleFooter}>More:</Link>
                  </span>
                  <button onClick={handleLogout}>Logout</button>
                </>
              )}
            </Link>
          ) : (
            <div className="commentreg-box">
              <span
                style={{ margin: '10px', color: '#fff', cursor: 'pointer' }}
                onClick={() => router.push('/pages/AdminLogin')}
              >
                Admin
              </span>
            </div>
          )}
        </ul>
      </div>
      <div style={{position:'relative',width:'100%'}}>
        <div style={{position:'absolute',width:'100%',zIndex:'1'}}>
          {isFooterVisible && <Footer />}
        </div>
      </div>
      {/* footer dropdown */}
    </>
  );
}
