'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import navlogo from '../img/gulime.png'
import Footer from './footer';
import { FaShoppingCart } from 'react-icons/fa';
export default function Navbar() {
const [isFooterVisible, setIsFooterVisible] = useState(false);
const router = useRouter()
const toggleFooter = () => {
setIsFooterVisible(!isFooterVisible);
};
return (
<>
<div className="nav">
<Image placeholder="blur" onClick={() => router.push('/')} src={navlogo} height={36} alt='...' />



<div className="navlinks">


{/* {isSignedIn ? (
<Link  href='#!'>
{names.length === 2 && (
<>
<span className="sm-name" >{names[0]}</span>
<span className="sm-name">{names[1]}</span>
</>
)}
</Link>
) : (

<span className="sm-name">
Guest

</span>
)} */}

<Link href="/">Home</Link>
<Link href="/pages/Technology">Technology</Link>
<Link href="/pages/Music">Music</Link>
<Link href="/pages/Fashion">Fashion</Link>
<Link href="/pages/VideoGames">Video Games</Link>
<Link href="/pages/Sports">Sports</Link>
<Link href='#!' onClick={toggleFooter}>More:</Link>
<Link href='#!'><FaShoppingCart style={{fontSize:'24px',color:'#fff',padding:'0 5px 0 0'}}/>cart</Link>

</div>


</div>
<div style={{position:'relative',width:'100%'}}>
<div style={{position:'absolute',width:'100%'}}>
{isFooterVisible && <Footer />}</div>
</div>

</>
)
}
