'use client';

interface TimeCellProps {
  day: string;
  time: string;
  moniteur: number;
  isOccupied: boolean;
  isSelected: boolean;
  isInCurrentSelection: boolean;
  formattedDate?: string; // Date formatée pour l'affichage (JJ/MM/YYYY)
  hideTime?: boolean; // Option pour masquer l'affichage de l'heure
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
}

export default function TimeCell({
  day,
  time,
  moniteur,
  isOccupied,
  isSelected,
  isInCurrentSelection,
  formattedDate,
  onMouseDown,
  onMouseMove,
  onMouseUp
}: TimeCellProps) {
  // Déterminer la classe CSS en fonction de l'état de la cellule
  const getCellClass = () => {
    if (isOccupied) return '';
    
    if (isSelected) {
      return 'border-2 border-blue-500 hover:border-blue-600 cursor-crosshair';
    }
    
    if (isInCurrentSelection) {
      return 'border border-blue-400 hover:border-blue-500 cursor-crosshair';
    }
    
    return 'hover:border hover:border-gray-400 cursor-crosshair';
  };
  
  // Extraire l'heure et les minutes pour l'affichage (optionnel)
  const [hourStr, minuteStr] = time.split(':');
  const minute = parseInt(minuteStr || '0');
  
  // Déterminer si on affiche l'heure (uniquement pour les cellules à minute = 0)
  const showTime = minute === 0;
  
  return (
    <div 
      data-day={day}
      data-time={time}
      data-moniteur={moniteur}
      data-formatted-date={formattedDate}
      className={`h-full flex items-center justify-center ${!isOccupied ? getCellClass() : ''}`}
      style={{ zIndex: 10 }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
    </div>
  );
}
