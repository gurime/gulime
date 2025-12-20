'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import supabase from '../supabase/supabase';
import Link from 'next/link';



export default function ForgotPassword() {
const router = useRouter();
const [email, setEmail] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [message, setMessage] = useState("");

const handleForgotPassword = async () => {
setLoading(true);
setError("");
setMessage("");

// Basic email validation
if (!email || !email.includes('@')) {
setError("Please enter a valid email address");
setLoading(false);
return;
}

try {
const { error } = await supabase.auth.resetPasswordForEmail(email, {
redirectTo: `${window.location.origin}/reset-password`,
});

if (error) throw error;
setMessage("Password reset email sent! Please check your inbox and spam folder.");
setEmail(""); // Clear the form
} catch (error: unknown) {
if (typeof error === "object" && error !== null && "message" in error) {
setError((error as { message?: string }).message || "An error occurred while sending reset email");
} else {
setError("An error occurred while sending reset email");
}
} finally {
setLoading(false);
}
};

const handleKeyPress = (e: React.KeyboardEvent) => {
if (e.key === 'Enter' && !loading) {
handleForgotPassword();
}
};

return (
<>   



<div className="min-h-screen bg-linear-to-r from-blue-500 to-blue-900 flex items-center justify-center p-4">

<div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
<Link title='Home' href="/" >
<div className='dark:bg-blue-900 flex items-center m-auto justify-center p-4 mb-6 rounded-lg'>  
<Image 
src="/images/gulime.png" 
alt="Gulime Logo" 
width={200} 
height={80}
className="mx-auto mb-4"/>
</div></Link>
<div className="text-center mb-8">
  


<h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
<p className="text-gray-600 text-sm">
No worries! Enter your email and we&apos;ll send you reset instructions.
</p>
</div>

{error && (
<div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-start">
<svg className="w-5 h-5 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
</svg>
<span className="text-sm">{error}</span>
</div>
)}

{message && (
<div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 flex items-start">
<svg className="w-5 h-5 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
</svg>
<span className="text-sm">{message}</span>
</div>
)}

<form onSubmit={handleForgotPassword} className="space-y-6">
<div>
<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
Email Address
</label>
<input
type="email"
id="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
onKeyDown={handleKeyPress}
placeholder="you@example.com"
disabled={loading}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"/>
</div>

<button
type='submit'
disabled={loading}
className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center">

{loading ? (
<>
<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg>
Sending...
</>
) : (
'Send Reset Link'
)}
</button>
</form>

<div className="mt-6 text-center">
<button 
onClick={() => router.push('/login')}
className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer">
← Back to Login
</button>
</div>
</div>
</div>
</>
  );
}