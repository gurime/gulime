import AdminHeader from "@/app/components/AdminHeader";
import { getArticle } from "../lib";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";


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
    const sanitizedPost: any = JSON.parse(JSON.stringify(post));
    const sanitiPost: any = JSON.parse(JSON.stringify(post));

    if (!post) {
        return <div>Product not found</div>;
    }
const lastUpdatedDate: Date | null = post.timestamp && post.timestamp.toDate();
const formattedDate: string | null = lastUpdatedDate && `${lastUpdatedDate.toLocaleString('en-US', 
{ timeZone: 'America/New_York', day: 'numeric', month: 'long', year: 'numeric' })}, 
${lastUpdatedDate.toLocaleString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: 'numeric', hour12: true })}`;

return (
<>
  <AdminHeader />
  <Navbar />
  <div className="article-container">
  
    <div className="product-details">
      <div className="product-images">
        <div className="main-image">
          {post.coverimage && (
            <img
              className="cover_image"
              src={post.coverimage}
              alt="Property Cover"
            />
          )}
        </div>
        <div className="thumbnails">
          {[1, 2, 3, 4, 5, 6, 7].map((index) => {
            const showcase = post[`imgshowcase${index}`];
            return showcase && showcase !== '' && (
              <img
                key={`imgshowcase${index}`}
                className={`imgshowcase${index}`}
                src={showcase}
                alt={`imgshowcase ${index}`}
              />
            );
          })}
        </div>
      </div>
      <div className="product-info">
        <h1 className="product-title">{post.title}</h1>
        <p className="product-price">{post.price}</p>
        {/* Add other product details here */}
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
