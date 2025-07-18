'use client';

import { useState, useEffect, useRef } from 'react';
import DirectorLayout from '@/components/directeur/layout/DirectorLayout';
import EleveTable from '@/app/(protected)/directeur/eleves/components/EleveTable';
import EleveFiltre from '@/app/(protected)/directeur/eleves/components/EleveFiltre';
import { FiPlus, FiChevronDown } from 'react-icons/fi';
import Link from 'next/link';

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
  showArchived: boolean;
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
      let url = `/directeur/eleves/api/ElevesTable?id_ecole=${id_ecole}&id_bureau=${id_bureau}`;
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
    dateInscription: 'all',
    showArchived: false
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
    
    // Filtre pour les élèves archivés
    if (!currentFilters.showArchived) {
      // Si showArchived est false, on exclut les élèves archivés
      filtered = filtered.filter(eleve => eleve.statut_dossier !== 'Archivé');
    }
    
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
  
  // Fonction pour supprimer un élève
  const deleteEleve = async (id_eleve: number) => {
    try {
      // Récupérer l'ID de l'école depuis le localStorage
      if (typeof window === 'undefined') {
        throw new Error("Cette fonction ne peut être exécutée que côté client");
      }
      
      const storedUser = localStorage.getItem('autosoft_user');
      if (!storedUser) {
        throw new Error("Utilisateur non connecté");
      }
      
      const userData = JSON.parse(storedUser);
      const id_ecole = userData.id_ecole;
      
      if (!id_ecole) {
        throw new Error("ID de l'auto-école non disponible");
      }
      
      // Faire la requête de suppression
      const response = await fetch(`/directeur/eleves/api/ElevesTable?id_eleve=${id_eleve}&id_ecole=${id_ecole}`, {
        method: 'DELETE',
      });
      
      // Vérifier si la requête a réussi
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      // Récupérer les données
      const data = await response.json();
      
      // Mettre à jour la liste des élèves
      fetchEleves();
      
      // Retirer l'élève de la liste des élèves sélectionnés
      if (selectedEleves.includes(id_eleve)) {
        setSelectedEleves(prev => prev.filter(id => id !== id_eleve));
      }
      
      // Afficher un message de succès (à implémenter selon votre système de notification)
      console.log("Élève supprimé avec succès");
      
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'élève:', error);
      // Afficher un message d'erreur (à implémenter selon votre système de notification)
    }
  };
  
  // État pour le menu déroulant de statut
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  
  // Fonction pour mettre à jour le statut des élèves sélectionnés
  const updateElevesStatus = async (status: string) => {
    try {
      // Récupérer l'ID de l'école depuis le localStorage
      if (typeof window === 'undefined') {
        throw new Error("Cette fonction ne peut être exécutée que côté client");
      }
      
      const storedUser = localStorage.getItem('autosoft_user');
      if (!storedUser) {
        throw new Error("Utilisateur non connecté");
      }
      
      const userData = JSON.parse(storedUser);
      const id_ecole = userData.id_ecole;
      
      if (!id_ecole) {
        throw new Error("ID de l'auto-école non disponible");
      }
      
      // Faire la requête de mise à jour avec la nouvelle route API
      const response = await fetch(`/directeur/eleves/api/ElevesTable`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_eleves: selectedEleves,
          status,
          id_ecole
        })
      });
      
      // Vérifier si la requête a réussi
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      // Récupérer les données
      const data = await response.json();
      
      // Mettre à jour la liste des élèves
      fetchEleves();
      
      // Fermer le menu déroulant
      setShowStatusDropdown(false);
      
      // Afficher un message de succès
      console.log(`Statut de ${selectedEleves.length} élève(s) mis à jour avec succès`);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut des élèves:', error);
      // Afficher un message d'erreur
    }
  };
  
  // Fermer le menu déroulant lorsqu'on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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
              <div className="relative" ref={statusDropdownRef}>
                <button 
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                >
                  <span>Changer le statut</span>
                  <FiChevronDown className="ml-1" />
                </button>
                {showStatusDropdown && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => updateElevesStatus('Actif')}
                      >
                        <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                        Actif
                      </button>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => updateElevesStatus('En attente')}
                      >
                        <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                        En attente
                      </button>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => updateElevesStatus('Complet')}
                      >
                        <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                        Complet
                      </button>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => updateElevesStatus('Incomplet')}
                      >
                        <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                        Incomplet
                      </button>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => updateElevesStatus('Brouillon')}
                      >
                        <span className="inline-block w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
                        Brouillon
                      </button>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => updateElevesStatus('Archivé')}
                      >
                        <span className="inline-block w-3 h-3 rounded-full bg-gray-400 mr-2"></span>
                        Archivé
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                Exporter
              </button>
              <button 
                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  // Confirmation avant suppression multiple
                  if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedEleves.length} élève(s) ?`)) {
                    // Supprimer chaque élève sélectionné
                    selectedEleves.forEach(id => deleteEleve(id));
                  }
                }}
              >
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
            onDeleteEleve={deleteEleve}
          />
        </div>
      </div>
    </DirectorLayout>
  );
}
