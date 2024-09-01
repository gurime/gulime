import React from 'react'
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import { getCheckout } from "../lib";
import { RiseLoader } from 'react-spinners';

export async function generateMetadata({ params }) {
  const checkoutId = params.id;
  try {
    const checkoutDetails = await getCheckout(checkoutId);
    if (checkoutDetails) {
      return {
        title: `Gulime | Checkout - ${checkoutId}`,
      };
    } else {
      return {
        title: 'Gulime | Checkout Not Found',
      };
    }
  } catch (error) {
    return {
      title: 'Gulime | Checkout Error',
    };
  }
}

export default async function CheckOutDetails({ params }) {
  const checkoutId = params.id;
  // Fetch checkout details
  const checkout = await getCheckout(checkoutId);

  if (!checkout) {
    return <div><RiseLoader/></div>;
  }

  const currentDate = new Date();
  const twoDaysAhead = new Date(currentDate.getTime() + (2 * 24 * 60 * 60 * 1000));
  const formattedDate = twoDaysAhead.toLocaleDateString();

  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return null;
    return numPrice.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const totalPrice = checkout.items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

  return (
    <>
      <Navbar/>
      <div className="Checkout-container">
        <h1 className="Checkout-title">Checkout Details</h1>
        <p className="Checkout-info">Checkout ID: {checkoutId}</p>
        <p className="Checkout-info">Expected Delivery: {formattedDate}</p>
        <p className="Checkout-info">Created At: {checkout.createdAt?.toDate().toLocaleString()}</p>
        
        <div className="Checkout-items">
          {checkout.items.map((item, index) => (
            <div key={index} className="Checkout-item">
              <h2 className="Checkout-itemTitle">{item.title || item.cartitle}</h2>
              <div className="Checkout-itemDetails">
                <div className="Checkout-itemInfo">
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: {formatPrice(item.price)}</p>
                  <p>Category: {item.category}</p>
                  {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                  {item.selectedConfiguration && <p>Configuration: {item.selectedConfiguration}</p>}
                  {item.selectedRim && <p>Rim: {item.selectedRim}</p>}
                  {item.carrange > 0 && <p>Range: {item.carrange} miles</p>}
                  {item.carsecs > 0 && <p>0-60 mph: {item.carsecs} seconds</p>}
                  {item.topspeed > 0 && <p>Top Speed: {item.topspeed} mph</p>}
                </div>
                <div className="Checkout-itemImages">
                  {item.coverimage && <img src={item.coverimage} alt={item.title} />}
                  {item.selectedColorUrl && <img src={item.selectedColorUrl} alt={item.title} />}
                </div>
              </div>
              {item.content && <p className="Checkout-itemDescription">Description: {item.content}</p>}
            </div>
          ))}
        </div>
        
        <h3 className="Checkout-totalPrice">Total Price: {formatPrice(totalPrice)}</h3>
      </div>
      <Footer/>
    </>
  )
}