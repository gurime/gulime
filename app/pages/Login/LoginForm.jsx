'use client';

import { signInWithEmailAndPassword } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { RiseLoader } from 'react-spinners';
import it from '../../img/gulime_g.png'
import { auth } from '../../Config/firebase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorState, setErrorState] = useState(null);
  const [isInputValid, setIsInputValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
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
          <Image style={{  padding: '20px', cursor: 'none' }} src={it} alt='...' />

          <form  className='formbox' onSubmit={handleLogin}>
          <div className='input-row'>

<div className='input-group'>
  <label htmlFor='email'>Email</label>
  <input
    type='email'
    id='email'
    value={email}
    onChange={(e) => {
      setEmail(e.target.value);
      validateInputs();
    }}
    required
    maxLength={254}
    title="Please enter a valid email address"
  />
</div>

<div className='input-group'>
  <label htmlFor='password'>Password</label>
  <input
    type='password'
    id='password'
    value={password}
    onChange={(e) => {
      setPassword(e.target.value);
      validateInputs();
    }}
    required
    minLength={8}
    maxLength={100}
    title="Password must be between 8 and 100 characters long and include symbols and numbers"
  />
</div>
</div>
            <div
              className='payment-title'
              style={{
                display: 'flex',
                justifyContent: 'center'
              }}>
              <p>
                <Link href='/pages/Register'>Need An Account</Link>
              </p>
            </div>
            <div className='error'>{errorState && <p>{errorState}</p>}</div>
            <button type='submit' disabled={!isInputValid || isLoading}>
              {isLoading ? <RiseLoader color='#fff' /> : 'Login'}
            </button>
          </form>
        </div>
 
        <div className='contribute-rightbox'>
          <div className="intro">
            <h1>Welcome Back to Gulime!</h1>
            <p>We're thrilled to have you return. By logging in to Gulime, you can continue exploring and purchasing from our vast selection of products.</p>
            <p>As a returning customer, you can:</p>
            <ul>
              <li>Quickly view and manage your past orders and shopping history.</li>
              <li>Access personalized product recommendations based on your preferences.</li>
              <li>Stay updated on the latest deals and exclusive offers tailored just for you.</li>
            </ul>
            <p>Your security is our top priority. We use advanced security measures to protect your data, ensuring that your information is safe and never shared without your consent.</p>
            <p>Ready to continue shopping? Log in below to access your account and discover more amazing products with Gulime!</p>
          </div>
        </div>
      </div>
    </>
  )
}