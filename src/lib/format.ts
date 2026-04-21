import { format } from "date-fns";
import { fr } from "date-fns/locale";
/**
 * Formate un prix stocké en centimes en chaîne Euro (ex: 1500 -> 15,00 €)
 */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}
/**
 * Formate un timestamp Convex en date lisible (ex: 14/05/2024 à 14:30)
 */
export function formatDate(timestamp: number): string {
  return format(new Date(timestamp), "dd/MM/yyyy 'à' HH:mm", { locale: fr });
}