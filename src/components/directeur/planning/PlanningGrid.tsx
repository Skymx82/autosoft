'use client';

import { useState } from 'react';
import JourVu from './vues/JourVu';
import SemaineVu from './semaine/SemaineVu';
import MoisVu from './vues/MoisVu';
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
  moniteur?: Moniteur;
  commentaire?: string;
}

// Exporter les types pour qu'ils soient utilisables par les autres composants
export type { Lecon, Moniteur, Eleve };

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
  showSunday?: boolean; // Option pour afficher ou non le dimanche
  addHoraireMode?: boolean; // Mode d'ajout d'horaire
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

// Fonction pour générer les heures de 8h à 20h par défaut
const generateHours = () => {
  const hours = [];
  for (let i = 8; i <= 20; i++) {
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
  // Créer une nouvelle instance pour éviter de modifier la date originale
  const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const endDateCopy = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  
  // Ajouter chaque jour jusqu'à la date de fin
  while (currentDate <= endDateCopy) {
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
  // Utiliser une méthode plus fiable pour le formatage des dates
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
};

export default function PlanningGrid({
  moniteurs,
  leconsByDay,
  startDate,
  endDate,
  currentView,
  selectedMoniteurId,
  showSunday = false,
  addHoraireMode = false
}: PlanningGridProps) {
  // Log pour vérifier si addHoraireMode est correctement transmis
  console.log('PlanningGrid - addHoraireMode:', addHoraireMode);
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
    <div className="w-full h-full text-black">
      <div className="w-full h-full overflow-auto">
        {currentView === 'day' ? (
          // Vue Jour - Utilisation du composant JourVu
          <JourVu 
            moniteurs={filteredMoniteurs}
            leconsByDay={leconsByDay}
            selectedDate={days[0]}
            hours={hours}
          />
        ) : currentView === 'week' ? (
          // Vue Semaine - Utilisation du composant SemaineVu
          <SemaineVu 
            moniteurs={filteredMoniteurs}
            leconsByDay={leconsByDay}
            days={days}
            hours={hours}
            showSunday={showSunday}
            addHoraireMode={addHoraireMode}
          />
        ) : (
          // Vue Mois - Utilisation du composant MoisVu
          <MoisVu 
            moniteurs={filteredMoniteurs}
            leconsByDay={leconsByDay}
            days={days}
            showSunday={showSunday}
          />
        )}
      </div>
      
      {/* Le modal est maintenant géré dans chaque composant de vue */}
    </div>
  );
}
