import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import React from 'react'
import LoginForm from './LoginForm';
 export const metadata = {
        title: 'Gulime.com - Login',
        description: 'Log in to your Gulime account to access personalized recommendations, exclusive deals, and a seamless shopping experience. Explore a wide range of products, including cars and trucks, and enjoy the benefits of being a Gulime community member.',
        keywords: 'Login, Gulime account, personalized recommendations, exclusive deals, shopping experience, Gulime community, cars, trucks',
      };
export default function page() {
   
  return (
    <>
    <Navbar/>
    <LoginForm/>
    <Footer/>
    </>
  )
}
