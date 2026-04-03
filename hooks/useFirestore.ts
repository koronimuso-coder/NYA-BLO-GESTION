"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  onSnapshot, 
  QueryConstraint, 
  DocumentData 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useFirestoreCollection(collectionPath: string, constraints: QueryConstraint[] = []) {
  const [data, setData] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionPath), ...constraints);
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const items: DocumentData[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(`❌ Firestore Error (${collectionPath}):`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionPath]);

  return { data, loading, error };
}
