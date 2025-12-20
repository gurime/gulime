'use client';

import { useState } from 'react';
import { ChevronDown, Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
const [openSection, setOpenSection] = useState<string | null>(null);

const toggleSection = (section: string) => {
setOpenSection(openSection === section ? null : section);
};

const scrollToTop = () => {
window.scrollTo({ top: 0, behavior: 'smooth' });
};

return (
<footer className="bg-linear-to-b from-blue-700 to-blue-800 text-white py-12">
<div className="container mx-auto px-4">

{/* Newsletter Section */}
<div className="bg-blue-900 rounded-lg p-6 mb-12">
<div className="flex flex-col md:flex-row items-center justify-between gap-4">
<div className="text-center md:text-left">
<h3 className="text-xl font-bold mb-2">Stay Updated with Gulime</h3>
<p className="text-blue-200 text-sm">Get exclusive deals and new product alerts delivered to your inbox</p>
</div>
<div className="flex gap-2 w-full md:w-auto">
<input
type="email"
placeholder="Enter your email"
className="px-4 py-2 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-64"
/>
<button className="px-6 py-2 bg-blue-500 hover:bg-orange-600  font-semibold transition-colors whitespace-nowrap">
Subscribe
</button>
</div>
</div>
</div>

{/* Main Footer Grid */}
<div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">

{/* Brand Section */}
<div className="md:col-span-1">
<div
className='mb-4'
onClick={scrollToTop}
title="Back To Top"

>
<Image src='/images/gulime.png'
loading="eager"
priority alt="Gulime Logo"   
width={150} height={150}



/>
</div>
<p className="text-blue-100 text-sm mb-4">
Your trusted marketplace for everything from electronics to vehicles. Shop with confidence.
</p>

{/* Social Media */}
<div className="flex gap-3">
<a href="#" className="bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition-colors">
<Facebook size={18} />
</a>
<a href="#" className="bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition-colors">
<Twitter size={18} />
</a>
<a href="#" className="bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition-colors">
<Instagram size={18} />
</a>
<a href="#" className="bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition-colors">
<Youtube size={18} />
</a>
</div>
</div>

{/* Shop */}
<FooterCollapse
title="Shop"
section="shop"
openSection={openSection}
toggleSection={toggleSection}
>
<FooterLink href="/electronics" label="Electronics" />
<FooterLink href="/vehicles" label="Vehicles" />
<FooterLink href="/fashion" label="Fashion" />
<FooterLink href="/home-garden" label="Home & Garden" />
<FooterLink href="/sports" label="Sports & Outdoors" />
<FooterLink href="/deals" label="Today's Deals" />
</FooterCollapse>

{/* Customer Service */}
<FooterCollapse
title="Customer Service"
section="service"
openSection={openSection}
toggleSection={toggleSection}
>
<FooterLink href="/help" label="Help Center" />
<FooterLink href="/track-order" label="Track Your Order" />
<FooterLink href="/returns" label="Returns & Refunds" />
<FooterLink href="/shipping" label="Shipping Info" />
<FooterLink href="/contact" label="Contact Us" />
<FooterLink href="/faq" label="FAQ" />
</FooterCollapse>

{/* About Gulime */}
<FooterCollapse
title="About Gulime"
section="about"
openSection={openSection}
toggleSection={toggleSection}
>
<FooterLink href="/about" label="About Us" />
<FooterLink href="/careers" label="Careers" />
<FooterLink href="/sell" label="Sell on Gulime" />
<FooterLink href="/press" label="Press & Media" />
<FooterLink href="/blog" label="Blog" />
<FooterLink href="/affiliate" label="Affiliate Program" />
</FooterCollapse>

{/* Legal */}
<FooterCollapse
title="Legal"
section="legal"
openSection={openSection}
toggleSection={toggleSection}
>
<FooterLink href="/privacy" label="Privacy Policy" />
<FooterLink href="/terms" label="Terms of Service" />
<FooterLink href="/cookies" label="Cookie Policy" />
<FooterLink href="/buyer-protection" label="Buyer Protection" />
<FooterLink href="/accessibility" label="Accessibility" />
</FooterCollapse>
</div>

{/* Payment Methods */}
<div className="border-t border-blue-600 pt-8 mb-8">
<p className="text-sm text-blue-200 mb-3 text-center md:text-left">We Accept</p>
<div className="flex flex-wrap justify-center md:justify-start gap-3">
<div className="bg-white px-4 py-2 rounded text-gray-800 font-semibold text-sm">VISA</div>
<div className="bg-white px-4 py-2 rounded text-gray-800 font-semibold text-sm">Mastercard</div>

</div>
</div>

{/* Copyright */}
<div className="border-t border-blue-600 pt-6 text-center">
<p className="text-blue-100 text-sm">
&copy; {new Date().getFullYear()} Gulime. All rights reserved. | Secure Shopping Guaranteed
</p>
</div>
</div>
</footer>
);
}

/* Collapse wrapper for mobile */
function FooterCollapse({
title,
section,
openSection,
toggleSection,
children,
}: {
title: string;
section: string;
openSection: string | null;
toggleSection: (s: string) => void;
children: React.ReactNode;
}) {  const isOpen = openSection === section;

return (
<div>
<button
onClick={() => toggleSection(section)}
className="w-full flex justify-between items-center md:cursor-default md:pointer-events-none md:mb-4"
>
<h4 className="text-lg font-semibold">{title}</h4>
<ChevronDown
className={`h-5 w-5 md:hidden transition-transform duration-300 cursor-pointer ${
isOpen ? 'rotate-180' : ''
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 md:block ${
isOpen ? 'max-h-96 mt-2' : 'max-h-0 md:max-h-none'
}`}
>
<ul className="space-y-2 text-sm">{children}</ul>
</div>
</div>
);
}

/* Simple link component */
function FooterLink({ href, label }: { href: string; label: string }) {
return (
<li>
<a
href={href}
className="text-blue-100 hover:text-white transition-colors duration-200 hover:underline"
>
{label}
</a>
</li>
);
}