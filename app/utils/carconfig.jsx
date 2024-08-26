import { useState, useEffect } from 'react';
import { getFirestore, getDoc, doc } from 'firebase/firestore';
import { color } from 'framer-motion';

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


const rimImageSuffixes = ['colorImages'];
const rimPriceSuffixes = ['RimPrice'];

export const useCarDetails = (
  id,
  setSelectedColor,
  setSelectedConfig,
  setSelectedRim,
  selectedColor,
  selectedConfig,
  selectedRim
) => {
  const [carDetails, setCarDetails] = useState(null);
  const [sortedColorKeys, setSortedColorKeys] = useState([]);
  const [sortedConfigKeys, setSortedConfigKeys] = useState([]);
  const [sortedRimKeys, setSortedRimKeys] = useState([]);

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
          if (carData.rims) {
            const rimKeys = Object.keys(carData.rims).sort();
            setSortedRimKeys(rimKeys);
            if (!selectedRim) {
              setSelectedRim(rimKeys[0]);
            }
          }
        }
      }
    };

    fetchCarDetails();
  }, [id, setSelectedColor, setSelectedConfig, setSelectedRim, selectedColor, selectedConfig, selectedRim]);

  return { carDetails, sortedColorKeys, sortedConfigKeys, sortedRimKeys };
};

export const getRimSize = (carDetails, rimName) => {
  if (!carDetails || !carDetails.rims || !carDetails.rims[rimName]) {
    return null;
  }
  return carDetails.rims[rimName].rimSize || null;
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


export const getRimButtonStyle = (carDetails, rim, selectedColor) => {
  if (!carDetails || !carDetails.rims || !carDetails.rims[rim]) {
    return {};
  }

  const rimData = carDetails.rims[rim];
  const colorImage = rimData.colorImages && rimData.colorImages[selectedColor];

  if (colorImage) {
    return { backgroundImage: `url('${colorImage}')` };
  }

  // Fallback to default rim image if color-specific image is not available
  return { backgroundImage: `url('${rimData.RimImage}')` };
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

export const getCarImageUrl = (carDetails, selectedRim, selectedColor) => {

  if (!carDetails || !carDetails.rims) {
    return null;
  }

  const rimData = carDetails.rims[selectedRim];
  if (!rimData) {
    return null;
  }


  if (rimData.colorImages) {
    // Normalize the selected color (remove spaces, convert to lowercase)
    const normalizedSelectedColor = selectedColor.replace(/\s+/g, '').toLowerCase();

    // Find a matching color, ignoring spaces and case
    const matchingColor = Object.keys(rimData.colorImages).find(color => 
      color.replace(/\s+/g, '').toLowerCase() === normalizedSelectedColor
    );

    if (matchingColor) {
      return rimData.colorImages[matchingColor];
    }

    // If no exact match, try to find a partial match
    const partialMatch = Object.keys(rimData.colorImages).find(color => 
      color.toLowerCase().includes(normalizedSelectedColor) ||
      normalizedSelectedColor.includes(color.toLowerCase())
    );

    if (partialMatch) {
      console.log('Found partial match for color:', partialMatch);
      return rimData.colorImages[partialMatch];
    }
  }

  // If no color-specific image found, fall back to the default rim image
  if (rimData.RimImage) {
    return rimData.RimImage;
  }

  return null;
};


export const getRimThumbnailUrl = (carDetails, rimName) => {
  if (!carDetails || !carDetails.rims || !carDetails.rims[rimName]) {
    return null;
  }

  return carDetails.rims[rimName].RimImage;
};


export const getRimUrl = (carDetails, rimName, selectedColor) => {
  if (!carDetails || !carDetails.rims || !carDetails.rims[rimName]) {
    return null;
  }

  const rimData = carDetails.rims[rimName];
  const colorImage = rimData.colorImages && rimData.colorImages[selectedColor];

  return colorImage || rimData.RimImage;
};




export const getRimPrice = (carDetails, rimName) => {
  if (!carDetails || !carDetails.rims || !carDetails.rims[rimName]) {
    return null;
  }

  const rimPrice = carDetails.rims[rimName].rimPrice;

  if (rimPrice === 'Included') {
    return 'Included';
  }

  return typeof rimPrice === 'number' ? rimPrice : null;
};



export const getCurrentPrice = (carDetails, selectedConfig, selectedColor, selectedRim) => {
  let totalPrice = 0;
  
  if (selectedConfig && carDetails.configurations?.[selectedConfig]) {
    const configPrice = carDetails.configurations[selectedConfig].price;
    totalPrice = typeof configPrice === 'string' 
      ? parseFloat(configPrice.replace(/,/g, '').replace('$', ''))
      : (typeof configPrice === 'number' ? configPrice : 0);
  }

  const colorPrice = getColorPrice(carDetails, selectedColor);
  if (typeof colorPrice === 'number') {
    totalPrice += colorPrice;
  }

  const rimPrice = getRimPrice(carDetails, selectedRim);
  if (typeof rimPrice === 'number') {
    totalPrice += rimPrice;
  }

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