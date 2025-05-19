'use client';

import { useState, useEffect } from 'react';
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
  // Nouvelles props pour la gestion des créneaux disponibles
  selectedSlot: string;
  availableSlotsData: any;
  isLoadingSlots: boolean;
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
  data,
  selectedSlot,
  availableSlotsData,
  isLoadingSlots
}: MoniteurEleveStepProps) {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Array<{id_eleve: number, nom: string, prenom: string}>>([]);
  
  // État pour stocker les moniteurs disponibles pour le créneau sélectionné
  const [availableMoniteurs, setAvailableMoniteurs] = useState<any[]>([]);

  // Filtrer les moniteurs disponibles en fonction du créneau sélectionné
  useEffect(() => {
    // Version simplifiée sans les logs de débogage excessifs
    console.log('Débogage MoniteurEleveStep:');
    console.log('- selectedSlot:', selectedSlot);
    
    // Si aucune donnée n'est encore chargée, afficher tous les moniteurs
    if (!availableSlotsData || isLoadingSlots) {
      if (data?.moniteurs) {
        console.log('- Données non chargées, affichage de tous les moniteurs');
        setAvailableMoniteurs(data.moniteurs);
      }
      return;
    }
    
    // Si aucun créneau n'est sélectionné, afficher tous les moniteurs
    if (!selectedSlot) {
      if (data?.moniteurs) {
        console.log('- Aucun créneau sélectionné, affichage de tous les moniteurs');
        setAvailableMoniteurs(data.moniteurs);
      }
      return;
    }
    
    // Trouver le créneau sélectionné dans les données disponibles
    const slot = availableSlotsData.availableSlots?.find(
      (s: any) => s.time === selectedSlot
    );
    
    console.log('- Créneau trouvé:', slot ? 'Oui' : 'Non');
    
    // Si le créneau n'existe pas, afficher tous les moniteurs
    if (!slot || !slot.teacherIds || slot.teacherIds.length === 0) {
      if (data?.moniteurs) {
        console.log('- Créneau sans moniteurs disponibles, affichage de tous les moniteurs');
        setAvailableMoniteurs(data.moniteurs);
      }
      return;
    }
    
    console.log('- IDs des moniteurs disponibles:', slot.teacherIds);
    
    // Convertir les IDs des moniteurs disponibles en chaînes pour la comparaison
    const availableTeacherIds = slot.teacherIds.map(String);
    
    // Filtrer les moniteurs disponibles pour ce créneau
    if (data?.moniteurs) {
      const moniteursDispo = data.moniteurs.filter((moniteur: any) => {
        const moniteurIdStr = String(moniteur.id_moniteur);
        return availableTeacherIds.includes(moniteurIdStr);
      });
      
      console.log('- Nombre de moniteurs disponibles:', moniteursDispo.length);
      setAvailableMoniteurs(moniteursDispo);
      
      // Si le moniteur actuellement sélectionné n'est pas disponible, réinitialiser la sélection
      if (moniteurId && !availableTeacherIds.includes(moniteurId)) {
        console.log('- Moniteur sélectionné non disponible, réinitialisation');
        setMoniteurId('');
      }
    }
  }, [selectedSlot, availableSlotsData, isLoadingSlots, data, moniteurId, setMoniteurId]);

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
            disabled={isLoading || isLoadingSlots}
          >
            <option value="">Sélectionner un moniteur</option>
            {isLoadingSlots ? (
              <option value="" disabled>Chargement des moniteurs disponibles...</option>
            ) : availableMoniteurs && availableMoniteurs.length > 0 ? (
              availableMoniteurs.map((moniteur: any) => (
                <option key={moniteur.id_moniteur} value={String(moniteur.id_moniteur)}>
                  {moniteur.prenom} {moniteur.nom}
                </option>
              ))
            ) : (
              <option value="" disabled>Aucun moniteur disponible pour ce créneau</option>
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
