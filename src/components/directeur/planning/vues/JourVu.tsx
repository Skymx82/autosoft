'use client';

import { useState } from 'react';
import { Lecon, Moniteur } from '../PlanningGrid';
import LeconDetailsModal from '../LeconDetailsModal';

// Fonction utilitaire pour formater une heure au format HH:MM:SS en HH:MM
const formatTimeToHHMM = (time: string): string => {
  // Si le format est déjà HH:MM, on le retourne tel quel
  if (time.length === 5) return time;
  
  // Sinon on extrait les heures et minutes
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

// Fonction utilitaire pour obtenir le style de couleur en fonction du type de leçon
const getLeconColor = (type_lecon: string, statut_lecon: string): string => {
  if (statut_lecon === 'Annulée') return 'bg-red-300 border-red-400';
  if (statut_lecon === 'Réalisée') return 'bg-green-100 border-green-400';
  
  switch (type_lecon) {
    case 'B manuelle':
      return 'bg-blue-100 border-blue-400';
    case 'B auto':
      return 'bg-indigo-100 border-indigo-400';
    case 'B manuelle conduite accompagnée':
      return 'bg-blue-200 border-blue-500';
    case 'B auto conduite accompagnée':
      return 'bg-indigo-200 border-indigo-500';
    case 'A':
    case 'A1':
    case 'A2':
      return 'bg-red-100 border-red-400';
    case 'C':
    case 'C1':
    case 'C1E':
    case 'CE':
      return 'bg-yellow-100 border-yellow-400';
    case 'D':
    case 'D1':
    case 'D1E':
    case 'DE':
      return 'bg-orange-100 border-orange-400';
    case 'Examen':
      return 'bg-purple-100 border-purple-400';
    case 'Indisponible':
      return 'bg-gray-200 border-gray-400';
    case 'Préparation examen':
      return 'bg-purple-200 border-purple-500';
    case 'Disponible':
      return 'bg-green-50 border-green-300';
    default:
      return 'bg-gray-100 border-gray-300';
  }
};

interface JourVuProps {
  moniteurs: Moniteur[];
  leconsByDay: {
    [date: string]: {
      [moniteurId: number]: Lecon[];
    };
  };
  selectedDate: Date;
  hours: string[];
}

export default function JourVu({ moniteurs, leconsByDay, selectedDate, hours }: JourVuProps) {
  const [selectedLecon, setSelectedLecon] = useState<Lecon | null>(null);
  
  // Calculer la position et la hauteur d'une leçon en fonction de son heure de début et de fin
  const calculateLeconPosition = (heure_debut: string, heure_fin: string) => {
    // Convertir les heures en minutes depuis le début de la journée (8h00)
    const [startHour, startMinute] = heure_debut.split(':').map(Number);
    const [endHour, endMinute] = heure_fin.split(':').map(Number);
    
    const startMinutes = (startHour - 8) * 60 + startMinute;
    const endMinutes = (endHour - 8) * 60 + endMinute;
    const durationMinutes = endMinutes - startMinutes;
    
    // Calculer la position en pixels (50px par heure)
    const startPosition = startMinutes * (50 / 60);
    
    return {
      top: `${startPosition}px`,
      height: `${durationMinutes * (50 / 60)}px`,
    };
  };

  // Formatage manuel de la date au format YYYY-MM-DD
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const date = String(selectedDate.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${date}`;
  
  return (
    <div className="h-full">
      {/* En-tête avec les moniteurs */}
      <div className="grid border-b bg-blue-50" style={{ gridTemplateColumns: `80px repeat(${moniteurs.length}, minmax(120px, 1fr))` }}>
        <div className="p-2 font-medium text-gray-600 border-r bg-blue-100"></div>
        {moniteurs.map((moniteur) => (
          <div key={moniteur.id_moniteur} className="p-2 text-center border-r font-medium text-blue-800 hover:bg-blue-100 transition-colors">
            {moniteur.prenom} {moniteur.nom}
          </div>
        ))}
      </div>
      
      {/* Corps du planning avec les heures et les leçons */}
      <div className="grid" style={{ gridTemplateColumns: `80px repeat(${moniteurs.length}, minmax(120px, 1fr))` }}>
        {/* Colonne des heures */}
        <div className="border-r border-b bg-gray-50">
          {hours.map((hour, hourIndex) => (
            <div key={hourIndex} className={`h-[50px] border-b p-1 text-xs font-medium ${hourIndex % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'}`}>
              {hour}
            </div>
          ))}
        </div>
        
        {/* Colonnes des moniteurs avec leurs leçons */}
        {moniteurs.map((moniteur, moniteurIndex) => {
          const leconsDuJour = leconsByDay[dateStr]?.[moniteur.id_moniteur] || [];
          
          return (
            <div key={moniteur.id_moniteur} className={`border-r border-b relative ${moniteurIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
              {/* Lignes d'heures (une par heure) */}
              {hours.map((hour, hourIndex) => (
                <div key={hourIndex} className={`h-[50px] border-b ${hourIndex % 2 === 0 ? 'bg-white/80' : 'bg-gray-50/50'}`}></div>
              ))}
              
              {/* Leçons du jour pour ce moniteur */}
              {leconsDuJour.map((lecon, leconIndex) => {
                const position = calculateLeconPosition(lecon.heure_debut, lecon.heure_fin);
                const colorClass = getLeconColor(lecon.type_lecon, lecon.statut_lecon);
                
                return (
                  <div
                    key={leconIndex}
                    className={`absolute left-0 right-0 mx-1 p-1 rounded border ${colorClass} text-xs overflow-hidden shadow-sm cursor-pointer hover:shadow transition-shadow`}
                    style={position}
                    onClick={() => setSelectedLecon(lecon)}
                  >
                    <div className="font-medium truncate">
                      {formatTimeToHHMM(lecon.heure_debut)} - {formatTimeToHHMM(lecon.heure_fin)}
                    </div>
                    {lecon.eleves && (
                      <div className="truncate">{lecon.eleves.prenom} {lecon.eleves.nom}</div>
                    )}
                    <div className="truncate text-[10px] text-gray-600">{lecon.type_lecon}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      
      {/* Modal pour afficher les détails d'une leçon */}
      {selectedLecon && (
        <LeconDetailsModal 
          lecon={selectedLecon} 
          onClose={() => setSelectedLecon(null)} 
        />
      )}
    </div>
  );
}
