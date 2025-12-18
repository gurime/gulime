'use client'
import React, { useEffect, useState } from 'react';
import { ChevronDown, ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
const [menuOpen, setMenuOpen] = useState(false);
const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
const [activeSubAccordion, setActiveSubAccordion] = useState<string | null>(null);
const [searchQuery, setSearchQuery] = useState('');

const toggleDropdown = (dropdown: string) => {
setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
};

const toggleAccordion = (section: string) => {
setActiveAccordion(activeAccordion === section ? null : section);
};

const toggleSubAccordion = (section: string) => {
setActiveSubAccordion(prev => (prev === section ? null : section));
};


return (
<nav className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg">
{/* Top Bar */}
<div className="bg-[#1547A0] py-2">
<div className="container mx-auto px-4 flex justify-between items-center text-sm">
<div className="flex gap-6">
<a href="/track-order" className="hover:text-blue-200 transition-colors">Track Order</a>
<a href="/help" className="hover:text-blue-200 transition-colors">Help Center</a>
</div>
<div className="flex gap-4">
<a href="/sell" className="hover:text-blue-200 transition-colors">Sell on Gulime</a>
<a href="/deals" className="hover:text-blue-200 transition-colors font-semibold">🔥 Today&apos;s Deals</a>
</div>
</div>
</div>

{/* Main Navbar */}
<div className="container mx-auto px-4 py-4">
<div className="flex items-center justify-between gap-4">
{/* Logo */}
<Link href="/" className="flex items-center gap-2">
<Image src='/images/gulime.png'
loading="eager"
priority alt="Gulime Logo"   
width={200} height={200}



/>
</Link>

{/* Search Bar - Desktop */}
<div className="hidden md:flex flex-1 max-w-2xl mx-8">
<div className="relative w-full">
<input
type="text"
placeholder="Search for products, cars, electronics..."
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
className="w-full px-4 py-3 rounded-l-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
/>
<button className="absolute right-0 top-0 h-full px-6 bg-blue-500 hover:bg-orange-600  transition-colors">
<Search size={20} />
</button>
</div>
</div>

{/* Right Icons */}
<div className="hidden md:flex items-center gap-6">
<a href="/account" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
<User size={24} />
<span className="font-medium">Account</span>
</a>
<a href="/cart" className="relative flex items-center gap-2 hover:text-blue-200 transition-colors">
<ShoppingCart size={24} />
<span className="font-medium">Cart</span>
<span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
3
</span>
</a>
</div>

{/* Mobile Menu Button */}
<button 
className="md:hidden"
onClick={() => setMenuOpen(!menuOpen)}
>
{menuOpen ? <X size={28} /> : <Menu size={28} />}
</button>
</div>

{/* Search Bar - Mobile */}
<div className="md:hidden mt-4">
<div className="relative w-full">
<input
type="text"
placeholder="Search products..."
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
className="w-full px-4 py-3 rounded-l-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
/>
<button className="absolute right-0 top-0 h-full px-6 bg-blue-500 hover:bg-orange-600  transition-colors">
<Search size={18} />
</button>
</div>
</div>
</div>

{/* Categories Navigation */}
<div className="bg-[#1547A0]">
<div className="container mx-auto px-4">
<div className="hidden md:flex items-center justify-between py-3 text-sm font-medium">

<div className="relative group">
  <button className="w-full flex items-center justify-between py-2 hover:text-blue-200">
    Electronics
    <ChevronDown size={16} />
  </button>

  <div className="absolute left-0 mt-2 w-[800px] bg-blue-900 text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg p-4 grid grid-cols-5 gap-4 z-50">
    {/* Smartphones */}
    <div>
      <h4 className="font-semibold mb-2 text-white">Smartphones</h4>
      <Link href="/phones/apple" className="block py-1 hover:text-white">Apple</Link>
      <Link href="/phones/samsung" className="block py-1 hover:text-white">Samsung</Link>
      <Link href="/phones/google" className="block py-1 hover:text-white">Google</Link>
      <Link href="/phones/oneplus" className="block py-1 hover:text-white">OnePlus</Link>
      <Link href="/phones/xiaomi" className="block py-1 hover:text-white">Xiaomi</Link>
    </div>

    {/* Laptops */}
    <div>
      <h4 className="font-semibold mb-2 text-white">Laptops</h4>
      <Link href="/laptops/apple" className="block py-1 hover:text-white">Apple</Link>
      <Link href="/laptops/dell" className="block py-1 hover:text-white">Dell</Link>
      <Link href="/laptops/asus" className="block py-1 hover:text-white">Asus</Link>
      <Link href="/laptops/msi" className="block py-1 hover:text-white">MSI</Link>
      <Link href="/laptops/razer" className="block py-1 hover:text-white">Razer</Link>
    </div>

    {/* Cameras */}
    <div>
      <h4 className="font-semibold mb-2 text-white">Cameras</h4>
      <Link href="/cameras/canon" className="block py-1 hover:text-white">Canon</Link>
      <Link href="/cameras/nikon" className="block py-1 hover:text-white">Nikon</Link>
      <Link href="/cameras/sony" className="block py-1 hover:text-white">Sony</Link>
      <Link href="/cameras/fujifilm" className="block py-1 hover:text-white">Fujifilm</Link>
    </div>

    {/* Audio */}
    <div>
      <h4 className="font-semibold mb-2 text-white">Audio</h4>
      <Link href="/audio/headphones" className="block py-1 hover:text-white">Headphones</Link>
      <Link href="/audio/speakers" className="block py-1 hover:text-white">Speakers</Link>
      <Link href="/audio/microphones" className="block py-1 hover:text-white">Microphones</Link>
      <Link href="/audio/mixers" className="block py-1 hover:text-white">Mixers & Interfaces</Link>
    </div>

    {/* Gaming */}
    <div>
      <h4 className="font-semibold mb-2 text-white">Gaming</h4>
      <Link href="/gaming/xbox" className="block py-1 hover:text-white">Xbox</Link>
      <Link href="/gaming/playstation" className="block py-1 hover:text-white">PlayStation</Link>
      <Link href="/gaming/nintendo" className="block py-1 hover:text-white">Nintendo</Link>
      <Link href="/gaming/pc" className="block py-1 hover:text-white">PC</Link>
      <Link href="/gaming/vr" className="block py-1 hover:text-white">VR Gear</Link>
    </div>
  </div>
</div>


{/* Vehicles Dropdown */}
<div className="relative">
<button
onClick={() => toggleDropdown('vehicles')}
className="flex items-center gap-1 hover:text-blue-200 transition-colors py-2"
>
Vehicles
<ChevronDown
size={16}
className={`transition-transform duration-300 ${
activeDropdown === 'vehicles' ? 'rotate-180' : ''
}`}
/>
</button>

<AnimatePresence>
{activeDropdown === 'vehicles' && (
<motion.div
initial={{ opacity: 0, y: -10, scale: 0.95 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: -10, scale: 0.95 }}
transition={{ duration: 0.2, ease: 'easeOut' }}
className="absolute left-0 top-full bg-white text-gray-800 rounded-lg shadow-xl w-64 py-2 z-50"
>
<a href="/cars" className="block px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors">Cars</a>
<a href="/motorcycles" className="block px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors">Motorcycles</a>
<a href="/trucks" className="block px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors">Trucks & SUVs</a>
<a href="/parts" className="block px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors">Auto Parts</a>
<a href="/accessories" className="block px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors">Accessories</a>
</motion.div>
)}
</AnimatePresence>
</div>

{/* Fashion Dropdown */}
<div className="relative">
<button
onClick={() => toggleDropdown('fashion')}
className="flex items-center gap-1 hover:text-blue-200 transition-colors py-2"
>
Fashion
<ChevronDown
size={16}
className={`transition-transform duration-300 ${
activeDropdown === 'fashion' ? 'rotate-180' : ''
}`}
/>
</button>

<AnimatePresence>
{activeDropdown === 'fashion' && (
<motion.div
initial={{ opacity: 0, y: -10, scale: 0.95 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: -10, scale: 0.95 }}
transition={{ duration: 0.2, ease: 'easeOut' }}
className="absolute left-0 top-full bg-white text-gray-800 rounded-lg shadow-xl w-64 py-2 z-50"
>
<a href="/mens" className="block px-4 py-2 hover:bg-blue-50 transition-colors">Men&apos;s Clothing</a>
<a href="/womens" className="block px-4 py-2 hover:bg-blue-50 transition-colors">Women&apos;s Clothing</a>
<a href="/shoes" className="block px-4 py-2 hover:bg-blue-50 transition-colors">Shoes</a>
<a href="/watches" className="block px-4 py-2 hover:bg-blue-50 transition-colors">Watches</a>
<a href="/jewelry" className="block px-4 py-2 hover:bg-blue-50 transition-colors">Jewelry</a>
</motion.div>
)}
</AnimatePresence>
</div>

<a href="/home-garden" className="hover:text-blue-200 transition-colors py-2">Home & Garden</a>
<a href="/sports" className="hover:text-blue-200 transition-colors py-2">Sports & Outdoors</a>
<a href="/books" className="hover:text-blue-200 transition-colors py-2">Books</a>
<a href="/toys" className="hover:text-blue-200 transition-colors py-2">Toys & Games</a>
<a href="/categories" className="hover:text-blue-200 transition-colors py-2 font-semibold">All Categories</a>
</div>

{/* Mobile Menu */}
{menuOpen && (
<div className="md:hidden py-4 space-y-2">
<a href="/account" className="flex items-center gap-2 py-2 hover:text-blue-200">
<User size={20} />
Account
</a>
<a href="/cart" className="flex items-center gap-2 py-2 hover:text-blue-200">
<ShoppingCart size={20} />
Cart (3)
</a>

<div className="border-t border-blue-600 my-2 pt-2">
{/* Electronics Accordion */}
<button
onClick={() => toggleAccordion('electronics')}
aria-expanded={activeAccordion === 'electronics'}
aria-controls="electronics-panel"
className="w-full flex items-center justify-between py-2 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
>
<span className="font-semibold">Electronics</span>
<ChevronDown
size={16}
className={`transition-transform duration-300 ${
activeAccordion === 'electronics' ? 'rotate-180' : ''
}`}
/>
</button>

<AnimatePresence initial={false}>
{activeAccordion === 'electronics' && (
<motion.div
id="electronics-panel"
initial={{ height: 0, opacity: 0 }}
animate={{ height: 'auto', opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.25, ease: 'easeOut' }}
className="overflow-hidden pl-4 space-y-1"
>
{/* Smartphones Accordion */}
<div className="border-l border-blue-700 mt-2">
<button
onClick={() => toggleSubAccordion('smartphones')}
aria-expanded={activeSubAccordion === 'smartphones'}
aria-controls="smartphones-panel"
className="w-full flex items-center justify-between py-1 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
>
<span className="font-semibold"> Smartphones</span>
<ChevronDown
size={14}
className={`transition-transform duration-300 ${
activeSubAccordion === 'smartphones' ? 'rotate-180' : ''
}`}
/>
</button>

<AnimatePresence initial={false}>
{activeSubAccordion === 'smartphones' && (
<motion.div
id="smartphones-panel"
initial={{ height: 0, opacity: 0 }}
animate={{ height: 'auto', opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.25, ease: 'easeOut' }}
className="overflow-hidden pl-4 space-y-1 text-sm text-blue-200"
>
<a href="/phones/apple" className="block py-1 hover:text-white">Apple</a>
<a href="/phones/samsung" className="block py-1 hover:text-white"> Samsung</a>
<a href="/phones/sony" className="block py-1 hover:text-white"> Sony</a>
<a href="/phones/google" className="block py-1 hover:text-white"> Google</a>
<a href="/phones/oneplus" className="block py-1 hover:text-white"> Oneplus</a>
<a href="/phones/xiaomi" className="block py-1 hover:text-white"> Xiaomi</a>
<a href="/phones/huawei" className="block py-1 hover:text-white"> Huawei</a>
<a href="/phones/razer" className="block py-1 hover:text-white"> Razer</a>
<a href="/phones/asus" className="block py-1 hover:text-white"> Asus(ROG Phone)</a>
</motion.div>
)}
</AnimatePresence>
</div>
<div className="border-l border-blue-700 mt-2">
<button
onClick={() => toggleSubAccordion('laptops')}
aria-expanded={activeSubAccordion === 'laptops'}
aria-controls="laptops-panel"
className="w-full flex items-center justify-between py-1 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
>
<span className="font-semibold"> Laptops</span>
<ChevronDown
size={14}
className={`transition-transform duration-300 ${
activeSubAccordion === 'laptops' ? 'rotate-180' : ''
}`}
/>
</button>

<AnimatePresence initial={false}>
{activeSubAccordion === 'laptops' && (
<motion.div
id="laptops-panel"
initial={{ height: 0, opacity: 0 }}
animate={{ height: 'auto', opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.25, ease: 'easeOut' }}
className="overflow-hidden pl-4 space-y-1 text-sm text-blue-200"
>
<Link href="/laptops/apple" className="block py-1 hover:text-white"> Apple</Link>
<Link href="/laptops/dell" className="block py-1 hover:text-white">Dell</Link>
<Link href="/laptops/alienware" className="block py-1 hover:text-white"> Alienware</Link>
<Link href="/laptops/hp" className="block py-1 hover:text-white"> HP</Link>
<Link href="/laptops/hpomen" className="block py-1 hover:text-white"> HP Omen</Link>
<Link href="/laptops/gigabyte" className="block py-1 hover:text-white"> Gigabyte / Aorus</Link>
<Link href="/laptops/asus" className="block py-1 hover:text-white"> Asus</Link>
<Link href="/laptops/samsung" className="block py-1 hover:text-white"> Samsung</Link>
<Link href="/laptops/msi" className="block py-1 hover:text-white"> MSI</Link>
<Link href="/laptops/acer" className="block py-1 hover:text-white"> Acer</Link>
<Link href="/laptops/razer" className="block py-1 hover:text-white"> Razer</Link>
<Link href="/laptops/microsoft" className="block py-1 hover:text-white"> Microsoft</Link>
<Link href="/laptops/lenovo" className="block py-1 hover:text-white"> Lenovo</Link>
<Link href="/laptops/razer" className="block py-1 hover:text-white"> Razer</Link>
</motion.div>
)}
</AnimatePresence>
</div>
<div className="border-l border-blue-700 mt-2">
<button
onClick={() => toggleSubAccordion('cameras')}
aria-expanded={activeSubAccordion === 'cameras'}
aria-controls="cameras-panel"
className="w-full flex items-center justify-between py-1 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
>
<span className="font-semibold">Cameras</span>
<ChevronDown
size={14}
className={`transition-transform duration-300 ${
activeSubAccordion === 'cameras' ? 'rotate-180' : ''
}`}
/>
</button>

<AnimatePresence initial={false}>
{activeSubAccordion === 'cameras' && (
<motion.div
id="cameras-panel"
initial={{ height: 0, opacity: 0 }}
animate={{ height: 'auto', opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.25, ease: 'easeOut' }}
className="overflow-hidden pl-4 space-y-1 text-sm text-blue-200"
>
<Link href="/cameras/canon" className="block py-1 hover:text-white"> Canon</Link>
<Link href="/cameras/nikon" className="block py-1 hover:text-white"> Nikon</Link>
<Link href="/cameras/sony" className="block py-1 hover:text-white"> Sony</Link>
<Link href="/cameras/fujifilm" className="block py-1 hover:text-white"> Fujifilm</Link>
<Link href="/cameras/panasonic" className="block py-1 hover:text-white"> Panasonic</Link>
<Link href="/cameras/olympus" className="block py-1 hover:text-white"> Olympus / OM System</Link>
<Link href="/cameras/pentax" className="block py-1 hover:text-white"> Pentax</Link>
<Link href="/cameras/leica" className="block py-1 hover:text-white">Leica</Link>
</motion.div>
)}
</AnimatePresence>
</div>

{/* Audio Accordion inside Electronics */}
<div className="border-l border-blue-700  mt-2">
<button
onClick={() => toggleSubAccordion('audio')}

aria-expanded={activeSubAccordion === 'audio'}
aria-controls="audio-panel"
className="w-full flex items-center justify-between py-1 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
>
<span className="font-semibold">Audio</span>
<ChevronDown
size={14}
className={`transition-transform duration-300 ${
activeSubAccordion === 'audio' ? 'rotate-180' : ''
}`}
/>
</button>

<AnimatePresence initial={false}>
{activeSubAccordion === 'audio' && (
<motion.div
id="audio-panel"
initial={{ height: 0, opacity: 0 }}
animate={{ height: 'auto', opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.25, ease: 'easeOut' }}
className="overflow-hidden pl-4 space-y-1 text-sm text-blue-200"
>
<a href="/audio/headphones" className="block py-1 hover:text-white">Headphones</a>
<a href="/audio/speakers" className="block py-1 hover:text-white">Speakers</a>
<a href="/audio/microphones" className="block py-1 hover:text-white">Microphones</a>
<a href="/audio/mixers" className="block py-1 hover:text-white">Mixers & Interfaces</a>
<a href="/audio/amplifiers" className="block py-1 hover:text-white">Amplifiers</a>
<a href="/audio/recording" className="block py-1 hover:text-white">Recording Gear</a>
<a href="/audio/streaming" className="block py-1 hover:text-white">Streaming Gear</a>

</motion.div>
)}
</AnimatePresence>
</div>

{/* Gaming Accordion inside Electronics */}
<div className="border-l border-blue-700  mt-2">
<button
onClick={() => toggleSubAccordion('gaming')}

aria-expanded={activeSubAccordion === 'gaming'}
aria-controls="gaming"
className="w-full flex items-center justify-between py-1 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
>
<span className="font-semibold"> Gaming</span>
<ChevronDown
size={14}
className={`transition-transform duration-300 ${
activeSubAccordion === 'gaming' ? 'rotate-180' : ''
}`}
/>
</button>

<AnimatePresence initial={false}>
{activeSubAccordion === 'gaming' && (
<motion.div
id="gaming"
initial={{ height: 0, opacity: 0 }}
animate={{ height: 'auto', opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.25, ease: 'easeOut' }}
className="overflow-hidden pl-4 space-y-1 text-sm text-blue-200"
>
<Link href="/gaming/xbox" className="block py-1 hover:text-white">Xbox</Link>
<Link href="/gaming/playstation" className="block py-1 hover:text-white">PlayStation</Link>
<Link href="/gaming/nintendo" className="block py-1 hover:text-white">Nintendo</Link>
<Link href="/gaming/pc" className="block py-1 hover:text-white">PC</Link>
<Link href="/gaming/steamdeck" className="block py-1 hover:text-white">Steam Deck</Link>
<Link href="/gaming/vr" className="block py-1 hover:text-white">VR Consoles & Gear</Link>
<Link href="/gaming/retro" className="block py-1 hover:text-white">Retro & Classic</Link>
<Link href="/gaming/controllers" className="block py-1 hover:text-white">Controllers & Gamepads</Link>
<Link href="/gaming/headsets" className="block py-1 hover:text-white">Gaming Headsets</Link>
<Link href="/gaming/keyboards-mice" className="block py-1 hover:text-white">Keyboards & Mice</Link>
<Link href="/gaming/monitors" className="block py-1 hover:text-white">Gaming Monitors</Link>

</motion.div>
)}
</AnimatePresence>
</div>
</motion.div>
)}
</AnimatePresence>
</div>



<div className="border-t border-blue-600 pt-2">
<button
onClick={() => toggleAccordion('vehicles')}
className="w-full flex items-center justify-between py-2 hover:text-blue-200"
>
Vehicles
<ChevronDown
size={16}
className={`transition-transform duration-300 ${
activeAccordion === 'vehicles' ? 'rotate-180' : ''
}`}
/>
</button>

<AnimatePresence initial={false}>
{activeAccordion === 'vehicles' && (
<motion.div
initial={{ height: 0, opacity: 0 }}
animate={{ height: 'auto', opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.25, ease: 'easeOut' }}
className="overflow-hidden pl-4 space-y-1 text-sm text-blue-200"
>
{/* Vehicle Types */}
<Link href="/vehicles/cars" className="block py-1 hover:text-white">Cars</Link>
<Link href="/vehicles/trucks-suvs" className="block py-1 hover:text-white">Trucks & SUVs</Link>
<Link href="/vehicles/motorcycles" className="block py-1 hover:text-white">Motorcycles</Link>
<Link href="/vehicles/electric" className="block py-1 hover:text-white">Electric Vehicles</Link>
<Link href="/vehicles/rare-collectibles" className="block py-1 hover:text-white">Rare & Collectible</Link>

{/* Popular Brands */}
<div className="pt-1 border-t border-blue-500 space-y-1">
<span className="font-semibold block py-1 text-white">Popular Brands</span>
<Link href="/vehicles/brands/tesla" className="block py-1 hover:text-white">Tesla</Link>
<Link href="/vehicles/brands/ford" className="block py-1 hover:text-white">Ford</Link>
<Link href="/vehicles/brands/toyota" className="block py-1 hover:text-white">Toyota</Link>
<Link href="/vehicles/brands/honda" className="block py-1 hover:text-white">Honda</Link>
<Link href="/vehicles/brands/chevrolet" className="block py-1 hover:text-white">Chevrolet</Link>
<Link href="/vehicles/brands/bmw" className="block py-1 hover:text-white">BMW</Link>
<Link href="/vehicles/brands/mercedes" className="block py-1 hover:text-white">Mercedes-Benz</Link>
<Link href="/vehicles/brands/audi" className="block py-1 hover:text-white">Audi</Link>
</div>

{/* Optional: Handheld & Specialty */}
<div className="pt-1 border-t border-blue-500 space-y-1">
<span className="font-semibold block py-1 text-white">Special Categories</span>
<Link href="/vehicles/motorhomes" className="block py-1 hover:text-white">Motorhomes & RVs</Link>
<Link href="/vehicles/atvs" className="block py-1 hover:text-white">ATVs & Off-Road</Link>
<Link href="/vehicles/buses" className="block py-1 hover:text-white">Buses</Link>
</div>
</motion.div>
)}
</AnimatePresence>
</div>



<div className="border-t border-blue-600 pt-2">
<button
onClick={() => toggleAccordion('fashion')}
className="w-full flex items-center justify-between py-2 hover:text-blue-200"
>
Fashion
<ChevronDown
size={16}
className={`transition-transform duration-300 ${
activeAccordion === 'fashion' ? 'rotate-180' : ''
}`}
/>
</button>

<AnimatePresence initial={false}>
{activeAccordion === 'fashion' && (
<motion.div
initial={{ height: 0, opacity: 0 }}
animate={{ height: 'auto', opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.25, ease: 'easeOut' }}
className="overflow-hidden pl-4 space-y-1 text-sm text-blue-200"
>
<Link href="/fashion/men" className="block py-1 hover:text-white">Men</Link>
<Link href="/fashion/women" className="block py-1 hover:text-white">Women</Link>
<Link href="/fashion/kids" className="block py-1 hover:text-white">Kids</Link>
<Link href="/fashion/shoes" className="block py-1 hover:text-white">Shoes</Link>
<Link href="/fashion/accessories" className="block py-1 hover:text-white">Accessories</Link>
<Link href="/fashion/jewelry" className="block py-1 hover:text-white">Jewelry</Link>
<Link href="/fashion/sale" className="block py-1 hover:text-white">Sale & Clearance</Link>
</motion.div>
)}
</AnimatePresence>
</div>
<div className="border-t border-blue-600 pt-2">
<button
onClick={() => toggleAccordion('homeGarden')}
className="w-full flex items-center justify-between py-2 hover:text-blue-200"
>
Home & Garden
<ChevronDown
size={16}
className={`transition-transform duration-300 ${
activeAccordion === 'homeGarden' ? 'rotate-180' : ''
}`}
/>
</button>

<AnimatePresence initial={false}>
{activeAccordion === 'homeGarden' && (
<motion.div
initial={{ height: 0, opacity: 0 }}
animate={{ height: 'auto', opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.25, ease: 'easeOut' }}
className="overflow-hidden pl-4 space-y-1 text-sm text-blue-200"
>
<Link href="/home-garden/furniture" className="block py-1 hover:text-white">Furniture</Link>
<Link href="/home-garden/kitchen" className="block py-1 hover:text-white">Kitchen & Dining</Link>
<Link href="/home-garden/decor" className="block py-1 hover:text-white">Home Decor</Link>
<Link href="/home-garden/garden" className="block py-1 hover:text-white">Garden & Outdoor</Link>
<Link href="/home-garden/bedding" className="block py-1 hover:text-white">Bedding & Bath</Link>
<Link href="/home-garden/storage" className="block py-1 hover:text-white">Storage & Organization</Link>
<Link href="/home-garden/tools" className="block py-1 hover:text-white">Tools & Hardware</Link>
</motion.div>
)}
</AnimatePresence>
</div>

<div className="border-t border-blue-600 pt-2">
<button
onClick={() => toggleAccordion('sports')}
className="w-full flex items-center justify-between py-2 hover:text-blue-200"
>
Sports
<ChevronDown
size={16}
className={`transition-transform duration-300 ${
activeAccordion === 'sports' ? 'rotate-180' : ''
}`}
/>
</button>

<AnimatePresence initial={false}>
{activeAccordion === 'sports' && (
<motion.div
initial={{ height: 0, opacity: 0 }}
animate={{ height: 'auto', opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.25, ease: 'easeOut' }}
className="overflow-hidden pl-4 space-y-1 text-sm text-blue-200"
>
<Link href="/sports/fitness" className="block py-1 hover:text-white">Fitness & Exercise</Link>
<Link href="/sports/outdoor" className="block py-1 hover:text-white">Outdoor Sports</Link>
<Link href="/sports/team-sports" className="block py-1 hover:text-white">Team Sports</Link>
<Link href="/sports/equipment" className="block py-1 hover:text-white">Equipment & Gear</Link>
</motion.div>
)}
</AnimatePresence>
</div>
<div className="border-t border-blue-600 pt-2">
<button
onClick={() => toggleAccordion('books')}
className="w-full flex items-center justify-between py-2 hover:text-blue-200"
>
Books
<ChevronDown
size={16}
className={`transition-transform duration-300 ${
activeAccordion === 'books' ? 'rotate-180' : ''
}`}
/>
</button>

<AnimatePresence initial={false}>
{activeAccordion === 'books' && (
<motion.div
initial={{ height: 0, opacity: 0 }}
animate={{ height: 'auto', opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.25, ease: 'easeOut' }}
className="overflow-hidden pl-4 space-y-1 text-sm text-blue-200"
>
<Link href="/books/fiction" className="block py-1 hover:text-white">Fiction</Link>
<Link href="/books/non-fiction" className="block py-1 hover:text-white">Non-Fiction</Link>
<Link href="/books/children" className="block py-1 hover:text-white">Children&apos;s Books</Link>
<Link href="/books/education" className="block py-1 hover:text-white">Education & Textbooks</Link>
<Link href="/books/comics" className="block py-1 hover:text-white">Comics & Graphic Novels</Link>
</motion.div>
)}
</AnimatePresence>
</div>
<div className="border-t border-blue-600 pt-2">
<button
onClick={() => toggleAccordion('toys')}
className="w-full flex items-center justify-between py-2 hover:text-blue-200"
>
Toys & Games
<ChevronDown
size={16}
className={`transition-transform duration-300 ${
activeAccordion === 'toys' ? 'rotate-180' : ''
}`}
/>
</button>

<AnimatePresence initial={false}>
{activeAccordion === 'toys' && (
<motion.div
initial={{ height: 0, opacity: 0 }}
animate={{ height: 'auto', opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.25, ease: 'easeOut' }}
className="overflow-hidden pl-4 space-y-1 text-sm text-blue-200"
>
<Link href="/toys/action-figures" className="block py-1 hover:text-white">Action Figures & Dolls</Link>
<Link href="/toys/board-games" className="block py-1 hover:text-white">Board Games & Puzzles</Link>
<Link href="/toys/outdoor" className="block py-1 hover:text-white">Outdoor & Sports Toys</Link>
<Link href="/toys/electronic" className="block py-1 hover:text-white">Electronic & Robotic Toys</Link>
<Link href="/toys/educational" className="block py-1 hover:text-white">Educational Toys</Link>
</motion.div>
)}
</AnimatePresence>
</div>
<Link href="/categories" className="block py-2 border-t border-blue-600 pt-2 hover:text-blue-200 font-bold">All Categories</Link>
</div>
)}
</div>
</div>
</nav>
);
}