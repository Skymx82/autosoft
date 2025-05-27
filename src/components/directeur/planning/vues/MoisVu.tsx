'use client';

import { useState } from 'react';
import { Lecon, Moniteur } from '../PlanningGrid';
import LeconDetailsModal from '../ModalDetail';

// Fonction utilitaire pour formater une heure au format HH:MM:SS en HH:MM
const formatTimeToHHMM = (time: string): string => {
  // Si le format est déjà HH:MM, on le retourne tel quel
  if (time.length === 5) return time;
  
  // Sinon on extrait les heures et minutes
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

// Fonction pour organiser les jours par semaines pour la vue mois
const organizeWeeks = (days: Date[], showSunday: boolean) => {
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
  
  // Ajouter des jours pour compléter la dernière semaine jusqu'à dimanche ou samedi selon l'option
  const lastDayOfWeek = endDate.getDay(); // 0 = dimanche
  // Si showSunday est false et que le dernier jour est un samedi, pas besoin d'ajouter de jours
  // Sinon, ajouter les jours nécessaires pour compléter la semaine
  const daysToAdd = !showSunday && lastDayOfWeek === 6 ? 0 : 
                   lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
  endDate.setDate(endDate.getDate() + daysToAdd);
  
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Si showSunday est false et que le jour est un dimanche, ne pas l'ajouter
    if (showSunday || currentDate.getDay() !== 0) {
      currentWeek.push(new Date(currentDate));
    }
    
    // Si nous avons 7 jours (avec dimanche) ou 6 jours (sans dimanche), c'est une semaine complète
    const weekLength = showSunday ? 7 : 6;
    if (currentWeek.length === weekLength) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Si la dernière semaine est incomplète mais non vide, l'ajouter quand même
  if (currentWeek.length > 0) {
    weeks.push([...currentWeek]);
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
  ];
  
  // Utiliser l'ID du moniteur pour sélectionner une couleur de manière déterministe
  const colorIndex = moniteurId % colors.length;
  return colors[colorIndex];
};

interface MoisVuProps {
  moniteurs: Moniteur[];
  leconsByDay: {
    [date: string]: {
      [moniteurId: number]: Lecon[];
    };
  };
  days: Date[];
  showSunday?: boolean; // Option pour afficher ou non le dimanche
}

export default function MoisVu({ moniteurs, leconsByDay, days, showSunday = false }: MoisVuProps) {
  const [selectedLecon, setSelectedLecon] = useState<Lecon | null>(null);
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Conteneur principal avec défilement synchronisé */}
      <div className="flex flex-col h-full">
        {/* Conteneur avec défilement horizontal synchronisé */}
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {/* Table layout pour assurer l'alignement entre l'en-tête et le contenu - min-width pour garantir le défilement */}
          <div className="min-w-[800px] md:min-w-full">
            {/* Jours de la semaine en en-tête - maintenant dans le même conteneur de défilement */}
            <div className="grid border-b bg-gray-50 sticky top-0 z-10" 
              style={{ 
                gridTemplateColumns: `minmax(80px, 0.8fr) repeat(${showSunday ? 7 : 6}, minmax(60px, 1fr))`,
              }}>
              <div className="p-2 font-medium text-gray-500 border-r text-xs sm:text-sm">Semaines</div>
              {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', ...(showSunday ? ['Dimanche'] : [])].map((jour, index) => (
                <div key={index} className="p-2 text-center border-r font-medium">
                  {/* Sur mobile, n'afficher que la première lettre, sur tablette le format court, sur PC le format complet */}
                  <span className="hidden md:inline">{jour}</span>
                  <span className="hidden sm:inline md:hidden">{jour.substring(0, 3)}</span>
                  <span className="sm:hidden">{jour.charAt(0)}</span>
                </div>
              ))}
            </div>
            
            {/* Organiser les jours par semaines - dans le même conteneur de défilement */}
            <div className="flex-grow overflow-y-auto">
            {organizeWeeks(days, showSunday).map((week, weekIndex) => {
              // Déterminer les dates de début et de fin de la semaine
              const startOfWeek = week[0];
              const endOfWeek = week[week.length - 1];
              const weekLabel = `Semaine du ${startOfWeek.getDate()}/${startOfWeek.getMonth() + 1} au ${endOfWeek.getDate()}/${endOfWeek.getMonth() + 1}`;
              
              return (
                <div key={weekIndex} className="grid border-b" 
                  style={{ 
                    gridTemplateColumns: `minmax(80px, 0.8fr) repeat(${showSunday ? 7 : 6}, minmax(60px, 1fr))`,
                  }}>
                  {/* Label de la semaine */}
                  <div className="p-2 font-medium border-r text-xs sm:text-sm">
                    {weekLabel}
                  </div>
                  
                  {/* Jours de la semaine */}
                  {week.map((day, dayIndex) => {
                    // Formatage manuel de la date au format YYYY-MM-DD
                    const year = day.getFullYear();
                    const month = String(day.getMonth() + 1).padStart(2, '0');
                    const date = String(day.getDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${date}`;
                    
                    // Vérifier si le jour fait partie du mois sélectionné
                    const isInSelectedMonth = days.some(d => {
                      const dYear = d.getFullYear();
                      const dMonth = String(d.getMonth() + 1).padStart(2, '0');
                      const dDate = String(d.getDate()).padStart(2, '0');
                      return `${dYear}-${dMonth}-${dDate}` === dateStr;
                    });
                    
                    return (
                      <div 
                        key={dayIndex} 
                        className={`border-r p-2 min-h-[80px] ${isInSelectedMonth ? '' : 'bg-gray-200 opacity-40'}`}
                      >
                        {/* Date du jour */}
                        <div className="text-center mb-2">
                          <div className="text-xs sm:text-sm font-medium">{day.getDate()}</div>
                        </div>
                        
                        {/* Leçons du jour pour tous les moniteurs */}
                        <div className="flex flex-wrap gap-1 justify-center">
                          {moniteurs.map((moniteur) => {
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
                                className={`w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full ${colorStyle} cursor-pointer flex items-center justify-center text-xs font-medium shadow-sm`}
                                onClick={() => {
                                  // Associer le moniteur à la leçon avant de la sélectionner
                                  setSelectedLecon({
                                    ...leconsDuJour[0],
                                    moniteur: moniteur
                                  });
                                }}
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
          </div>
        </div>
      </div>
      
      {/* Modal pour afficher les détails d'une leçon */}
      <LeconDetailsModal 
        lecon={selectedLecon!} 
        onClose={() => setSelectedLecon(null)} 
        showModal={selectedLecon !== null}
        onUpdate={async (updatedLecon, action) => {
          // Ici, vous pouvez ajouter la logique pour mettre à jour la leçon
          console.log(`Leçon mise à jour avec l'action: ${action}`, updatedLecon);
          // Exemple: appeler une API pour mettre à jour la leçon
          // await updateLecon(updatedLecon);
          // Fermer le modal après la mise à jour
          setSelectedLecon(null);
        }}
      />
    </div>
  );
}
