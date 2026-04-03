import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, doc, writeBatch } from "firebase/firestore";

/**
 * Route d'initialisation Cosmos (v3 FULL) pour NYA BLO OS.
 * URL: /api/admin/reboot
 */
export async function GET() {
  console.log("🌌 Déclenchement du Big Bang Final...");
  const batch = writeBatch(db);

  // 1. ENTREPRISES
  const companies = [
    { id: "nya-blo-digital", name: "NYA BLO SARL", slug: "nya-blo-digital", sector: "Digital Services", metrics: { monthly_ca: 5000000, conversion_rate: 15 } },
    { id: "galf-formation", name: "GALF FORMATION", slug: "galf-formation", sector: "BTP / Engins", metrics: { monthly_ca: 8200000, conversion_rate: 22 } },
    { id: "yoela-flowers", name: "YOELA FLOWERS", slug: "yoela-flowers", sector: "Fleurs & Event", metrics: { monthly_ca: 2100000, conversion_rate: 38 } },
    { id: "yoela-beauty", name: "YOELA BEAUTY", slug: "yoela-beauty", sector: "Luxe & Beauté", metrics: { monthly_ca: 3400000, conversion_rate: 42 } }
  ];

  companies.forEach(company => {
    batch.set(doc(db, "companies", company.id), { ...company, status: "ACTIVE", updated_at: new Date().toISOString() }, { merge: true });
  });

  // 2. GALF (Trainings & Sessions)
  const galfTrainings = [
    { id: "TR-001", name: "Pelle hydraulique", category: "Génie Civil", price: 250000, company_id: "galf-formation" },
    { id: "TR-002", name: "Grutier", category: "Équipement Lourd", price: 350000, company_id: "galf-formation" }
  ];
  galfTrainings.forEach(t => batch.set(doc(db, "trainings", t.id), t, { merge: true }));

  // 3. FLOWERS (Inventory & Orders)
  const flowersStock = [
    { id: "FL-001", name: "Roses Rouges", type: "Fleur fraîche", stock: 120, min_stock: 50, price: 5000, company_id: "yoela-flowers" },
    { id: "FL-002", name: "Lys Blanc", type: "Fleur fraîche", stock: 15, min_stock: 30, price: 8000, company_id: "yoela-flowers" }
  ];
  flowersStock.forEach(s => batch.set(doc(db, "inventory", s.id), s, { merge: true }));

  // 4. BEAUTY (Appointments)
  const beautyAppts = [
    { client_name: "Mariam Kouassi", service: "Soin Visage Hydratant", date: "Demain 14:00", status: "Confirmé", company_id: "yoela-beauty" },
    { client_name: "Nadia Bamba", service: "Pose Gel & Nail Art", date: "Mardi 10:00", status: "En attente", company_id: "yoela-beauty" }
  ];
  beautyAppts.forEach(a => batch.set(doc(collection(db, "appointments")), a));

  // 5. DIGITAL (Projects)
  const digitalProjects = [
    { name: "Site E-commerce ACAD", client: "ACAD-CI", progress: 65, status: "En cours", company_id: "nya-blo-digital" },
    { name: "App Mobile Yoela", client: "NYA BLO", progress: 90, status: "Finalisation", company_id: "nya-blo-digital" }
  ];
  digitalProjects.forEach(p => batch.set(doc(collection(db, "projects")), p));

  // 6. LEADS & SALES (Global)
  const leads = [
    { company_id: "galf-formation", client_name: "Seydou Konaté", status: "NEGOTIATION", value: 180000 },
    { company_id: "nya-blo-digital", client_name: "Cabinet Juridique ABA", status: "NEW", value: 500000 }
  ];
  leads.forEach(l => batch.set(doc(collection(db, "leads")), { ...l, created_at: new Date().toISOString() }));

  const sales = [
    { company_id: "galf-formation", client_name: "Drissa Coulibaly", amount: 180000, status: "Payé", item: "Formation Pelle" },
    { company_id: "yoela-beauty", client_name: "Aïcha Diallo", amount: 15000, status: "Payé", item: "Manucure" }
  ];
  sales.forEach(s => batch.set(doc(collection(db, "sales")), { ...s, created_at: new Date().toISOString(), id: `V-${Math.random().toString(36).substr(2, 6).toUpperCase()}` }));

  try {
    await batch.commit();
    return NextResponse.json({ success: true, message: "NYA BLO OS FULL REBOOT COMPLETED" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
