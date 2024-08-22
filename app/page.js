import Carosel from "./components/Carosel";
import Footer from "./components/Footer";
import Homepage from "./components/HomePage";
import Navbar from "./components/Navbar";



export const metadata = {
  title: 'Gulime - Your One-Stop Shop for All Your Needs',
  description: 'Explore Gulime, your premier ecommerce destination for a vast array of products, including cars & Trucks. Discover great deals, fast shipping, and exceptional customer service. From everyday essentials to luxury items, Gulime has got you covered.',
  keywords: 'ecommerce, online shopping, cars, trucks, products, deals, fast shipping, customer service, shopping platform'
  }

export default function Home() {
return (
<>
<Navbar/>
<Carosel/>
<Homepage/>
<Footer/>
</>
);
}
