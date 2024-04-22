import AdminHeader from "@/app/components/AdminHeader";
import { getArticle } from "../lib";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import ProductRatings from "@/app/components/ProductRatings";
import ImageGallery from "@/app/components/ImageGallery";
import ContentDisplay from "@/app/components/ContentDisplay";
import AddtocartBtn from "@/app/components/AddtocartBtn";



export async function generateMetadata({ params }: { params: { id: string } }): Promise<{ title: string }> {
    const articleId: string = params.id;
  
    try {
      const articleDetails: any | null = await getArticle(articleId);
  
      if (articleDetails) {
        return {
          title: `Gulime | ${articleDetails.title || 'Page Not Found'}`,
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



  export default async function DetailsPage({ params }: { params: { id: string } }): Promise<JSX.Element> {

    const articleId: string = params.id;

    // Fetch article details
    const post: any | null = await getArticle(articleId);
   

    if (!post) {
        return <div>Product not found</div>;
    }
    const currentDate = new Date();
  const twoDaysAhead = new Date(currentDate.getTime() + (2 * 24 * 60 * 60 * 1000));
  const formattedDate = twoDaysAhead.toLocaleDateString();
  const images = [post.coverimage, post.imgshowcase, post.imgshowcase1, post.imgshowcase2, post.imgshowcase3, post.imgshowcase4, post.imgshowcase5, post.imgshowcase6, post.imgshowcase7].filter(Boolean);


return (
<>
  <AdminHeader />
  <Navbar />
  <div className="article-container">
  
  <div className="product-details">
  <ImageGallery images={images} />

  <div className="product-info">
    <h1 className="product-title">{post.title}</h1>
    <ProductRatings productId={articleId} />

    <p className="product-price">{post.price}</p>

    
    <div className="product-details">
       <p>
        <strong>About this item:</strong>
      </p>
    
      <ul>
      <ContentDisplay
  content={post.content}
  content1={post.content1}
  content2={post.content2}
  content3={post.content3}
  content4={post.content4}
  content5={post.content5}
  content6={post.content6}
  content7={post.content7}
  content8={post.content8}
  content9={post.content9}
  content10={post.content10}
/>    
      </ul>
    </div>
<AddtocartBtn post={post}/>
    <div className="product-delivery">
      <p>
      
        <strong>Delivery:</strong> Get it by {formattedDate}
      </p>
      <p>
        <strong>Pickup:</strong> Free pickup today at{' '}
        <a href="#">Gulime</a>
      </p>
    </div>
  </div>
</div>
  
  <div className="body-content">
    <p>{post.content}</p>
  </div>
  </div>

  <Footer />
</>
)
}
