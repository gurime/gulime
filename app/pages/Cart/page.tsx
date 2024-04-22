import AdminHeader from '@/app/components/AdminHeader'
import Navbar from '@/app/components/navbar'
import { Metadata } from 'next'
import React from 'react'
import CartPage from './CartPage'
import Footer from '@/app/components/footer'


export const metadata: Metadata = {
    title: 'Gulime - Cart'
 
    }

export default function Cart() {
return (
<>
<AdminHeader/>
<Navbar/>
<CartPage/>
<Footer/>
</>
)
}
