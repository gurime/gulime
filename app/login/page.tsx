"use client";
import { useRouter,useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "../supabase/supabase"; // Ensure this path is correct
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
const router = useRouter();

// UI State
const [isLogin, setIsLogin] = useState(true);
const [initialLoading, setInitialLoading] = useState(true); // Fixes "Flash of content"
const [loading, setLoading] = useState(false);

// Form State
const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [error, setError] = useState("");

const searchParams = useSearchParams();
const tab = searchParams.get("tab");

// Check auth on mount
useEffect(() => {
const checkUser = async () => {
try {
const {
data: { session },
} = await supabase.auth.getSession();
if (session) {
router.replace("/"); // replace is better than push for redirects (no back button loop)
} else {
setInitialLoading(false); // Only show form if no user found
}
} catch (e) {
setInitialLoading(false);
}
};
checkUser();
}, [router]);

useEffect(() => {
if (tab === "signup") {
setIsLogin(false);
} else {
setIsLogin(true);
}
}, [tab]);

const handleLogin = async (e: React.FormEvent) => {
e.preventDefault();
setLoading(true);
setError("");

try {
const { error } = await supabase.auth.signInWithPassword({
email,
password,
});

if (error) throw error;

toast.success("Login successful!");
router.refresh(); // Ensure server components update
router.push("/");
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

const handleSignup = async (e: React.FormEvent) => {
e.preventDefault();
setLoading(true);
setError("");

if (password !== confirmPassword) {
setError("Passwords do not match");
setLoading(false);
return;
}

if (password.length < 6) {
setError("Password must be at least 6 characters");
setLoading(false);
return;
}

try {
const { data, error } = await supabase.auth.signUp({
email,
password,
options: {
data: {
full_name: fullName,
},
},
});

if (error) throw error;

// Insert into profiles table
if (data.user) {
const { error: profileError } = await supabase
.from('profiles')
.insert({
id: data.user.id,
full_name: fullName,
email: data.user.email,
});

if (profileError) {
console.error('Error creating profile:', profileError);
// Don't throw - the user account was created successfully
}
}

toast.success(
"Account created! Please check your email to verify your account."
);

// Clear form
setFullName("");
setEmail("");
setPassword("");
setConfirmPassword("");
setIsLogin(true);
router.push("/")
} catch (error: unknown) {
if (typeof error === "object" && error !== null && "message" in error) {
setError((error as { message?: string }).message || "An error occurred during signup");
} else {
setError("An error occurred during signup");
}
} finally {
setLoading(false);
}
};

// Prevent rendering the form until we know the user isn't logged in
if (initialLoading) {
return null; // Or return a loading spinner
}

return (
// FIX: Changed bg-linear-to-r to bg-gradient-to-r
<div className="min-h-screen bg-linear-to-r from-blue-500 to-blue-900 flex items-center justify-center p-4">
<Toaster position="top-center" />
<div className="w-full max-w-md">
{/* Logo and Header */}
<div className="text-center mb-8">
<Link href="/" className="inline-block">
<Image
src="/images/gulime.png"
alt="Gulime Logo"
width={200}
height={80}
className="mx-auto mb-4"
loading="eager"
priority/>
</Link>

<h1 className="text-3xl font-bold text-white mb-2">
{isLogin ? "Welcome Back" : "Join Gulime"}
</h1>
<p className="text-white text-sm">
{isLogin
? "Sign in to access your account"
: "Create an account to get started"}
</p>
</div>

{/* Auth Card */}
<div className="bg-white rounded-2xl shadow-xl p-8">
{/* Toggle Buttons */}
<div className="flex gap-2 mb-6 bg-gray-100 rounded-lg p-1">
<button
type="button" // Explicitly set type button to prevent form submit
onClick={() => {
setIsLogin(true);
router.push("/login?tab=login");
setError("");
}}
className={`flex-1 py-2 px-4 rounded-md font-medium transition-all cursor-pointer ${
isLogin
? "bg-blue-900 text-white shadow-md"
: "text-gray-600 hover:text-gray-900"
}`}
>
Login
</button>
<button
type="button"
onClick={() => {
setIsLogin(false);
router.push("/login?tab=signup");
setError("");
}}
className={`flex-1 py-2 px-4 rounded-md font-medium transition-all cursor-pointer ${
!isLogin
? "bg-blue-900 text-white shadow-md"
: "text-gray-600 hover:text-gray-900"
}`}
>
Sign Up
</button>
</div>

{/* Error Messages */}
{error && (
<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
{error}
</div>
)}

{/* Form */}
<form
onSubmit={isLogin ? handleLogin : handleSignup}
className="space-y-4"
>
{/* Full Name Input */}
{!isLogin && (
<div>
{/* FIX: Added missing label classes */}
<label
htmlFor="fname"
className="block text-sm font-medium text-gray-700 mb-1"
>
Full Name
</label>
<input
id="fname"
type="text" // FIX: changed from 'fname' to 'text'
name="name"
autoComplete="name" // Added autocomplete
value={fullName}
onChange={(e) => setFullName(e.target.value)}
required
onFocus={() => setError("")}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
placeholder="John Doe"
/>
</div>
)}

{/* Email Input */}
<div>
<label
htmlFor="email"
className="block text-sm font-medium text-gray-700 mb-1"
>
Email Address
</label>
<input
id="email"
type="email"
name="email"
autoComplete="email" // Added autocomplete
value={email}
onChange={(e) => setEmail(e.target.value)}
required
onFocus={() => setError("")}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
placeholder="you@example.com"
/>
</div>

{/* Password Input */}
<div>
<label
htmlFor="password"
className="block text-sm font-medium text-gray-700 mb-1"
>
Password
</label>
<input
id="password"
type="password"
name="password"
autoComplete={isLogin ? "current-password" : "new-password"} // Dynamic autocomplete
value={password}
onChange={(e) => setPassword(e.target.value)}
required
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
placeholder="••••••••"
/>
</div>

{/* Confirm Password (Signup only) */}
{!isLogin && (
<div>
<label
htmlFor="confirmPassword"
className="block text-sm font-medium text-gray-700 mb-1"
>
Confirm Password
</label>
<input
id="confirmPassword"
type="password"
name="confirmPassword"
autoComplete="new-password"
value={confirmPassword}
onChange={(e) => setConfirmPassword(e.target.value)}
required
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
placeholder="••••••••"
/>
</div>
)}

{/* Forgot Password Link (Login only) */}
{isLogin && (
<div className="text-right">
<Link
href="/forgot-password"
className="text-sm text-blue-900 hover:underline"
>
Forgot password?
</Link>
</div>
)}

{/* Submit Button */}
<button
disabled={loading}
type="submit"
className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold 
hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98]
transition-all duration-200 ease-out
shadow-md hover:shadow-lg 
disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
cursor-pointer"
>
{loading ? (
<span className="flex items-center justify-center">
<svg
className="animate-spin h-5 w-5 mr-2"
viewBox="0 0 24 24"
>
<circle
className="opacity-25"
cx="12"
cy="12"
r="10"
stroke="currentColor"
strokeWidth="4"
fill="none"
/>
<path
className="opacity-75"
fill="currentColor"
d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
/>
</svg>
{isLogin ? "Signing in..." : "Creating account..."}
</span>
) : isLogin ? (
"Sign In"
) : (
"Create Account"
)}
</button>
</form>

{/* Terms (Signup only) */}
{!isLogin && (
<p className="mt-4 text-xs text-gray-500 text-center">
By signing up, you agree to our{" "}
<Link href="/terms" className="text-blue-900 hover:underline">
Terms of Service
</Link>{" "}
and{" "}
<Link href="/privacy" className="text-blue-900 hover:underline">
Privacy Policy
</Link>
</p>
)}
</div>

{/* Back to Home */}
<div className="text-center mt-6">
<Link
href="/"
className="text-sm text-white transition-colors cursor-pointer"
>
← Back to Gulime
</Link>
</div>
</div>
</div>
);
}
