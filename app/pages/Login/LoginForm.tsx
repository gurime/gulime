'use client'

import { auth, db } from '@/app/firebase/firebase';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { BeatLoader, DotLoader } from 'react-spinners';
import it from '../../img/gulime.png'
export default function LoginForm() {
  const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errorState, setErrorState] = useState<string | null>(null);
const [isInputValid, setIsInputValid] = useState(false);
const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
    setIsLoading(true);
    validateInputs();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    router.push('/');
    } catch (error) {
    setErrorState('Authentication failed. Please check your credentials and try again.');
    } finally {
    setIsLoading(false);
    }
    }
        
    const validateInputs = () => {
    if (email === '' || password === '') {
    setIsInputValid(false);
    } else {
    setIsInputValid(true);
    }
    };
  return (
    <>
    <div className='contribute-box'>
<div className='contribute-leftbox' style={{ marginBottom: '10rem' }}>
<Image style={{ backgroundColor: '#1508ce', padding: '20px', cursor: 'none' }} src={it} alt='...' />

<form style={{width:'35rem'}} className='formbox' onSubmit={handleLogin}>
<label htmlFor='email'>Email</label>
<input
type='email'
id='email'
value={email}
onChange={(e) => {
setEmail(e.target.value);
validateInputs();}}
/>

<label htmlFor='password'>Password</label>
<input
type='password'
id='password'
value={password}
onChange={(e) => {
setPassword(e.target.value);
validateInputs();}}
/>
<div
className='payment-title'
style={{
display: 'flex',
justifyContent: 'center'}}>
<p>
<Link href='/pages/Register'>Need An Account</Link>
</p>
</div>
<div className='error'>{errorState && <p>{errorState}</p>}</div>
<button type='submit' disabled={!isInputValid || isLoading}>
  {isLoading ? <DotLoader color='#fff' /> : 'Login'}
</button>
</form>
</div>
 
        <div className='contribute-rightbox'>
          <h1> Gulime.com</h1>
          <p style={{ lineHeight: '1.8', fontSize: '15px', borderTop: 'solid 1px gray' }}>  Login into your Gulime account <br /> and continue your shopping spree.
          </p>
        </div>
      </div>
    </>
  )
 }