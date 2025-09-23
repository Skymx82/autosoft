import { useState, useEffect } from 'react';

// Interface pour l'élève
export interface Eleve {
  id_eleve: number;
  nom: string;
  prenom: string;
  tel?: string;
  email?: string;
  categorie?: string;
}

interface ElevesData {
  eleves: Eleve[];
  isLoading: boolean;
  error: string | null;
}

export function useElevesData() {
  const [data, setData] = useState<ElevesData>({
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
        
        console.log('Chargement des données des élèves avec id_ecole:', id_ecole, 'et id_bureau:', id_bureau);
        
        // Appel à l'API pour récupérer les élèves
        // Nous utilisons la même API que pour AjoutHoraire car elle retourne déjà la liste des élèves
        const response = await fetch(`/directeur/planning/api/AjoutHoraire?id_ecole=${id_ecole}&id_bureau=${id_bureau}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données des élèves');
        }
        
        const responseData = await response.json();
        console.log('Données des élèves reçues:', responseData);
        
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
