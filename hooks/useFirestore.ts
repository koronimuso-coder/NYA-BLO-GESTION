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

const EMPTY_CONSTRAINTS: QueryConstraint[] = [];

export function useFirestoreCollection<T = DocumentData>(collectionPath: string, constraints: QueryConstraint[] = EMPTY_CONSTRAINTS) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // --- WOW MOCK FALLBACK SYSTEM ---
    const hasDb = !!db && Object.keys(db).length > 0 && "app" in db;

    if (!hasDb) {
      const mockData: Record<string, DocumentData[]> = {
        "companies": [
          { id: "galf-id", name: "GALF Production", sector: "BTP & Industrie", ca: 8500000, sales: 42, leads: 156, conversion: 68, trend: "up" },
          { id: "yoela-f-id", name: "Yoela Flowers", sector: "Artisanat Floral", ca: 2200000, sales: 58, leads: 84, conversion: 42, trend: "neutral" },
          { id: "beauty-id", name: "Yoela Beauty", sector: "Institut de Soins", ca: 3000000, sales: 124, leads: 210, conversion: 55, trend: "up" },
          { id: "nya-blo-id", name: "NYA BLO OS", sector: "Digital Services", ca: 4500000, sales: 12, leads: 45, conversion: 82, trend: "up" }
        ],
        "leads": [
          { id: "l1", client_name: "Yasmine D.", status: "NEGOTIATION", value: 1250000 },
          { id: "l2", client_name: "Hôtel Ivoire", status: "INTERESTED", value: 4500000 }
        ],
        "sales": [
          { id: "s1", amount: 8500000, amount_paid: 7200000, company_id: "galf-id" }
        ]
      };
      
      Promise.resolve().then(() => {
        setData((mockData[collectionPath] || []) as T[]);
        setLoading(false);
      });
      return;
    }

    const q = query(collection(db, collectionPath), ...constraints);
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const items: DocumentData[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        
        if (items.length === 0) {
           // Reuse mock data for empty collections
           const mockData: Record<string, DocumentData[]> = {
             "companies": [{ id: "galf-id", name: "GALF Production", type: "BTP", metrics: { conversion_rate: 68 } }]
           };
           setData((mockData[collectionPath] || []) as T[]);
        } else {
          setData(items as T[]);
        }
        setLoading(false);
      },
      (err) => {
        console.error(`❌ Firestore Error (${collectionPath}):`, (err as Error).message);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionPath, constraints]);
 // constraints is the missing dependency

  return { data, loading, error };
}
