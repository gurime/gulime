import React, { useMemo } from 'react';

const CartSummary = ({ items }) => {

  // Convert items object to array if necessary
  const itemsArray = useMemo(() => {
    if (Array.isArray(items)) {
      return items;
    } else if (typeof items === 'object' && items !== null) {
      return Object.values(items);
    } else {
      return [];
    }
  }, [items]);

  // Calculate total price and item count
  const { totalPrice, itemCount } = useMemo(() => {
    return itemsArray.reduce((acc, item) => {
      if (!item || typeof item.price === 'undefined' || typeof item.quantity === 'undefined') {
        return acc;
      }

      const itemPrice = parseFloat(item.price) * item.quantity;
      return {
        totalPrice: acc.totalPrice + itemPrice,
        itemCount: acc.itemCount + item.quantity
      };
    }, { totalPrice: 0, itemCount: 0 });
  }, [itemsArray]);

  // Format the total price
  const formattedTotalPrice = formatNumber(totalPrice.toFixed(2));

  // Format number function
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div style={{ textAlign: 'end' }}>
      <h3>Total ({itemCount} items): ${formattedTotalPrice}</h3>
    </div>
  );
};

export default CartSummary;