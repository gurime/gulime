import Navbar from "../../../components/Navbar";
import { getArticle } from "../lib";
import ImageGallery from "../../../components/ImageGallery";
import ProductRatings from "../../../components/ProductRatings";
import CarDetailsClient from "../CarDetailsClient";
import ContentDisplay from "../../../components/ContentDisplay";
import ReviewListing from "../../../components/ReviewListings";
import Footer from "../../../components/Footer";
import TrackList from "../../../components/TrackList";
import ProductCartBtn from '../../Cart/ProductCartBtn'

export async function generateMetadata({ params }) {
  const articleId = params.id;

  try {
    const articleDetails = await getArticle(articleId);

    if (articleDetails) {
      const title = articleDetails.title || articleDetails.cartitle || articleDetails.trucktitle || 'Page Not Found';
      return {
        title: `Gulime | ${title}`,
      };
    } else {
      return {
        title: 'Gulime | Page Not Found',
      };
    }
  } catch (error) {
    return {
      title: 'Gulime | Page Not Found',
    };
  }
}

export default async function DetailsPage({ params }) {
  const articleId = params.id;

  // Fetch article details
  const post = await getArticle(articleId);

  if (!post) {
    return <div><RiseLoader/></div>;
  }

  const currentDate = new Date();
  const twoDaysAhead = new Date(currentDate.getTime() + (2 * 24 * 60 * 60 * 1000));
  const formattedDate = twoDaysAhead.toLocaleDateString();

  const images = [post.coverimage, post.imgshowcase, post.imgshowcase1, post.imgshowcase2, post.imgshowcase3, post.imgshowcase4, post.imgshowcase5, post.imgshowcase6, post.imgshowcase7].filter(Boolean);

  // Convert the `timestamp` object to a simple value
  const product = {
    ...post,
    timestamp: post.timestamp ? post.timestamp.seconds : null,
  };

  const formatPrice = (price) => {
    // Ensure price is a number
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Check if it's a valid number
    if (isNaN(numPrice)) return null;
    
    // Format the number with commas and two decimal places
    return numPrice.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };
  const isCar = Boolean(product.configurations || product.colors || product.cartitle);

  return (
    <>
      <Navbar />
      <div className="product-container">
        <ImageGallery images={images} />
        <div className="product-details">
          <div className="product-info">
            <h1 className="detailproduct-title">{product.title}</h1>
            <div className="product-ratings">
              <div className="rating-stars">
                <ProductRatings productId={articleId}/>
              </div>
              <span className="rating-count">{product.ratingCount} </span>
            </div>
            <p className="detailproduct-price">
            {product.price ? `Total Price: $${formatPrice(product.price)}` : null}
            </p>
            {isCar ? (
              <CarDetailsClient 
                product={product}
                articleId={articleId}
                images={images}
                formattedDate={formattedDate}
              />
            ) : (
          
                <ProductCartBtn articleId={articleId} product={product} />
           
            )}

          
<div className="product-delivery">
<p>
<strong style={{padding:'3rem'}}>Delivery:</strong> Get it by {formattedDate} 
</p>
<p>
<strong style={{padding:'3rem'}}>Pickup:</strong> Free pickup today at <a href="#">Gulime</a>
</p>
</div>
</div>
<div className="product-details-info">
            <p>
              <strong style={{padding:'3rem'}}>About this item:</strong>
            </p>
            <ul>
              <ContentDisplay
                content={product.content}
                content1={product.content1}
                content2={product.content2}
                content3={product.content3}
                content4={product.content4}
                content5={product.content5}
                content6={product.content6}
                content7={product.content7}
                content8={product.content8}
                content9={product.content9}
                content10={product.content10}
              />
            </ul>
          </div>
          {product?.tracks  &&(<TrackList tracks={product.tracks} />)}
          </div>
      </div>
      <ReviewListing articleId={articleId}/>
      <Footer />
    </>
  );
}