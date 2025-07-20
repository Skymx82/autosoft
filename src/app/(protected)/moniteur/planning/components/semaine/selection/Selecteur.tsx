'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import SelectionControls from './ConfirmeSelect';

export interface SelectionCell {
  day: string;
  time: string;
  hour?: string; // Ajout de la propriété hour pour compatibilité
  moniteur: number;
  endTime?: string; // Heure de fin de la sélection
  formattedDate?: string; // Date formatée pour l'affichage (JJ/MM/YYYY)
}

export interface SelectionRect {
  top: number;
  left: number;
  width: number;
  height: number;
  moniteur: number;
  day: string;
}

interface SelectionManagerProps {
  children: ReactNode;
  isActive: boolean;
  onCellOccupiedCheck: (day: string, time: string, moniteur: number) => boolean;
  onSelectionComplete?: (start: SelectionCell, end: SelectionCell) => void;
  moniteurs?: any[]; // Liste des moniteurs pour récupérer les noms
  date?: string; // Date sélectionnée
}

export default function SelectionManager({ 
  children, 
  isActive, 
  onCellOccupiedCheck,
  onSelectionComplete,
  moniteurs = [],
  date
}: SelectionManagerProps) {
  // États pour la sélection
  const [selectionStart, setSelectionStart] = useState<SelectionCell | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<SelectionCell | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedCell, setSelectedCell] = useState<SelectionCell | null>(null);
  
  // État pour le rectangle de sélection
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);
  
  // État pour afficher les contrôles de sélection
  const [showControls, setShowControls] = useState(false);
  const [controlsPosition, setControlsPosition] = useState({ top: 0, left: 0 });
  
  // Référence pour le conteneur des cellules
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Fonction pour calculer les coordonnées du rectangle de sélection
  const calculateSelectionRect = (startTime: string, endTime: string, day: string, moniteur: number) => {
    if (!gridRef.current) return null;
    
    // Convertir les heures en minutes pour faciliter la comparaison
    const [startHourStr, startMinuteStr] = startTime.split(':');
    const [endHourStr, endMinuteStr] = endTime.split(':');
    
    const startHour = parseInt(startHourStr);
    const startMinute = parseInt(startMinuteStr || '0');
    const endHour = parseInt(endHourStr);
    const endMinute = parseInt(endMinuteStr || '0');
    
    // Trouver les cellules correspondantes
    const startSelector = `[data-day="${day}"][data-time="${startTime}"][data-moniteur="${moniteur}"]`;
    const endSelector = `[data-day="${day}"][data-time="${endTime}"][data-moniteur="${moniteur}"]`;
    
    const startCell = gridRef.current.querySelector(startSelector) as HTMLElement;
    const endCell = gridRef.current.querySelector(endSelector) as HTMLElement;
    
    if (!startCell || !endCell) return null;
    
    // Déterminer quelle cellule est en haut et laquelle est en bas
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;
    
    let topCell, bottomCell;
    if (startTimeInMinutes <= endTimeInMinutes) {
      topCell = startCell;
      bottomCell = endCell;
    } else {
      topCell = endCell;
      bottomCell = startCell;
    }
    
    // Obtenir les coordonnées des cellules par rapport au conteneur
    const gridRect = gridRef.current.getBoundingClientRect();
    const topCellRect = topCell.getBoundingClientRect();
    const bottomCellRect = bottomCell.getBoundingClientRect();
    
    // Calculer les coordonnées et dimensions du rectangle de sélection
    const top = topCellRect.top - gridRect.top;
    const left = topCellRect.left - gridRect.left;
    const width = topCellRect.width;
    const height = (bottomCellRect.top + bottomCellRect.height) - topCellRect.top;
    
    return { top, left, width, height, moniteur, day };
  };
  
  // Fonction pour gérer le début de la sélection (mousedown)
  const handleSelectionStart = (day: string, time: string, moniteur: number, formattedDate?: string) => {
    if (!isActive) return;
    
    // Logs pour débogage
    console.log('Selecteur - handleSelectionStart - Données de la cellule sélectionnée:');
    console.log('day:', day);
    console.log('time:', time);
    console.log('moniteur:', moniteur);
    console.log('formattedDate:', formattedDate);
    
    // Vérifier si la cellule est occupée
    if (onCellOccupiedCheck(day, time, moniteur)) return;
    
    // Démarrer la sélection
    setSelectionStart({ day, time, moniteur, formattedDate });
    setSelectionEnd({ day, time, moniteur, formattedDate });
    setIsSelecting(true);
    
    // Initialiser le rectangle de sélection
    const rect = calculateSelectionRect(time, time, day, moniteur);
    if (rect) {
      setSelectionRect(rect);
    }
    
    console.log(`Début de sélection: ${day} à ${time} avec le moniteur ${moniteur}`);
  };
  
  // Fonction pour gérer le glissement de la sélection (mousemove)
  const handleSelectionMove = (day: string, time: string, moniteur: number, formattedDate?: string) => {
    if (!isSelecting || !selectionStart) return;
    
    // Vérifier que la sélection reste sur le même moniteur et le même jour
    if (selectionStart.day !== day || selectionStart.moniteur !== moniteur) return;
    
    // Mettre à jour la fin de la sélection
    setSelectionEnd({ day, time, moniteur, formattedDate: selectionStart.formattedDate });
    
    // Mettre à jour le rectangle de sélection
    const rect = calculateSelectionRect(selectionStart.time, time, day, moniteur);
    if (rect) {
      setSelectionRect(rect);
    }
  };
  
  // Fonction pour gérer la fin de la sélection (mouseup)
  const handleSelectionEnd = () => {
    if (!isSelecting || !selectionStart || !selectionEnd) return;
    
    // Vérifier que la sélection est valide (même jour et même moniteur)
    if (selectionStart.day === selectionEnd.day && selectionStart.moniteur === selectionEnd.moniteur) {
      // Déterminer l'heure de début et de fin en fonction de l'ordre de sélection
      const startTime = selectionStart.time;
      const endTime = selectionEnd.time;
      
      // Convertir les heures en minutes pour faciliter la comparaison
      const [startHourStr, startMinuteStr] = startTime.split(':');
      const [endHourStr, endMinuteStr] = endTime.split(':');
      
      const startHour = parseInt(startHourStr);
      const startMinute = parseInt(startMinuteStr || '0');
      const endHour = parseInt(endHourStr);
      const endMinute = parseInt(endMinuteStr || '0');
      
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;
      
      // Déterminer quelle heure est la plus petite pour le début
      let finalStartTime, finalEndTime;
      if (startTimeInMinutes <= endTimeInMinutes) {
        finalStartTime = startTime;
        finalEndTime = endTime;
      } else {
        finalStartTime = endTime;
        finalEndTime = startTime;
      }
      
      // Sélectionner la cellule avec les bonnes heures
      setSelectedCell({
        day: selectionStart.day,
        time: finalStartTime,
        hour: finalStartTime, // Pour compatibilité
        moniteur: selectionStart.moniteur,
        endTime: finalEndTime, // Ajouter l'heure de fin
        formattedDate: selectionStart.formattedDate // Conserver la date formatée
      });
      
      // Afficher les contrôles de sélection
      if (selectionRect) {
        setControlsPosition({
          top: selectionRect.top,
          left: selectionRect.left + selectionRect.width / 2
        });
        setShowControls(true);
      }
    }
    
    // Réinitialiser l'état de sélection
    setSelectionStart(null);
    setSelectionEnd(null);
    setIsSelecting(false);
  };
  
  // Fonction pour annuler la sélection
  const cancelSelection = () => {
    setSelectionStart(null);
    setSelectionEnd(null);
    setIsSelecting(false);
    setSelectionRect(null);
    setSelectedCell(null);
    setShowControls(false);
  };
  
  // Fonction pour confirmer la sélection
  const confirmSelection = () => {
    if (selectionStart && selectionEnd && onSelectionComplete) {
      onSelectionComplete(selectionStart, selectionEnd);
    }
    setShowControls(false);
  };
  
  // Fonction pour déterminer si une cellule fait partie de la sélection en cours
  const isCellInSelection = (day: string, time: string, moniteur: number) => {
    if (!isSelecting || !selectionStart || !selectionEnd) return false;
    
    // Vérifier que la cellule est sur le même jour et le même moniteur que la sélection
    if (day !== selectionStart.day || moniteur !== selectionStart.moniteur) return false;
    
    // Extraire les heures et minutes
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr || '0');
    
    // Convertir en minutes pour faciliter la comparaison
    const cellTimeInMinutes = hour * 60 + minute;
    
    // Extraire les heures et minutes de début et de fin de sélection
    const [startHourStr, startMinuteStr] = selectionStart.time.split(':');
    const [endHourStr, endMinuteStr] = selectionEnd.time.split(':');
    
    const startHour = parseInt(startHourStr);
    const startMinute = parseInt(startMinuteStr || '0');
    const endHour = parseInt(endHourStr);
    const endMinute = parseInt(endMinuteStr || '0');
    
    // Convertir en minutes
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;
    
    // Déterminer l'intervalle de temps sélectionné
    const minTime = Math.min(startTimeInMinutes, endTimeInMinutes);
    const maxTime = Math.max(startTimeInMinutes, endTimeInMinutes);
    
    return cellTimeInMinutes >= minTime && cellTimeInMinutes <= maxTime;
  };
  
  // Ajouter des écouteurs d'événements pour gérer la sélection
  useEffect(() => {
    const handleMouseUp = () => {
      if (isSelecting) {
        handleSelectionEnd();
      }
    };
    
    const handleMouseLeave = () => {
      if (isSelecting) {
        handleSelectionEnd();
      }
    };
    
    // Désactiver la sélection de texte pendant le glissement
    const handleSelectStart = (e: Event) => {
      if (isSelecting) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('selectstart', handleSelectStart as EventListener);
    
    if (gridRef.current) {
      gridRef.current.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('selectstart', handleSelectStart as EventListener);
      
      if (gridRef.current) {
        gridRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isSelecting, selectionStart, selectionEnd]);
  
  // Réinitialiser la sélection lorsque le mode addHoraire est désactivé
  useEffect(() => {
    if (!isActive) {
      // Annuler la sélection lorsque le mode addHoraire est désactivé
      cancelSelection();
    }
  }, [isActive]);
  
  return (
    <div className="h-full select-none relative" ref={gridRef}>
      {/* Passer les fonctions et états aux enfants via le contexte */}
      <div 
        className="relative h-full"
        onMouseDown={(e) => {
          // Récupérer les attributs data de l'élément ciblé
          const target = e.target as HTMLElement;
          
          const day = target.dataset.day;
          const time = target.dataset.time;
          const moniteur = target.dataset.moniteur;
          // Récupérer formattedDate (la date au format YYYY-MM-DD)
          const formattedDate = target.dataset.formattedDate;
          
          if (day && time && moniteur) {
            handleSelectionStart(day, time, parseInt(moniteur), formattedDate);
          } else {
            console.log('Selecteur - onMouseDown - Attributs data manquants, recherche dans les parents');
            
            // Essayer de trouver les attributs data dans les parents
            let currentElement = target.parentElement;
            let depth = 0;
            const maxDepth = 5; // Éviter une boucle infinie
            
            while (currentElement && depth < maxDepth) {
              console.log(`Recherche dans le parent niveau ${depth + 1}:`, currentElement);
              console.log('data-day:', currentElement.dataset.day);
              console.log('data-time:', currentElement.dataset.time);
              console.log('data-moniteur:', currentElement.dataset.moniteur);
              console.log('data-formatted-date:', currentElement.dataset.formattedDate);
              
              if (currentElement.dataset.day && currentElement.dataset.time && currentElement.dataset.moniteur) {
                console.log('Attributs data trouvés dans un parent!');
                handleSelectionStart(
                  currentElement.dataset.day,
                  currentElement.dataset.time,
                  parseInt(currentElement.dataset.moniteur),
                  currentElement.dataset.formattedDate
                );
                break;
              }
              
              currentElement = currentElement.parentElement;
              depth++;
            }
          }
        }}
        onMouseMove={(e) => {
          // Récupérer les attributs data de l'élément ciblé
          const target = e.target as HTMLElement;
          const day = target.dataset.day;
          const time = target.dataset.time;
          const moniteur = target.dataset.moniteur;
          const formattedDate = target.dataset.formattedDate;
          
          if (day && time && moniteur) {
            handleSelectionMove(day, time, parseInt(moniteur), formattedDate);
          }
        }}
      >
        {children}
        
        {/* Rectangle de sélection qui englobe toutes les cellules sélectionnées */}
        {selectionRect && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-20 pointer-events-none"
            style={{
              top: selectionRect.top,
              left: selectionRect.left,
              width: selectionRect.width,
              height: selectionRect.height,
              zIndex: 20
            }}
          />
        )}
      </div>
      
      {/* Contrôles de sélection */}
      {showControls && selectionRect && (
        <SelectionControls 
          onConfirm={confirmSelection}
          onCancel={cancelSelection}
          position={controlsPosition}
          selectionStart={selectedCell}
          selectionEnd={selectedCell}
          moniteurId={selectedCell?.moniteur}
          moniteurNom={selectedCell ? moniteurs.find(m => m.id_moniteur === selectedCell.moniteur)?.nom : undefined}
          moniteurPrenom={selectedCell ? moniteurs.find(m => m.id_moniteur === selectedCell.moniteur)?.prenom : undefined}
          date={selectedCell?.formattedDate || selectedCell?.day || date}
        />
      )}
    </div>
  );
}

// Exporter les fonctions utilitaires et types
export { 
  SelectionManager
};
