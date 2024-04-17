'use client'
import React from 'react'
import { useRouter } from "next/navigation"

export default function Goback() {
    const router = useRouter()
    
      const handleGoBack = () => {
    // Navigate back to the previous page
    router.back()

window.scrollTo(0, 0)
  }
  return (
    <>
      <button onClick={handleGoBack} className="backbtn">
        &#8592; go back
      </button>
    </>
  )
}