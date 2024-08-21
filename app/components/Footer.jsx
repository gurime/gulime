'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import footLogo from '../img/gulime_g.png'
import Image from 'next/image'
import navlogo from '../img/gulime.png'

const Footer = () => {
const router = useRouter()
const scrollTo = () =>{
window.scroll({top: 0,})
}  

return (
<>


<footer>

<div className="flex-footer">
<div className="footer-tablebox">
  <div className="footer-headline">Get To Know Us</div>
  <ul className="footer-navlink">
    <li><Link href='/pages/Career'>Career</Link></li>
    <li><Link href='/pages/CompanyNews'>Company News</Link></li>
    <li><Link href='/pages/PressCenter'>Press Center</Link></li>
    <li><Link href='/pages/About'>About Gulime</Link></li>
    <li><Link href='/pages/Investor'>Investor Relations</Link></li>
    <li><Link href='/pages/Advertise'>Advertise</Link></li>
  </ul>
</div>
{/* Remaining table boxes */}

{/*first tablebox stops here*/}
<div className="footer-tablebox"> 
<div className="footer-headline">Shop</div>

<ul className="footer-navlink">
<li><Link href='/pages/Toys'>Toys, Kids, & Baby</Link></li>

<li><Link href='/pages/HomeGarden'>Home & Garden</Link></li>

<li><Link href='/pages/Luggage'>Luggage & Suitcases</Link></li>

<li><Link href='/pages/Books'>Books & Literature</Link></li>

<li><Link href='/pages/Makeup'>Beauty & Makeup</Link></li>

<li><Link href='/pages/Clothing'>Clothing & Appareal</Link></li>


<li><Link href='/pages/Groceries'>Food & Groceries</Link></li>

<li><Link href='/pages/School'>School Essentials</Link></li>

<li><Link href='/pages/Cameras'>Cameras & Photography</Link></li>

</ul>
</div>
{/*seconds tablebox stops here*/}
<div className="footer-tablebox">
 <div className="footer-headline">World Shop</div>
 <ul className="footer-navlink">
   <li><Link href='/pages/AustralianProducts'>Australian Products</Link></li>
   <li><Link href='/pages/MexicanProducts'>Mexican Products</Link></li>
   <li><Link href='/pages/SouthAmericanProducts'>South American Products</Link></li>
   <li><Link href='/pages/EuropeanProducts'>European Products</Link></li>
   <li><Link href='/pages/AsianProducts'>Asian Products</Link></li>
   <li><Link href='/pages/AfricanProducts'>African Products</Link></li>
   <li><Link href='/pages/NorthAmericanProducts'>North American Products</Link></li>
   <li><Link href='/pages/MiddleEasternProducts'>Middle Eastern Products</Link></li>
   <li><Link href='/pages/IslandProducts'>Island Products</Link></li>
 </ul>
</div>
{/*third tablebox stops here*/}
<div className="footer-tablebox" style={{ borderRight: 'none' }}>
  <div className="footer-headline">Lifestyle Shop</div>
  <ul className="footer-navlink">
    <li><Link href="/pages/Automotive">Automotive & Industrial</Link></li>
    <li><Link href="/pages/Cars">Cars & Trucks</Link></li>
    <li><Link href="/pages/Handmade">Handmade</Link></li>
    <li><Link href="/pages/Pets">Pet Supplies</Link></li>
    <li><Link href="/pages/Fitness">Fitness Products</Link></li>
    <li><Link href="/pages/Electronics">Electronics & Gadgets</Link></li>
    <li><Link href="/pages/religion">Faith & Religion</Link></li>
    <li><Link href="/pages/outdoors">Outdoors & Hiking</Link></li>
    <li><Link href="/pages/pride">Pride Shop</Link></li>
  </ul>
</div>
{/*fourth tablebox stops here*/}
<div className="footer-tablebox" style={{borderRight:'none',borderLeft:'solid 1px #fff'}}>
 <div className="footer-headline">Health Products</div>
 <ul className="footer-navlink" style={{borderBottom:'none'}}>
   <li><Link href='/pages/Mental'>Mental Health Products</Link></li>
   <li><Link href='/pages/Childrens'>Children's Health Products</Link></li>
   <li><Link href='/pages/Heart'>Heart Health Products</Link></li>
   <li><Link href='/pages/Pet'>Pet Health Products</Link></li>
   <li><Link href='/pages/Eye'>Eye Health Products</Link></li>
   <li><Link href='/pages/Vitamins'>Vitamins & Supplements</Link></li>
   <li><Link href='/pages/Medical'>Medical Research Products</Link></li>
   <li><Link href='/pages/FitnessNutrition'>Fitness & Nutrition</Link></li>
   <li><Link href='/pages/OralHealth'>Oral Health Products</Link></li>

 </ul>
</div>
{/*fourth tablebox stops here*/}


</div>

<div  className="nav">
<Image title='Home Page' style={{marginRight:'auto '}} onClick={() => router.push('/')} src={navlogo} height={36} alt='...'  />






<div className="navlinks sm-navlink" style={{flexWrap:'nowrap'}}>
<Link  href='/pages/Contact'>Contact Gulime.com</Link>

<Link  href='/pages/Terms'>terms of Use</Link>

<Link  href='/pages/Privacy'>Privacy Policies </Link>

<Link style={{border:'none'}}  href='../pages/Cookie'>Cookie Policies</Link>


</div>
</div>





<hr />
<div style={{
color:'#fff',
padding:'1rem 0',
textAlign:'center'
}}>
   &#169;{new Date().getFullYear()} Gulime or its affiliated companies. All rights reserved.<br />

</div>
<hr />

<div style={{
color:'#fff',
padding:'1rem 0',
textAlign:'center'
}}>
   <br />
   The contents of this website may not be reproduced, distributed, transmitted, or otherwise used without prior written permission from Gulime. 
</div>


<div className="footer-logo-box">

<Image title='To Top' width={36} onClick={scrollTo}  src={footLogo} alt="..." />

</div>
</footer>






</>
)
}

export default Footer