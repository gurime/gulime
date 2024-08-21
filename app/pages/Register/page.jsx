
import React from 'react'
import RegisterForm from './RegisterForm';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Gulime.com - Register',
  description: 'Create your Gulime account to start shopping for a wide range of products, including cars and trucks. Enjoy personalized recommendations, exclusive deals, and a seamless shopping experience. Sign up now and join the Gulime community!',
  keywords: 'Register, create account, Gulime.com account, personalized recommendations, exclusive deals, shopping experience, Gulime community',
};

export default function page() {
return (
<>
<Navbar/>
<RegisterForm/>
<Footer/>
</>
)
}