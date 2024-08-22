import { useState, useEffect } from 'react';
import { getFirestore, getDoc, doc } from 'firebase/firestore';

const colorImageSuffixes = [
  'SolidBlackImage',
  'DeepBlueMetallicImage',
  'UltraRedImage',
  'PearlWhiteMultiCoatImage',
  'QuickSilverImage',
  'StealthGreyImage',
];

const colorPriceSuffixes = [
  'SolidBlackPrice',
  'DeepBlueMetallicPrice',
  'UltraRedPrice',
  'PearlWhiteMultiCoatPrice',
  'QuickSilverPrice',
  'StealthGreyPrice',
];

export const useCarDetails = (
  id,
  setSelectedColor,
  setSelectedConfig,
  selectedColor,
  selectedConfig
) => {
  const [carDetails, setCarDetails] = useState(null);
  const [sortedColorKeys, setSortedColorKeys] = useState([]);
  const [sortedConfigKeys, setSortedConfigKeys] = useState([]);

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (id) {
        const db = getFirestore();
        const carDoc = await getDoc(doc(db, 'products', id));
        if (carDoc.exists()) {
          const carData = carDoc.data();
          setCarDetails(carData);
          if (carData.colors) {
            const colorKeys = Object.keys(carData.colors).sort();
            setSortedColorKeys(colorKeys);
            if (!selectedColor) {
              setSelectedColor(colorKeys[0]);
            }
          }
          if (carData.configurations) {
            const configKeys = Object.keys(carData.configurations).sort();
            setSortedConfigKeys(configKeys);
            if (!selectedConfig) {
              setSelectedConfig(configKeys[0]);
            }
          }
        }
      }
    };

    fetchCarDetails();
  }, [id, setSelectedColor, setSelectedConfig, selectedColor, selectedConfig]);

  return { carDetails, sortedColorKeys, sortedConfigKeys };
};


export const getColorButtonStyle = (color) => {
  if (color === 'Solid Black') return { backgroundColor: '#000000' };
  if (color === 'Ultra Red') return { backgroundColor: '#d51c1c' };
  if (color === 'Stealth Grey') return { backgroundColor: '#71797E' };
  if (color === 'Deep Blue Metallic') return { backgroundColor: '#2828ff' };
  if (color === 'Quicksilver') return { backgroundColor: 'silver' };
  if (color === 'Pearl White Multi-Coat') return { backgroundColor: '#d8d5d5' };
  return { backgroundColor: color.toLowerCase() };
};

export const getColorUrl = (carDetails, colorName) => {
  const colorInfo = carDetails.colors[colorName];

  if (typeof colorInfo === 'string') {
    return colorInfo;
  } else if (colorInfo && typeof colorInfo === 'object') {
    for (const suffix of colorImageSuffixes) {
      if (colorInfo[suffix]) {
        return colorInfo[suffix];
      }
    }
  }

  throw new Error(`Color image for ${colorName} not found`);
};

export const getCurrentPrice = (carDetails, selectedConfig, selectedColor) => {
  // Start with the base price of the selected configuration
  let totalPrice = 0;
  
  if (selectedConfig && carDetails.configurations?.[selectedConfig]) {
    const configPrice = carDetails.configurations[selectedConfig].price;
    totalPrice = typeof configPrice === 'string' 
      ? parseFloat(configPrice.replace(/,/g, '').replace('$', ''))
      : (typeof configPrice === 'number' ? configPrice : 0);
  }

  // Add color price if it's not included
  const colorPrice = getColorPrice(carDetails, selectedColor);
  if (typeof colorPrice === 'number') {
    totalPrice += colorPrice;
  }

  // Ensure the price is not negative
  return Math.max(totalPrice, 0);
};
export const getColorPrice = (carDetails, colorName) => {
  if (!carDetails || !carDetails.colors || !colorName) {
    return null;
  }

  const colorInfo = carDetails.colors[colorName];
  if (typeof colorInfo === 'object' && colorInfo !== null) {
    for (const suffix of colorPriceSuffixes) {
      if (colorInfo[suffix] !== undefined) {
        const price = colorInfo[suffix];
        
        // Handle string price
        if (typeof price === 'string') {
          if (price.toLowerCase() === 'included') {
            return 'Included';
          }
          const numericPrice = parseFloat(price.replace(/,/g, ''));
          return isNaN(numericPrice) ? null : numericPrice;
        }
        
        // Handle number price
        if (typeof price === 'number') {
          return price;
        }
        
        // Handle other types (return null for unexpected types)
        return null;
      }
    }
  }
  return null;
};

export const getFinalPrice = (carDetails, selectedConfig, selectedColor) => {
  let totalPrice = getCurrentPrice(carDetails, selectedConfig, selectedColor);
  const colorPrice = getColorPrice(carDetails, selectedColor);
  
  // Only add colorPrice if it's a number
  if (typeof colorPrice === 'number' && !isNaN(colorPrice)) {
    totalPrice += colorPrice;
  }

  return totalPrice;
};