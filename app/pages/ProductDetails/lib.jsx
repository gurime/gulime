import { db } from "../../Config/firebase";
import { doc, getDoc } from "firebase/firestore";


export async function getArticle(id) {
  const collectionNames = [
    "products",
    "carts"
    // Pride page stops here
  ];

  const collectionRefs = collectionNames.map(name => doc(db, name, id));

  try {
    const snapshotPromises = collectionRefs.map(ref => getDoc(ref));
    const snapshots = await Promise.all(snapshotPromises);

    for (const snapshot of snapshots) {
      if (snapshot.exists()) {
        return snapshot.data();
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching article: ", error);
    return null;
  }
}