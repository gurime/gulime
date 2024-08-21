'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

  
export default function notFound() {
const router = useRouter()

return (
<div style={{ backgroundColor: '#2f3144', height: '100vh', display: 'grid', placeItems: 'center' }}>
<div style={{ textAlign: 'center' }}>
<h1 style={{ color: '#fff', letterSpacing: '1px' }}>404</h1>
<h2 style={{ textTransform: 'capitalize', color: '#fff', letterSpacing: '1px' }}>page not found</h2>
<p style={{ color: '#fff', lineHeight: '2', letterSpacing: '1px' }}>
Oops... The Link you clicked may be broken or the page <br /> may have been removed.
</p>
<button
onClick={() => router.back()}
style={{
display: 'inline-block',
padding: '5px 10px',
fontSize: '18px',
color: '#fff',
backgroundColor: '#f33030',
border: 'none',
borderRadius: '4px',
textTransform: 'capitalize',
cursor: 'pointer',
margin: 'auto 0',
}}
>&#8592; go back</button>
</div>
</div>
 )
}