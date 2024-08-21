import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import React from 'react'
import CartPage from './CartPage'
export const metadata = {
    title: 'Gulime.com - Shopping Cart'
 
    }
export default function page() {
return (
<>
<Navbar/>
<CartPage/>
<Footer/>
</>
)
}
