'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiUser, FiCalendar, FiMapPin, FiTag, FiSettings, FiPlus, FiTrash2 } from 'react-icons/fi';
import { BiBuildings } from 'react-icons/bi';
import { supabase } from '@/lib/supabase';
import EleveAjout from './EleveAjout';

export interface EleveFilters {
  searchTerm: string;
  bureau: string;
  statut: string;
  categoriePermis: string;
  dateInscription: string;
  showArchived: boolean;
  itemsPerPage?: number;
}

interface EleveFiltreProps {
  // Filtres
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  bureau?: string;
  setBureau?: (bureau: string) => void;
  statut?: string;
  setStatut?: (statut: string) => void;
  categoriePermis?: string;
  setCategoriePermis?: (categorie: string) => void;
  dateInscription?: string;
  setDateInscription?: (date: string) => void;
  // Callback pour notifier des changements
  onFilterChange?: (filters: EleveFilters) => void;
  // Fonction de rendu optionnelle
  render?: (data: { isLoading: boolean; error: string | null; data: any }) => React.ReactNode;
}

export default function EleveFiltre({
  searchTerm: externalSearchTerm,
  setSearchTerm: externalSetSearchTerm,
  bureau: externalBureau,
  setBureau: externalSetBureau,
  statut: externalStatut,
  setStatut: externalSetStatut,
  categoriePermis: externalCategoriePermis,
  setCategoriePermis: externalSetCategoriePermis,
  dateInscription: externalDateInscription,
  setDateInscription: externalSetDateInscription,
  onFilterChange,
  render
}: EleveFiltreProps) {
  // États locaux pour les filtres (utilisés si les props ne sont pas fournies)
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localBureau, setLocalBureau] = useState('all');
  const [localStatut, setLocalStatut] = useState('all');
  const [localCategoriePermis, setLocalCategoriePermis] = useState('all');
  const [localDateInscription, setLocalDateInscription] = useState('all');
  const [showArchived, setShowArchived] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Utiliser les props si fournies, sinon utiliser les états locaux
  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : localSearchTerm;
  const bureau = externalBureau !== undefined ? externalBureau : localBureau;
  const statut = externalStatut !== undefined ? externalStatut : localStatut;
  const categoriePermis = externalCategoriePermis !== undefined ? externalCategoriePermis : localCategoriePermis;
  const dateInscription = externalDateInscription !== undefined ? externalDateInscription : localDateInscription;
  
  // Fonctions pour mettre à jour les états
  const handleSearchTermChange = (term: string) => {
    if (externalSetSearchTerm) {
      externalSetSearchTerm(term);
    } else {
      setLocalSearchTerm(term);
      // Notifier le parent du changement si pas de prop externe
      if (onFilterChange) {
        onFilterChange({
          searchTerm: term,
          bureau,
          statut,
          categoriePermis,
          dateInscription,
          showArchived
        });
      }
    }
  };
  
  const handleBureauChange = (value: string) => {
    if (externalSetBureau) {
      externalSetBureau(value);
    } else {
      setLocalBureau(value);
      // Notifier le parent du changement si pas de prop externe
      if (onFilterChange) {
        onFilterChange({
          searchTerm,
          bureau: value,
          statut,
          categoriePermis,
          dateInscription,
          showArchived
        });
      }
    }
  };
  
  const handleStatutChange = (value: string) => {
    // Si le statut est "Archivé", on active automatiquement l'affichage des élèves archivés
    const shouldShowArchived = value === 'Archivé' ? true : showArchived;
    
    if (value === 'Archivé') {
      setShowArchived(true);
    }
    
    if (externalSetStatut) {
      externalSetStatut(value);
    } else {
      setLocalStatut(value);
      // Notifier le parent du changement si pas de prop externe
      if (onFilterChange) {
        onFilterChange({
          searchTerm,
          bureau,
          statut: value,
          categoriePermis,
          dateInscription,
          showArchived: shouldShowArchived
        });
      }
    }
  };
  
  const handleCategoriePermisChange = (value: string) => {
    if (externalSetCategoriePermis) {
      externalSetCategoriePermis(value);
    } else {
      setLocalCategoriePermis(value);
      // Notifier le parent du changement si pas de prop externe
      if (onFilterChange) {
        onFilterChange({
          searchTerm,
          bureau,
          statut,
          categoriePermis: value,
          dateInscription,
          showArchived
        });
      }
    }
  };
  
  const handleDateInscriptionChange = (value: string) => {
    if (externalSetDateInscription) {
      externalSetDateInscription(value);
    } else {
      setLocalDateInscription(value);
      // Notifier le parent du changement si pas de prop externe
      if (onFilterChange) {
        onFilterChange({
          searchTerm,
          bureau,
          statut,
          categoriePermis,
          dateInscription: value,
          showArchived
        });
      }
    }
  };
  
  // États pour l'UI
  const [isExpanded, setIsExpanded] = useState(false);
  const [bureaux, setBureaux] = useState<Array<{id_bureau: number, nom: string}>>([]);
  const [categoriesPermis, setCategoriesPermis] = useState<string[]>(['B', 'A', 'A1', 'A2', 'C', 'D', 'BE', 'CE', 'DE']);
  const [showEleveAjout, setShowEleveAjout] = useState(false);
  const [showBureauWarning, setShowBureauWarning] = useState(false);
  
  // Effet pour bloquer le défilement du body quand le modal est ouvert
  useEffect(() => {
    if (showEleveAjout) {
      // Désactiver le défilement sur le body
      document.body.style.overflow = 'hidden';
    } else {
      // Réactiver le défilement sur le body
      document.body.style.overflow = 'auto';
    }
    
    // Nettoyer l'effet lors du démontage du composant
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showEleveAjout]);
  
  // États pour les suggestions d'élèves
  const [suggestions, setSuggestions] = useState<Array<{id_eleve: number, nom: string, prenom: string}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Récupérer les bureaux depuis la base de données
  useEffect(() => {
    const fetchBureaux = async () => {
      try {
        // Récupérer l'id_ecole depuis le localStorage
        const storedUser = localStorage.getItem('autosoft_user');
        if (!storedUser) {
          console.error("Utilisateur non connecté");
          return;
        }
        
        const userData = JSON.parse(storedUser);
        const id_ecole = userData.id_ecole;
        
        if (!id_ecole) {
          console.error("ID de l'auto-école non disponible");
          return;
        }
        
        const { data, error } = await supabase
          .from('bureau')
          .select('id_bureau, nom')
          .eq('id_ecole', id_ecole)
          .order('nom');
          
        if (error) throw error;
        
        setBureaux(data || []);
      } catch (err) {
        console.error('Erreur lors de la récupération des bureaux:', err);
      }
    };
    
    fetchBureaux();
  }, []);
  
  // État pour les données à passer au render
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  // Fonction pour récupérer les suggestions d'élèves
  const fetchSuggestions = async (term: string) => {
    if (!term || term.length < 2) {
      setSuggestions([]);
      return;
    }
    
    try {
      // Récupérer l'id_ecole depuis le localStorage
      const storedUser = localStorage.getItem('autosoft_user');
      if (!storedUser) {
        console.error("Utilisateur non connecté");
        return;
      }
      
      const userData = JSON.parse(storedUser);
      const id_ecole = userData.id_ecole;
      const id_bureau_user = userData.id_bureau;
      
      if (!id_ecole) {
        console.error("ID de l'auto-école non disponible");
        return;
      }
      
      // Appeler l'API pour les suggestions
      const response = await fetch('/directeur/eleves/api/EleveFiltre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm: term,
          id_ecole,
          id_bureau: id_bureau_user && id_bureau_user !== '0' ? id_bureau_user : undefined
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      setSuggestions(result.suggestions || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des suggestions:', err);
      setSuggestions([]);
    }
  };
  
  return (
    <div className="bg-white shadow-sm px-4 pt-4 pb-0 w-full text-black">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        {/* Barre de recherche */}
        <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4 flex-wrap gap-y-2">
          <div className="relative w-full md:w-64 lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                handleSearchTermChange(value);
                setShowSuggestions(value.length > 0);
                fetchSuggestions(value);
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              placeholder="Rechercher par nom, prénom, email, téléphone..."
            />
            {searchTerm && (
              <button
                onClick={() => {
                  handleSearchTermChange('');
                  setShowSuggestions(false);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              >
                <FiX />
              </button>
            )}
          </div>
          
          {/* Sélecteur de catégorie de permis */}
          <div className="w-48 lg:w-56">
            <select
              value={categoriePermis}
              onChange={(e) => handleCategoriePermisChange(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            >
              <option value="all">Toutes les catégories</option>
              {categoriesPermis.map((categorie) => (
                <option key={categorie} value={categorie}>{categorie}</option>
              ))}
            </select>
          </div>
          
          {/* Filtre par date d'inscription */}
          <div className="w-48 lg:w-56">
            <select
              id="dateInscription"
              value={dateInscription}
              onChange={(e) => handleDateInscriptionChange(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            >
              <option value="all">Toutes les dates</option>
              <option value="last7days">7 derniers jours</option>
              <option value="last30days">30 derniers jours</option>
              <option value="last90days">90 derniers jours</option>
              <option value="thisYear">Cette année</option>
            </select>
          </div>
          
          {/* Le sélecteur de statut a été déplacé en bas des filtres principaux */}
        </div>
        
        {/* Boutons d'action */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            title="Filtres avancés"
          >
            <FiFilter className="w-4 h-4 mr-1" />
            <span>Filtres avancés</span>
          </button>
          
          <button
            onClick={() => {
              // Vérifier si un bureau est sélectionné
              const userDataStr = localStorage.getItem('autosoft_user');
              const userData = userDataStr ? JSON.parse(userDataStr) : null;
              const id_bureau = userData?.id_bureau || 0;
              
              if (id_bureau === 0) {
                // Afficher le modal d'avertissement
                setShowBureauWarning(true);
              } else {
                // Ouvrir le modal d'ajout d'élève
                setShowEleveAjout(true);
              }
            }}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            title="Ajouter un élève"
          >
            <FiPlus className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Onglets de statut (prenant toute la largeur) */}
      <div className="w-full border-b-0">
        <div className="grid grid-cols-7 w-full">
          <button
            onClick={() => handleStatutChange('all')}
            className={`text-center py-2 border-b-2 font-medium text-sm ${statut === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Tous les statuts
          </button>
          <button
            onClick={() => handleStatutChange('Actif')}
            className={`text-center py-2 border-b-2 font-medium text-sm ${statut === 'Actif' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Actif
          </button>
          <button
            onClick={() => handleStatutChange('Complet')}
            className={`text-center py-1 border-b-2 font-medium text-sm ${statut === 'Complet' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Complet
          </button>
          <button
            onClick={() => handleStatutChange('Incomplet')}
            className={`text-center py-1 border-b-2 font-medium text-sm ${statut === 'Incomplet' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Incomplet
          </button>
          <button
            onClick={() => handleStatutChange('En attente')}
            className={`text-center py-2 border-b-2 font-medium text-sm ${statut === 'En attente' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            En attente
          </button>
          <button
            onClick={() => handleStatutChange('Brouillon')}
            className={`text-center py-2 border-b-2 font-medium text-sm ${statut === 'Brouillon' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Brouillon
          </button>
          <button
            onClick={() => handleStatutChange('Archivé')}
            className={`text-center py-2 border-b-2 font-medium text-sm ${statut === 'Archivé' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Archivé
          </button>
        </div>
      </div>
      {/* Panneau de paramètres (affiché conditionnellement) */}
      {isExpanded && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Filtres avancés</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Filtre pour le nombre d'élèves par page */}
            <div>
              <label htmlFor="itemsPerPage" className="block text-xs font-medium text-gray-700 mb-1">
                Élèves par page
              </label>
              <div className="relative">
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setItemsPerPage(value);
                    if (onFilterChange) {
                      onFilterChange({
                        searchTerm,
                        bureau,
                        statut,
                        categoriePermis,
                        dateInscription,
                        showArchived,
                        itemsPerPage: value
                      });
                    }
                  }}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                >
                  <option value="5">5 élèves</option>
                  <option value="10">10 élèves</option>
                  <option value="20">20 élèves</option>
                  <option value="50">50 élèves</option>
                  <option value="100">100 élèves</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal d'avertissement pour sélection de bureau */}
      {showBureauWarning && (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 text-yellow-500">
                <FiFilter className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sélection de bureau requise</h3>
              <p className="text-gray-600 mb-6">
                Veuillez sélectionner un bureau sur lequel l'élève sera enregistré. 
                Pour changer de bureau, cliquez sur l'icône <BiBuildings className="inline h-5 w-5" /> dans la barre de navigation.
              </p>
              <button
                onClick={() => setShowBureauWarning(false)}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal pour l'ajout d'élève */}
      {showEleveAjout && (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Ajouter un nouvel élève</h2>
              <button 
                onClick={() => setShowEleveAjout(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <EleveAjout />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
