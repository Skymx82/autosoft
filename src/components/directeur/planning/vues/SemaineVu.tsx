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
  addHoraireMode?: boolean; // Mode d'ajout d'horaire
}

export default function SemaineVu({ moniteurs, leconsByDay, days, hours, showSunday = false, addHoraireMode = false }: SemaineVuProps) {
  const [selectedLecon, setSelectedLecon] = useState<Lecon | null>(null);
  
  // États pour le mode d'ajout d'horaire avec sélection par glissement
  const [selectionStart, setSelectionStart] = useState<{day: string, time: string, moniteur: number} | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{day: string, time: string, moniteur: number} | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{day: string, hour: string, moniteur: number} | null>(null);
  
  // Fonction pour vérifier si une cellule est occupée
  const isCellOccupied = (day: string, time: string, moniteur: number) => {
    const leconsDuMoniteur = leconsByDay[day]?.[moniteur] || [];
    
    // Extraire les heures et minutes du créneau
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr || '0');
    
    // Convertir en minutes pour faciliter la comparaison
    const timeInMinutes = hour * 60 + minute;
    
    // Vérifier si le créneau est déjà occupé par une leçon
    return leconsDuMoniteur.some(lecon => {
      const leconStart = lecon.heure_debut.split(':').map(Number);
      const leconEnd = lecon.heure_fin.split(':').map(Number);
      
      const leconStartInMinutes = leconStart[0] * 60 + leconStart[1];
      const leconEndInMinutes = leconEnd[0] * 60 + leconEnd[1];
      
      return timeInMinutes >= leconStartInMinutes && timeInMinutes < leconEndInMinutes;
    });
  };
  
  // Fonction pour gérer le début de la sélection (mousedown)
  const handleSelectionStart = (day: string, time: string, moniteur: number) => {
    if (!addHoraireMode) return;
    
    // Vérifier si la cellule est occupée
    if (isCellOccupied(day, time, moniteur)) return;
    
    // Démarrer la sélection
    setSelectionStart({ day, time, moniteur });
    setSelectionEnd({ day, time, moniteur }); // Initialiser la fin au même point que le début
    setIsSelecting(true);
    console.log(`Début de sélection: ${day} à ${time} avec le moniteur ${moniteur}`);
  };
  
  // Fonction pour gérer le glissement de la sélection (mousemove)
  const handleSelectionMove = (day: string, time: string, moniteur: number) => {
    if (!isSelecting || !selectionStart) return;
    
    // Vérifier que le jour et le moniteur sont les mêmes que ceux du début de la sélection
    if (day !== selectionStart.day || moniteur !== selectionStart.moniteur) return;
    
    // Mettre à jour la fin de la sélection
    setSelectionEnd({ day, time, moniteur });
    console.log(`Glissement de sélection: ${day} à ${time} avec le moniteur ${moniteur}`);
  };
  
  // Fonction pour gérer la fin de la sélection (mouseup)
  const handleSelectionEnd = () => {
    if (!isSelecting || !selectionStart || !selectionEnd) return;
    
    // Finaliser la sélection
    console.log(`Fin de sélection: de ${selectionStart.time} à ${selectionEnd.time} le ${selectionStart.day} avec le moniteur ${selectionStart.moniteur}`);
    setIsSelecting(false);
    
    // Ici, on pourrait ouvrir un modal pour créer un nouvel horaire avec les informations de la sélection
  };
  
  // Fonction pour annuler la sélection (par exemple, si l'utilisateur clique en dehors du planning)
  const cancelSelection = () => {
    setSelectionStart(null);
    setSelectionEnd(null);
    setIsSelecting(false);
  };
  
  // Fonction pour déterminer si une cellule fait partie de la sélection en cours
  const isCellInSelection = (day: string, time: string, moniteur: number) => {
    if (!isSelecting || !selectionStart || !selectionEnd) return false;
    if (day !== selectionStart.day || moniteur !== selectionStart.moniteur) return false;
    
    // Convertir les heures en minutes pour faciliter la comparaison
    const [startHourStr, startMinuteStr] = selectionStart.time.split(':');
    const [endHourStr, endMinuteStr] = selectionEnd.time.split(':');
    const [cellHourStr, cellMinuteStr] = time.split(':');
    
    const startTimeInMinutes = parseInt(startHourStr) * 60 + parseInt(startMinuteStr || '0');
    const endTimeInMinutes = parseInt(endHourStr) * 60 + parseInt(endMinuteStr || '0');
    const cellTimeInMinutes = parseInt(cellHourStr) * 60 + parseInt(cellMinuteStr || '0');
    
    // Gérer le cas où l'utilisateur glisse vers le haut (endTime < startTime)
    const minTime = Math.min(startTimeInMinutes, endTimeInMinutes);
    const maxTime = Math.max(startTimeInMinutes, endTimeInMinutes);
    
    return cellTimeInMinutes >= minTime && cellTimeInMinutes <= maxTime;
  };
  
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
    <div className="h-full select-none">
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
      
      {/* Ligne avec les initiales des moniteurs */}
      <div className="grid border-b bg-gray-100" style={{ gridTemplateColumns: `80px repeat(${filteredDays.length}, minmax(120px, 1fr))` }}>
        <div className="p-1 font-medium text-gray-500 border-r text-xs">Moniteurs</div>
        {filteredDays.map((day, dayIndex) => {
          // Formatage manuel de la date au format YYYY-MM-DD
          const year = day.getFullYear();
          const month = String(day.getMonth() + 1).padStart(2, '0');
          const date = String(day.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${date}`;
          
          return (
            <div key={dayIndex} className="border-r p-1">
              <div className="flex h-full w-full">
                {moniteurs.map((moniteur, moniteurIndex) => {
                  const colWidth = 100 / moniteurs.length;
                  const color = getMoniteurColor(moniteur.id_moniteur);
                  
                  // Adapter l'affichage en fonction du nombre de moniteurs
                  let displayName;
                  if (moniteurs.length <= 2) {
                    // Afficher le prénom complet et l'initiale du nom
                    displayName = `${moniteur.prenom} ${moniteur.nom.charAt(0)}.`;
                  } else if (moniteurs.length <= 4) {
                    // Afficher jusqu'à 5 caractères du prénom et l'initiale du nom
                    displayName = `${moniteur.prenom.substring(0, 5)}${moniteur.prenom.length > 5 ? '.' : ''} ${moniteur.nom.charAt(0)}.`;
                  } else {
                    // Afficher initiale prénom . initiale nom
                    displayName = `${moniteur.prenom.charAt(0)}. ${moniteur.nom.charAt(0)}.`;
                  }
                  
                  return (
                    <div 
                      key={moniteurIndex}
                      className={`text-center text-xs font-medium ${color.split(' ')[0]} h-full flex items-center justify-center`} 
                      style={{ 
                        width: `${colWidth}%`, 
                        whiteSpace: 'nowrap', 
                        overflow: 'visible',
                        color: 'black', // Texte en noir uniforme
                        margin: '0 1px' // Petit espace entre les cases pour les distinguer
                      }}
                      title={`${moniteur.prenom} ${moniteur.nom}`} // Ajouter un tooltip pour voir le nom complet au survol
                    >
                      {displayName}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
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
                <div key={hourIndex} className="h-[50px] border-b">
                  {/* En mode ajout d'horaire, colorer les cases vides */}
                  {addHoraireMode && (
                    <div className="flex flex-col h-full w-full">
                      {/* Première partie de l'heure (0-15 minutes) */}
                      <div className="flex h-1/4 w-full border-b border-gray-200">
                        {moniteurs.map((moniteur, moniteurIndex) => {
                          const colWidth = 100 / moniteurs.length;
                          const leconsDuMoniteur = leconsByDay[dateStr]?.[moniteur.id_moniteur] || [];
                          const hourValue = parseInt(hour.split(':')[0]);
                          const firstQuarterHour = `${hourValue}:00`;
                          
                          // Vérifier si cette case est déjà occupée par une leçon
                          const isOccupied = leconsDuMoniteur.some(lecon => {
                            const leconStart = lecon.heure_debut.split(':').map(Number);
                            const leconEnd = lecon.heure_fin.split(':').map(Number);
                            
                            // Convertir en minutes pour faciliter la comparaison
                            const cellTimeInMinutes = hourValue * 60; // 0 minutes
                            const leconStartInMinutes = leconStart[0] * 60 + leconStart[1];
                            const leconEndInMinutes = leconEnd[0] * 60 + leconEnd[1];
                            
                            // Vérifier si le créneau actuel est dans la plage de la leçon
                            return cellTimeInMinutes >= leconStartInMinutes && cellTimeInMinutes < leconEndInMinutes;
                          });
                          
                          // Vérifier si cette case est sélectionnée ou fait partie de la sélection en cours
                          const isSelected = selectedCell && 
                            selectedCell.day === dateStr && 
                            selectedCell.hour === firstQuarterHour && 
                            selectedCell.moniteur === moniteur.id_moniteur;
                          
                          // Vérifier si cette case fait partie de la sélection en cours
                          const isInCurrentSelection = isCellInSelection(dateStr, firstQuarterHour, moniteur.id_moniteur);
                          
                          return (
                            <div 
                              key={moniteurIndex}
                              className={`h-full flex items-center justify-center ${!isOccupied ? 
                                isSelected ? 
                                  'border-2 border-blue-500 hover:border-blue-600 cursor-crosshair' : 
                                  isInCurrentSelection ?
                                    'border border-blue-400 hover:border-blue-500 cursor-crosshair' :
                                    'hover:border hover:border-gray-400 cursor-crosshair' 
                                : ''}`}
                              style={{ width: `${colWidth}%`, zIndex: 10 }}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                if (!isOccupied) {
                                  handleSelectionStart(dateStr, firstQuarterHour, moniteur.id_moniteur);
                                }
                              }}
                              onMouseMove={(e) => {
                                e.stopPropagation();
                                if (!isOccupied) {
                                  handleSelectionMove(dateStr, firstQuarterHour, moniteur.id_moniteur);
                                }
                              }}
                              onMouseUp={(e) => {
                                e.stopPropagation();
                                handleSelectionEnd();
                              }}
                              title={!isOccupied ? 
                                isSelected ? 
                                  `Annuler la sélection` : 
                                  `Ajouter un horaire pour ${moniteur.prenom} ${moniteur.nom} le ${dateStr} à ${firstQuarterHour}` 
                                : ''}
                            >
                              {!isOccupied && <span className="w-full h-full">&nbsp;</span>}
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Deuxième partie de l'heure (15-30 minutes) */}
                      <div className="flex h-1/4 w-full border-b border-gray-200">
                        {moniteurs.map((moniteur, moniteurIndex) => {
                          const colWidth = 100 / moniteurs.length;
                          const leconsDuMoniteur = leconsByDay[dateStr]?.[moniteur.id_moniteur] || [];
                          const hourValue = parseInt(hour.split(':')[0]);
                          const secondQuarterHour = `${hourValue}:15`;
                          
                          // Vérifier si cette case est déjà occupée par une leçon
                          const isOccupied = leconsDuMoniteur.some(lecon => {
                            const leconStart = lecon.heure_debut.split(':').map(Number);
                            const leconEnd = lecon.heure_fin.split(':').map(Number);
                            
                            // Convertir en minutes pour faciliter la comparaison
                            const cellTimeInMinutes = hourValue * 60 + 15; // 15 minutes
                            const leconStartInMinutes = leconStart[0] * 60 + leconStart[1];
                            const leconEndInMinutes = leconEnd[0] * 60 + leconEnd[1];
                            
                            // Vérifier si le créneau actuel est dans la plage de la leçon
                            return cellTimeInMinutes >= leconStartInMinutes && cellTimeInMinutes < leconEndInMinutes;
                          });
                          
                          // Vérifier si cette case est sélectionnée ou fait partie de la sélection en cours
                          const isSelected = selectedCell && 
                            selectedCell.day === dateStr && 
                            selectedCell.hour === secondQuarterHour && 
                            selectedCell.moniteur === moniteur.id_moniteur;
                          
                          // Vérifier si cette case fait partie de la sélection en cours
                          const isInCurrentSelection = isCellInSelection(dateStr, secondQuarterHour, moniteur.id_moniteur);
                          
                          return (
                            <div 
                              key={moniteurIndex}
                              className={`h-full flex items-center justify-center ${!isOccupied ? 
                                isSelected ? 
                                  'border-2 border-blue-500 hover:border-blue-600 cursor-crosshair' : 
                                  isInCurrentSelection ?
                                    'border border-blue-400 hover:border-blue-500 cursor-crosshair' :
                                    'hover:border hover:border-gray-400 cursor-crosshair' 
                                : ''}`}
                              style={{ width: `${colWidth}%`, zIndex: 10 }}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                if (!isOccupied) {
                                  handleSelectionStart(dateStr, secondQuarterHour, moniteur.id_moniteur);
                                }
                              }}
                              onMouseMove={(e) => {
                                e.stopPropagation();
                                if (!isOccupied) {
                                  handleSelectionMove(dateStr, secondQuarterHour, moniteur.id_moniteur);
                                }
                              }}
                              onMouseUp={(e) => {
                                e.stopPropagation();
                                handleSelectionEnd();
                              }}
                              title={!isOccupied ? 
                                isSelected ? 
                                  `Annuler la sélection` : 
                                  `Ajouter un horaire pour ${moniteur.prenom} ${moniteur.nom} le ${dateStr} à ${secondQuarterHour}` 
                                : ''}
                            >
                              {!isOccupied && <span className="w-full h-full">&nbsp;</span>}
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Troisième partie de l'heure (30-45 minutes) */}
                      <div className="flex h-1/4 w-full border-b border-gray-200">
                        {moniteurs.map((moniteur, moniteurIndex) => {
                          const colWidth = 100 / moniteurs.length;
                          const leconsDuMoniteur = leconsByDay[dateStr]?.[moniteur.id_moniteur] || [];
                          const hourValue = parseInt(hour.split(':')[0]);
                          const thirdQuarterHour = `${hourValue}:30`;
                          
                          // Vérifier si cette case est déjà occupée par une leçon
                          const isOccupied = leconsDuMoniteur.some(lecon => {
                            const leconStart = lecon.heure_debut.split(':').map(Number);
                            const leconEnd = lecon.heure_fin.split(':').map(Number);
                            
                            // Convertir en minutes pour faciliter la comparaison
                            const cellTimeInMinutes = hourValue * 60 + 30; // 30 minutes
                            const leconStartInMinutes = leconStart[0] * 60 + leconStart[1];
                            const leconEndInMinutes = leconEnd[0] * 60 + leconEnd[1];
                            
                            // Vérifier si le créneau actuel est dans la plage de la leçon
                            return cellTimeInMinutes >= leconStartInMinutes && cellTimeInMinutes < leconEndInMinutes;
                          });
                          
                          // Vérifier si cette case est sélectionnée ou fait partie de la sélection en cours
                          const isSelected = selectedCell && 
                            selectedCell.day === dateStr && 
                            selectedCell.hour === thirdQuarterHour && 
                            selectedCell.moniteur === moniteur.id_moniteur;
                            
                          // Vérifier si cette case fait partie de la sélection en cours
                          const isInCurrentSelection = isCellInSelection(dateStr, thirdQuarterHour, moniteur.id_moniteur);
                          
                          return (
                            <div 
                              key={moniteurIndex}
                              className={`h-full flex items-center justify-center ${!isOccupied ? 
                                isSelected ? 
                                  'border-2 border-blue-500 hover:border-blue-600 cursor-crosshair' : 
                                  isInCurrentSelection ?
                                    'border border-blue-400 hover:border-blue-500 cursor-crosshair' :
                                    'hover:border hover:border-gray-400 cursor-crosshair' 
                                : ''}`}
                              style={{ width: `${colWidth}%`, zIndex: 10 }}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                if (!isOccupied) {
                                  handleSelectionStart(dateStr, thirdQuarterHour, moniteur.id_moniteur);
                                }
                              }}
                              onMouseMove={(e) => {
                                e.stopPropagation();
                                if (!isOccupied) {
                                  handleSelectionMove(dateStr, thirdQuarterHour, moniteur.id_moniteur);
                                }
                              }}
                              onMouseUp={(e) => {
                                e.stopPropagation();
                                handleSelectionEnd();
                              }}
                              title={!isOccupied ? 
                                isSelected ? 
                                  `Annuler la sélection` : 
                                  `Ajouter un horaire pour ${moniteur.prenom} ${moniteur.nom} le ${dateStr} à ${thirdQuarterHour}` 
                                : ''}
                            >
                              {!isOccupied && <span className="w-full h-full">&nbsp;</span>}
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Quatrième partie de l'heure (45-60 minutes) */}
                      <div className="flex h-1/4 w-full">
                        {moniteurs.map((moniteur, moniteurIndex) => {
                          const colWidth = 100 / moniteurs.length;
                          const leconsDuMoniteur = leconsByDay[dateStr]?.[moniteur.id_moniteur] || [];
                          const hourValue = parseInt(hour.split(':')[0]);
                          const fourthQuarterHour = `${hourValue}:45`;
                          
                          // Vérifier si cette case est déjà occupée par une leçon
                          const isOccupied = leconsDuMoniteur.some(lecon => {
                            const leconStart = lecon.heure_debut.split(':').map(Number);
                            const leconEnd = lecon.heure_fin.split(':').map(Number);
                            
                            // Convertir en minutes pour faciliter la comparaison
                            const cellTimeInMinutes = hourValue * 60 + 45; // 45 minutes
                            const leconStartInMinutes = leconStart[0] * 60 + leconStart[1];
                            const leconEndInMinutes = leconEnd[0] * 60 + leconEnd[1];
                            
                            // Vérifier si le créneau actuel est dans la plage de la leçon
                            return cellTimeInMinutes >= leconStartInMinutes && cellTimeInMinutes < leconEndInMinutes;
                          });
                          
                          // Vérifier si cette case est sélectionnée ou fait partie de la sélection en cours
                          const isSelected = selectedCell && 
                            selectedCell.day === dateStr && 
                            selectedCell.hour === fourthQuarterHour && 
                            selectedCell.moniteur === moniteur.id_moniteur;
                            
                          // Vérifier si cette case fait partie de la sélection en cours
                          const isInCurrentSelection = isCellInSelection(dateStr, fourthQuarterHour, moniteur.id_moniteur);
                          
                          return (
                            <div 
                              key={moniteurIndex}
                              className={`h-full flex items-center justify-center ${!isOccupied ? 
                                isSelected ? 
                                  'border-2 border-blue-500 hover:border-blue-600 cursor-crosshair' : 
                                  isInCurrentSelection ?
                                    'border border-blue-400 hover:border-blue-500 cursor-crosshair' :
                                    'hover:border hover:border-gray-400 cursor-crosshair' 
                                : ''}`}
                              style={{ width: `${colWidth}%`, zIndex: 10 }}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                if (!isOccupied) {
                                  handleSelectionStart(dateStr, fourthQuarterHour, moniteur.id_moniteur);
                                }
                              }}
                              onMouseMove={(e) => {
                                e.stopPropagation();
                                if (!isOccupied) {
                                  handleSelectionMove(dateStr, fourthQuarterHour, moniteur.id_moniteur);
                                }
                              }}
                              onMouseUp={(e) => {
                                e.stopPropagation();
                                handleSelectionEnd();
                              }}
                              title={!isOccupied ? 
                                isSelected ? 
                                  `Annuler la sélection` : 
                                  `Ajouter un horaire pour ${moniteur.prenom} ${moniteur.nom} le ${dateStr} à ${fourthQuarterHour}` 
                                : ''}
                            >
                              {!isOccupied && <span className="w-full h-full">&nbsp;</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
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
