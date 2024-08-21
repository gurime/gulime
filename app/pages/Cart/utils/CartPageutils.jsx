import { useState, useCallback, useEffect, useMemo } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';

export const useCartState = (  articleId, 
  product, 
  selectedColor, 
  selectedConfiguration,
  configurationPrice,
  selectedColorUrl,
  finalPrice
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

  const handleAddToCart = useCallback(async (newItem, quantity = 1) => {
    const updatedCartItems = [...cartItems];
    const existingItemIndex = updatedCartItems.findIndex((item) => item.id === newItem.id);
    
    if (existingItemIndex !== -1) {
      updatedCartItems[existingItemIndex].quantity += quantity;
    } else {
      updatedCartItems.push({
        ...newItem,
        id: articleId,
        itemID: `${articleId}_${selectedColor || ''}_${selectedConfiguration || ''}_${Date.now()}`,
        quantity: 1,
        selectedColor: selectedColor || '',
        selectedColorUrl: selectedColorUrl,
        selectedConfiguration: selectedConfiguration || '',
        configurationPrice: configurationPrice?.toString() || '',
        title: newItem.title || product.cartitle || '',
        content: newItem.content || '',
        basePrice: newItem.basePrice?.toString() || '',
        coverimage: newItem.coverimage || '',
        category: newItem.category || '',
        cardisplay: newItem.cardisplay || '',
        carrange: newItem.carrange?.toString() || '',
        carsecs: newItem.carsecs?.toString() || '',
        topspeed: newItem.topspeed?.toString() || '',
 
      });
    }
    
    setCartItems(updatedCartItems);
    updateCartCount(updatedCartItems);
    await updateFirestoreDocument('carts', updatedCartItems);
    await deleteFromSaved(newItem.id);
    setShowConfirmation('Product added to cart');
    setTimeout(() => setShowConfirmation(false), 3000);
  }, [cartItems, updateFirestoreDocument, deleteFromSaved, updateCartCount]);

  const deleteFromCart = useCallback(async (itemID) => {
    const updatedCartItems = cartItems.filter((item) => item.itemID !== itemID);
    setCartItems(updatedCartItems);
    updateCartCount(updatedCartItems);
    await updateFirestoreDocument('carts', updatedCartItems);
    setShowConfirmation('Product deleted from cart');
    setTimeout(() => setShowConfirmation(false), 3000);
  }, [cartItems, updateFirestoreDocument, updateCartCount]);

  const handleSaveForLater = useCallback(async (itemID) => {
    const itemToSave = cartItems.find((item) => item.itemID === itemID);
    if (itemToSave) {
      const updatedCartItems = cartItems.filter((item) => item.itemID !== itemID);
      const updatedSavedItems = [...savedItems, itemToSave];
      setCartItems(updatedCartItems);
      setSavedItems(updatedSavedItems);
      await updateFirestoreDocument('carts', updatedCartItems);
      await updateFirestoreDocument('saved', updatedSavedItems);
    }
  }, [cartItems, savedItems, updateFirestoreDocument]);

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
                viewedProducts.push(product);
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
            const viewedProductsRef = doc(db, 'BroswingHistory', currentUser?.uid || '');
            const viewedProductsSnap = await getDoc(viewedProductsRef);
            const viewedProductsData = viewedProductsSnap.data();
            const viewedProducts = viewedProductsData?.products || [];

            setUserViewedProducts(viewedProducts);

            const recommendedProductsData = await getRecommendedProducts(viewedProducts);
            setRecommendedProducts(recommendedProductsData);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
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