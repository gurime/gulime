import Image from 'next/image'
import React from 'react'

export default function Navbar() {
  return (
    <>
    <div className="hidden md:block">

<div className="flex items-center justify-center  bg-[#1547A0]">
       <Image src='/images/gulime.png'
 loading="eager"
priority alt="Gulime Logo"   
style={{ width: "auto" ,height:"auto"}}
width={200} height={200}
   

  
    />
    </div>
</div>
    </>
  )
}
