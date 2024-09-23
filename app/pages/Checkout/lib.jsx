import { db } from "../../Config/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getCheckout(id) {
  const checkoutRef = doc(db, "checkout", id);

  try {
    const snapshot = await getDoc(checkoutRef);
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}