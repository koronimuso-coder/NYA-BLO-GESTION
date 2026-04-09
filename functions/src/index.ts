import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

/**
 * Automatiquement déclenché à chaque nouvelle saisie journalière.
 * Calcule les agrégats de l'entreprise et envoie une notification.
 */
export const onNewDailyEntry = functions.firestore
  .document("daily_entries/{entryId}")
  .onCreate(async (snap, context) => {
    const entry = snap.data();
    const { companyId, amount, paidAmount } = entry;

    // Mise à jour des stats de l'entreprise (aggregation rapide)
    const companyRef = db.collection("companies").doc(companyId);
    
    await db.runTransaction(async (transaction) => {
      const companyDoc = await transaction.get(companyRef);
      if (!companyDoc.exists) return;

      const currentStats = companyDoc.data()?.stats || { totalSales: 0, totalPaid: 0, entryCount: 0 };
      
      transaction.update(companyRef, {
        "stats.totalSales": admin.firestore.FieldValue.increment(amount),
        "stats.totalPaid": admin.firestore.FieldValue.increment(paidAmount),
        "stats.entryCount": admin.firestore.FieldValue.increment(1),
        "lastActivity": admin.firestore.FieldValue.serverTimestamp()
      });
    });

    console.log(`Stats mises à jour pour l'entreprise ${companyId}`);
  });

/**
 * Rapport journalier automatique (cron).
 * S'exécute tous les jours à 20h00.
 */
export const scheduledDailyReport = functions.pubsub
  .schedule("0 20 * * *")
  .timeZone("Africa/Abidjan")
  .onRun(async (context) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Récupérer toutes les saisies du jour
    const entriesSnapshot = await db.collection("daily_entries")
      .where("date", "==", today)
      .get();

    if (entriesSnapshot.empty) {
      console.log("Aucune saisie aujourd'hui.");
      return null;
    }

    // Ici on enverrait l'email via SendGrid ou Firebase Trigger Email
    // Pour l'instant on log les résultats
    console.log(`Rapport du ${today}: ${entriesSnapshot.size} entrées traitées.`);
    
    return null;
  });
