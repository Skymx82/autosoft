'use client';

import React, { useState, useEffect } from 'react';
import { useElevesData, Eleve } from '../hooks/useElevesData';

interface EleveSelectorProps {
  selectedEleveId: number | null;
  onEleveChange: (eleveId: number | null) => void;
}

export default function EleveSelector({
  selectedEleveId,
  onEleveChange
}: EleveSelectorProps) {
  // Utiliser le hook personnalisé pour récupérer les données
  const { eleves, isLoading, error: apiError } = useElevesData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);
  const [suggestions, setSuggestions] = useState<Eleve[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mettre à jour l'erreur locale si l'API renvoie une erreur
  useEffect(() => {
    if (apiError) {
      setError(apiError);
    }
  }, [apiError]);
  
  // Mettre à jour l'élève sélectionné lorsque l'ID change
  useEffect(() => {
    if (selectedEleveId) {
      const eleve = eleves.find(e => e.id_eleve === selectedEleveId);
      setSelectedEleve(eleve || null);
    } else {
      setSelectedEleve(null);
    }
  }, [selectedEleveId, eleves]);
  
  // Gérer le changement de terme de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Générer des suggestions si l'utilisateur tape quelque chose
    if (value.trim() !== '') {
      const valueLower = value.toLowerCase();
      const filteredSuggestions = eleves.filter(eleve => 
        (eleve.nom && eleve.nom.toLowerCase().includes(valueLower)) ||
        (eleve.prenom && eleve.prenom.toLowerCase().includes(valueLower))
      );
      
      // Trier les suggestions par pertinence (commence par > contient)
      const sortedSuggestions = filteredSuggestions.sort((a, b) => {
        const aFullName = `${a.prenom} ${a.nom}`.toLowerCase();
        const bFullName = `${b.prenom} ${b.nom}`.toLowerCase();
        
        // Priorité aux noms qui commencent par la recherche
        const aStartsWith = aFullName.startsWith(valueLower) ? 0 : 1;
        const bStartsWith = bFullName.startsWith(valueLower) ? 0 : 1;
        
        if (aStartsWith !== bStartsWith) {
          return aStartsWith - bStartsWith;
        }
        
        // Ensuite, trier par ordre alphabétique
        return aFullName.localeCompare(bFullName);
      });
      
      // Limiter à 5 suggestions maximum
      setSuggestions(sortedSuggestions.slice(0, 5));
      setShowSuggestions(sortedSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      // Si le champ est vidé, réinitialiser l'élève sélectionné
      setSelectedEleve(null);
      onEleveChange(null);
    }
  };
  
  // Gérer la sélection d'un élève depuis les suggestions
  const handleSelectEleve = (eleve: Eleve) => {
    setSelectedEleve(eleve);
    setSearchTerm(`${eleve.prenom} ${eleve.nom}`);
    setShowSuggestions(false);
    onEleveChange(eleve.id_eleve);
  };
  
  // Gérer la suppression de l'élève sélectionné
  const handleClearEleve = () => {
    setSelectedEleve(null);
    setSearchTerm('');
    onEleveChange(null);
  };
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Élève associé (optionnel)
      </label>
      
      {error && (
        <div className="mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="relative">
        {/* Champ de recherche avec suggestions */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Rechercher un élève..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 pl-10 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            onFocus={() => {
              if (searchTerm.trim() !== '' && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              // Délai pour permettre la sélection d'une suggestion avant de fermer
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
          {selectedEleve && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                type="button"
                onClick={handleClearEleve}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {/* Liste des suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((eleve) => (
              <div 
                key={eleve.id_eleve}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectEleve(eleve)}
              >
                {eleve.prenom} {eleve.nom}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedEleve && (
        <div className="bg-gray-50 p-3 rounded-md mt-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{selectedEleve.prenom} {selectedEleve.nom}</h3>
              {selectedEleve.email && <p className="text-sm text-gray-500">{selectedEleve.email}</p>}
              {selectedEleve.tel && <p className="text-sm text-gray-500">{selectedEleve.tel}</p>}
            </div>
            {selectedEleve.categorie && (
              <div className="text-right">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {selectedEleve.categorie}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
