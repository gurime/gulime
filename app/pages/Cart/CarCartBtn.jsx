import { getColorPrice, getColorUrl, getCurrentPrice } from '../../utils/carconfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { arrayUnion, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function CarCartBtn({ 
  articleId, 
  product, 
  selectedColor, 
  selectedConfiguration,
  configurationPrice,
  setCurrentPrice
}) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);

  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Calculate final price
    const basePrice = getCurrentPrice(product, selectedConfiguration, selectedColor);
    const colorPrice = getColorPrice(product, selectedColor);
    let calculatedFinalPrice = basePrice;
    
    if (typeof colorPrice === 'number' && !isNaN(colorPrice)) {
      calculatedFinalPrice += colorPrice;
    }

    setFinalPrice(calculatedFinalPrice);
    
    // Update the current price in the parent component
    if (setCurrentPrice) {
      setCurrentPrice(calculatedFinalPrice);
    }



    return () => unsubscribe();
  }, [product, selectedConfiguration, selectedColor, configurationPrice, setCurrentPrice]);

  const handleAddToCart = async () => {
    if (!currentUser) {
      router.push('/pages/Login');
      return;
    }
  
    if (!articleId || !product) {
      return;
    }
  
    const db = getFirestore();
    const userCartRef = doc(db, 'carts', currentUser.uid);
  
    try {
      const cartDoc = await getDoc(userCartRef);
     
      const selectedColorUrl = getColorUrl(product, selectedColor);
  
      const newItem = {
        id: articleId,
        itemID: `${articleId}_${selectedColor || ''}_${selectedConfiguration || ''}_${Date.now()}`,
        quantity: 1,
        selectedColor: selectedColor || '',
        selectedColorUrl: selectedColorUrl,
        selectedConfiguration: selectedConfiguration || '',
        configurationPrice: configurationPrice?.toString() || '',
        title: product.title || product.cartitle || '',
        content: product.content || '',
        basePrice: product.basePrice?.toString() || '',
        coverimage: product.coverimage || '',
        category: product.category || '',
        cardisplay: product.cardisplay || '',
        carrange: product.carrange?.toString() || '',
        carsecs: product.carsecs?.toString() || '',
        topspeed: product.topspeed?.toString() || '',
        price: finalPrice.toFixed(2)
      };
  
      // Ensure all fields are defined
      Object.keys(newItem).forEach(key => {
        if (newItem[key] === undefined) {
          newItem[key] = ''; // Use empty string as default
        }
      });
  
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const cartItems = cartData.items || [];
        const existingItemIndex = cartItems.findIndex(
          (item) => 
            item.id === articleId && 
            item.selectedColor === selectedColor && 
            item.selectedConfiguration === selectedConfiguration
        );
  
        if (existingItemIndex !== -1) {
          // Item already exists, update quantity and price
          cartItems[existingItemIndex].quantity += 1;
          cartItems[existingItemIndex].price = (
            parseFloat(cartItems[existingItemIndex].price) * cartItems[existingItemIndex].quantity
          ).toFixed(2);
  
          await updateDoc(userCartRef, { items: cartItems });
        } else {
          // New item, add to cart
          await updateDoc(userCartRef, {
            items: arrayUnion(newItem),
          });
        }
      } else {
        // Cart doesn't exist, create new cart with the item
        await setDoc(userCartRef, {
          items: [newItem],
        });
      }
  
      router.push('/pages/Cart/');
    } catch (error) {
      // You might want to show an error message to the user here
    }
  };
  const formattedPrice = formatNumber(finalPrice.toFixed(2));

  return (
    <button className='add-to-cart-btn' onClick={handleAddToCart}>
      Add to cart 
    </button>
  );
}