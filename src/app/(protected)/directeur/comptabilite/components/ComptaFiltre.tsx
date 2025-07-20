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
  const [activeTab, setActiveTab] = useState('depenses');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
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
  const categories = activeTab === 'depenses' 
    ? ['Fonctionnement', 'Déplacements', 'Frais fixes', 'Cotisations et taxes'] 
    : ['Formation B', 'Formation A', 'Formation C', 'Formation D'];
  
  const modesReglement = ['Espèces', 'Carte bancaire', 'Chèque', 'Virement', 'Prélèvement'];
  
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
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              placeholder={activeTab === 'depenses' ? "Rechercher une dépense..." : "Rechercher une recette..."}
            />
            {searchTerm && (
              <button
                onClick={() => {
                  handleSearchTermChange('');
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              >
                <FiX />
              </button>
            )}
          </div>
          
          {/* Sélecteur de catégorie */}
          <div className="w-48 lg:w-56">
            <select
              value={categorie}
              onChange={(e) => handleCategorieChange(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          {/* Filtre par date */}
          <div className="w-48 lg:w-56">
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => handleDateDebutChange(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              />
              <span>à</span>
              <input
                type="date"
                value={dateFin}
                onChange={(e) => handleDateFinChange(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              />
            </div>
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
            onClick={() => {
              // Action pour ajouter une nouvelle entrée selon l'onglet actif
              console.log(`Ajouter un(e) ${activeTab === 'depenses' ? 'dépense' : activeTab === 'recettes' ? 'recette' : activeTab}`);
            }}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            title={`Ajouter ${activeTab === 'depenses' ? 'une dépense' : activeTab === 'recettes' ? 'une recette' : ''}`}
          >
            <FiPlus className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Onglets de navigation avec menu déroulant pour les options supplémentaires */}
      <div className="w-full border-b mt-4">
        <div className="grid grid-cols-6 w-full">
          {/* Onglets principaux toujours visibles */}
          <button
            onClick={() => setActiveTab('depenses')}
            className={`text-center py-2 border-b-2 font-medium text-sm ${activeTab === 'depenses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Dépenses
          </button>
          <button
            onClick={() => setActiveTab('recettes')}
            className={`text-center py-2 border-b-2 font-medium text-sm ${activeTab === 'recettes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Recettes
          </button>
          <button
            onClick={() => setActiveTab('chiffre-affaires')}
            className={`text-center py-2 border-b-2 font-medium text-sm ${activeTab === 'chiffre-affaires' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Chiffre d'affaires
          </button>
          <button
            onClick={() => setActiveTab('factures')}
            className={`text-center py-2 border-b-2 font-medium text-sm ${activeTab === 'factures' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Factures
          </button>
          <button
            onClick={() => setActiveTab('tva')}
            className={`text-center py-2 border-b-2 font-medium text-sm ${activeTab === 'tva' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            TVA
          </button>
          
          {/* Menu déroulant pour les autres options */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`w-full text-center py-2 border-b-2 font-medium text-sm flex items-center justify-center ${showMoreMenu || ['voitures', 'devis-contrats', 'resultats', 'justificatifs', 'suivi-paiements'].includes(activeTab) ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              {['voitures', 'devis-contrats', 'resultats', 'justificatifs', 'suivi-paiements'].includes(activeTab) ? 
                {
                  'voitures': 'Voitures',
                  'devis-contrats': 'Devis/Contrats',
                  'resultats': 'Résultats',
                  'justificatifs': 'Justificatifs',
                  'suivi-paiements': 'Suivi paiements'
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
                    onClick={() => {
                      setActiveTab('voitures');
                      setShowMoreMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeTab === 'voitures' ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    Voitures
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('devis-contrats');
                      setShowMoreMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeTab === 'devis-contrats' ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    Devis/Contrats
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('resultats');
                      setShowMoreMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeTab === 'resultats' ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    Résultats
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('justificatifs');
                      setShowMoreMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeTab === 'justificatifs' ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    Dépôts de justificatifs
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('suivi-paiements');
                      setShowMoreMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeTab === 'suivi-paiements' ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    Suivi paiements élèves
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Panneau de paramètres (affiché conditionnellement) */}
      {isExpanded && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Filtres avancés</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Filtre pour le mode de règlement */}
            <div>
              <label htmlFor="modeReglement" className="block text-xs font-medium text-gray-700 mb-1">
                Mode de règlement
              </label>
              <div className="relative">
                <select
                  id="modeReglement"
                  value={modeReglement}
                  onChange={(e) => handleModeReglementChange(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                >
                  <option value="all">Tous les modes</option>
                  {modesReglement.map((mode) => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Filtre pour le nombre d'éléments par page */}
            <div>
              <label htmlFor="itemsPerPage" className="block text-xs font-medium text-gray-700 mb-1">
                Éléments par page
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
                        dateDebut,
                        dateFin,
                        categorie,
                        modeReglement,
                        itemsPerPage: value
                      });
                    }
                  }}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                >
                  <option value="5">5 éléments</option>
                  <option value="10">10 éléments</option>
                  <option value="20">20 éléments</option>
                  <option value="50">50 éléments</option>
                  <option value="100">100 éléments</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
