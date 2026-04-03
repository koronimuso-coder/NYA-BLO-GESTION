/**
 * Formate un nombre en devise FCFA selon le format ivoirien
 */
export function formatFCFA(amount: number | string | bigint): string {
  const num = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  
  if (isNaN(num)) return "0 FCFA";

  // Utilise le format français avec espaces comme séparateur de milliers
  const formatted = new Intl.NumberFormat("fr-CI", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);

  return formatted;
}
