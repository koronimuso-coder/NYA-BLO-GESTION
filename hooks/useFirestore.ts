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
        
        // --- WOW MOCK FALLBACK SYSTEM ---
        // If the collection is empty, we inject premium mock data for demonstration
        if (items.length === 0) {
          const mockData: Record<string, DocumentData[]> = {
            "companies": [
              { id: "galf-id", name: "GALF Production", type: "BTP & Industrie", metrics: { conversion_rate: 68 } },
              { id: "yoela-f-id", name: "Yoela Flowers", type: "Artisanat Floral", metrics: { conversion_rate: 42 } },
              { id: "beauty-id", name: "Yoela Beauty", type: "Institut de Soins", metrics: { conversion_rate: 55 } }
            ],
            "leads": [
              { id: "lead-1", client_name: "Yasmine Diabaté", status: "NEGOTIATION", value: 1250000, company_id: "galf-formation", created_at: new Date().toISOString() },
              { id: "lead-2", client_name: "Hôtel Ivoire", status: "INTERESTED", value: 4500000, company_id: "yoela-flowers", created_at: new Date().toISOString() }
            ],
            "sales": [
              { id: "sale-1", client_name: "Marie Koné", amount: 75000, amount_paid: 75000, status: "Payé", company_id: "yoela-beauty", created_at: new Date().toISOString() }
            ],
            "sessions": [
              { id: "SESS-01", title: "Formation HSE - Sécurité Chantier", date: "2025-05-15", enrolled: 12, capacity: 15, status: "Ouvert", company_id: "galf-formation" }
            ]
          };

          if (mockData[collectionPath]) {
            console.log(`✨ Mode Démo: Injection de données pour ${collectionPath}`);
            setData(mockData[collectionPath]);
            setLoading(false);
            return;
          }
        }
        // --- END WOW MOCK FALLBACK ---

        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(`❌ Firestore Error (${collectionPath}):`, (err as Error).message);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionPath, constraints]); // constraints is the missing dependency

  return { data, loading, error };
}
