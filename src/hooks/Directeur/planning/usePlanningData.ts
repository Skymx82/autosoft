import { useState, useEffect } from 'react';

interface Moniteur {
  id_moniteur: number;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  num_enseignant: string;
}

interface Eleve {
  id_eleve: number;
  nom: string;
  prenom: string;
  tel: string;
  categorie: string;
  id_moniteur: number | null;
}

interface Lecon {
  id_planning: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  type_lecon: string;
  statut_lecon: string;
  id_moniteur: number;
  id_eleve: number;
  eleves: {
    id_eleve: number;
    nom: string;
    prenom: string;
    tel: string;
    categorie: string;
  } | null;
}

interface LeconsByDay {
  [date: string]: {
    [moniteurId: number]: Lecon[];
  };
}

interface PlanningData {
  moniteurs: Moniteur[];
  lecons: Lecon[];
  leconsByDay: LeconsByDay;
  eleves: Eleve[];
}

interface UsePlanningDataResult {
  isLoading: boolean;
  error: string | null;
  data: PlanningData | null;
  refetch: () => void;
}

export function usePlanningData(
  id_ecole: string,
  id_bureau: string = '0',
  startDate: string,
  endDate: string,
  view: 'day' | 'week' | 'month' = 'week'
): UsePlanningDataResult {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PlanningData | null>(null);

  const fetchData = async () => {
    if (!id_ecole || !startDate || !endDate) {
      setError('Paramètres manquants');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        id_ecole,
        id_bureau,
        startDate,
        endDate,
        view
      });

      const response = await fetch(`/api/directeur/planning?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des données');
      }

      const planningData = await response.json();
      setData(planningData);
    } catch (err) {
      console.error('Erreur dans usePlanningData:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id_ecole, id_bureau, startDate, endDate, view]);

  return {
    isLoading,
    error,
    data,
    refetch: fetchData
  };
}
