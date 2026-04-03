import { db } from "./firebase";
import { collection, doc, setDoc, writeBatch } from "firebase/firestore";

/**
 * Script de pré-configuration Firestore pour NYA BLO BUSINESS OS.
 * À exécuter une fois pour initialiser les 4 entreprises et la structure de base.
 */
export async function seedFirestore() {
  console.log("🌍 Initialisation de la Cosmogonie Firestore...");
  const batch = writeBatch(db);

  // 1. ENTREPRISES
  const companies = [
    {
      id: "nya-blo-digital",
      name: "NYA BLO SARL",
      sector: "Digital Services",
      description: "Agence Tech & IA",
      metrics: { monthly_ca: 5000000, conversion_rate: 15 }
    },
    {
      id: "galf-formation",
      name: "GALF FORMATION",
      sector: "BTP / Engins",
      description: "Centre de formation spécialisé",
      metrics: { monthly_ca: 8000000, conversion_rate: 20 }
    },
    {
      id: "yoela-flowers",
      name: "YOELA FLOWERS",
      sector: "Fleurs & Event",
      description: "Boutique florale premium",
      metrics: { monthly_ca: 2000000, conversion_rate: 35 }
    },
    {
      id: "yoela-beauty",
      name: "YOELA BEAUTY",
      sector: "Luxe & Beauté",
      description: "Institut de beauté",
      metrics: { monthly_ca: 3000000, conversion_rate: 45 }
    }
  ];

  companies.forEach((company) => {
    const companyRef = doc(db, "companies", company.id);
    batch.set(companyRef, {
      ...company,
      status: "ACTIVE",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  });

  // 2. EXEMPLE DE LEAD
  const leadRef = doc(collection(db, "leads"));
  batch.set(leadRef, {
    company_id: "galf-formation",
    client_name: "Ibrahim Touré",
    status: "NEW",
    value: 250000,
    source: "Facebook",
    created_at: new Date().toISOString(),
  });

  try {
    await batch.commit();
    console.log("✅ Firestore Initialisé avec Succès !");
  } catch (error) {
    console.error("❌ Erreur lors du seed Firestore:", error);
  }
}
