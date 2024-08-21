import Footer from '@/app/components/Footer'
import Navbar from '@/app/components/Navbar'
import { Metadata } from 'next'
import React from 'react'
export const metadata: Metadata = {
    title: 'Gulime Profile',
    description: 'Explore Gulime, your premier ecommerce destination for a vast array of products, including cars & Trucks. Discover great deals, fast shipping, and exceptional customer service. From everyday essentials to luxury items, Gulime has got you covered.',
    keywords: 'ecommerce, online shopping, cars, trucks, products, deals, fast shipping, customer service, shopping platform'
    }
export default function page() {
return (
<>
<Navbar/>
<Footer/>
</>
)
}
