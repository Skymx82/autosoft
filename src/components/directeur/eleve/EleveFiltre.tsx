'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiUser, FiCalendar, FiMapPin, FiTag, FiSettings, FiPlus } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import EleveAjout from './EleveAjout';

export interface EleveFilters {
  searchTerm: string;
  bureau: string;
  statut: string;
  categoriePermis: string;
  dateInscription: string;
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
          dateInscription
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
          dateInscription
        });
      }
    }
  };
  
  const handleStatutChange = (value: string) => {
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
          dateInscription
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
          dateInscription
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
          dateInscription: value
        });
      }
    }
  };
  
  // États pour l'UI
  const [isExpanded, setIsExpanded] = useState(false);
  const [bureaux, setBureaux] = useState<Array<{id_bureau: number, nom: string}>>([]);
  const [categoriesPermis, setCategoriesPermis] = useState<string[]>(['B', 'A', 'A1', 'A2', 'C', 'D', 'BE', 'CE', 'DE']);
  const [showEleveAjout, setShowEleveAjout] = useState(false);
  
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
      const response = await fetch('/api/directeur/eleves/EleveFiltre', {
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
    <div className="bg-white shadow-sm p-4 w-full text-black">
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
          
          {/* Sélecteur de statut */}
          <div className="w-48">
            <select
              value={statut}
              onChange={(e) => handleStatutChange(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            >
              <option value="all">Tous les statuts</option>
              <option value="Actif">Actif</option>
              <option value="Complet">Complet</option>
              <option value="En attente">En attente</option>
              <option value="Brouillon">Brouillon</option>
              <option value="Archivé">Archivé</option>
            </select>
          </div>
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
            onClick={() => setShowEleveAjout(true)}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            title="Ajouter un élève"
          >
            <FiPlus className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Panneau de paramètres (affiché conditionnellement) */}
      {isExpanded && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Filtres avancés</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Espace vide intentionnellement laissé pour maintenir la structure de la grille */}
            
            {/* Filtre par date d'inscription */}
            <div>
              <label htmlFor="dateInscription" className="block text-xs font-medium text-gray-700 mb-1">
                Date d'inscription
              </label>
              <div className="relative">
                <select
                  id="dateInscription"
                  value={dateInscription}
                  onChange={(e) => handleDateInscriptionChange(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                >
                  <option value="all">Toutes les dates</option>
                  <option value="last7days">7 derniers jours</option>
                  <option value="last30days">30 derniers jours</option>
                  <option value="last90days">90 derniers jours</option>
                  <option value="thisYear">Cette année</option>
                </select>
              </div>
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
