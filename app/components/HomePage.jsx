'use client'
import React, { useState, useEffect } from 'react'
import { db } from '../Config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { RiseLoader } from 'react-spinners';
import Carousel from '../components/HomeCarousel '
import { useFirebaseFeaturedProducts } from '../hooks/CarouselHooks';
async function getArticles() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  } catch (error) {
    throw error;
  }
}

const Homepage = () => {
  const [loading, setLoading] = useState(true);
  const [useArticle, setUseArticle] = useState([]);
  const { products } = useFirebaseFeaturedProducts(5); // Fetch up to 5 featured products

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const articles = await getArticles();
        setUseArticle(articles);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const mainProduct = useArticle.find(product => product.id === 'd4cY1CZ4eQnX26ipigAE');
  const leftProducts = useArticle.filter(product => ['jTY4uUE9E5FYBM0rVBXr','cTAttMOYTSo2ccGvWFqJ'].includes(product.id));
  const rightProducts = useArticle.filter(product => ['q7W8AVFUBjAg14Oy5sLW', 'G4BRbX5fnhJ5zUXoyya8'].includes(product.id));
  const midProducts = useArticle.filter(product => ['swVsmBX5UVUH5o8ncG2m', 'G4BRbX5fnhJ5zUXoyya8'].includes(product.id));

  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(price);
  };
  return (
    <>
    <Carousel items={products}/>
      <div className='hero-grid'>
        {loading ? (
          <div className="loader-container">
            <RiseLoader color="blue" size={15} />
          </div>
        ) : (
          <>
            <div className="left-column">
              {leftProducts.map((product) => (
                <div key={product.id} className="first-left-content">
                  <div className="content-wrapper">
                    <span className='dashcategory'>{product.category}</span>
                    <Link href={`/pages/ProductDetails/${product.id}`}>
                      <img src={product.coverimage || product.cardisplay} alt={product.title} />
                    </Link>
                    <span style={{ fontSize: '20px', lineHeight: '40px', textAlign: 'center' }}>{product.title} {product.cartitle}</span>
                    <div className='detailproduct-price'>               
                             ${formatPrice(product.price || product.basePrice)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {mainProduct && (
              <div className="main-content">
                <div className="mainflex">
                  <div style={{ display: 'grid' }}>
                    <span className='dashcategory'>{mainProduct.category}</span>
                    <span className='detailproduct-price'>           
                                 ${formatPrice(mainProduct.price)}
                    </span>
                  </div>
                  <Link href={`/pages/ProductDetails/${mainProduct.id}`}>
                    <img src={mainProduct.coverimage} className="main-content-img" alt={mainProduct.title} />
                  </Link>
                  <span style={{ fontSize: '17px', lineHeight: '40px' }}>{mainProduct.title}</span>
                  <div style={{ width: '10rem', margin: 'auto' }}>
                    <span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="right-column">
              {rightProducts.map((product) => (
                <div key={product.id} className="second-left-content">
                  <div className="content-wrapper">
                    <span className='dashcategory'>{product.category}</span>
                    <Link href={`/pages/ProductDetails/${product.id}`}>
                      <img src={product.coverimage} alt={product.title} />
                    </Link>
                    <span style={{ fontSize: '20px', lineHeight: '40px', textAlign: 'center' }}>{product.title} {product.cartitle}</span>
                    <div className='detailproduct-price'>             
                               ${formatPrice(product.price || product.basePrice)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )} 
    
      </div>

<div className="mid-column">
{midProducts.map((product) => (
<div key={product.id} className="mid-content">
<div className="content-wrapper">
<span className='dashcategory'>{product.category}</span>
<Link href={`/pages/ProductDetails/${product.id}`}>
<img src={product.coverimage} alt={product.title} />
</Link>
<span style={{ fontSize: '20px', lineHeight: '40px', textAlign: 'center' }}>{product.title} {product.cartitle}</span>
<div className='detailproduct-price'>             
${formatPrice(product.price || product.basePrice)}
</div>
</div>
</div>
))}
</div>
srg
</>
  );
};

export default Homepage;