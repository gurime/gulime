import { notFound } from 'next/navigation';
import supabase from '@/app/supabase/supabase';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductDetailsClient from '../ProductDetailsClient';
import NotFound from '@/app/not-found';

// Keep your Product interface and generateMetadata

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from('dashboard_products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    NotFound();
  }

  return (
    <>
      <Navbar />
      <ProductDetailsClient product={product} />
      <Footer />
    </>
  );
}