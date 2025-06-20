'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import SelectionControls from '../../semaine/selection/ConfirmeSelect';

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

interface SelectionManagerJourProps {
  children: ReactNode;
  isActive: boolean;
  onCellOccupiedCheck: (day: string, time: string, moniteur: number) => boolean;
  onSelectionComplete?: (start: SelectionCell, end: SelectionCell) => void;
  moniteurs?: any[]; // Liste des moniteurs pour récupérer les noms
  date?: string; // Date sélectionnée
}

export default function SelectionManagerJour({ 
  children, 
  isActive, 
  onCellOccupiedCheck,
  onSelectionComplete,
  moniteurs = [],
  date
}: SelectionManagerJourProps) {
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
  // Adaptée pour la vue jour où les moniteurs sont en colonnes
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
      
      // Afficher les contrôles de sélection - exactement comme dans la vue semaine
      if (selectionRect) {
        setControlsPosition({
          top: selectionRect.top,
          left: selectionRect.left + selectionRect.width / 2
        });
        setShowControls(true);
      }
    }
    
    // Ne pas réinitialiser l'état de sélection tout de suite
    // pour permettre à l'utilisateur de voir les contrôles
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
    if (selectedCell && selectedCell.endTime && onSelectionComplete) {
      // Créer les objets de début et de fin pour la fonction onSelectionComplete
      const start = {
        day: selectedCell.day,
        time: selectedCell.time,
        moniteur: selectedCell.moniteur,
        formattedDate: selectedCell.formattedDate
      };
      
      const end = {
        day: selectedCell.day,
        time: selectedCell.endTime,
        moniteur: selectedCell.moniteur,
        formattedDate: selectedCell.formattedDate
      };
      
      onSelectionComplete(start, end);
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
  
  // Réinitialiser la sélection lorsque le mode isActive est désactivé
  useEffect(() => {
    if (!isActive) {
      cancelSelection();
    }
  }, [isActive]);
  
  // Trouver le moniteur correspondant à l'ID
  const getMoniteur = (id: number) => {
    return moniteurs.find(m => m.id_moniteur === id);
  };
  
  // Cloner les enfants et ajouter les gestionnaires d'événements
  const cloneChildren = (children: ReactNode): ReactNode => {
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) {
        return child;
      }
      
      const props = child.props as Record<string, any>;
      
      // Si l'enfant a des attributs data-day, data-time et data-moniteur, c'est une cellule de temps
      if (props && props['data-day'] && props['data-time'] && props['data-moniteur']) {
        const day = props['data-day'] as string;
        const time = props['data-time'] as string;
        const moniteur = parseInt(props['data-moniteur'] as string);
        const formattedDate = props['data-formatted-date'] as string | undefined;
        
        // Vérifier si cette cellule est dans la sélection en cours
        const isInCurrentSelection = isCellInSelection(day, time, moniteur);
        
        // Vérifier si cette cellule est sélectionnée
        const isThisSelected = selectedCell && 
          selectedCell.day === day && 
          selectedCell.time === time && 
          selectedCell.moniteur === moniteur;
        
        const newProps: Record<string, any> = {
          isInCurrentSelection,
          isSelected: isThisSelected
        };
        
        // Ajouter les gestionnaires d'événements
        newProps.onMouseDown = (e: React.MouseEvent) => {
          handleSelectionStart(day, time, moniteur, formattedDate);
          if (props.onMouseDown) props.onMouseDown(e);
        };
        
        newProps.onMouseMove = (e: React.MouseEvent) => {
          handleSelectionMove(day, time, moniteur, formattedDate);
          if (props.onMouseMove) props.onMouseMove(e);
        };
        
        return React.cloneElement(child, newProps);
      }
      
      // Si l'enfant a des enfants, les cloner récursivement
      if (props && props.children) {
        return React.cloneElement(child, {
          children: cloneChildren(props.children)
        } as React.HTMLAttributes<HTMLElement>);
      }
      
      return child;
    });
  };
  
  // Trouver le moniteur sélectionné
  const selectedMoniteur = selectedCell ? getMoniteur(selectedCell.moniteur) : null;
  
  return (
    <div ref={gridRef} className="relative">
      {/* Cloner les enfants et ajouter les gestionnaires d'événements */}
      {cloneChildren(children)}
      
      {/* Rectangle de sélection */}
      {selectionRect && (isSelecting || showControls) && (
        <div
          className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-20 pointer-events-none"
          style={{
            top: selectionRect.top,
            left: selectionRect.left,
            width: selectionRect.width,
            height: selectionRect.height,
            zIndex: 20
          }}
        ></div>
      )}
      
      {/* Contrôles de sélection - exactement comme dans la vue semaine */}
      {showControls && selectedCell && (
        <SelectionControls
          onConfirm={confirmSelection}
          onCancel={cancelSelection}
          position={controlsPosition}
          selectionStart={selectedCell}
          selectionEnd={{
            ...selectedCell,
            time: selectedCell.endTime || selectedCell.time
          }}
          moniteurId={selectedCell.moniteur}
          moniteurNom={selectedMoniteur?.nom}
          moniteurPrenom={selectedMoniteur?.prenom}
          date={selectedCell.day}
        />
      )}
    </div>
  );
}
