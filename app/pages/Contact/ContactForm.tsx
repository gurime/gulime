'use client'
import { auth } from '@/app/firebase/firebase';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getFirestore } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import contactimg from '../../img/gulime.png'
import { DotLoader } from 'react-spinners';

export default function ContactForm() {
    const [names, setNames] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [contact, setContact] = useState<any[]>([]);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [autoFocus, setAutoFocus] = useState(true);
    const router = useRouter()
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        const getUserData = async (userId: string) => {
          try {
            const db = getFirestore();
            const userDocRef = doc(db, 'users', userId);
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
              const userData = userDocSnapshot.data();
              return userData;
            } else {
              return null;
            }
          } catch (error) {
            throw error;
          }
        };
  
        setIsSignedIn(!!user);
  
        if (user) {
          try {
            const userData = await getUserData(user.uid);
            if (userData) {
              setNames(userData.names || ''); // Set names to userData.names or an empty string
            } else {
              setNames(''); // Set names to an empty string if userData is null
            }
          } catch (error) {
            setErrorMessage(error as string);
          } finally {
            setIsLoading(false);
          }
        }
      });
  
      return () => unsubscribe();
    }, []);
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        setIsLoading(true);
        const db = getFirestore();
        const docRef = await addDoc(collection(db, 'contacts'), {
          content: content,
          timestamp: new Date(),
          userName: user?.displayName,
          userEmail: user?.email,
        });
        setContact((prevComments) => [
          ...prevComments,
          {
            id: docRef.id,
            content: content,
            timestamp: new Date(),
            userName: user?.displayName,
            userEmail: user?.email,
          },
        ]);
  
        router.push('/pages/Contact/Confirmation')
  
        setNames('');
        setEmail('');
        setSubject('');
        setContent('');
      } catch (error) {
        setErrorMessage('Error submitting form. Please try again.');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };
return (
<>
<div className='contact_title_img'>
<Link href='/'>
<h2>Contact Gulime</h2>
</Link>
      </div>
      <div style={{ display: 'grid', placeContent: 'center', maxWidth: '30rem', margin: 'auto' }}>
        <form className='formbox' onSubmit={handleSubmit}>
          <label htmlFor='fname' aria-label="Name">Full Name</label>
          <input type="text" name="fname" value={names} onChange={(e) => setNames(e.target.value)} required />
          <label htmlFor='email' aria-label="Email">Email</label>
          <input type="email" name="email" aria-describedby="emailError" value={email} onChange={(e) => { setEmail(e.target.value); }} />
          <label htmlFor='subject' aria-label="Subject">Subject</label>
          <input type="text" name="subject" aria-describedby="subjectError" value={subject} onChange={(e) => setSubject(e.target.value)} />

          <label htmlFor='content' aria-label="Type Your Message">Type Your Message</label>
<textarea
name="content"
rows={5}
required
value={content}
onChange={(e) => setContent(e.target.value)}
autoFocus={autoFocus}
aria-describedby="messageError"
/>
<button className={isSignedIn ? "submitbtn" : "submitbtn disabled"} type="submit" disabled={!isSignedIn || !content || isLoading}>
{isLoading ? <DotLoader color='blue' /> : 'Submit'}
</button>
</form>
{errorMessage && <p className='error'>{errorMessage}</p>}
{successMessage && <p className="success">{successMessage}</p>}
</div></>
)
}
