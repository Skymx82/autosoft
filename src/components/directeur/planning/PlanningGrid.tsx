'use client';

import { useState } from 'react';
// Fonction utilitaire pour formater une heure au format HH:MM:SS en HH:MM
const formatTimeToHHMM = (time: string): string => {
  // Si le format est déjà HH:MM, on le retourne tel quel
  if (time.length === 5) return time;
  
  // Sinon on extrait les heures et minutes
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

// Types pour les données du planning
interface Moniteur {
  id_moniteur: number;
  nom: string;
  prenom: string;
  email?: string;
  tel?: string;
  num_enseignant?: string;
}

interface Eleve {
  id_eleve: number;
  nom: string;
  prenom: string;
  tel?: string;
  categorie?: string;
}

interface Lecon {
  id_planning: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  type_lecon: string;
  statut_lecon: string;
  id_moniteur: number;
  id_eleve: number;
  eleves: Eleve | null;
}

interface LeconsByDay {
  [date: string]: {
    [moniteurId: number]: Lecon[];
  };
}

// Props pour le composant PlanningGrid
interface PlanningGridProps {
  moniteurs: Moniteur[];
  leconsByDay: LeconsByDay;
  startDate: Date;
  endDate: Date;
  currentView: 'day' | 'week' | 'month';
  selectedMoniteurId?: number | null;
}

// Fonction utilitaire pour obtenir le style de couleur en fonction du type de leçon
const getLeconColor = (type_lecon: string, statut_lecon: string): string => {
  if (statut_lecon === 'Annulée') return 'bg-gray-300 border-gray-400';
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

// Fonction pour générer les heures de 7h à 22h
const generateHours = () => {
  const hours = [];
  for (let i = 7; i <= 22; i++) {
    hours.push(`${i}:00`);
  }
  return hours;
};

// Fonction pour générer les jours de la semaine
const generateDays = (startDate: Date, endDate: Date, currentView: 'day' | 'week' | 'month') => {
  // Si on est en vue jour, on ne renvoie que le jour sélectionné
  if (currentView === 'day') {
    return [new Date(startDate)];
  }
  
  const days = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
};

// Fonction pour organiser les jours par semaines pour la vue mois
const organizeWeeks = (days: Date[]) => {
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  // Trouver le premier jour (lundi) de la première semaine
  const firstDay = new Date(days[0]);
  const dayOfWeek = firstDay.getDay(); // 0 = dimanche, 1 = lundi, ...
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ajuster pour commencer le lundi
  
  firstDay.setDate(firstDay.getDate() - daysToSubtract);
  
  // Créer un tableau de toutes les dates du mois organisées par semaine
  const startDate = new Date(firstDay);
  const lastDay = new Date(days[days.length - 1]);
  const endDate = new Date(lastDay);
  
  // Ajouter des jours pour compléter la dernière semaine jusqu'à dimanche
  const lastDayOfWeek = endDate.getDay(); // 0 = dimanche
  const daysToAdd = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
  endDate.setDate(endDate.getDate() + daysToAdd);
  
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    currentWeek.push(new Date(currentDate));
    
    if (currentWeek.length === 7) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return weeks;
};

// Fonction pour générer une couleur unique pour chaque moniteur
const getMoniteurColor = (moniteurId: number) => {
  // Liste de couleurs distinctes
  const colors = [
    'bg-blue-200 border-blue-400',
    'bg-green-200 border-green-400',
    'bg-red-200 border-red-400',
    'bg-yellow-200 border-yellow-400',
    'bg-purple-200 border-purple-400',
    'bg-indigo-200 border-indigo-400',
    'bg-pink-200 border-pink-400',
    'bg-teal-200 border-teal-400',
    'bg-orange-200 border-orange-400',
    'bg-cyan-200 border-cyan-400'
  ];
  
  // Utiliser le modulo pour s'assurer que l'index est dans la plage des couleurs disponibles
  return colors[moniteurId % colors.length];
};

// Fonction pour formater la date en jour de la semaine
const formatDayOfWeek = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
};

// Fonction pour formater la date en jour/mois
const formatDayMonth = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'numeric' };
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
};

export default function PlanningGrid({
  moniteurs,
  leconsByDay,
  startDate,
  endDate,
  currentView,
  selectedMoniteurId
}: PlanningGridProps) {
  const [selectedLecon, setSelectedLecon] = useState<Lecon | null>(null);
  
  // Générer les heures et les jours pour l'affichage
  const hours = generateHours();
  const days = generateDays(startDate, endDate, currentView);
  
  // Filtrer les moniteurs si un moniteur spécifique est sélectionné
  const filteredMoniteurs = selectedMoniteurId
    ? moniteurs.filter(m => m.id_moniteur === selectedMoniteurId)
    : moniteurs;
  
  // Calculer la position et la hauteur d'une leçon en fonction de son heure de début et de fin
  const calculateLeconPosition = (heure_debut: string, heure_fin: string) => {
    const debut = new Date(`1970-01-01T${heure_debut}`);
    const fin = new Date(`1970-01-01T${heure_fin}`);
    
    const debutHours = debut.getHours() + debut.getMinutes() / 60;
    const finHours = fin.getHours() + fin.getMinutes() / 60;
    
    // Calculer la position de début relative à 7h00 (première heure affichée)
    const startPosition = (debutHours - 7) * 60; // en minutes depuis 7h
    
    // Calculer la durée en minutes
    const durationMinutes = (finHours - debutHours) * 60;
    
    return {
      top: `${startPosition}px`,
      height: `${durationMinutes}px`,
    };
  };
  
  return (
    <div className="w-full h-full">
      <div className="w-full h-full overflow-auto">
        {currentView === 'day' ? (
          // Vue Jour - Affichage détaillé avec moniteurs en colonnes
          <div>
            {/* En-tête avec les moniteurs */}
            <div className="grid border-b bg-gray-50" style={{ gridTemplateColumns: `100px repeat(${filteredMoniteurs.length}, 1fr)` }}>
              <div className="p-2 font-medium text-gray-500 border-r"></div>
              {filteredMoniteurs.map((moniteur) => (
                <div key={moniteur.id_moniteur} className="p-2 text-center border-r font-medium">
                  {moniteur.prenom} {moniteur.nom}
                </div>
              ))}
            </div>
            
            {/* Corps du planning avec les heures et les leçons */}
            <div className="grid" style={{ gridTemplateColumns: `100px repeat(${filteredMoniteurs.length}, 1fr)` }}>
              {/* Colonne des heures */}
              <div className="border-r">
                {hours.map((hour, hourIndex) => (
                  <div key={hourIndex} className="h-[60px] border-b p-1 text-xs text-gray-500">
                    {hour}
                  </div>
                ))}
              </div>
              
              {/* Colonnes des moniteurs avec leurs leçons */}
              {filteredMoniteurs.map((moniteur) => {
                const dateStr = days[0].toISOString().split('T')[0];
                const leconsDuJour = leconsByDay[dateStr]?.[moniteur.id_moniteur] || [];
                
                return (
                  <div key={moniteur.id_moniteur} className="border-r relative">
                    {/* Lignes d'heures (une par heure) */}
                    {hours.map((hour, hourIndex) => (
                      <div key={hourIndex} className="h-[60px] border-b"></div>
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
          </div>
        ) : currentView === 'week' ? (
          // Vue Semaine - Affichage avec jours en colonnes
          <div>
            {/* En-tête avec les jours */}
            <div className="grid border-b bg-gray-50" style={{ gridTemplateColumns: `100px repeat(${days.length}, 1fr)` }}>
              <div className="p-2 font-medium text-gray-500 border-r"></div>
              {days.map((day, index) => (
                <div key={index} className="p-2 text-center border-r">
                  <div className="font-medium capitalize">{formatDayOfWeek(day)}</div>
                  <div className="text-sm text-gray-500">{formatDayMonth(day)}</div>
                </div>
              ))}
            </div>
            
            {/* Corps du planning avec les heures */}
            <div className="grid" style={{ gridTemplateColumns: `100px repeat(${days.length}, 1fr)` }}>
              {/* Colonne des heures */}
              <div className="border-r">
                {hours.map((hour, hourIndex) => (
                  <div key={hourIndex} className="h-[60px] border-b p-1 text-xs text-gray-500">
                    {hour}
                  </div>
                ))}
              </div>
              
              {/* Colonnes des jours */}
              {days.map((day, dayIndex) => {
                const dateStr = day.toISOString().split('T')[0];
                
                return (
                  <div key={dayIndex} className="border-r relative">
                    {/* Lignes d'heures (une par heure) */}
                    {hours.map((hour, hourIndex) => (
                      <div key={hourIndex} className="h-[60px] border-b"></div>
                    ))}
                    
                    {/* Leçons pour tous les moniteurs ce jour-là */}
                    {filteredMoniteurs.map((moniteur) => {
                      const leconsDuJour = leconsByDay[dateStr]?.[moniteur.id_moniteur] || [];
                      const moniteurColor = getMoniteurColor(moniteur.id_moniteur);
                      
                      return leconsDuJour.map((lecon, leconIndex) => {
                        const position = calculateLeconPosition(lecon.heure_debut, lecon.heure_fin);
                        
                        return (
                          <div
                            key={`${moniteur.id_moniteur}-${leconIndex}`}
                            className={`absolute left-0 right-0 mx-1 p-1 rounded border ${moniteurColor} text-xs overflow-hidden shadow-sm cursor-pointer hover:shadow transition-shadow`}
                            style={position}
                            onClick={() => setSelectedLecon(lecon)}
                          >
                            <div className="font-medium truncate">
                              {moniteur.prenom} {moniteur.nom.charAt(0)}.
                            </div>
                          </div>
                        );
                      });
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Vue Mois - Affichage avec jours de la semaine en colonnes et semaines en lignes
          <div>
            {/* Jours de la semaine en en-tête */}
            <div className="grid border-b bg-gray-50" style={{ gridTemplateColumns: 'minmax(150px, 1fr) repeat(7, 1fr)' }}>
              <div className="p-2 font-medium text-gray-500 border-r">Semaines</div>
              {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((jour, index) => (
                <div key={index} className="p-2 text-center border-r font-medium">
                  {jour}
                </div>
              ))}
            </div>
            
            {/* Organiser les jours par semaines */}
            {organizeWeeks(days).map((week, weekIndex) => {
              // Déterminer les dates de début et de fin de la semaine
              const startOfWeek = week[0];
              const endOfWeek = week[week.length - 1];
              const weekLabel = `Semaine du ${startOfWeek.getDate()}/${startOfWeek.getMonth() + 1} au ${endOfWeek.getDate()}/${endOfWeek.getMonth() + 1}`;
              
              return (
                <div key={weekIndex} className="grid border-b" style={{ gridTemplateColumns: 'minmax(150px, 1fr) repeat(7, 1fr)' }}>
                  {/* Label de la semaine */}
                  <div className="p-2 font-medium border-r">
                    {weekLabel}
                  </div>
                  
                  {/* Jours de la semaine */}
                  {week.map((day, dayIndex) => {
                    const dateStr = day.toISOString().split('T')[0];
                    const isInSelectedMonth = days.some(d => d.toISOString().split('T')[0] === dateStr);
                    
                    return (
                      <div 
                        key={dayIndex} 
                        className={`border-r p-2 ${isInSelectedMonth ? '' : 'bg-gray-100 opacity-50'}`}
                      >
                        {/* Date du jour */}
                        <div className="text-center mb-2">
                          <div className="text-sm font-medium">{day.getDate()}</div>
                        </div>
                        
                        {/* Leçons du jour pour tous les moniteurs */}
                        <div className="flex flex-wrap gap-1">
                          {filteredMoniteurs.map((moniteur) => {
                            const leconsDuJour = leconsByDay[dateStr]?.[moniteur.id_moniteur] || [];
                            
                            // Ne rien afficher si pas de leçons pour ce moniteur ce jour-là
                            if (leconsDuJour.length === 0) return null;
                            
                            const moniteurColor = getMoniteurColor(moniteur.id_moniteur);
                            const colorStyle = moniteurColor.split(' ')[0];
                            const nbLecons = leconsDuJour.length;
                            
                            // Créer un résumé des leçons pour le tooltip
                            const leconsSummary = leconsDuJour.map(lecon => 
                              `${formatTimeToHHMM(lecon.heure_debut)} - ${formatTimeToHHMM(lecon.heure_fin)}${lecon.eleves ? ` avec ${lecon.eleves.prenom} ${lecon.eleves.nom}` : ''}`
                            ).join('\n');
                            
                            return (
                              <div 
                                key={moniteur.id_moniteur} 
                                className={`w-6 h-6 rounded-full ${colorStyle} cursor-pointer flex items-center justify-center text-xs font-medium`}
                                onClick={() => setSelectedLecon(leconsDuJour[0])}
                                title={`${moniteur.prenom} ${moniteur.nom} - ${nbLecons} leçon(s):\n${leconsSummary}`}
                              >
                                {nbLecons > 1 ? nbLecons : ''}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Modal pour afficher les détails d'une leçon */}
      {selectedLecon && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={() => setSelectedLecon(null)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-4">Détails de la leçon</h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-gray-500">Date:</span> {new Date(selectedLecon.date).toLocaleDateString('fr-FR')}
              </div>
              <div>
                <span className="text-gray-500">Horaire:</span> {formatTimeToHHMM(selectedLecon.heure_debut)} - {formatTimeToHHMM(selectedLecon.heure_fin)}
              </div>
              <div>
                <span className="text-gray-500">Type:</span> {selectedLecon.type_lecon}
              </div>
              <div>
                <span className="text-gray-500">Statut:</span> {selectedLecon.statut_lecon}
              </div>
              {selectedLecon.eleves && (
                <div>
                  <span className="text-gray-500">Élève:</span> {selectedLecon.eleves.prenom} {selectedLecon.eleves.nom}
                  {selectedLecon.eleves.tel && (
                    <div className="text-sm text-gray-500">Tél: {selectedLecon.eleves.tel}</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => setSelectedLecon(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
