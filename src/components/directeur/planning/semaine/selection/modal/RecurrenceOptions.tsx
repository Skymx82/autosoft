'use client';

import React, { useState, useEffect } from 'react';
import { RecurrenceOptionsProps, RecurrencePattern } from './types';

export default function RecurrenceOptions({
  isRecurring,
  onIsRecurringChange,
  recurrencePattern,
  onRecurrencePatternChange,
  startDate
}: RecurrenceOptionsProps) {
  // État local pour les options de récurrence
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>(
    recurrencePattern?.frequency || 'weekly'
  );
  const [endDate, setEndDate] = useState<string>(
    recurrencePattern?.endDate || getDefaultEndDate()
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    recurrencePattern?.daysOfWeek || []
  );
  
  // Calculer une date de fin par défaut (4 semaines après la date de début)
  function getDefaultEndDate() {
    try {
      const date = new Date(startDate);
      date.setDate(date.getDate() + 28); // 4 semaines
      return date.toISOString().split('T')[0];
    } catch (error) {
      const today = new Date();
      today.setDate(today.getDate() + 28);
      return today.toISOString().split('T')[0];
    }
  }
  
  // Mettre à jour le pattern de récurrence lorsque les options changent
  useEffect(() => {
    if (isRecurring) {
      // Vérifier si le pattern a réellement changé avant de le mettre à jour
      const currentPattern = recurrencePattern || { frequency: '', endDate: '', daysOfWeek: [] };
      const hasChanged = 
        currentPattern.frequency !== frequency ||
        currentPattern.endDate !== endDate ||
        JSON.stringify(currentPattern.daysOfWeek || []) !== JSON.stringify(selectedDays);
      
      if (hasChanged) {
        const newPattern: RecurrencePattern = {
          frequency,
          endDate,
          daysOfWeek: selectedDays.length > 0 ? selectedDays : undefined
        };
        onRecurrencePatternChange(newPattern);
      }
    }
  }, [isRecurring, frequency, endDate, selectedDays, recurrencePattern, onRecurrencePatternChange]);
  
  // Gérer le changement de la case à cocher de récurrence
  const handleRecurringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onIsRecurringChange(e.target.checked);
  };
  
  // Gérer le changement de fréquence
  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFrequency(e.target.value as 'weekly' | 'biweekly' | 'monthly');
  };
  
  // Gérer le changement de date de fin
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };
  
  // Gérer le changement des jours de la semaine
  const handleDayToggle = (day: number) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };
  
  // Obtenir le jour de la semaine à partir de la date de début
  const getStartDayOfWeek = () => {
    try {
      const date = new Date(startDate);
      return date.getDay(); // 0 = dimanche, 1 = lundi, etc.
    } catch (error) {
      return new Date().getDay();
    }
  };
  
  // Initialiser les jours sélectionnés si nécessaire
  useEffect(() => {
    // N'initialiser que lorsque isRecurring passe de false à true et qu'aucun jour n'est sélectionné
    if (isRecurring && selectedDays.length === 0 && !recurrencePattern?.daysOfWeek?.length) {
      const startDay = getStartDayOfWeek();
      setSelectedDays([startDay]);
    }
  }, [isRecurring, selectedDays.length, startDate, recurrencePattern?.daysOfWeek]);
  
  // Noms des jours de la semaine
  const daysOfWeek = [
    { value: 1, label: 'Lun' },
    { value: 2, label: 'Mar' },
    { value: 3, label: 'Mer' },
    { value: 4, label: 'Jeu' },
    { value: 5, label: 'Ven' },
    { value: 6, label: 'Sam' },
    { value: 0, label: 'Dim' }
  ];
  
  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <input
          type="checkbox"
          id="isRecurring"
          checked={isRecurring}
          onChange={handleRecurringChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isRecurring" className="ml-2 block text-sm font-medium text-gray-700">
          Leçon récurrente
        </label>
      </div>
      
      {isRecurring && (
        <div className="pl-6 border-l-2 border-gray-200">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fréquence
            </label>
            <select
              value={frequency}
              onChange={handleFrequencyChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="weekly">Hebdomadaire</option>
              <option value="biweekly">Toutes les deux semaines</option>
              <option value="monthly">Mensuelle</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {(frequency === 'weekly' || frequency === 'biweekly') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jours de la semaine
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(day => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleDayToggle(day.value)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedDays.includes(day.value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              {selectedDays.length === 0 && (
                <p className="mt-1 text-sm text-red-600">
                  Veuillez sélectionner au moins un jour.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
