'use client'

import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import {  DotLoader } from 'react-spinners';
import it from '../../img/gulime_g.png'
import { auth, db } from '../../Config/firebase';

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errorState, setErrorState] = useState(null);
  const [isInputValid, setIsInputValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('Weak');
  const router = useRouter();
 
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: `${firstName} ${lastName}`
      });
      await sendEmailVerification(auth.currentUser);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName,
        lastName,
        email,
        password,
        phone,
        address
      });
      router.push('/');
    } catch (error) {
      if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
        setErrorState('That email address is already in use.');
      } else {
        setErrorState('Registration failed. Please check your details and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
 
  //change color on strength
  const strengthToColorMap = {
    Weak: 'red',
    Moderate: 'orange',
    Strong: 'green',
  };
 
  function getColor(strength) {
    return strengthToColorMap[strength] || '#555';
  }
  //change color on strength
 
  // check password strength
  const checkPasswordStrength = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{15,}$/;
    const moderateRegex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*(),.?":{}|<>]).{8,14}$/;
    const strength = strongRegex.test(password) ? 'Strong' : moderateRegex.test(password) ? 'Moderate' : 'Weak';
    setPasswordStrength(strength);
  };
  // check password strength
 
  const validateInputs = () => {
    setIsInputValid(email !== '' && password !== '');
  };
 
  return (
    <>
      <div className='contribute-box'>
<div className='contribute-leftbox'>
          <Image style={{  padding: '20px', cursor: 'none' }} src={it} alt='...' />
 
          <form  className='formbox' onSubmit={handleRegister}>
  <div className='error'>
    {errorState && <p className='error-message'>{errorState}</p>}
  </div>

  {errorState && errorState.includes('email') && (
    <p className='error-message'>{errorState}</p>
  )}

  <div className='input-row'>
    <div className='input-group'>
      <label htmlFor='fname'>First Name</label>
      <input
        type='text'
        id='fname'
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        maxLength={50}
      />
    </div>
    <div className='input-group'>
      <label htmlFor='lname'>Last Name</label>
      <input
        type='text'
        id='lname'
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        maxLength={50}
      />
    </div>
  </div>

  <div className='input-row'>
  <div className='input-group'>
    <label htmlFor='phone'>Phone Number</label>
    <input
      type='text'
      id='phone'
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      placeholder="Please Enter Your Phone Number"
      required
    />
</div>
  <div className='input-group'>
    <label htmlFor='address'>Address</label>
    <input
      type='text'
      id='address'
      value={address}
      placeholder="Please Enter Your Address"
      onChange={(e) => setAddress(e.target.value)}
      required
    />
  </div>
</div>
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
        checkPasswordStrength(e.target.value);
      }}
      required
      minLength={8}
      maxLength={100}
      title="Password must be between 8 and 100 characters long and include symbols and numbers"
    />
  </div>
</div>
  <div className={`password-strength ${passwordStrength.toLowerCase()}`}>
    <span>Password Strength: {passwordStrength}</span>
  </div>

  <div
    className="payment-title"
    style={{
      display: 'flex',
      justifyContent: 'center'
    }}
  >
    <p><Link href='/pages/Login'>Already Have An Account</Link></p>
  </div>

  <div className='error'>{errorState && <p>{errorState}</p>}</div>

  <button type='submit' disabled={!isInputValid || isLoading}>
    {isLoading ? <DotLoader color='#fff' /> : 'Register'}
  </button>
</form>

        </div>
 
        <div className='contribute-rightbox'>
          <div className="intro">
            <h1>Welcome to Gulime!</h1>
            <p>We're excited to have you join our shopping community. By registering with Gulime, you unlock access to a variety of features designed to enhance your shopping experience.</p>

            <p>As a registered customer, you can:</p>
            <ul>
                <li>Easily manage your orders and track your purchases with our user-friendly system.</li>
                <li>Receive personalized product recommendations and discover new items tailored to your preferences.</li>
                <li>Access exclusive deals, discounts, and early notifications on sales events.</li>
                <li>Connect with our customer support team and get assistance whenever you need it.</li>
            </ul>

            <p>Your privacy and security are our top priorities. Your personal information is securely stored and never shared without your explicit consent. We follow the highest standards of data protection to ensure your information remains confidential.</p>

            <p>Get started today and explore the endless shopping possibilities with Gulime!</p>
          </div>
        </div>
      </div>
    </>
  )
}