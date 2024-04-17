'use client'

import React, { useState, FormEvent } from 'react';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';
import { auth, db } from '@/app/firebase/firebase';

export default function LoginForm(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorState, setErrorState] = useState<string | null>(null);
  const [isInputValid, setIsInputValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
        setIsLoading(true);
        validateInputs();

        const adminUsersSnapshot = await getDocs(collection(db, 'adminusers'));
        const isAdminUser = adminUsersSnapshot.docs.some(doc => doc.data().email === email);

        if (!isAdminUser) {
            throw new Error('Authentication failed. Only admin users are allowed.');
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        router.push('/pages/Admin');
    } catch (error: any) {
        console.error('Error occurred:', error);
        setErrorState(error.message || 'An error occurred');
    } finally {
        setIsLoading(false);
    }
}
  const validateInputs = () => {
    setIsInputValid(email !== '' && password !== '');
  };

  return (
    <>
      <div style={{height:'100vh', display:'grid',alignItems:'center'}} className='adminform_bg'>

        <form className="adminform admin_login" onSubmit={handleLogin}>
          <h1>Admin Login</h1>      <div className='sm-adminform-input' style={{ display: 'grid', gap: '1rem' }}>

          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => {setEmail(e.target.value);validateInputs();}}/>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => {setPassword(e.target.value);validateInputs();}}/>
   </div>
          <div className='error'>{errorState && <p style={{color:'#fff'}}>{errorState}</p>}</div>
          <button
            type='submit'
            disabled={!isInputValid || isLoading}
            style={{
              cursor: !isInputValid || isLoading ? 'not-allowed' : 'pointer',
              backgroundColor: !isInputValid || isLoading ? '#d3d3d3' : '#007bff',
              color: !isInputValid || isLoading ? '#a9a9a9' : '#fff',
            }}>
            {isLoading ? <BeatLoader color='blue' /> : 'Login'}
          </button>
        </form>
     
      </div>
    </>
  );
}
