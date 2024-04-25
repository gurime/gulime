import { db } from "@/app/firebase/firebase";
import { doc, getDoc, DocumentSnapshot } from "firebase/firestore";

export async function getArticle(id: string): Promise<any | null> {
    const collectionRefs: any[] = [
      doc(db, 'Dashboard', id),

    ];
  
    try {
      for (const ref of collectionRefs) {
        const snapshot: DocumentSnapshot = await getDoc(ref);
        if (snapshot.exists()) {
          return snapshot.data();
        }
      }
      console.log(`Article with ID ${id} not found in any collection.`);
      return null;
    } catch (error) {
      console.error(`Error fetching article with ID ${id}:`, error);
      return null;
    }
  }