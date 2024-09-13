export function formatDateToFrenchLocale(dateString: string): string {
  // Découpe la date d'entrée sur les '/'
  const [day, month, year] = dateString.split("/");

  // Crée un objet Date (les mois sont indexés à partir de 0 en JS)
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  // Options pour le formatage avec types spécifiques
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // 'long', 'short' ou 'narrow'
    day: "numeric", // 'numeric' ou '2-digit'
    month: "long", // 'long', 'short' ou 'narrow'
  };

  // Retourne la date formatée en français
  return date.toLocaleDateString("fr-FR", options);
}
