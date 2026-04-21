import { format } from "date-fns";
import { fr } from "date-fns/locale";
/**
 * Formate un prix stocké en centimes en Dirham Marocain (ex: 1500 -> 15,00 DH)
 */
export function formatCurrency(cents: number): string {
  // On utilise la locale fr-MA pour le formatage des nombres
  // Mais on gère manuellement le symbole 'DH' pour garantir la cohérence visuelle demandée '100,00 DH'
  const amount = (cents / 100).toLocaleString("fr-MA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${amount} DH`;
}
/**
 * Formate un timestamp Convex en date lisible (ex: 14/05/2024 à 14:30)
 */
export function formatDate(timestamp: number): string {
  return format(new Date(timestamp), "dd/MM/yyyy 'à' HH:mm", { locale: fr });
}