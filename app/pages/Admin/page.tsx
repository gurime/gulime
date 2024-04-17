import React from 'react'
import { Metadata } from 'next';
import AdminForm from './AdminForm';
import AdminHeader from '@/app/components/AdminHeader';


export const metadata: Metadata = {
  title: 'iTruth News - Admin',
  
};



export default function page() {
return (
<>
<AdminHeader/>
<AdminForm/>
</>
)
}