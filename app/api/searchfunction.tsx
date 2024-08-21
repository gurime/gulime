import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../Config/firebase";

type Article = {
    title: string;
    price: string;
    id: string;
    coverimage:string;
    collection: string;
  };
  
  export async function getArticle(searchTerm: string): Promise<Article[]> {
    try {
      const collectionNames = ['products']; // Add more collection names if needed
  
      // Fetch documents from each collection in parallel
      const querySnapshots = await Promise.all(
        collectionNames.map((collectionName) =>
          getDocs(query(collection(db, collectionName)))
        )
      );
  
      // Use an array to store unique articles
      const uniqueArticles: Article[] = [];
  
      querySnapshots.forEach((querySnapshot, index) => {
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
  
          // Check if the article title or owner includes the search term
          if (
            (docData.title &&
              docData.title.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
            (docData.owner &&
              docData.owner.toLowerCase().includes(searchTerm.toLowerCase().trim()))
          ) {
            uniqueArticles.push({
              id: doc.id,
              title: docData.title,
              price: docData.price,
              coverimage:docData.coverimage,
              collection: collectionNames[index]
            });
          }
        });
      });
  
      return uniqueArticles;
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  }
  