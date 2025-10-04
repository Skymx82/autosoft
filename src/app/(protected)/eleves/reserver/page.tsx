'use client';

import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUser, FiMapPin, FiCheck, FiChevronLeft, FiChevronRight, FiInfo } from 'react-icons/fi';
import EleveLayout from '@/components/layout/EleveLayout';

// Types
type TimeSlot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  available: boolean;
  moniteur: {
    id: string;
    nom: string;
    prenom: string;
  };
  vehicule: string;
  lieu: string;
};

export default function EleveReserver() {
  // États
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Sélection date, 2: Sélection horaire, 3: Confirmation
  const [loading, setLoading] = useState(true);
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Récupérer les données utilisateur depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('autosoft_user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Générer les dates du mois actuel
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Obtenir le jour de la semaine du premier jour (0 = dimanche, 1 = lundi, etc.)
    const firstDayOfWeek = firstDay.getDay();
    // Ajuster pour que la semaine commence le lundi (0 = lundi, 6 = dimanche)
    const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const days = [];
    
    // Ajouter les jours du mois précédent pour compléter la première semaine
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = adjustedFirstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }
    
    // Ajouter les jours du mois actuel
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Ajouter les jours du mois suivant pour compléter la dernière semaine
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const days = getDaysInMonth(currentDate);

  // Formater la date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // Vérifier si une date est aujourd'hui
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Vérifier si une date est dans le passé
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Vérifier si une date a des créneaux disponibles
  const hasAvailableSlots = (date: Date) => {
    // Simuler des dates avec disponibilités (en réalité, cela viendrait d'une API)
    const availableDates = [
      new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1),
      new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2),
      new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 3),
      new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 5),
      new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 8),
      new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 9),
      new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 12),
    ];
    
    return availableDates.some(availableDate => 
      availableDate.getDate() === date.getDate() &&
      availableDate.getMonth() === date.getMonth() &&
      availableDate.getFullYear() === date.getFullYear()
    );
  };

  // Passer au mois précédent
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Passer au mois suivant
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Sélectionner une date
  const handleDateSelect = (date: Date) => {
    if (isPastDate(date)) return;
    
    setSelectedDate(date);
    setStep(2);
    
    // Simuler le chargement des créneaux horaires depuis une API
    setLoading(true);
    setTimeout(() => {
      // Générer des créneaux horaires aléatoires pour la démonstration
      const mockTimeSlots: TimeSlot[] = [];
      const startHour = 8;
      const endHour = 18;
      
      for (let hour = startHour; hour < endHour; hour++) {
        // Créneaux d'une heure et demie
        if (hour % 2 === 0) {
          mockTimeSlots.push({
            id: `slot-${date.toISOString()}-${hour}`,
            date: date.toISOString().split('T')[0],
            startTime: `${hour}:00`,
            endTime: `${hour + 1}:30`,
            duration: 90,
            available: Math.random() > 0.3, // 70% de chance d'être disponible
            moniteur: {
              id: 'm1',
              nom: 'Dupont',
              prenom: 'Jean',
            },
            vehicule: 'Renault Clio',
            lieu: 'Auto-école Centre'
          });
        }
      }
      
      setTimeSlots(mockTimeSlots);
      setLoading(false);
    }, 500);
  };

  // Sélectionner un créneau horaire
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setStep(3);
  };

  // Confirmer la réservation
  const handleConfirmReservation = () => {
    setLoading(true);
    
    // Simuler une requête API pour enregistrer la réservation
    setTimeout(() => {
      setConfirmationSuccess(true);
      setLoading(false);
    }, 1000);
  };

  // Réinitialiser le processus de réservation
  const resetReservation = () => {
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setStep(1);
    setConfirmationSuccess(false);
  };

  // Afficher le contenu en fonction de l'étape actuelle
  const renderStepContent = () => {
    if (confirmationSuccess) {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Réservation confirmée !</h2>
          <p className="text-gray-600 mb-6">
            Votre leçon a été réservée avec succès pour le {selectedDate && formatDate(selectedDate)} à {selectedTimeSlot?.startTime}.
          </p>
          <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto mb-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <FiCalendar className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{selectedDate && formatDate(selectedDate)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FiClock className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Horaire</p>
                  <p className="font-medium">{selectedTimeSlot?.startTime} - {selectedTimeSlot?.endTime}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FiUser className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Moniteur</p>
                  <p className="font-medium">{selectedTimeSlot?.moniteur.prenom} {selectedTimeSlot?.moniteur.nom}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FiMapPin className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Lieu</p>
                  <p className="font-medium">{selectedTimeSlot?.lieu}</p>
                </div>
              </div>
            </div>
          </div>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            onClick={resetReservation}
          >
            Réserver une autre leçon
          </button>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-4 bg-blue-600 text-white">
                <div className="flex justify-between items-center">
                  <button 
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-blue-700 rounded-full transition-colors"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-lg font-bold">
                    {new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentDate)}
                  </h3>
                  <button 
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-blue-700 rounded-full transition-colors"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                {/* Jours de la semaine */}
                <div className="grid grid-cols-7 mb-2">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
                    <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Jours du mois */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    const isAvailable = hasAvailableSlots(day.date);
                    const isPast = isPastDate(day.date);
                    const isTodayDate = isToday(day.date);
                    
                    return (
                      <button
                        key={index}
                        onClick={() => isAvailable && handleDateSelect(day.date)}
                        disabled={isPast || !isAvailable}
                        className={`
                          aspect-square flex flex-col items-center justify-center rounded-lg text-sm
                          ${!day.isCurrentMonth ? 'text-gray-300' : isPast ? 'text-gray-400' : 'text-gray-800'}
                          ${isTodayDate ? 'border border-blue-500' : ''}
                          ${isAvailable && !isPast ? 'bg-blue-50 hover:bg-blue-100' : ''}
                          ${selectedDate && selectedDate.getTime() === day.date.getTime() ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                        `}
                      >
                        <span>{day.date.getDate()}</span>
                        {isAvailable && !isPast && (
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                <span>Disponible</span>
              </div>
              <div className="flex items-center ml-4">
                <span className="w-3 h-3 bg-gray-300 rounded-full mr-1"></span>
                <span>Indisponible</span>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div>
            <div className="mb-6 flex items-center">
              <button 
                onClick={() => setStep(1)}
                className="mr-3 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <FiChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-lg font-bold text-gray-900">
                {selectedDate && formatDate(selectedDate)}
              </h3>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {timeSlots.length > 0 ? (
                  <div className="space-y-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => slot.available && handleTimeSlotSelect(slot)}
                        disabled={!slot.available}
                        className={`
                          w-full p-4 rounded-lg border text-left flex justify-between items-center
                          ${slot.available 
                            ? 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-md transition-all' 
                            : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'}
                        `}
                      >
                        <div>
                          <div className="font-medium">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="text-sm text-gray-500">
                            {slot.moniteur.prenom} {slot.moniteur.nom} • {slot.vehicule}
                          </div>
                        </div>
                        {!slot.available && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                            Complet
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FiInfo className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun créneau disponible</h3>
                    <p className="text-gray-600">
                      Il n'y a pas de créneaux disponibles pour cette date. Veuillez sélectionner une autre date.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        );
      
      case 3:
        return (
          <div>
            <div className="mb-6 flex items-center">
              <button 
                onClick={() => setStep(2)}
                className="mr-3 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <FiChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-lg font-bold text-gray-900">
                Confirmation de réservation
              </h3>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-5 mb-6">
              <h4 className="font-bold text-gray-900 mb-4">Récapitulatif</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FiCalendar className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{selectedDate && formatDate(selectedDate)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiClock className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Horaire</p>
                    <p className="font-medium">{selectedTimeSlot?.startTime} - {selectedTimeSlot?.endTime}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiUser className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Moniteur</p>
                    <p className="font-medium">{selectedTimeSlot?.moniteur.prenom} {selectedTimeSlot?.moniteur.nom}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiMapPin className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Lieu</p>
                    <p className="font-medium">{selectedTimeSlot?.lieu}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
              <FiInfo className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <p className="text-blue-800 font-medium">Important</p>
                <p className="text-blue-700 text-sm">
                  Vous pouvez annuler votre réservation jusqu'à 24h avant l'heure prévue sans frais.
                </p>
              </div>
            </div>
            
            <button
              onClick={handleConfirmReservation}
              disabled={loading}
              className={`
                w-full py-3 rounded-lg font-medium text-white text-center
                ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                transition-colors
              `}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Confirmation en cours...
                </div>
              ) : (
                'Confirmer la réservation'
              )}
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <EleveLayout>
      <div className="p-4 sm:p-6 pb-20 text-gray-800">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Réserver une leçon</h1>
          <p className="text-gray-600">Choisissez une date et un horaire pour votre prochaine leçon</p>
        </div>
        
        {/* Étapes de réservation */}
        {!confirmationSuccess && (
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <span className="text-xs mt-1 text-center">Date</span>
              </div>
              
              <div className={`flex-grow h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <span className="text-xs mt-1 text-center">Horaire</span>
              </div>
              
              <div className={`flex-grow h-1 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
                <span className="text-xs mt-1 text-center">Confirmation</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Contenu de l'étape actuelle */}
        {renderStepContent()}
      </div>
    </EleveLayout>
  );
}
