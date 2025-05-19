'use client';

import { useState } from 'react';
import { FiUsers, FiSearch } from 'react-icons/fi';

interface MoniteurEleveStepProps {
  moniteurId: string;
  setMoniteurId: (id: string) => void;
  eleveId: string;
  setEleveId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedEleve: {id_eleve: number, nom: string, prenom: string} | null;
  setSelectedEleve: (eleve: {id_eleve: number, nom: string, prenom: string} | null) => void;
  isLoading: boolean;
  data: any;
}

export default function MoniteurEleveStep({
  moniteurId,
  setMoniteurId,
  eleveId,
  setEleveId,
  searchQuery,
  setSearchQuery,
  selectedEleve,
  setSelectedEleve,
  isLoading,
  data
}: MoniteurEleveStepProps) {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Array<{id_eleve: number, nom: string, prenom: string}>>([]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    // Générer des suggestions si l'utilisateur tape quelque chose
    if (value.trim() !== '') {
      const valueLower = value.toLowerCase();
      const filteredSuggestions = data?.eleves?.filter((eleve: any) => 
        (eleve.nom && eleve.nom.toLowerCase().includes(valueLower)) ||
        (eleve.prenom && eleve.prenom.toLowerCase().includes(valueLower))
      ) || [];
      
      // Trier les suggestions par pertinence (commence par > contient)
      const sortedSuggestions = filteredSuggestions.sort((a: any, b: any) => {
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
      
      setSuggestions(sortedSuggestions);
      setShowSuggestions(sortedSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedEleve(null);
      setEleveId('');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 text-blue-600 mb-2">
        <FiUsers className="w-5 h-5" />
        <h3 className="font-medium">Moniteur et élève</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="moniteur" className="block text-sm font-medium text-gray-700 mb-1">Moniteur</label>
          <select
            id="moniteur"
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm"
            value={moniteurId}
            onChange={(e) => setMoniteurId(e.target.value)}
            disabled={isLoading}
          >
            <option value="">Sélectionner un moniteur</option>
            {data?.moniteurs && data.moniteurs.length > 0 ? (
              data.moniteurs.map((moniteur: any) => (
                <option key={moniteur.id_moniteur} value={String(moniteur.id_moniteur)}>
                  {moniteur.prenom} {moniteur.nom}
                </option>
              ))
            ) : (
              <option value="" disabled>Chargement des moniteurs...</option>
            )}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Élève</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
              placeholder="Rechercher un élève..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim() !== '' && suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                // Délai pour permettre la sélection d'une suggestion avant de fermer
                setTimeout(() => setShowSuggestions(false), 200);
              }}
            />
            
            {/* Liste des suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((eleve) => (
                  <div 
                    key={eleve.id_eleve}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchQuery(`${eleve.prenom} ${eleve.nom}`);
                      setShowSuggestions(false);
                      setSelectedEleve(eleve);
                      setEleveId(String(eleve.id_eleve));
                    }}
                  >
                    {eleve.prenom} {eleve.nom}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
