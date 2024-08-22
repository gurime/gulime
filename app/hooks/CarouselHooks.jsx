// hooks/useFirebaseProducts.js
import { useState, useEffect } from 'react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import {db} from '../Config/firebase'
export const useFirebaseFeaturedProducts = (limitCount = 5) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const featuredRef = collection(db, 'featured_products');
        const q = query(featuredRef, limit(limitCount));
        const featuredSnapshot = await getDocs(q);
        
        const productsData = featuredSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setProducts(productsData);
      } catch (err) {
        setError(err);
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [limitCount]);

  return { products, loading, error };
};