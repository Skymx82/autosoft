import { useState, useEffect, useRef, useCallback } from 'react';

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

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface PlanningData {
  moniteurs: Moniteur[];
  lecons: Lecon[];
  leconsByDay: LeconsByDay;
  eleves: Eleve[];
  pagination?: PaginationInfo;
}

interface UsePlanningDataResult {
  isLoading: boolean;
  error: string | null;
  data: PlanningData | null;
  refetch: () => void;
  loadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}

// Cache pour stocker les résultats des requêtes
const dataCache: Record<string, { data: PlanningData, timestamp: number }> = {};

// Durée de validité du cache en millisecondes (30 secondes)
const CACHE_DURATION = 30 * 1000;

// Fonction pour fusionner les données de pagination
function mergeData(oldData: PlanningData | null, newData: PlanningData): PlanningData {
  if (!oldData) return newData;
  
  // Fusionner les leçons sans doublons
  const leconIds = new Set(oldData.lecons.map(lecon => lecon.id_planning));
  const mergedLecons = [
    ...oldData.lecons,
    ...newData.lecons.filter(lecon => !leconIds.has(lecon.id_planning))
  ];
  
  // Fusionner leconsByDay
  const mergedLeconsByDay = { ...oldData.leconsByDay };
  Object.entries(newData.leconsByDay).forEach(([date, moniteurs]) => {
    if (!mergedLeconsByDay[date]) {
      mergedLeconsByDay[date] = { ...moniteurs };
    } else {
      Object.entries(moniteurs).forEach(([moniteurId, lecons]) => {
        const monId = parseInt(moniteurId);
        if (!mergedLeconsByDay[date][monId]) {
          mergedLeconsByDay[date][monId] = [...lecons];
        } else {
          // Filtrer les leçons déjà présentes
          const existingIds = new Set(mergedLeconsByDay[date][monId].map(l => l.id_planning));
          mergedLeconsByDay[date][monId] = [
            ...mergedLeconsByDay[date][monId],
            ...lecons.filter(l => !existingIds.has(l.id_planning))
          ];
        }
      });
    }
  });
  
  return {
    moniteurs: newData.moniteurs, // Utiliser les moniteurs les plus récents
    eleves: newData.eleves, // Utiliser les élèves les plus récents
    lecons: mergedLecons,
    leconsByDay: mergedLeconsByDay,
    pagination: newData.pagination // Utiliser les infos de pagination les plus récentes
  };
}

export function usePlanningData(
  id_ecole: string,
  id_bureau: string = '0',
  startDate: string,
  endDate: string,
  view: 'day' | 'week' | 'month' = 'week',
  searchQuery: string = '',
  selectedMoniteur: string = 'all',
  initialPageSize: number = 50 // Nombre d'éléments par page par défaut
): UsePlanningDataResult {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PlanningData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(initialPageSize);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Créer une clé de cache unique basée sur les paramètres (sans la page)
  const baseCacheKey = `planning_${id_ecole}_${id_bureau}_${startDate}_${endDate}_${view}_${searchQuery}_${selectedMoniteur}`;
  const cacheKey = `${baseCacheKey}_page${currentPage}`;

  const fetchData = async (page: number = 1, isLoadingMoreData: boolean = false) => {
    if (!id_ecole || !startDate || !endDate) {
      setError('Paramètres manquants');
      setIsLoading(false);
      return;
    }
    
    // Annuler toute requête en cours
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Vérifier si les données sont dans le cache et toujours valides
    const cachedResult = dataCache[cacheKey];
    const now = Date.now();
    
    if (cachedResult && (now - cachedResult.timestamp < CACHE_DURATION)) {
      // Utiliser les données du cache
      if (isLoadingMoreData) {
        setData(prevData => mergeData(prevData, cachedResult.data));
        setIsLoadingMore(false);
      } else {
        setData(cachedResult.data);
        setIsLoading(false);
      }
      return;
    }

    if (isLoadingMoreData) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    
    // Créer un nouveau AbortController pour cette requête
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      const queryParams = new URLSearchParams({
        id_ecole,
        id_bureau,
        startDate,
        endDate,
        view,
        page: page.toString(),
        pageSize: pageSize.toString()
      });
      
      // Ajouter les paramètres de recherche s'ils sont définis
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }
      
      if (selectedMoniteur && selectedMoniteur !== 'all') {
        queryParams.append('moniteur', selectedMoniteur);
      }

      const response = await fetch(`/api/directeur/planning?${queryParams.toString()}`, { signal });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des données');
      }

      const planningData = await response.json();
      
      // Mettre à jour le cache
      dataCache[cacheKey] = {
        data: planningData,
        timestamp: now
      };
      
      // Ne pas mettre à jour l'état si la requête a été annulée
      if (!signal.aborted) {
        // Vérifier s'il y a plus de pages à charger
        const pagination = planningData.pagination;
        if (pagination) {
          setHasMore(pagination.currentPage < pagination.totalPages);
        } else {
          setHasMore(false);
        }
        
        if (isLoadingMoreData) {
          // Fusionner les nouvelles données avec les données existantes
          setData(prevData => mergeData(prevData, planningData));
        } else {
          setData(planningData);
        }
      }
    } catch (err) {
      // Ne pas mettre à jour l'état en cas d'erreur d'annulation
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Requête annulée');
        return;
      }
      
      console.error('Erreur dans usePlanningData:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      if (abortControllerRef.current?.signal.aborted === false) {
        if (isLoadingMoreData) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
        abortControllerRef.current = null;
      }
    }
  };

  // Réinitialiser la pagination lorsque les paramètres de recherche changent
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    setData(null); // Réinitialiser les données
  }, [id_ecole, id_bureau, startDate, endDate, view, searchQuery, selectedMoniteur]);
  
  // Charger les données lorsque la page change ou que les paramètres changent
  useEffect(() => {
    fetchData(currentPage);
    
    // Nettoyage: annuler la requête en cours si le composant est démonté ou si les dépendances changent
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [currentPage, id_ecole, id_bureau, startDate, endDate, view, searchQuery, selectedMoniteur]);

  // Fonction pour charger plus de données
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      setCurrentPage(prev => prev + 1);
      fetchData(currentPage + 1, true);
    }
  }, [isLoadingMore, hasMore, currentPage]);

  return {
    isLoading,
    error,
    data,
    refetch: () => fetchData(1),
    loadMore,
    hasMore,
    isLoadingMore
  };
}
