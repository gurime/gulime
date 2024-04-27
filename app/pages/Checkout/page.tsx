import AdminHeader from '@/app/components/AdminHeader'
import Footer from '@/app/components/footer'
import Navbar from '@/app/components/navbar'
import React from 'react'
import CheckoutPage from './CheckoutPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Gulime.com - Your One-Stop Shop for All Your Needs',
    description: 'Explore Gulime, your premier ecommerce destination for a vast array of products, including cars & Trucks. Discover great deals, fast shipping, and exceptional customer service. From everyday essentials to luxury items, Gulime has got you covered.',
    keywords: 'ecommerce, online shopping, cars, trucks, products, deals, fast shipping, customer service, shopping platform'
    }

export default function Checkout() {
return (
<>
<AdminHeader/>
<Navbar/>
<CheckoutPage/>
<Footer/>
</>
)
}
