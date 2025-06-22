'use client';

import { useState, useEffect } from 'react';
import DirectorLayout from '@/components/directeur/layout/DirectorLayout';
import EleveFiltre from '@/components/directeur/eleve/EleveFiltre';
import EleveTable from '@/components/directeur/eleve/EleveTable';

interface Eleve {
  id_eleve: number;
  nom: string;
  prenom: string;
  naiss?: string; // date de naissance
  mail?: string;
  tel?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
  categorie?: string;
  statut_dossier?: string; // statut du dossier
  date_inscription?: string;
  id_bureau?: number;
  bureau?: { nom: string };
}

interface EleveFilters {
  searchTerm: string;
  bureau: string;
  statut: string;
  categoriePermis: string;
  dateInscription: string;
}

export default function ElevesPage() {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [filteredEleves, setFilteredEleves] = useState<Eleve[]>([]);
  
  // Fonction pour récupérer les élèves
  const fetchEleves = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Récupérer l'ID de l'école et l'ID du bureau depuis le localStorage
      if (typeof window === 'undefined') {
        throw new Error("Cette fonction ne peut être exécutée que côté client");
      }
      
      const storedUser = localStorage.getItem('autosoft_user');
      if (!storedUser) {
        throw new Error("Utilisateur non connecté");
      }
      
      const userData = JSON.parse(storedUser);
      const id_ecole = userData.id_ecole;
      const id_bureau = userData.id_bureau;
      
      if (!id_ecole) {
        throw new Error("ID de l'auto-école non disponible");
      }
      
      // Construire l'URL avec les paramètres
      let url = `/api/directeur/eleves/ElevesTable?id_ecole=${id_ecole}&id_bureau=${id_bureau}`;
      // Toujours inclure id_bureau pour éviter les problèmes de filtrage
      
      // Faire la requête
      const response = await fetch(url);
      
      // Vérifier si la requête a réussi
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      // Récupérer les données
      const data = await response.json();
      
      // Mettre à jour les états
      setEleves(data);
      setFilteredEleves(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des élèves:', error);
      setError('Erreur lors de la récupération des élèves');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Récupérer les élèves au chargement de la page
  useEffect(() => {
    // Appeler la fonction fetchEleves qui récupère maintenant directement les données du localStorage
    if (typeof window !== 'undefined') {
      fetchEleves().catch(error => {
        console.error("Erreur lors de la récupération des élèves:", error);
        setError(error.message || "Erreur lors de la récupération des élèves");
      });
    }
  }, []);
  const [selectedEleves, setSelectedEleves] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EleveFilters>({
    searchTerm: '',
    bureau: 'all',
    statut: 'all',
    categoriePermis: 'all',
    dateInscription: 'all'
  });
  
  // Fonctions pour gérer les changements de filtres
  const handleFilterChange = (newFilters: EleveFilters) => {
    setFilters(newFilters);
    
    // Si le bureau change, récupérer les élèves du bureau sélectionné
    if (newFilters.bureau !== filters.bureau) {
      // Mettre à jour temporairement le bureau dans le localStorage pour le prochain appel à fetchEleves
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('autosoft_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.id_bureau = newFilters.bureau;
          localStorage.setItem('autosoft_user', JSON.stringify(userData));
          
          // Récupérer les élèves avec le nouveau bureau
          fetchEleves().catch(error => {
            console.error("Erreur lors de la récupération des élèves:", error);
            setError(error.message || "Erreur lors de la récupération des élèves");
          });
        }
      }
    } else {
      // Appliquer les autres filtres côté client
      applyFilters(newFilters);
    }
  };
  
  // Fonction pour appliquer les filtres aux élèves
  const applyFilters = (currentFilters: EleveFilters) => {
    // Si aucun élève, ne rien faire
    if (!eleves || eleves.length === 0) {
      setFilteredEleves([]);
      return;
    }
    
    // Filtrer les élèves en fonction des filtres
    let filtered = [...eleves];
    
    // Filtre par terme de recherche
    if (currentFilters.searchTerm) {
      const searchLower = currentFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(eleve => {
        // Vérifier le nom et le prénom
        const nameMatch = 
          eleve.nom.toLowerCase().includes(searchLower) || 
          eleve.prenom.toLowerCase().includes(searchLower) ||
          `${eleve.nom.toLowerCase()} ${eleve.prenom.toLowerCase()}`.includes(searchLower);
        
        // Vérifier l'email (s'il existe)
        const emailMatch = eleve.mail ? 
          eleve.mail.toLowerCase().includes(searchLower) : 
          false;
        
        // Vérifier le numéro de téléphone (s'il existe)
        const telMatch = eleve.tel ? 
          eleve.tel.includes(searchLower) : 
          false;
        
        // Retourner true si l'un des critères correspond
        return nameMatch || emailMatch || telMatch;
      });
    }
    
    // Filtre par statut
    if (currentFilters.statut && currentFilters.statut !== 'all') {
      filtered = filtered.filter(eleve => eleve.statut_dossier === currentFilters.statut);
    }
    
    // Filtre par catégorie de permis
    if (currentFilters.categoriePermis && currentFilters.categoriePermis !== 'all') {
      filtered = filtered.filter(eleve => eleve.categorie === currentFilters.categoriePermis);
    }
    
    // Filtre par date d'inscription
    if (currentFilters.dateInscription && currentFilters.dateInscription !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (currentFilters.dateInscription) {
        case 'last7days':
          // 7 derniers jours
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(eleve => {
            if (!eleve.date_inscription) return false;
            const inscriptionDate = new Date(eleve.date_inscription);
            return inscriptionDate >= filterDate;
          });
          break;
        case 'last30days':
          // 30 derniers jours
          filterDate.setDate(today.getDate() - 30);
          filtered = filtered.filter(eleve => {
            if (!eleve.date_inscription) return false;
            const inscriptionDate = new Date(eleve.date_inscription);
            return inscriptionDate >= filterDate;
          });
          break;
        case 'last90days':
          // 90 derniers jours
          filterDate.setDate(today.getDate() - 90);
          filtered = filtered.filter(eleve => {
            if (!eleve.date_inscription) return false;
            const inscriptionDate = new Date(eleve.date_inscription);
            return inscriptionDate >= filterDate;
          });
          break;
        case 'thisYear':
          // Cette année
          filterDate.setMonth(0); // Janvier
          filterDate.setDate(1);   // Premier jour
          filterDate.setFullYear(today.getFullYear()); // Année en cours
          
          filtered = filtered.filter(eleve => {
            if (!eleve.date_inscription) return false;
            const inscriptionDate = new Date(eleve.date_inscription);
            return inscriptionDate >= filterDate;
          });
          break;
      }
    }
    
    // Mettre à jour les élèves filtrés
    setFilteredEleves(filtered);
  };
  
  // Fonction pour gérer la sélection d'un élève
  const toggleEleveSelection = (id_eleve: number) => {
    setSelectedEleves(prev => {
      if (prev.includes(id_eleve)) {
        return prev.filter(id => id !== id_eleve);
      } else {
        return [...prev, id_eleve];
      }
    });
  };
  
  // Fonction pour sélectionner/désélectionner tous les élèves
  const toggleAllEleves = () => {
    if (selectedEleves.length === filteredEleves.length) {
      setSelectedEleves([]);
    } else {
      setSelectedEleves(filteredEleves.map(eleve => eleve.id_eleve));
    }
  };
  
  return (
    <DirectorLayout>
      <div className="flex flex-col h-full relative">
        {/* Barre de filtres fixe en haut */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <EleveFiltre 
            onFilterChange={handleFilterChange}
          />
        </div>
        
        {/* Barre d'actions pour les élèves sélectionnés */}
        {selectedEleves.length > 0 && (
          <div className="bg-blue-50 p-2 flex items-center justify-between">
            <span className="text-sm text-blue-700 font-medium">
              {selectedEleves.length} élève(s) sélectionné(s)
            </span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                Envoyer un message
              </button>
              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                Exporter
              </button>
              <button className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">
                Supprimer
              </button>
            </div>
          </div>
        )}
        
        {/* Tableau des élèves */}
        <div className="p-4 flex-grow overflow-auto">
          <EleveTable 
            eleves={filteredEleves}
            selectedEleves={selectedEleves}
            toggleEleveSelection={toggleEleveSelection}
            toggleAllEleves={toggleAllEleves}
          />
        </div>
      </div>
    </DirectorLayout>
  );
}
