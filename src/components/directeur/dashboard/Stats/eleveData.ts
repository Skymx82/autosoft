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
    
    // Requête pour compter le nombre total d'élèves
    let query = supabase
      .from('eleves')
      .select('id_eleve', { count: 'exact' });
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (user.id_bureau !== 0) {
      query = query.eq('id_bureau', user.id_bureau);
    }
    
    // Toujours filtrer par école
    query = query.eq('id_ecole', user.id_ecole);
    
    const { count: currentCount, error } = await query;
    
    if (error) throw error;
    
    // Simulation du pourcentage de changement pour la démonstration
    // Dans une application réelle, vous feriez une requête pour obtenir le nombre d'élèves du mois dernier
    let percentChange = null;
    
    if (currentCount !== null) {
      const lastMonthCount = Math.floor(currentCount * 0.95); // Simuler une augmentation de 5%
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
