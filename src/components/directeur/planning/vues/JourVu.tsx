'use client';

import { useState } from 'react';
import { Lecon, Moniteur } from '../PlanningGrid';
import LeconDetailsModal from '../ModalDetail';
import { updateLecon } from '../../../../utils/Directeur/Planning/route';

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
  // Base de couleur en fonction du type d'événement
  let baseColor = '';
  
  // ===== LEÇONS DE CONDUITE (nuances de bleu) =====
  if (type_lecon === 'Conduite') {
    baseColor = 'bg-blue-100 text-blue-800 border-blue-400';
  } else if (type_lecon === 'Code') {
    baseColor = 'bg-blue-50 text-blue-700 border-blue-300';
  } else if (type_lecon === 'Évaluation') {
    baseColor = 'bg-blue-200 text-blue-900 border-blue-500';
  } 
  
  // ===== EXAMENS (nuances de rouge/violet) =====
  else if (type_lecon === 'Examen code') {
    baseColor = 'bg-red-100 text-red-800 border-red-400';
  } else if (type_lecon === 'Examen conduite') {
    baseColor = 'bg-red-200 text-red-900 border-red-500';
  } else if (type_lecon === 'Examen plateau') {
    baseColor = 'bg-red-300 text-red-900 border-red-600';
  } else if (type_lecon === 'Examen') {
    baseColor = 'bg-red-200 text-red-900 border-red-500';
  } else if (type_lecon === 'Examen blanc') {
    baseColor = 'bg-orange-100 text-orange-800 border-orange-400';
  } else if (type_lecon === 'Préparation examen') {
    baseColor = 'bg-purple-100 text-purple-800 border-purple-400';
  } 
  
  // ===== INDISPONIBILITÉS (nuances de gris) =====
  else if (type_lecon === 'Congé') {
    baseColor = 'bg-gray-100 text-gray-700 border-gray-300';
  } else if (type_lecon === 'Maladie') {
    baseColor = 'bg-gray-200 text-gray-800 border-gray-400';
  } else if (type_lecon === 'Formation') {
    baseColor = 'bg-gray-300 text-gray-800 border-gray-500';
  } else if (type_lecon === 'Réunion') {
    baseColor = 'bg-gray-200 text-gray-800 border-gray-400';
  } else if (type_lecon === 'Autre' || type_lecon === 'Indisponible') {
    baseColor = 'bg-gray-200 text-gray-700 border-gray-400';
  } 
  
  // ===== DISPONIBILITÉS (nuances de vert) =====
  else if (type_lecon === 'Disponible') {
    baseColor = 'bg-green-50 text-green-700 border-green-300';
  } 
  
  // Si aucune couleur spécifique n'est définie, utiliser la couleur du moniteur
  else {
    return 'bg-gray-100 text-gray-700 border-gray-300';
  }
  
  // ===== MODIFICATEURS DE STATUT =====
  if (statut_lecon === 'Annulée') {
    // Pour les leçons annulées: version désaturée avec bordure pointillée
    return baseColor.replace('bg-', 'bg-opacity-50 bg-') + ' border-dashed';
  } else if (statut_lecon === 'Réalisée') {
    // Pour les leçons réalisées: bordure plus épaisse avec motif de hachures
    return baseColor + ' border-2 lecon-realisee';
  }
  
  return baseColor;
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
                    onClick={() => {
                      // Associer le moniteur à la leçon avant de la sélectionner
                      setSelectedLecon({
                        ...lecon,
                        moniteur: moniteur
                      });
                    }}
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
      <LeconDetailsModal 
        lecon={selectedLecon!} 
        onClose={() => setSelectedLecon(null)} 
        showModal={selectedLecon !== null}
        onUpdate={async (updatedLecon, action) => {
          try {
            // Mettre à jour la leçon dans la base de données
            const updatedLeconFromServer = await updateLecon(updatedLecon);
            console.log(`Leçon mise à jour avec l'action: ${action}`, updatedLeconFromServer);
            
            // Vous pourriez également mettre à jour l'état local si nécessaire
            // pour refléter les changements sans avoir à recharger la page
            
            // Fermer le modal après la mise à jour
            setSelectedLecon(null);
          } catch (error) {
            console.error('Erreur lors de la mise à jour de la leçon:', error);
            alert('Erreur lors de la mise à jour de la leçon. Veuillez réessayer.');
          }
        }}
      />
    </div>
  );
}
