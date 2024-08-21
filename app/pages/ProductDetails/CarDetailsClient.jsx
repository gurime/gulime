'use client';
import React, { useState, useEffect } from 'react';
import CarConfigurator from '../../components/CarConfigurator';
import CarCartBtn from '../Cart/CarCartBtn';
import { getCurrentPrice, getColorPrice } from '../../utils/carconfig'; // Make sure to import these

export default function CarDetailsClient({ product, articleId }) {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedConfig, setSelectedConfig] = useState('');
  const [configurationPrice, setConfigurationPrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    if (product.configurations && selectedConfig) {
      const newPrice = parseFloat(product.configurations[selectedConfig].price);
      if (!isNaN(newPrice)) {
        setConfigurationPrice(newPrice);
      } else {
        setConfigurationPrice(0);
      }
    } else {
      setConfigurationPrice(0);
    }
  }, [selectedConfig, product.configurations]);

  useEffect(() => {
    // Calculate the current price whenever relevant factors change
    const basePrice = getCurrentPrice(product, selectedConfig, selectedColor);
    const colorPrice = getColorPrice(product, selectedColor);
    let calculatedPrice = basePrice;
    
    if (typeof colorPrice === 'number' && !isNaN(colorPrice)) {
      calculatedPrice += colorPrice;
    }

    setCurrentPrice(calculatedPrice);

  }, [product, selectedConfig, selectedColor, configurationPrice]);

  const handleConfigChange = (config) => {
    setSelectedConfig(config);
  };

  // Convert CarDetails to Article
  const articleProduct = {
    ...product,
    title: product.cartitle,
    content: '',
    price: currentPrice, // Use the calculated current price
    basePrice: parseFloat(product.basePrice),
  };


  const isConfigSelected = selectedConfig !== '' && selectedColor !== '';

  return (
    <>
      <CarConfigurator
        initialCarDetails={product}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedConfig={selectedConfig}
        setSelectedConfig={handleConfigChange}
      />
      <div>
        <p>Current Price: ${currentPrice.toFixed(2)}</p>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        {isConfigSelected ? (
          <CarCartBtn 
            articleId={articleId}
            product={articleProduct}
            selectedColor={selectedColor}
            selectedConfiguration={selectedConfig} 
            configurationPrice={configurationPrice}
            currentPrice={currentPrice} // Pass the current price instead of a setter
          />
        ) : (
          <p>Please select a configuration and color before adding to cart.</p>
        )}
      </div>
    </>
  );
}