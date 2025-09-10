'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiCalendar, FiPlus } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';

export interface ComptaFilters {
  searchTerm: string;
  dateDebut: string;
  dateFin: string;
  categorie: string;
  modeReglement: string;
  itemsPerPage?: number;
}

interface ComptaFiltreProps {
  // Filtres
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  dateDebut?: string;
  setDateDebut?: (date: string) => void;
  dateFin?: string;
  setDateFin?: (date: string) => void;
  categorie?: string;
  setCategorie?: (categorie: string) => void;
  modeReglement?: string;
  setModeReglement?: (mode: string) => void;
  // Callback pour notifier des changements
  onFilterChange?: (filters: ComptaFilters) => void;
  // Gestion des onglets
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  // Fonction de rendu optionnelle
  render?: (data: { isLoading: boolean; error: string | null; data: any }) => React.ReactNode;
}

export default function ComptaFiltre({
  searchTerm: externalSearchTerm,
  setSearchTerm: externalSetSearchTerm,
  dateDebut: externalDateDebut,
  setDateDebut: externalSetDateDebut,
  dateFin: externalDateFin,
  setDateFin: externalSetDateFin,
  categorie: externalCategorie,
  setCategorie: externalSetCategorie,
  modeReglement: externalModeReglement,
  setModeReglement: externalSetModeReglement,
  onFilterChange,
  activeTab: externalActiveTab,
  onTabChange,
  render
}: ComptaFiltreProps) {
  // États locaux pour les filtres (utilisés si les props ne sont pas fournies)
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localDateDebut, setLocalDateDebut] = useState('');
  const [localDateFin, setLocalDateFin] = useState('');
  const [localCategorie, setLocalCategorie] = useState('all');
  const [localModeReglement, setLocalModeReglement] = useState('all');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // États pour l'interface
  const [localActiveTab, setLocalActiveTab] = useState('dashboard');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  // Utiliser la prop activeTab si fournie, sinon utiliser l'état local
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : localActiveTab;
  
  // Fonction pour gérer le changement d'onglet
  const handleTabChange = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setLocalActiveTab(tab);
    }
    // Fermer le menu déroulant si ouvert
    setShowMoreMenu(false);
  };
  
  // Référence pour le menu déroulant
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Effet pour fermer le menu déroulant lorsqu'on clique ailleurs sur la page
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    }

    // Ajouter l'écouteur d'événements lorsque le menu est ouvert
    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Nettoyer l'écouteur d'événements
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);
  
  // Utiliser les props si fournies, sinon utiliser les états locaux
  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : localSearchTerm;
  const dateDebut = externalDateDebut !== undefined ? externalDateDebut : localDateDebut;
  const dateFin = externalDateFin !== undefined ? externalDateFin : localDateFin;
  const categorie = externalCategorie !== undefined ? externalCategorie : localCategorie;
  const modeReglement = externalModeReglement !== undefined ? externalModeReglement : localModeReglement;
  
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
          dateDebut,
          dateFin,
          categorie,
          modeReglement
        });
      }
    }
  };
  
  const handleDateDebutChange = (date: string) => {
    if (externalSetDateDebut) {
      externalSetDateDebut(date);
    } else {
      setLocalDateDebut(date);
      // Notifier le parent du changement si pas de prop externe
      if (onFilterChange) {
        onFilterChange({
          searchTerm,
          dateDebut: date,
          dateFin,
          categorie,
          modeReglement
        });
      }
    }
  };
  
  const handleDateFinChange = (date: string) => {
    if (externalSetDateFin) {
      externalSetDateFin(date);
    } else {
      setLocalDateFin(date);
      // Notifier le parent du changement si pas de prop externe
      if (onFilterChange) {
        onFilterChange({
          searchTerm,
          dateDebut,
          dateFin: date,
          categorie,
          modeReglement
        });
      }
    }
  };
  
  const handleCategorieChange = (value: string) => {
    if (externalSetCategorie) {
      externalSetCategorie(value);
    } else {
      setLocalCategorie(value);
      // Notifier le parent du changement si pas de prop externe
      if (onFilterChange) {
        onFilterChange({
          searchTerm,
          dateDebut,
          dateFin,
          categorie: value,
          modeReglement
        });
      }
    }
  };
  
  const handleModeReglementChange = (value: string) => {
    if (externalSetModeReglement) {
      externalSetModeReglement(value);
    } else {
      setLocalModeReglement(value);
      // Notifier le parent du changement si pas de prop externe
      if (onFilterChange) {
        onFilterChange({
          searchTerm,
          dateDebut,
          dateFin,
          categorie,
          modeReglement: value
        });
      }
    }
  };
  
  // Listes des catégories et modes de règlement
  const categories = activeTab === 'dashboard' 
    ? ['Fonctionnement', 'Déplacements', 'Frais fixes', 'Cotisations et taxes'] 
    : ['Formation B', 'Formation A', 'Formation C', 'Formation D'];
  
  const modesReglement = ['Espèces', 'Carte bancaire', 'Chèque', 'Virement', 'Prélèvement'];
  
  return (
    <div className="bg-white shadow-sm px-4 pt-2 pb-0 w-full text-black">
        
      {/* Onglets de navigation avec menu déroulant pour les options supplémentaires */}
      <div className="w-full mt-1">
        <div className="grid grid-cols-6 w-full">
          {/* Onglets principaux toujours visibles */}
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`text-center py-2 border-b-2 font-medium text-sm ${activeTab === 'dashboard' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Tableau de bord
          </button>
          <button
            onClick={() => handleTabChange('depenses')}
            className={`text-center py-2 border-b-2 font-medium text-sm ${activeTab === 'depenses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Dépenses
          </button>
          <button
            onClick={() => handleTabChange('recettes')}
            className={`text-center py-2 border-b-2 font-medium text-sm ${activeTab === 'recettes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Recettes
          </button>
          <button
            onClick={() => handleTabChange('chiffre-affaires')}
            className={`text-center py-2 border-b-2 font-medium text-sm ${activeTab === 'chiffre-affaires' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Chiffre d'affaires
          </button>
          <button
            onClick={() => handleTabChange('factures')}
            className={`text-center py-2 border-b-2 font-medium text-sm ${activeTab === 'factures' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Factures
          </button>
          
          {/* Menu déroulant pour les autres options */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`w-full text-center py-2 border-b-2 font-medium text-sm flex items-center justify-center ${showMoreMenu || ['voitures', 'devis-contrats', 'resultats', 'justificatifs', 'suivi-paiements', 'tva'].includes(activeTab) ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              {['voitures', 'devis-contrats', 'resultats', 'justificatifs', 'suivi-paiements', 'tva'].includes(activeTab) ? 
                {
                  'voitures': 'Voitures',
                  'devis-contrats': 'Devis/Contrats',
                  'resultats': 'Résultats',
                  'justificatifs': 'Justificatifs',
                  'suivi-paiements': 'Suivi paiements',
                  'tva': 'TVA'
                }[activeTab] : 'Plus'}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Menu déroulant */}
            {showMoreMenu && (
              <div className="absolute right-0 left-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={() => handleTabChange('voitures')}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeTab === 'voitures' ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    Voitures
                  </button>
                  <button
                    onClick={() => handleTabChange('devis-contrats')}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeTab === 'devis-contrats' ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    Devis/Contrats
                  </button>
                  <button
                    onClick={() => handleTabChange('resultats')}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeTab === 'resultats' ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    Résultats
                  </button>
                  <button
                    onClick={() => handleTabChange('justificatifs')}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeTab === 'justificatifs' ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    Dépôts de justificatifs
                  </button>
                  <button
                    onClick={() => handleTabChange('suivi-paiements')}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeTab === 'suivi-paiements' ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    Suivi paiements élèves
                  </button>
                  <button
                    onClick={() => handleTabChange('tva')}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeTab === 'tva' ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    TVA
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
