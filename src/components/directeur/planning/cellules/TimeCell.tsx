'use client';

interface TimeCellProps {
  day: string;
  time: string;
  moniteur: number;
  isOccupied: boolean;
  isSelected: boolean;
  isInCurrentSelection: boolean;
  colWidth: number;
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
  colWidth,
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
  
  return (
    <div 
      data-day={day}
      data-time={time}
      data-moniteur={moniteur}
      className={`h-full flex items-center justify-center ${!isOccupied ? getCellClass() : ''}`}
      style={{ width: `${colWidth}%`, zIndex: 10 }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* Contenu de la cellule si nécessaire */}
    </div>
  );
}
