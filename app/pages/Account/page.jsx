
import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import AccountPage from './AccountPage'
export const metadata = {
    title: 'Gulime Profile',
    description: 'Explore Gulime, your premier ecommerce destination for a vast array of products, including cars & Trucks. Discover great deals, fast shipping, and exceptional customer service. From everyday essentials to luxury items, Gulime has got you covered.',
    keywords: 'ecommerce, online shopping, cars, trucks, products, deals, fast shipping, customer service, shopping platform'
    }
export default function page() {
return (
<>

<Navbar/>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300">
  <rect width="1200" height="300" fill="#bcd4ec"/>
  
  <circle cx="50" cy="50" r="100" fill="#e1e8ed"/>
  <circle cx="1150" cy="250" r="100" fill="#e1e8ed"/>
  
  <rect x="50" y="100" width="30" height="100" rx="20" fill="#4a90e2"/>
  <text x="150" y="165"  fontSize="36" fill="black" textAnchor="middle">Gulime</text>
  
  <text x="600" y="170"  fontSize="36" fill="#333" textAnchor="middle">Welcome to Your Gulime Account</text>
</svg>
<AccountPage/>
<Footer/>
</>
)
}
