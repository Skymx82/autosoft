import { useState, useEffect } from 'react';
import { Student } from '@/components/directeur/planning/semaine/modal/types';

interface AjoutHoraireData {
  eleves: Student[];
  isLoading: boolean;
  error: string | null;
}

export function useAjoutHoraireData() {
  const [data, setData] = useState<AjoutHoraireData>({
    eleves: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer l'utilisateur actuel depuis le localStorage
        const userData = localStorage.getItem('autosoft_user');
        if (!userData) {
          setData({
            eleves: [],
            isLoading: false,
            error: 'Utilisateur non trouvé dans le localStorage'
          });
          return;
        }
        
        // Parser les données utilisateur
        const user = JSON.parse(userData);
        const id_ecole = user.id_ecole;
        const id_bureau = user.id_bureau;
        
        console.log('Chargement des données pour AjoutHoraire avec id_ecole:', id_ecole, 'et id_bureau:', id_bureau);
        
        // Appel à l'API
        const response = await fetch(`/api/directeur/planning/AjoutHoraire?id_ecole=${id_ecole}&id_bureau=${id_bureau}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        
        const responseData = await response.json();
        console.log('Données reçues:', responseData);
        
        setData({
          eleves: responseData.eleves || [],
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Erreur:', error);
        setData({
          eleves: [],
          isLoading: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
    };
    
    fetchData();
  }, []);

  return data;
}
