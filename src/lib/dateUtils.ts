/**
 * Utilitaires pour la manipulation et le formatage des dates
 */

/**
 * Formate une heure au format HH:MM:SS en HH:MM
 * @param time - Heure au format HH:MM:SS
 * @returns Heure au format HH:MM
 */
export const formatTimeToHHMM = (time: string): string => {
  // Si le format est déjà HH:MM, on le retourne tel quel
  if (time.length === 5) return time;
  
  // Sinon on extrait les heures et minutes
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

/**
 * Génère un tableau de dates pour une semaine à partir d'une date donnée
 * @param date - Date de référence
 * @returns Tableau de 7 dates (du lundi au dimanche)
 */
export const getWeekDates = (date: Date): Date[] => {
  const result: Date[] = [];
  const day = date.getDay(); // 0 = dimanche, 1 = lundi, ...
  const diff = day === 0 ? 6 : day - 1; // Ajustement pour commencer le lundi
  
  // Date du lundi de la semaine
  const monday = new Date(date);
  monday.setDate(date.getDate() - diff);
  
  // Générer les 7 jours de la semaine
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + i);
    result.push(currentDate);
  }
  
  return result;
};

/**
 * Génère un tableau de dates pour un mois à partir d'une date donnée
 * @param date - Date de référence
 * @returns Tableau de dates pour tout le mois
 */
export const getMonthDates = (date: Date): Date[] => {
  const result: Date[] = [];
  
  // Premier jour du mois
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  
  // Dernier jour du mois
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  // Générer toutes les dates du mois
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
    result.push(currentDate);
  }
  
  return result;
};

/**
 * Formate une date au format français (jj/mm/aaaa)
 * @param date - Date à formater
 * @returns Date au format français
 */
export const formatDateFR = (date: Date): string => {
  return date.toLocaleDateString('fr-FR');
};

/**
 * Calcule la différence en minutes entre deux heures
 * @param startTime - Heure de début au format HH:MM:SS
 * @param endTime - Heure de fin au format HH:MM:SS
 * @returns Différence en minutes
 */
export const getTimeDifferenceInMinutes = (startTime: string, endTime: string): number => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  
  return (end.getTime() - start.getTime()) / (1000 * 60);
};
