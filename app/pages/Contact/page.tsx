import AdminHeader from '@/app/components/AdminHeader'
import Footer from '@/app/components/footer'
import Navbar from '@/app/components/navbar'
import { Metadata } from 'next'
import React from 'react'
import ContactForm from './ContactForm'
export const metadata: Metadata = {
    title: 'Contact Gulime.com',
    description: 'Get in touch with Gulime, your premier ecommerce destination for a vast array of products, including cars & Trucks. We offer great deals, fast shipping, and exceptional customer service. From everyday essentials to luxury items, we`ve got you covered.',
    keywords: 'ecommerce, online shopping, cars, trucks, products, deals, fast shipping, customer service, shopping platform'
    }

export default function page() {
return (
<>
<AdminHeader/>
<Navbar/>
<ContactForm/>
<Footer/>
</>
)
}
