'use client';

import React, { useState, useEffect } from 'react';
import { RecurrenceOptionsProps, RecurrencePattern, CustomTimeSlot } from './types';

export default function RecurrenceOptions({
  isRecurring,
  onIsRecurringChange,
  recurrencePattern,
  onRecurrencePatternChange,
  startDate
}: RecurrenceOptionsProps) {
  // État local pour les options de récurrence
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly' | 'custom'>(
    recurrencePattern?.frequency || 'weekly'
  );
  const [endDate, setEndDate] = useState<string>(
    recurrencePattern?.endDate || getDefaultEndDate()
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    recurrencePattern?.daysOfWeek || []
  );
  
  // États pour les horaires personnalisés
  const [customTimeSlots, setCustomTimeSlots] = useState<CustomTimeSlot[]>(
    recurrencePattern?.customTimeSlots || []
  );
  const [newSlotDate, setNewSlotDate] = useState<string>(startDate);
  const [newSlotStartTime, setNewSlotStartTime] = useState<string>('09:00');
  const [newSlotEndTime, setNewSlotEndTime] = useState<string>('10:00');
  
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
      const currentPattern = recurrencePattern || { frequency: '', endDate: '', daysOfWeek: [], customTimeSlots: [] };
      const hasChanged = 
        currentPattern.frequency !== frequency ||
        currentPattern.endDate !== endDate ||
        JSON.stringify(currentPattern.daysOfWeek || []) !== JSON.stringify(selectedDays) ||
        JSON.stringify(currentPattern.customTimeSlots || []) !== JSON.stringify(customTimeSlots);
      
      if (hasChanged) {
        const newPattern: RecurrencePattern = {
          frequency,
          endDate,
          daysOfWeek: selectedDays.length > 0 ? selectedDays : undefined,
          customTimeSlots: customTimeSlots.length > 0 ? customTimeSlots : undefined
        };
        onRecurrencePatternChange(newPattern);
      }
    }
  }, [isRecurring, frequency, endDate, selectedDays, customTimeSlots, recurrencePattern, onRecurrencePatternChange]);
  
  // Gérer le changement de la case à cocher de récurrence
  const handleRecurringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onIsRecurringChange(e.target.checked);
  };
  
  // Gérer le changement de fréquence
  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFrequency(e.target.value as 'weekly' | 'biweekly' | 'monthly' | 'custom');
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
  
  // Ajouter un nouvel horaire personnalisé
  const addCustomTimeSlot = () => {
    // Vérifier que les heures sont valides
    if (newSlotStartTime >= newSlotEndTime) {
      alert("L'heure de début doit être antérieure à l'heure de fin");
      return;
    }
    
    const newSlot: CustomTimeSlot = {
      id: Date.now().toString(), // ID unique basé sur le timestamp
      date: newSlotDate,
      startTime: newSlotStartTime,
      endTime: newSlotEndTime
    };
    
    setCustomTimeSlots(prev => [...prev, newSlot]);
    
    // Réinitialiser les champs pour le prochain ajout
    const nextDate = new Date(newSlotDate);
    nextDate.setDate(nextDate.getDate() + 7); // Proposer une date une semaine plus tard
    setNewSlotDate(nextDate.toISOString().split('T')[0]);
  };
  
  // Supprimer un horaire personnalisé
  const removeCustomTimeSlot = (id: string) => {
    setCustomTimeSlots(prev => prev.filter(slot => slot.id !== id));
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
  
  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };
  
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
          Planification avancée
        </label>
      </div>
      
      {isRecurring && (
        <div className="pl-6 border-l-2 border-gray-200">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de planification
            </label>
            <select
              value={frequency}
              onChange={handleFrequencyChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="weekly">Hebdomadaire</option>
              <option value="biweekly">Toutes les deux semaines</option>
              <option value="monthly">Mensuelle</option>
              <option value="custom">Horaires personnalisés</option>
            </select>
          </div>
          
          {frequency !== 'custom' ? (
            <>
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
            </>
          ) : (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Ajouter des horaires personnalisés</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date</label>
                  <input
                    type="date"
                    value={newSlotDate}
                    onChange={(e) => setNewSlotDate(e.target.value)}
                    min={startDate}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Heure de début</label>
                  <input
                    type="time"
                    value={newSlotStartTime}
                    onChange={(e) => setNewSlotStartTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Heure de fin</label>
                  <input
                    type="time"
                    value={newSlotEndTime}
                    onChange={(e) => setNewSlotEndTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              
              <button
                type="button"
                onClick={addCustomTimeSlot}
                className="flex items-center justify-center w-full p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded border border-blue-200 mb-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Ajouter cet horaire
              </button>
              
              {customTimeSlots.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Horaires programmés</h4>
                  <div className="bg-gray-50 rounded border border-gray-200 overflow-hidden">
                    {customTimeSlots.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between p-2 border-b border-gray-200 last:border-b-0 hover:bg-gray-100">
                        <div className="flex-1">
                          <span className="font-medium">{formatDate(slot.date)}</span>
                          <span className="mx-2 text-gray-400">|</span>
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCustomTimeSlot(slot.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Supprimer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
