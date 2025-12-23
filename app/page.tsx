'use client';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import supabase from "./supabase/supabase";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";

interface Product {
id: string;
created_at: string;
updated_at: string;
name: string;
slug: string;
description: string;
short_description?: string;
sku: string;
barcode?: string;
price: number;
compare_price?: number;
cost_price?: number;
retail_price?: number;
weight?: number;
weight_unit?: string;
stock_quantity: number;
low_stock_threshold?: number;
track_inventory: boolean;
allow_backorder: boolean;
tax_rate?: number;
tax_class?: string;
shipping_class?: string;
length?: number;
width?: number;
height?: number;
dimension_unit?: string;
image_url?: string;
gallery_images?: string;
category_id?: string;
brand?: string;
tags?: string;
featured: boolean;
is_active: boolean;
is_digital: boolean;
meta_title?: string;
meta_description?: string;
search_score?: number;
total_sales?: number;
view_count?: number;
rating_average?: number;
rating_count?: number;
vendor_id?: string;
created_by?: string;
updated_by?: string;
}

export default function Home() {
const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
const [products, setProducts] = useState<Product[]>([]);
const [currentSlide, setCurrentSlide] = useState(0);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
fetchProducts();
}, []);

async function fetchProducts() {
try {
setLoading(true);

// Fetch featured products for carousel
const { data: featured, error: featuredError } = await supabase
  .from("dashboard_products")
  .select("*")
  .eq("featured", true)
  .eq("is_active", true)
  .limit(5);


if (featuredError) throw featuredError;
setFeaturedProducts(featured || []);

// Fetch all products
const { data, error: productsError } = await supabase
  .from("dashboard_products")
  .select("*")
  .eq("is_active", true)
  .order("created_at", { ascending: false })
  .limit(20);
if (productsError) throw productsError;
setProducts(data || []);
} catch (err) {
setError("Failed to load products");
console.error(err);
} finally {
setLoading(false);
}
}


const nextSlide = () => {
setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
};

const prevSlide = () => {
setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
};

// useEffect(() => {
// if (featuredProducts.length > 1) {
// const timer = setInterval(nextSlide, 5000);
// return () => clearInterval(timer);
// }
// }, [featuredProducts.length]);

const calculateDiscount = (price: number, comparePrice?: number) => {
if (!comparePrice || comparePrice <= price) return null;
return Math.round(((comparePrice - price) / comparePrice) * 100);
};

const ProductCard = ({ product }: { product: Product }) => {
const discount = calculateDiscount(product.price, product.compare_price);

return (
<div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
<div className="relative overflow-hidden aspect-square bg-gray-100">
{product.image_url ? (
<img 
src={product.image_url} 
alt={product.name}
className="w-full  object-cover group-hover:scale-105 transition-transform duration-300"
/>
) : (
<div className="absolute inset-0 bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center">
<span className="text-gray-400 text-sm">No image</span>
</div>
)}

{discount && (
<div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold z-10">
-{discount}%
</div>
)}

<button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors z-10">
<Heart className="w-4 h-4 text-gray-600" />
</button>
</div>

<div className="p-4">
<div className="text-xs text-gray-500 mb-1">{product.brand || 'Brand'}</div>
<h3 className="font-semibold text-sm mb-2 line-clamp-2 h-10">{product.name}</h3>

{product.rating_average && (
<div className="flex items-center gap-1 mb-2">
<div className="flex">
{[...Array(5)].map((_, i) => (
<Star
key={i}
className={`w-3 h-3 ${
i < Math.floor(product.rating_average || 0)
? 'fill-yellow-400 text-yellow-400'
: 'text-gray-300'
}`}
/>
))}
</div>
<span className="text-xs text-gray-600">({product.rating_count || 0})</span>
</div>
)}

<div className="flex items-baseline gap-2 mb-3">
<span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
{product.compare_price && product.compare_price > product.price && (
<span className="text-sm text-gray-500 line-through">
${product.compare_price.toFixed(2)}
</span>
)}
</div>

{product.stock_quantity > 0 ? (
<button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2">
<ShoppingCart className="w-4 h-4" />
Add to Cart
</button>
) : (
<button disabled className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg font-medium text-sm cursor-not-allowed">
Out of Stock
</button>
)}
</div>
</div>
);
};

if (loading) {
return (
<>
<Navbar />
<div className="min-h-screen bg-gray-50 flex items-center justify-center">
<div className="text-center">
<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
<p className="text-gray-600">Loading products...</p>
</div>
</div>
<Footer />
</>
);
}

if (error) {
return (
<>
<Navbar />
<div className="min-h-screen bg-gray-50 flex items-center justify-center">
<div className="text-center">
<p className="text-red-600 mb-4">{error}</p>
<button 
onClick={fetchProducts}
className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
>
Retry
</button>
</div>
</div>
<Footer />
</>
);
}

return (
<>
<Navbar />
<div className="min-h-screen bg-gray-50">
{/* Hero Carousel */}
{featuredProducts.length > 0 && (
<div className="relative h-96 overflow-hidden bg-linear-to-r from-blue-600 to-purple-600">
<div className="absolute inset-0">
{featuredProducts.map((product, index) => (
<div
key={product.id}
className={`absolute inset-0 transition-opacity duration-500 ${
index === currentSlide ? 'opacity-100' : 'opacity-0'
}`}
>
{product.image_url && (
<img 
src={product.image_url} 
alt={product.name}
className="absolute inset-0 w-full h-full object-cover opacity-30"
/>
)}
<div className="relative container mx-auto px-4 h-full flex items-center">
<div className="max-w-xl text-white">
<div className="inline-block bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-bold mb-4">
Featured Deal
</div>
<h2 className="text-5xl font-bold mb-4">{product.name}</h2>
<p className="text-xl mb-6 opacity-90">
{product.short_description || product.description}
</p>
<div className="flex items-baseline gap-4 mb-6">
<span className="text-4xl font-bold">${product.price.toFixed(2)}</span>
{product.compare_price && product.compare_price > product.price && (
<span className="text-2xl line-through opacity-75">
${product.compare_price.toFixed(2)}
</span>
)}
</div>
<Link href={`/Details/${product.id}`} className="block w-full">
<button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
Shop Now
</button>
</Link>
</div>
</div>
</div>
))}
</div>

{featuredProducts.length > 1 && (
<>
<button
onClick={prevSlide}
className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
>
<ChevronLeft className="w-6 h-6 text-gray-900" />
</button>
<button
onClick={nextSlide}
className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
>
<ChevronRight className="w-6 h-6 text-gray-900" />
</button>

<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
{featuredProducts.map((_, index) => (
<button
key={index}
onClick={() => setCurrentSlide(index)}
className={`w-3 h-3 rounded-full transition-all ${
index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
}`}
/>
))}
</div>
</>
)}
</div>
)}

{/* Products Grid */}
<div className="container mx-auto px-4 py-8">
{/* Today's Deals */}
{products.length > 0 && (
<section className="mb-12">
<div className="flex items-center justify-between mb-6">
<h2 className="text-2xl font-bold">Today's Deals</h2>
<a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
See all
</a>
</div>
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
{products.slice(0, 5).map((product) => (
<ProductCard key={product.id} product={product} />
))}
</div>
</section>
)}

{/* Recommended Products */}
{products.length > 5 && (
<section className="mb-12">
<div className="flex items-center justify-between mb-6">
<h2 className="text-2xl font-bold">Recommended for You</h2>
<a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
See all
</a>
</div>
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
{products.slice(5, 10).map((product) => (
<ProductCard key={product.id} product={product} />
))}
</div>
</section>
)}

{/* All Products */}
{products.length > 10 && (
<section>
<h2 className="text-2xl font-bold mb-6">All Products</h2>
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
{products.slice(10).map((product) => (
<ProductCard key={product.id} product={product} />
))}
</div>
</section>
)}

{products.length === 0 && (
<div className="text-center py-12">
<p className="text-gray-600 text-lg">No products available at the moment.</p>
</div>
)}
</div>
</div>
<Footer />
</>
);
}