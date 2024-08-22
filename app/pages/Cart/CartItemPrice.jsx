import React from 'react';

const CartItemPrice = ({ item }) => {
  function formatNumber(num) {
    // Ensure the input is a number
    const number = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
    
    // Check if the parsing resulted in a valid number
    if (isNaN(number)) {
      console.error('Invalid price value:', num);
      return '0.00';
    }

    // Format the number with commas and two decimal places
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const formattedPrice = formatNumber(item.price);

  return (
    <>
      ${formattedPrice}
    </>
  );
};

export default CartItemPrice;