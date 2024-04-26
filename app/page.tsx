import { SkeletonTheme } from "react-loading-skeleton";
import AdminHeader from "./components/AdminHeader";
import Dashboard from "./components/Dashboard";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import { Metadata } from "next";
import { CartProvider } from "./Context/Cartcontext";
export const metadata: Metadata = {
  title: 'Gulime - Your One-Stop Shop for All Your Needs',
  description: 'Explore Gulime, your premier ecommerce destination for a vast array of products, including cars & Trucks. Discover great deals, fast shipping, and exceptional customer service. From everyday essentials to luxury items, Gulime has got you covered.',
  keywords: 'ecommerce, online shopping, cars, trucks, products, deals, fast shipping, customer service, shopping platform'
  }


export default function Home() {
  return (
<>
<AdminHeader/>
<CartProvider><Navbar/></CartProvider>

<SkeletonTheme baseColor="grey" highlightColor="#e6e6e6">
<Dashboard/>
</SkeletonTheme>
<Footer/>
</>
);
}
