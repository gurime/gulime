'use client'
import { getAuth } from 'firebase/auth';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/app/firebase/firebase';
import Link from 'next/link';

const BrowsingHistory = () => {
  const [browsingHistory, setBrowsingHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchBrowsingHistory = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const browsingHistoryRef = collection(db, 'BrowsingHistory');
        const q = query(
          browsingHistoryRef,
          where('userId', '==', currentUser.uid),
          orderBy('timestamp', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const history = querySnapshot.docs.map((doc) => doc.data());
        setBrowsingHistory(history);
      }
    };

    fetchBrowsingHistory();
  }, []);

  return (
    <>
    <div className="browsing-history">
      <h2>Browsing History</h2>
      <div className="browsing-history-items">
        {browsingHistory.map((item) => (
          <div key={item.id} className="browsing-history-item">
                          <Link href={`/pages/Details/${item.id}`} className="hero-btn">

            <img src={item.coverimage} alt={item.title} />
            </Link>
        
          </div>
        ))}
      </div>
    </div>
</>
);
};

export default BrowsingHistory;
