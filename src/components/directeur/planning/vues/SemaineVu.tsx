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
  // Liste de classes de couleurs Tailwind pour les moniteurs
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800',
    'bg-purple-100 text-purple-800',
    'bg-indigo-100 text-indigo-800',
    'bg-pink-100 text-pink-800',
    'bg-gray-100 text-gray-800',
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
              
              {/* Leçons pour tous les moniteurs ce jour-là avec gestion des chevauchements */}
              {(() => {
                // Récupérer toutes les leçons de tous les moniteurs pour ce jour
                const toutesLesLeconsDuJour: Array<{lecon: Lecon, moniteur: Moniteur, color: string}> = [];
                
                moniteurs.forEach(moniteur => {
                  const leconsDuMoniteur = leconsByDay[dateStr]?.[moniteur.id_moniteur] || [];
                  leconsDuMoniteur.forEach(lecon => {
                    toutesLesLeconsDuJour.push({
                      lecon,
                      moniteur,
                      color: getMoniteurColor(moniteur.id_moniteur)
                    });
                  });
                });
                
                // Organiser les leçons par créneau horaire pour détecter les chevauchements
                const leconsByCreneau: Record<string, Array<{lecon: Lecon, moniteur: Moniteur, color: string}>> = {};
                
                toutesLesLeconsDuJour.forEach(item => {
                  const key = `${item.lecon.heure_debut}-${item.lecon.heure_fin}`;
                  if (!leconsByCreneau[key]) {
                    leconsByCreneau[key] = [];
                  }
                  leconsByCreneau[key].push(item);
                });
                
                // Rendu des leçons avec gestion des chevauchements
                return Object.entries(leconsByCreneau).flatMap(([creneau, items]) => {
                  return items.map((item, index) => {
                    const { lecon, moniteur, color } = item;
                    const position = calculateLeconPosition(lecon.heure_debut, lecon.heure_fin);
                    const totalItems = items.length;
                    
                    // Calculer la largeur et la position horizontale en fonction du nombre d'items
                    const width = `calc((100% / ${totalItems}) - 4px)`;
                    const left = `calc(${index} * (100% / ${totalItems}))`;
                    
                    return (
                      <div
                        key={`${moniteur.id_moniteur}-${lecon.id_planning}`}
                        className={`absolute p-1 rounded border ${color} text-xs overflow-hidden shadow-sm cursor-pointer hover:shadow transition-shadow`}
                        style={{
                          ...position,
                          width,
                          left,
                          right: 'auto'
                        }}
                        onClick={() => setSelectedLecon(lecon)}
                      >
                        <div className="font-medium truncate">
                          {moniteur.prenom} {moniteur.nom.charAt(0)}.
                        </div>
                        {lecon.eleves && (
                          <div className="truncate">{lecon.eleves.prenom} {lecon.eleves.nom}</div>
                        )}
                        <div className="truncate text-[10px] text-gray-600">{lecon.type_lecon}</div>
                      </div>
                    );
                  });
                });
              })()}
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
