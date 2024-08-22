import { useState, useCallback, useEffect, useMemo } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';

export const useCartState = (  
  
 ) => {
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [db, setDb] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [userViewedProducts, setUserViewedProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const updateFirestoreDocument = useCallback(async (collectionName, items) => {
    if (currentUser && db) {
      const docRef = doc(db, collectionName, currentUser.uid);
      await setDoc(docRef, { items });
    }
  }, [currentUser, db]);

  const updateCartCount = useCallback((items) => {
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalCount);
  }, []);

  const deleteFromSaved = useCallback(async (itemID) => {
    const updatedSavedItems = savedItems.filter((item) => item.itemID !== itemID);
    setSavedItems(updatedSavedItems);
    await updateFirestoreDocument('saved', updatedSavedItems);
  }, [savedItems, updateFirestoreDocument]);

  const handleQuantityChange = useCallback(async (item, change) => {
    const updatedCartItems = cartItems.map((cartItem) => {
      if (cartItem.itemID === item.itemID) {
        return { ...cartItem, quantity: Math.max(1, cartItem.quantity + change) };
      }
      return cartItem;
    });

    setCartItems(updatedCartItems);
    updateCartCount(updatedCartItems);
    await updateFirestoreDocument('carts', updatedCartItems);
  }, [cartItems, updateFirestoreDocument, updateCartCount]);

  // add to cart from the save for later
  const handleAddToCart = useCallback(async (savedItem, quantity = 1) => {
    try {
      const updatedCartItems = [...cartItems];
      const itemIdentifier = savedItem.itemID || savedItem.id; // Use itemID for cars, id for other products
      
      const existingItemIndex = updatedCartItems.findIndex((item) => 
        (item.itemID && item.itemID === savedItem.itemID) || (item.id && item.id === savedItem.id)
      );
      
      if (existingItemIndex !== -1) {
        updatedCartItems[existingItemIndex].quantity += quantity;
      } else {
        const newCartItem = {
          ...savedItem,
          quantity: quantity,
        };
  
        // Ensure both id and itemID are present
        if (!newCartItem.id) newCartItem.id = itemIdentifier;
        if (!newCartItem.itemID) newCartItem.itemID = itemIdentifier;
  
        updatedCartItems.push(newCartItem);
      }
      
      // Update Firestore first
      await updateFirestoreDocument('carts', updatedCartItems);
      
      // If Firestore update is successful, update local state
      setCartItems(updatedCartItems);
      updateCartCount(updatedCartItems);
      
      // Remove item from saved list
      await deleteFromSaved(itemIdentifier);
      
      setShowConfirmation('Product added to cart');
      setTimeout(() => setShowConfirmation(false), 3000);
    } catch (error) {
      setShowConfirmation('Error adding item to cart. Please try again.');
      setTimeout(() => setShowConfirmation(false), 3000);
    }
  }, [cartItems, updateFirestoreDocument, deleteFromSaved, updateCartCount]);

  // add to cart from the save for later


  // delete item
  const deleteFromCart = useCallback(async (itemID) => {
    const updatedCartItems = cartItems.filter((item) => item.itemID !== itemID);
    setCartItems(updatedCartItems);
    updateCartCount(updatedCartItems);
    await updateFirestoreDocument('carts', updatedCartItems);
    setShowConfirmation('Product deleted from cart');
    setTimeout(() => setShowConfirmation(false), 3000);
  }, [cartItems, updateFirestoreDocument, updateCartCount]);

    // delete item


  // save for later

  const handleSaveForLater = useCallback(async (itemID) => {
    try {
      const itemToSave = cartItems.find((item) => item.id === itemID || item.itemID === itemID);
      if (itemToSave) {
        const updatedCartItems = cartItems.filter((item) => item.id !== itemID && item.itemID !== itemID);
        const updatedSavedItems = [...savedItems, itemToSave];
        
        // Update Firestore first
        await updateFirestoreDocument('carts', updatedCartItems);
        await updateFirestoreDocument('saved', updatedSavedItems);
        
        // If Firestore updates are successful, update local state
        setCartItems(updatedCartItems);
        setSavedItems(updatedSavedItems);
        updateCartCount(updatedCartItems);
        
        setShowConfirmation('Item saved for later');
        setTimeout(() => setShowConfirmation(false), 3000);
      }
    } catch (error) {
      setShowConfirmation('Error saving item for later. Please try again.');
      setTimeout(() => setShowConfirmation(false), 3000);
    }
  }, [cartItems, savedItems, updateFirestoreDocument, setShowConfirmation, updateCartCount]);

    // save for later


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const firestore = getFirestore();
        setDb(firestore);
        const cartRef = doc(firestore, 'carts', user.uid);
        const savedRef = doc(firestore, 'saved', user.uid);
        const unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
          const cartData = snapshot.data();
          if (cartData && cartData.items) {
            const items = cartData.items;
            setCartItems(items);
            updateCartCount(items);
          }
          setLoading(false);
        });

        const unsubscribeSaved = onSnapshot(savedRef, (snapshot) => {
          const savedData = snapshot.data();
          const items = savedData?.items || [];
          setSavedItems(items);
          const counts = items.reduce((acc, item) => {
            const category = item.category;
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          }, {});

          setCategoryCounts(counts);
          setLoading(false);
        });
        return () => {
          unsubscribeCart();
          unsubscribeSaved();
        };
      } else {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [updateCartCount]);

  const savedItemsByCategory = useMemo(() => {
    return savedItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [savedItems]);

  const getRecommendedProducts = useCallback(async (viewedProducts) => {
    const allProducts = [...cartItems, ...savedItems, ...viewedProducts];

    const filteredProducts = allProducts.filter((product) => 
        !cartItems.some((cartItem) => cartItem.id === product.id)
    );

    const uniqueProducts = filteredProducts.filter((product, index, self) =>
        index === self.findIndex((t) => t.id === product.id)
    );

    uniqueProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

    return uniqueProducts.slice(0, 5);
  }, [cartItems, savedItems]);

  const addProductToViewed = useCallback(async (product, user) => {
    if (db && user?.uid) {
      try {
        const userViewedRef = doc(db, 'BrowsingHistory', user.uid);
        const userViewedSnap = await getDoc(userViewedRef);
  
        let viewedProducts = [];
        if (userViewedSnap.exists()) {
          viewedProducts = userViewedSnap.data()?.products || [];
        }
  
        const isProductAlreadyViewed = viewedProducts.some(
          (viewedProduct) => viewedProduct.id === product.id
        );
  
        if (!isProductAlreadyViewed) {
          // Ensure the product has the correct category
          const productWithCategory = {
            ...product,
            category: product.category || "" // Default to "Technology" if no category is provided
          };
  
          viewedProducts = [productWithCategory, ...viewedProducts.slice(0, 19)]; // Keep only the 20 most recent items
          await setDoc(userViewedRef, { products: viewedProducts });
        }
      } catch (error) {
        console.error("Error adding product to viewed:", error);
      }
    }
  }, [db]);

  const handleProductView = (product) => {
    const user = currentUser;
    if (user) {
        addProductToViewed(product, user);
    }
  };

  const fetchRecommendations = useCallback(async () => {
    if (db) {
        try {
            const viewedProductsRef = doc(db, 'BrowsingHistory', currentUser?.uid || '');
            const viewedProductsSnap = await getDoc(viewedProductsRef);
            const viewedProductsData = viewedProductsSnap.data();
            const viewedProducts = viewedProductsData?.products || [];

            setUserViewedProducts(viewedProducts);

            const recommendedProductsData = await getRecommendedProducts(viewedProducts);
            setRecommendedProducts(recommendedProductsData);
        } catch (error) {
        }
    }
  }, [db, cartItems, savedItems, currentUser, getRecommendedProducts]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    cartItems,
    savedItems,
    currentUser,
    showConfirmation,
    cartCount,
    categoryCounts,
    expandedCategories,
    loading,
    userViewedProducts,
    recommendedProducts,
    savedItemsByCategory,
    toggleCategory,
    handleQuantityChange,
    handleAddToCart,
    deleteFromCart,
    handleSaveForLater,
    fetchRecommendations,
    deleteFromSaved,
    addProductToViewed,
    handleProductView
  };
};