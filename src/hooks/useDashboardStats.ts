import { useState, useEffect } from 'react';

// Interface pour les données de statistiques
export interface DashboardStats {
  isLoading: boolean;
  eleves: {
    totalEleves: number | null;
    percentChange: number | null;
  };
  conduite: {
    totalHeures: number | null;
    percentChange: number | null;
  };
  elevesPrets: {
    total: number | null;
    percentChange: number | null;
  };
  chiffreAffaires: {
    total: number | null;
    percentChange: number | null;
  };
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    isLoading: true,
    eleves: { totalEleves: null, percentChange: null },
    conduite: { totalHeures: null, percentChange: null },
    elevesPrets: { total: null, percentChange: null },
    chiffreAffaires: { total: null, percentChange: null },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Récupérer l'utilisateur actuel
        const userData = localStorage.getItem('autosoft_user');
        if (!userData) {
          setStats(prev => ({ ...prev, isLoading: false }));
          return;
        }
        
        const user = JSON.parse(userData);
        
        // Appeler l'endpoint unique
        const response = await fetch(`/api/directeur/dashboard/Stats?id_ecole=${user.id_ecole}&id_bureau=${user.id_bureau}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des statistiques');
        }
        
        const data = await response.json();
        
        setStats({
          isLoading: false,
          ...data
        });
        
      } catch (error) {
        console.error('Erreur:', error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    fetchStats();
  }, []); // Ce hook s'exécute une seule fois au montage du composant

  return stats;
}
