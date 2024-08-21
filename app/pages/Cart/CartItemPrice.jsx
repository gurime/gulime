import React from 'react';

const CartItemPrice = ({ item }) => {
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const formattedPrice = formatNumber(parseFloat(item.price.replace(/,/g, '')));

  return (
    <>
      ${formattedPrice}
    </>
  );
};

export default CartItemPrice;