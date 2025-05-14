import { supabase } from '@/lib/supabase';

export interface EleveStatsData {
  totalEleves: number | null;
  percentChange: number | null;
  isLoading: boolean;
}

export async function fetchElevesStats(): Promise<EleveStatsData> {
  try {
    // Récupérer l'utilisateur actuel
    const userData = localStorage.getItem('autosoft_user');
    if (!userData) {
      return { totalEleves: null, percentChange: null, isLoading: false };
    }
    
    const user = JSON.parse(userData);
    
    // Obtenir la date du premier jour du mois en cours
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Obtenir la date du premier jour du mois suivant le mois en cours
    const firstDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    // Obtenir la date du premier jour du mois précédent
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    // Requête pour compter le nombre d'élèves du mois en cours uniquement
    let currentQuery = supabase
      .from('eleves')
      .select('id_eleve', { count: 'exact' })
      .gte('date_inscription', firstDayCurrentMonth.toISOString().split('T')[0])
      .lt('date_inscription', firstDayNextMonth.toISOString().split('T')[0]);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (user.id_bureau !== 0) {
      currentQuery = currentQuery.eq('id_bureau', user.id_bureau);
    }
    
    // Toujours filtrer par école
    currentQuery = currentQuery.eq('id_ecole', user.id_ecole);
    
    const { count: currentCount, error: currentError } = await currentQuery;
    
    if (currentError) throw currentError;
    
    // Requête pour compter le nombre d'élèves du mois dernier
    // (inscrits pendant le mois précédent uniquement)
    let lastMonthQuery = supabase
      .from('eleves')
      .select('id_eleve', { count: 'exact' })
      .gte('date_inscription', firstDayLastMonth.toISOString().split('T')[0])
      .lt('date_inscription', firstDayCurrentMonth.toISOString().split('T')[0]);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (user.id_bureau !== 0) {
      lastMonthQuery = lastMonthQuery.eq('id_bureau', user.id_bureau);
    }
    
    // Toujours filtrer par école
    lastMonthQuery = lastMonthQuery.eq('id_ecole', user.id_ecole);
    
    const { count: lastMonthCount, error: lastMonthError } = await lastMonthQuery;
    
    if (lastMonthError) throw lastMonthError;
    
    // Calculer le pourcentage de changement
    let percentChange = null;
    
    if (currentCount !== null && lastMonthCount !== null) {
      const change = currentCount - lastMonthCount;
      const percentChangeValue = lastMonthCount > 0 ? (change / lastMonthCount) * 100 : 0;
      percentChange = parseFloat(percentChangeValue.toFixed(1));
    }
    
    return {
      totalEleves: currentCount,
      percentChange,
      isLoading: false
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques d\'élèves:', error);
    return { totalEleves: null, percentChange: null, isLoading: false };
  }
}
