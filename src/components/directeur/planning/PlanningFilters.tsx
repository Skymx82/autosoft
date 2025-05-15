'use client';

import { useState, useEffect } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiSettings, FiSearch, FiUser } from 'react-icons/fi';
import { usePlanningData } from '@/hooks/Directeur/planning/usePlanningData';

interface PlanningFiltersProps {
  currentView: 'day' | 'week' | 'month';
  setCurrentView: (view: 'day' | 'week' | 'month') => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  render?: (data: { isLoading: boolean; error: string | null; data: any }) => React.ReactNode;
}

export default function PlanningFilters({
  currentView,
  setCurrentView,
  currentDate,
  setCurrentDate,
  render
}: PlanningFiltersProps) {
  const [showSettings, setShowSettings] = useState(false);
  
  // Calculer les dates de début et de fin en fonction de la vue et de la date actuelle
  const [dateRange, setDateRange] = useState<{startDate: string, endDate: string}>({startDate: '', endDate: ''});
  
  // État pour stocker les informations de l'utilisateur (id_ecole, id_bureau)
  const [userInfo, setUserInfo] = useState<{id_ecole: string, id_bureau: string}>({id_ecole: '', id_bureau: '0'});
  
  // Récupérer les informations de l'utilisateur depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('autosoft_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserInfo({
        id_ecole: userData.id_ecole || '',
        id_bureau: userData.id_bureau || '0'
      });
    }
  }, []);
  
  // Mettre à jour les dates de début et de fin lorsque la vue ou la date change
  useEffect(() => {
    const newStartDate = new Date(currentDate);
    const newEndDate = new Date(currentDate);
    
    if (currentView === 'day') {
      // Pour la vue jour, on prend juste le jour sélectionné
      // Pas besoin de modifier les dates
    } else if (currentView === 'week') {
      // Pour la vue semaine, on prend du lundi au dimanche
      const dayOfWeek = currentDate.getDay(); // 0 = dimanche, 1 = lundi, ...
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ajustement pour commencer le lundi
      newStartDate.setDate(currentDate.getDate() - diff);
      newEndDate.setDate(newStartDate.getDate() + 6);
    } else if (currentView === 'month') {
      // Pour la vue mois, on prend tout le mois
      newStartDate.setDate(1);
      newEndDate.setMonth(newStartDate.getMonth() + 1);
      newEndDate.setDate(0); // Dernier jour du mois
    }
    
    setDateRange({
      startDate: newStartDate.toISOString().split('T')[0],
      endDate: newEndDate.toISOString().split('T')[0]
    });
  }, [currentView, currentDate]);
  
  // Utiliser le hook pour récupérer les données du planning
  const { isLoading, error, data } = usePlanningData(
    userInfo.id_ecole,
    userInfo.id_bureau,
    dateRange.startDate,
    dateRange.endDate,
    currentView
  );
  
  // Fonction pour formater la période affichée selon la vue
  const formatPeriod = () => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    
    if (currentView === 'day') {
      return new Intl.DateTimeFormat('fr-FR', options).format(currentDate);
    } 
    
    if (currentView === 'week') {
      // Calculer le début et la fin de la semaine
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1)); // Lundi
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Dimanche
      
      return `${new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(startOfWeek)} - ${new Intl.DateTimeFormat('fr-FR', options).format(endOfWeek)}`;
    }
    
    if (currentView === 'month') {
      return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentDate);
    }
    
    return '';
  };
  
  // Fonctions de navigation
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    
    if (currentView === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    
    setCurrentDate(newDate);
  };
  
  const goToNext = () => {
    const newDate = new Date(currentDate);
    
    if (currentView === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    
    setCurrentDate(newDate);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Si la prop render est fournie, on l'appelle avec les données
  if (render) {
    return render({ isLoading, error, data });
  }
  
  return (
    <div className="bg-white shadow-sm p-4 w-full">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        {/* Sélecteurs de vue et navigation */}
        <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4 flex-wrap gap-y-2">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setCurrentView('day')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                currentView === 'day'
                  ? 'bg-blue-50 text-blue-700 border border-blue-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Jour
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('week')}
              className={`px-4 py-2 text-sm font-medium ${
                currentView === 'week'
                  ? 'bg-blue-50 text-blue-700 border border-blue-300'
                  : 'bg-white text-gray-700 border-t border-b border-gray-300 hover:bg-gray-50'
              }`}
            >
              Semaine
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('month')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                currentView === 'month'
                  ? 'bg-blue-50 text-blue-700 border border-blue-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Mois
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-sm font-medium text-gray-700 min-w-[150px] text-center">
              {formatPeriod()}
            </span>
            
            <button
              onClick={goToNext}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={goToToday}
              className="ml-2 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100"
            >
              Aujourd'hui
            </button>
          </div>
        </div>
        
        {/* Filtres et recherche */}
        <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4 flex-wrap gap-y-2">
          <div className="relative min-w-[200px] lg:min-w-[250px] xl:min-w-[300px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
              placeholder="Rechercher un élève..."
            />
          </div>
          
          <div className="w-48 lg:w-56 xl:w-64">
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              disabled={isLoading}
            >
              <option value="">Tous les moniteurs</option>
              {data?.moniteurs && data.moniteurs.length > 0 ? (
                data.moniteurs.map((moniteur) => (
                  <option key={moniteur.id_moniteur} value={moniteur.id_moniteur}>
                    {moniteur.prenom} {moniteur.nom}
                  </option>
                ))
              ) : isLoading ? (
                <option value="" disabled>Chargement...</option>
              ) : (
                <option value="" disabled>Aucun moniteur disponible</option>
              )}
            </select>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 ml-auto lg:ml-0"
          >
            <FiSettings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Panneau de paramètres (affiché conditionnellement) */}
      {showSettings && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Paramètres du planning</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Heure de début
              </label>
              <select className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                {Array.from({ length: 12 }, (_, i) => i + 6).map((hour) => (
                  <option key={hour} value={hour}>{`${hour}:00`}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Heure de fin
              </label>
              <select className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                {Array.from({ length: 10 }, (_, i) => i + 14).map((hour) => (
                  <option key={hour} value={hour}>{`${hour}:00`}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Durée par défaut
              </label>
              <select className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                <option value="30">30 minutes</option>
                <option value="60">1 heure</option>
                <option value="90">1h30</option>
                <option value="120">2 heures</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Afficher le dimanche</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
