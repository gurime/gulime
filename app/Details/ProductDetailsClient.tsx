'use client'
import React, { useState, useEffect } from 'react';

import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, ChevronRight, MapPin, Minus, Plus, Check } from 'lucide-react';
import { useParams } from 'next/navigation';
import supabase from '@/app/supabase/supabase';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Image from 'next/image';

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
gallery_images_text?: string; // Fixed: Changed from gallery_images
gallery_images?: string; // Keep for backward compatibility
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



export default function ProductDetailsClient({ product }: { product: Product }) {
const [selectedImage, setSelectedImage] = useState<string>(product.image_url || '');
const [quantity, setQuantity] = useState(1);
const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
const { id } = useParams<{ id: string }>();
const [productState, setProduct] = useState<Product | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
fetchProduct();
}, [id]);

async function fetchProduct() {
try {
setLoading(true);
const { data, error: fetchError } = await supabase
.from('dashboard_products')
.select('*')
.eq('id', id)
.single();

if (fetchError) throw fetchError;

setProduct(data);
setSelectedImage(data?.image_url || '');
} catch (err) {
setError('Failed to load product');
console.error(err);
} finally {
setLoading(false);
}
}

const calculateDiscount = () => {
if (!product?.compare_price || product.compare_price <= product.price) return null;
return Math.round(((product.compare_price - product.price) / product.compare_price) * 100);
};

const getGalleryImages = () => {
  if (!product) return [];

  const images: string[] = [];

  // Add main image first
  const mainImage = typeof product.image_url === "string" ? product.image_url.trim() : null;

  if (mainImage) {
    images.push(mainImage);
  }

  // Get gallery images from either column name
  const galleryData = product.gallery_images_text || product.gallery_images;

  console.log('Raw gallery data:', galleryData);
  console.log('Type of gallery data:', typeof galleryData);

  if (galleryData) {
    let gallery: string[] = [];

    // If it's already an array (Supabase might parse JSON automatically)
    if (Array.isArray(galleryData)) {
      gallery = galleryData.filter(img => typeof img === 'string' && img.trim()).map(img => img.trim());
    } else if (typeof galleryData === 'string') {
      // Try parsing as JSON first
      try {
        const parsed = JSON.parse(galleryData);

        if (Array.isArray(parsed)) {
          gallery = parsed.filter(img => typeof img === 'string' && img.trim()).map(img => img.trim());
        } else if (typeof parsed === "string") {
          // If it's a JSON string that contains a comma-separated list
          gallery.push(
            ...parsed
              .split(",")
              .map((img) => img.trim())
              .filter(Boolean)
          );
        }
      } catch {
        // Fallback: treat as comma-separated string or newline-separated
        const separator = galleryData.includes("\n") ? "\n" : ",";
        gallery.push(
          ...galleryData
            .split(separator)
            .map((img) => img.trim())
            .filter(Boolean)
        );
      }
    }

    // Remove duplicate of main image and any empty strings
    gallery = gallery.filter((img) => img && img !== mainImage);

    images.push(...gallery);
  }

  console.log('Final gallery images:', images);

  return images;
};


const incrementQuantity = () => {
if (product && quantity < product.stock_quantity) {
setQuantity(quantity + 1);
}
};

const decrementQuantity = () => {
if (quantity > 1) {
setQuantity(quantity - 1);
}
};

if (loading) {
return (
<>
<Navbar />
<div className="min-h-screen bg-gray-50 flex items-center justify-center">
<div className="text-center">
<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
<p className="text-gray-600">Loading product...</p>
</div>
</div>
<Footer />
</>
);
}

if (error || !product) {
return (
<>
<Navbar />
<div className="min-h-screen bg-gray-50 flex items-center justify-center">
<div className="text-center">
<p className="text-red-600 mb-4">{error || 'Product not found'}</p>
<a href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-block">
Back to Home
</a>
</div>
</div>
<Footer />
</>
);
}

const discount = calculateDiscount();
const galleryImages = getGalleryImages();
const inStock = product.stock_quantity > 0;

// Debug: Log gallery images to console
console.log('Gallery Images:', galleryImages);
console.log('Gallery Data Raw:', product.gallery_images_text || product.gallery_images);

return (
<>
<div className="min-h-screen bg-gray-50">
{/* Breadcrumb */}
<div className="bg-white border-b">
<div className="container mx-auto px-4 py-3">
<div className="flex items-center gap-2 text-sm text-gray-600">
<a href="/" className="hover:text-blue-600">Home</a>
<ChevronRight className="w-4 h-4" />
<a href="#" className="hover:text-blue-600">{product.category_id || 'Products'}</a>
<ChevronRight className="w-4 h-4" />
<span className="text-gray-900">{product.name}</span>
</div>
</div>
</div>

<div className="container mx-auto px-4 py-8">
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
{/* Left Column - Images */}
<div className="lg:col-span-1">
<div className="sticky top-4">
{/* Main Image */}
<div className="bg-white rounded-lg p-4 mb-4 shadow">
<div className="relative aspect-square">
{selectedImage ? (
<img 
src={selectedImage} 
alt={product.name}
className="w-full h-full object-contain"
/>
) : (
<div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center rounded-lg">
<span className="text-gray-400">No image</span>
</div>
)}
{discount && (
<div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">
-{discount}% OFF
</div>
)}
</div>
</div>

{/* Thumbnail Gallery */}
{galleryImages.length > 1 && (
<div className="grid grid-cols-5 gap-2">
{galleryImages.map((img, idx) => (
<button
key={`${img}-${idx}`}
onClick={() => setSelectedImage(img)}
className={`aspect-square border-2 rounded-lg overflow-hidden transition-all ${
selectedImage === img
? "border-blue-600"
: "border-gray-200 hover:border-gray-400"
}`}
>
<img
src={img}
alt={`${product.name} view ${idx + 1}`}
className="w-full h-full object-cover"
/>
</button>
))}
</div>
)}
</div>
</div>

{/* Middle Column - Product Info */}
<div className="lg:col-span-1 space-y-4">
{product.brand && (
<a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
Visit the {product.brand} Store
</a>
)}

<h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

{/* Rating */}
{product.rating_average && (
<div className="flex items-center gap-2">
<div className="flex items-center gap-1">
<span className="text-lg font-semibold">{product.rating_average.toFixed(1)}</span>
<div className="flex">
{[...Array(5)].map((_, i) => (
<Star
key={i}
className={`w-5 h-5 ${
i < Math.floor(product.rating_average || 0)
? 'fill-yellow-400 text-yellow-400'
: 'text-gray-300'
}`}
/>
))}
</div>
</div>
<a href="#reviews" className="text-blue-600 hover:text-blue-800 text-sm">
{product.rating_count || 0} ratings
</a>
</div>
)}

<hr />

{/* Price */}
<div className="space-y-2">
<div className="flex items-baseline gap-3">
{discount && (
<span className="text-sm text-red-600 font-medium">-{discount}%</span>
)}
<span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
</div>
{product.compare_price && product.compare_price > product.price && (
<div className="flex items-center gap-2">
<span className="text-sm text-gray-500">List Price:</span>
<span className="text-sm text-gray-500 line-through">
${product.compare_price.toFixed(2)}
</span>
</div>
)}
{product.tax_rate && (
<p className="text-sm text-gray-600">
Tax: {product.tax_rate}% (included in price)
</p>
)}
</div>

<hr />

{/* Short Description */}
{product.short_description && (
<div className="prose prose-sm">
<p className="text-gray-700">{product.short_description}</p>
</div>
)}

{/* Product Features/Highlights */}
<div className="bg-gray-50 rounded-lg p-4">
<h3 className="font-semibold mb-2">Product Highlights</h3>
<ul className="space-y-2">
<li className="flex items-start gap-2 text-sm">
<Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
<span>SKU: {product.sku}</span>
</li>
{product.brand && (
<li className="flex items-start gap-2 text-sm">
<Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
<span>Brand: {product.brand}</span>
</li>
)}
{product.weight && (
<li className="flex items-start gap-2 text-sm">
<Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
<span>Weight: {product.weight} {product.weight_unit || 'kg'}</span>
</li>
)}
{product.is_digital && (
<li className="flex items-start gap-2 text-sm">
<Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
<span>Digital Product - Instant Delivery</span>
</li>
)}
</ul>
</div>

{/* Tags */}
{product.tags && typeof product.tags === 'string' && (
<div className="flex flex-wrap gap-2">
{product.tags.split(',').map((tag, index) => (
<span
key={index}
className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm text-gray-700 cursor-pointer"
>
{tag.trim()}
</span>
))}
</div>
)}
</div>

{/* Right Column - Buy Box */}
<div className="lg:col-span-1">
<div className="sticky top-4">
<div className="bg-white border rounded-lg p-6 space-y-4">
<div className="flex items-baseline gap-2">
<span className="text-3xl font-bold text-gray-900">
${product.price.toFixed(2)}
</span>
{product.compare_price && product.compare_price > product.price && (
<span className="text-sm text-gray-500 line-through">
${product.compare_price.toFixed(2)}
</span>
)}
</div>

{!product.is_digital && (
<div className="flex items-center gap-2 text-sm">
<Truck className="w-5 h-5 text-green-600" />
<span className="text-green-600 font-medium">FREE delivery</span>
<span className="text-gray-600">Wednesday, Dec 25</span>
</div>
)}

<div className="flex items-start gap-2 text-sm">
<MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
<div>
<p className="text-gray-600">Deliver to</p>
<button className="text-blue-600 hover:text-blue-800 font-medium">
Select your address
</button>
</div>
</div>

<hr />

{/* Stock Status */}
{inStock ? (
<div className="text-green-600 font-medium text-lg">In Stock</div>
) : (
<div className="text-red-600 font-medium text-lg">Currently Unavailable</div>
)}

{inStock && product.stock_quantity <= (product.low_stock_threshold || 10) && (
<p className="text-orange-600 text-sm">
Only {product.stock_quantity} left in stock - order soon
</p>
)}

{/* Quantity Selector */}
{inStock && (
<div className="flex items-center gap-3">
<label className="text-sm font-medium text-gray-700">Quantity:</label>
<div className="flex items-center border rounded-lg">
<button
onClick={decrementQuantity}
disabled={quantity <= 1}
className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
>
<Minus className="w-4 h-4" />
</button>
<span className="px-4 py-2 border-x min-w-[3rem] text-center">{quantity}</span>
<button
onClick={incrementQuantity}
disabled={quantity >= product.stock_quantity}
className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
>
<Plus className="w-4 h-4" />
</button>
</div>
</div>
)}

{/* Add to Cart Button */}
<button
disabled={!inStock}
className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
>
<ShoppingCart className="w-5 h-5" />
Add to Cart
</button>

{/* Buy Now Button */}
<button
disabled={!inStock}
className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
>
Buy Now
</button>

{/* Wishlist Button */}
<button className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
<Heart className="w-5 h-5" />
Add to Wishlist
</button>

<hr />

{/* Trust Badges */}
<div className="space-y-3 text-sm">
<div className="flex items-center gap-3">
<Shield className="w-5 h-5 text-blue-600" />
<span className="text-gray-700">Secure transaction</span>
</div>
{!product.is_digital && (
<div className="flex items-center gap-3">
<RotateCcw className="w-5 h-5 text-blue-600" />
<span className="text-gray-700">30-day returns</span>
</div>
)}
</div>
</div>
</div>
</div>
</div>

{/* Product Details Tabs */}
<div className="mt-12">
<div className="bg-white rounded-lg shadow">
{/* Tab Headers */}
<div className="border-b">
<div className="flex gap-8 px-6">
<button
onClick={() => setActiveTab('description')}
className={`py-4 border-b-2 font-medium transition-colors ${
activeTab === 'description'
? 'border-blue-600 text-blue-600'
: 'border-transparent text-gray-600 hover:text-gray-900'
}`}
>
Description
</button>
<button
onClick={() => setActiveTab('specifications')}
className={`py-4 border-b-2 font-medium transition-colors ${
activeTab === 'specifications'
? 'border-blue-600 text-blue-600'
: 'border-transparent text-gray-600 hover:text-gray-900'
}`}
>
Specifications
</button>
<button
onClick={() => setActiveTab('reviews')}
className={`py-4 border-b-2 font-medium transition-colors ${
activeTab === 'reviews'
? 'border-blue-600 text-blue-600'
: 'border-transparent text-gray-600 hover:text-gray-900'
}`}
>
Reviews ({product.rating_count || 0})
</button>
</div>
</div>

{/* Tab Content */}
<div className="p-6">
{activeTab === 'description' && (
<div className="prose prose-lg max-w-none">
<h3 className="text-xl font-bold mb-4">About this item</h3>
<p className="text-gray-700 whitespace-pre-line">{product.description}</p>
</div>
)}

{activeTab === 'specifications' && (
<div>
<h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="flex py-3 border-b">
<span className="font-medium text-gray-900 w-48">SKU</span>
<span className="text-gray-700">{product.sku}</span>
</div>
{product.barcode && (
<div className="flex py-3 border-b">
<span className="font-medium text-gray-900 w-48">Barcode</span>
<span className="text-gray-700">{product.barcode}</span>
</div>
)}
{product.brand && (
<div className="flex py-3 border-b">
<span className="font-medium text-gray-900 w-48">Brand</span>
<span className="text-gray-700">{product.brand}</span>
</div>
)}
{product.weight && (
<div className="flex py-3 border-b">
<span className="font-medium text-gray-900 w-48">Weight</span>
<span className="text-gray-700">{product.weight} {product.weight_unit || 'kg'}</span>
</div>
)}
{(product.length || product.width || product.height) && (
<div className="flex py-3 border-b">
<span className="font-medium text-gray-900 w-48">Dimensions</span>
<span className="text-gray-700">
{product.length} × {product.width} × {product.height} {product.dimension_unit || 'cm'}
</span>
</div>
)}
<div className="flex py-3 border-b">
<span className="font-medium text-gray-900 w-48">Product Type</span>
<span className="text-gray-700">{product.is_digital ? 'Digital' : 'Physical'}</span>
</div>
</div>
</div>
)}

{activeTab === 'reviews' && (
<div>
<h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
{product.rating_average ? (
<div className="flex items-center gap-8 mb-6">
<div className="text-center">
<div className="text-5xl font-bold mb-2">{product.rating_average.toFixed(1)}</div>
<div className="flex justify-center mb-1">
{[...Array(5)].map((_, i) => (
<Star
key={i}
className={`w-5 h-5 ${
i < Math.floor(product.rating_average || 0)
? 'fill-yellow-400 text-yellow-400'
: 'text-gray-300'
}`}
/>
))}
</div>
<div className="text-sm text-gray-600">{product.rating_count} ratings</div>
</div>
</div>
) : (
<p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
)}
</div>
)}
</div>
</div>
</div>
</div>
</div>
</>
);
}