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

// Fonction pour formater la date en jour de la semaine
const formatDayOfWeek = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(date);
};

// Fonction pour formater la date en jour/mois
const formatDayMonth = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'numeric' }).format(date);
};

// Fonction pour générer une couleur unique pour chaque moniteur
const getMoniteurColor = (moniteurId: number) => {
  // Liste de classes de couleurs Tailwind pour les moniteurs - couleurs pastel
  const colors = [
    'bg-blue-100 text-blue-800 border-blue-300',
    'bg-green-100 text-green-800 border-green-300',
    'bg-yellow-100 text-yellow-800 border-yellow-300',
    'bg-red-100 text-red-800 border-red-300',
    'bg-purple-100 text-purple-800 border-purple-300',
    'bg-indigo-100 text-indigo-800 border-indigo-300',
    'bg-pink-100 text-pink-800 border-pink-300',
    'bg-gray-100 text-gray-800 border-gray-300',
    'bg-teal-100 text-teal-800 border-teal-300',
    'bg-orange-100 text-orange-800 border-orange-300',
    'bg-lime-100 text-lime-800 border-lime-300',
    'bg-cyan-100 text-cyan-800 border-cyan-300',
    'bg-amber-100 text-amber-800 border-amber-300',
  ];
  
  // Utiliser l'ID du moniteur pour sélectionner une couleur de manière déterministe
  const colorIndex = moniteurId % colors.length;
  return colors[colorIndex];
};

interface SemaineVuProps {
  moniteurs: Moniteur[];
  leconsByDay: {
    [date: string]: {
      [moniteurId: number]: Lecon[];
    };
  };
  days: Date[];
  hours: string[];
  showSunday?: boolean; // Nouvelle prop pour contrôler l'affichage du dimanche
}

export default function SemaineVu({ moniteurs, leconsByDay, days, hours, showSunday = false }: SemaineVuProps) {
  const [selectedLecon, setSelectedLecon] = useState<Lecon | null>(null);
  
  // Log pour vérifier la valeur de showSunday
  console.log('SemaineVu - showSunday:', showSunday);
  console.log('SemaineVu - days:', days.map(d => d.toISOString().split('T')[0]));
  
  // Filtrer les jours pour exclure le dimanche si showSunday est false
  const filteredDays = showSunday ? days : days.filter(day => day.getDay() !== 0); // 0 = dimanche
  
  // Log pour vérifier les jours filtrés
  console.log('SemaineVu - filteredDays:', filteredDays.map(d => d.toISOString().split('T')[0]));
  
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
  
  return (
    <div className="h-full">
      {/* En-tête avec les jours */}
      <div className="grid border-b bg-gray-50" style={{ gridTemplateColumns: `80px repeat(${filteredDays.length}, minmax(120px, 1fr))` }}>
        <div className="p-2 font-medium text-gray-500 border-r"></div>
        {filteredDays.map((day, index) => (
          <div key={index} className="p-2 text-center border-r">
            <div className="font-medium capitalize">{formatDayOfWeek(day)}</div>
            <div className="text-sm text-gray-500">{formatDayMonth(day)}</div>
          </div>
        ))}
      </div>
      
      {/* Corps du planning avec les heures */}
      <div className="grid" style={{ gridTemplateColumns: `80px repeat(${filteredDays.length}, minmax(120px, 1fr))` }}>
        {/* Colonne des heures */}
        <div className="border-r border-b">
          {hours.map((hour, hourIndex) => (
            <div key={hourIndex} className="h-[50px] border-b p-1 text-xs text-gray-500">
              {hour}
            </div>
          ))}
        </div>
        
        {/* Colonnes des jours */}
        {filteredDays.map((day, dayIndex) => {
          // Formatage manuel de la date au format YYYY-MM-DD pour correspondre au format de la base de données
          const year = day.getFullYear();
          const month = String(day.getMonth() + 1).padStart(2, '0');
          const date = String(day.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${date}`;
          
          return (
            <div key={dayIndex} className="border-r border-b relative">
              {/* Lignes d'heures (une par heure) */}
              {hours.map((hour, hourIndex) => (
                <div key={hourIndex} className="h-[50px] border-b"></div>
              ))}
              
              {/* Leçons pour tous les moniteurs ce jour-là avec sous-colonnes par moniteur */}
              <div className="absolute inset-0">
                {/* Créer des sous-colonnes invisibles pour chaque moniteur */}
                <div className="flex h-full w-full">
                  {/* Ajouter des séparateurs visuels entre les colonnes de moniteurs */}
                  {moniteurs.length > 1 && moniteurs.map((_, index) => {
                    if (index === 0) return null; // Pas de séparateur avant la première colonne
                    return (
                      <div 
                        key={`separator-${index}`}
                        className="absolute h-full border-l border-gray-200" 
                        style={{ left: `${(index * 100) / moniteurs.length}%` }}
                      />
                    );
                  })}
                  
                  {moniteurs.map((moniteur, moniteurIndex) => {
                    const leconsDuMoniteur = leconsByDay[dateStr]?.[moniteur.id_moniteur] || [];
                    const color = getMoniteurColor(moniteur.id_moniteur);
                    const colWidth = 100 / moniteurs.length;
                    
                    return (
                      <div 
                        key={moniteurIndex}
                        className="h-full relative" 
                        style={{ width: `${colWidth}%` }}
                      >
                        {/* Leçons pour ce moniteur */}
                        {leconsDuMoniteur.map((lecon) => {
                          const position = calculateLeconPosition(lecon.heure_debut, lecon.heure_fin);
                          
                          return (
                            <div
                              key={lecon.id_planning}
                              className={`absolute p-1 rounded ${color} text-xs overflow-hidden shadow-sm cursor-pointer hover:shadow transition-shadow`}
                              style={{
                                ...position,
                                width: moniteurs.length > 10 ? 'calc(100% - 2px)' : 'calc(100% - 4px)',
                                left: moniteurs.length > 10 ? '1px' : '2px',
                                right: moniteurs.length > 10 ? '1px' : '2px',
                                // Réduire la taille de police pour les auto-écoles avec beaucoup de moniteurs
                                fontSize: moniteurs.length > 8 ? '0.65rem' : undefined,
                                // Bordure fine mais visible
                                borderWidth: '1px'
                              }}
                              onClick={() => setSelectedLecon(lecon)}
                            >
                              {/* Affichage adapté au nombre de moniteurs */}
                              <>
                                <div className="font-medium truncate">
                                  {/* Toujours afficher le nom complet pour 6 moniteurs ou moins */}
                                  {moniteurs.length <= 6 
                                    ? `${moniteur.prenom} ${moniteur.nom.charAt(0)}.`
                                    : (moniteurs.length > 10 
                                        ? `${moniteur.prenom.charAt(0)}${moniteur.nom.charAt(0)}` 
                                        : `${moniteur.prenom.charAt(0)}. ${moniteur.nom.charAt(0)}.`)
                                  }
                                </div>
                                {lecon.eleves && (
                                  <div className="truncate">
                                    {/* Toujours afficher le nom complet de l'élève pour 6 moniteurs ou moins */}
                                    {moniteurs.length <= 6 
                                      ? `${lecon.eleves.prenom} ${lecon.eleves.nom}`
                                      : (moniteurs.length > 10 
                                          ? `${lecon.eleves.prenom.charAt(0)}${lecon.eleves.nom.charAt(0)}` 
                                          : `${lecon.eleves.prenom.charAt(0)}. ${lecon.eleves.nom.charAt(0)}.`)
                                    }
                                  </div>
                                )}
                                {/* Afficher le type de leçon pour 6 moniteurs ou moins */}
                                {moniteurs.length <= 6 && (
                                  <div className="truncate text-[10px] text-gray-600">{lecon.type_lecon}</div>
                                )}
                              </>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
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
