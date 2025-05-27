'use client';

import React from 'react';
import { TimeRangeSelectorProps } from './types';

export default function TimeRangeSelector({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  date
}: TimeRangeSelectorProps) {
  // Fonction pour calculer la durée entre deux heures
  const calculateDuration = () => {
    try {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      const startDate = new Date();
      startDate.setHours(startHour, startMinute, 0);
      
      const endDate = new Date();
      endDate.setHours(endHour, endMinute, 0);
      
      // Si l'heure de fin est avant l'heure de début, on considère que c'est le jour suivant
      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }
      
      const durationMs = endDate.getTime() - startDate.getTime();
      const durationMinutes = Math.floor(durationMs / (1000 * 60));
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      
      return `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
    } catch (error) {
      return 'Durée invalide';
    }
  };
  
  // Validation de l'heure de fin (doit être après l'heure de début)
  const validateEndTime = (newEndTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = newEndTime.split(':').map(Number);
    
    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0);
    
    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0);
    
    // Si l'heure de fin est avant l'heure de début, on la corrige
    if (endDate <= startDate) {
      // Ajouter au moins 15 minutes à l'heure de début
      startDate.setMinutes(startDate.getMinutes() + 15);
      const correctedHour = startDate.getHours().toString().padStart(2, '0');
      const correctedMinute = startDate.getMinutes().toString().padStart(2, '0');
      return `${correctedHour}:${correctedMinute}`;
    }
    
    return newEndTime;
  };
  
  // Gérer le changement de l'heure de début
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    onStartTimeChange(newStartTime);
    
    // Ajuster l'heure de fin si nécessaire
    const [startHour, startMinute] = newStartTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0);
    
    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0);
    
    if (endDate <= startDate) {
      // Ajouter 15 minutes à l'heure de début pour l'heure de fin
      startDate.setMinutes(startDate.getMinutes() + 15);
      const correctedHour = startDate.getHours().toString().padStart(2, '0');
      const correctedMinute = startDate.getMinutes().toString().padStart(2, '0');
      onEndTimeChange(`${correctedHour}:${correctedMinute}`);
    }
  };
  
  // Gérer le changement de l'heure de fin
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    const validatedEndTime = validateEndTime(newEndTime);
    onEndTimeChange(validatedEndTime);
  };
  
  // Formater la date pour l'affichage
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      return dateStr;
    }
  };
  
  return (
    <div className="mb-6">
      {/* L'affichage de la date a été supprimé car elle est déjà affichée sous le moniteur */}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Heure de début
          </label>
          <input
            type="time"
            value={startTime}
            onChange={handleStartTimeChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Heure de fin
          </label>
          <input
            type="time"
            value={endTime}
            onChange={handleEndTimeChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
      
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          Durée: <span className="font-medium">{calculateDuration()}</span>
        </p>
      </div>
    </div>
  );
}
