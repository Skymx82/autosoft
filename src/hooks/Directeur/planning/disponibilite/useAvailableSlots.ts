import { useState, useEffect } from 'react';

interface AvailableSlot {
  time: string;
  availableTeachers: number;
  teacherIds: number[];
}

interface Teacher {
  nom: string;
  prenom: string;
}

interface AvailableSlotsResponse {
  date: string;
  availableSlots: AvailableSlot[];
  moniteurs: Record<number, Teacher>;
}

interface UseAvailableSlotsResult {
  isLoading: boolean;
  error: string | null;
  data: AvailableSlotsResponse | null;
  refetch: (date?: string) => void;
}

export function useAvailableSlots(
  initialDate: string,
  id_ecole: string,
  id_bureau: string
): UseAvailableSlotsResult {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AvailableSlotsResponse | null>(null);
  const [currentDate, setCurrentDate] = useState<string>(initialDate);

  const fetchAvailableSlots = async (date: string = currentDate) => {
    if (!id_ecole) {
      setError('ID école manquant');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        date,
        id_ecole,
        id_bureau
      });

      const response = await fetch(`/api/directeur/planning/disponibilites?${queryParams.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des disponibilités');
      }

      const availableSlotsData = await response.json();
      setData(availableSlotsData);
    } catch (err) {
      console.error('Erreur dans useAvailableSlots:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, [id_ecole, id_bureau, currentDate]);

  const refetch = (date?: string) => {
    if (date) {
      setCurrentDate(date);
    } else {
      fetchAvailableSlots();
    }
  };

  return {
    isLoading,
    error,
    data,
    refetch
  };
}
