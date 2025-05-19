'use client';

import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { useAvailableSlots } from '@/hooks/Directeur/planning/disponibilite/useAvailableSlots';

interface DateHeureStepProps {
  date: string;
  setDate: (date: string) => void;
  heureDebut: dayjs.Dayjs | null;
  setHeureDebut: (heure: dayjs.Dayjs | null) => void;
  duree: string;
  setDuree: (duree: string) => void;
}

// Durées disponibles en minutes
const ALL_DURATIONS = [
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '1 heure' },
  { value: '90', label: '1 heure 30' },
  { value: '120', label: '2 heures' }
];

export default function DateHeureStep({
  date,
  setDate,
  heureDebut,
  setHeureDebut,
  duree,
  setDuree
}: DateHeureStepProps) {
  // État pour le mode d'affichage (sélecteur classique ou créneaux disponibles)
  const [displayMode, setDisplayMode] = useState<'classic' | 'slots'>('slots');
  
  // État pour stocker le créneau sélectionné
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  
  // État pour stocker les durées disponibles
  const [availableDurations, setAvailableDurations] = useState(ALL_DURATIONS);
  
  // Récupérer les informations utilisateur depuis le localStorage
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [id_ecole, setIdEcole] = useState<string>('');
  const [id_bureau, setIdBureau] = useState<string>('');
  
  // Chargement des données utilisateur depuis localStorage
  useEffect(() => {
    const userData = localStorage.getItem('autosoft_user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setIdEcole(String(user.id_ecole));
      setIdBureau(String(user.id_bureau));
    }
  }, []);
  
  // Utiliser le hook pour récupérer les créneaux disponibles seulement quand les IDs sont disponibles
  const { isLoading, error, data: availableSlotsData, refetch } = useAvailableSlots(
    date,
    id_ecole,
    id_bureau
  );
  
  // Mettre à jour les créneaux disponibles lorsque la date ou les IDs changent
  useEffect(() => {
    // Ne faire la requête que si nous avons des IDs valides
    if (id_ecole && id_bureau) {
      refetch(date);
    }
  }, [date, id_ecole, id_bureau]);
  
  // Mettre à jour l'heure de début lorsqu'un créneau est sélectionné
  useEffect(() => {
    if (selectedSlot) {
      const [hours, minutes] = selectedSlot.split(':').map(Number);
      setHeureDebut(dayjs().hour(hours).minute(minutes));
      
      // Calculer les durées disponibles en fonction du créneau sélectionné
      if (availableSlotsData) {
        calculateAvailableDurations(selectedSlot, availableSlotsData.availableSlots);
      }
    }
  }, [selectedSlot, setHeureDebut, availableSlotsData]);
  
  // Calculer les durées disponibles en fonction du créneau sélectionné et des créneaux disponibles
  const calculateAvailableDurations = (startTime: string, availableSlots: any[]) => {
    if (!startTime || !availableSlots || availableSlots.length === 0) {
      setAvailableDurations(ALL_DURATIONS);
      return;
    }
    
    // Convertir l'heure de début en minutes depuis minuit
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const startTimeInMinutes = startHours * 60 + startMinutes;
    
    // Trouver les créneaux disponibles après l'heure de début
    const laterSlots = availableSlots
      .map(slot => {
        const [slotHours, slotMinutes] = slot.time.split(':').map(Number);
        return {
          time: slot.time,
          timeInMinutes: slotHours * 60 + slotMinutes,
          availableTeachers: slot.availableTeachers
        };
      })
      .filter(slot => slot.timeInMinutes > startTimeInMinutes)
      .sort((a, b) => a.timeInMinutes - b.timeInMinutes);
    
    // Si aucun créneau ultérieur, limiter à 30 minutes
    if (laterSlots.length === 0) {
      setAvailableDurations([ALL_DURATIONS[0]]);
      setDuree('30'); // Forcer la durée à 30 minutes
      return;
    }
    
    // Trouver le prochain créneau occupé
    const nextBusySlot = laterSlots.find(slot => slot.availableTeachers < availableSlots.find(s => s.time === startTime)?.availableTeachers);
    
    // Calculer la durée maximale possible
    let maxDurationInMinutes = 120; // Par défaut, max 2 heures
    
    if (nextBusySlot) {
      // Calculer la durée jusqu'au prochain créneau occupé
      const durationUntilNextBusy = nextBusySlot.timeInMinutes - startTimeInMinutes;
      maxDurationInMinutes = Math.min(maxDurationInMinutes, durationUntilNextBusy);
    }
    
    // Filtrer les durées disponibles
    const filteredDurations = ALL_DURATIONS.filter(duration => {
      return parseInt(duration.value) <= maxDurationInMinutes;
    });
    
    setAvailableDurations(filteredDurations);
    
    // Si la durée actuelle n'est plus disponible, sélectionner la plus grande durée disponible
    if (!filteredDurations.some(d => d.value === duree)) {
      const maxAvailableDuration = filteredDurations[filteredDurations.length - 1]?.value || '30';
      setDuree(maxAvailableDuration);
    }
  };
  
  // Formater l'heure pour l'affichage
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}h${minutes === '00' ? '' : minutes}`;
  };
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 text-blue-600 mb-2">
        <FiCalendar className="w-5 h-5" />
        <h3 className="font-medium">Date et heure</h3>
      </div>
      
      {/* Sélecteur de mode d'affichage */}
      <div className="flex space-x-2 mb-4">
        <button
          type="button"
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            displayMode === 'slots'
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
          }`}
          onClick={() => setDisplayMode('slots')}
        >
          Créneaux disponibles
        </button>
        <button
          type="button"
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            displayMode === 'classic'
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
          }`}
          onClick={() => setDisplayMode('classic')}
        >
          Sélection manuelle
        </button>
      </div>
      
      {/* Sélection de date (commune aux deux modes) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input 
          type="date" 
          className="w-full p-2 border border-gray-300 rounded-md"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      
      {/* Mode créneaux disponibles */}
      {displayMode === 'slots' && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Créneaux disponibles</h4>
          
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Chargement des créneaux disponibles...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          ) : !availableSlotsData || availableSlotsData.availableSlots.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-700">Aucun créneau disponible pour cette date.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {availableSlotsData.availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  className={`p-2 border rounded-md text-center transition-colors ${
                    selectedSlot === slot.time
                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSlot(slot.time)}
                >
                  <div className="font-medium">{formatTime(slot.time)}</div>
                  <div className="text-xs mt-1 flex items-center justify-center gap-1">
                    <FiUser className="w-3 h-3" />
                    <span>{slot.availableTeachers}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {selectedSlot && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm"
                value={duree}
                onChange={(e) => setDuree(e.target.value)}
              >
                {availableDurations.map((duration) => (
                  <option key={duration.value} value={duration.value}>
                    {duration.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
      
      {/* Mode sélection manuelle */}
      {displayMode === 'classic' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
            <div className="relative">
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                <TimePicker
                  value={heureDebut}
                  onChange={(newValue) => setHeureDebut(newValue)}
                  minTime={dayjs().hour(7).minute(0)}
                  maxTime={dayjs().hour(20).minute(0)}
                  ampm={false}
                  skipDisabled={true}
                  minutesStep={5}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      size: 'small',
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          height: '42px',
                          borderRadius: '0.375rem',
                          backgroundColor: 'white',
                          border: '1px solid #D1D5DB',
                          '&:hover': {
                            borderColor: '#9CA3AF'
                          },
                          '& fieldset': {
                            border: 'none'
                          }
                        },
                        '& .MuiInputBase-input': {
                          padding: '0.5rem 0.75rem',
                        }
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm"
              value={duree}
              onChange={(e) => setDuree(e.target.value)}
            >
              {ALL_DURATIONS.map((duration) => (
                <option key={duration.value} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
