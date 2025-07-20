'use client';

import { useState, useEffect, useRef } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiSearch, FiUser, FiX, FiSettings } from 'react-icons/fi';

import { usePlanningData } from '@/app/(protected)/directeur/planning/hooks/usePlanningData';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/navigation';
import EleveLeconsSummary from './ModalEleve/EleveLeconsSummary';
import { fr } from 'date-fns/locale';

interface PlanningFiltersProps {
  currentView: 'day' | 'week' | 'month';
  setCurrentView: (view: 'day' | 'week' | 'month') => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  showSundayProp?: boolean; // Prop pour contrôler l'affichage du dimanche
  setShowSunday?: (show: boolean) => void; // Fonction pour mettre à jour l'état
  render?: (data: { isLoading: boolean; error: string | null; data: any; showSunday: boolean }) => React.ReactNode;
}

export default function PlanningFilters({
  currentView,
  setCurrentView,
  currentDate,
  setCurrentDate,
  showSundayProp,
  setShowSunday: externalSetShowSunday,
  render
}: PlanningFiltersProps) {

  // Enregistrer la locale française pour le DatePicker
  registerLocale('fr', fr);
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  
  // État pour les suggestions d'élèves
  const [suggestions, setSuggestions] = useState<Array<{id_eleve: number, nom: string, prenom: string}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // États pour le modal et l'élève sélectionné
  const [showModal, setShowModal] = useState(false);
  const [selectedEleve, setSelectedEleve] = useState<{id_eleve: number, nom: string, prenom: string} | null>(null);
  
  // État pour l'option "Afficher le dimanche" (décochée par défaut)
  // Utiliser la prop si fournie, sinon utiliser l'état local
  const [localShowSunday, setLocalShowSunday] = useState(false);
  const showSunday = showSundayProp !== undefined ? showSundayProp : localShowSunday;
  

  
  // Fonction pour mettre à jour l'état showSunday
  const handleShowSundayChange = (show: boolean) => {
    console.log('PlanningFilters - handleShowSundayChange:', show);
    if (externalSetShowSunday) {
      externalSetShowSunday(show);
    } else {
      setLocalShowSunday(show);
    }
  };
  
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
    let newStartDate = new Date(currentDate);
    let newEndDate = new Date(currentDate);
    
    console.log('PlanningFilters - Date courante (objet):', currentDate);
    console.log('PlanningFilters - Date courante (ISO):', currentDate.toISOString());
    console.log('PlanningFilters - Date courante (locale):', currentDate.toLocaleDateString());
    
    if (currentView === 'day') {
      // Vue jour : uniquement la date sélectionnée
      // Pas besoin de modifier les dates
      console.log('PlanningFilters - Vue jour - Pas de modification des dates');
    } else if (currentView === 'week') {
      // Vue semaine : du lundi au dimanche de la semaine contenant la date sélectionnée
      const dayOfWeek = newStartDate.getDay(); // 0 = dimanche, 1 = lundi, ...
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ajuster pour commencer le lundi
      
      newStartDate.setDate(newStartDate.getDate() - diff); // Aller au lundi
      newEndDate = new Date(newStartDate);
      newEndDate.setDate(newEndDate.getDate() + 6); // Aller au dimanche
      console.log('PlanningFilters - Vue semaine - Ajustement pour semaine complète');
    } else if (currentView === 'month') {
      // Vue mois : tout le mois contenant la date sélectionnée
      newStartDate = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), 1);
      newEndDate = new Date(newStartDate.getFullYear(), newStartDate.getMonth() + 1, 0);
      console.log('PlanningFilters - Vue mois - Ajustement pour mois complet');
    }
    
    console.log('PlanningFilters - Date de début calculée (objet):', newStartDate);
    console.log('PlanningFilters - Date de fin calculée (objet):', newEndDate);
    
    setDateRange({
      startDate: newStartDate.toISOString().split('T')[0],
      endDate: newEndDate.toISOString().split('T')[0]
    });
  }, [currentView, currentDate]);
  
  // Ajouter un délai avant de déclencher la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms de délai
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  


  // Utiliser le hook personnalisé pour récupérer les données du planning avec pagination
  const startDateStr = dateRange.startDate;
  const endDateStr = dateRange.endDate;
  
  console.log('PlanningFilters - Dates envoyées à l\'API:');
  console.log('  - startDate:', startDateStr);
  console.log('  - endDate:', endDateStr);
  console.log('  - currentView:', currentView);
  
  const { isLoading, error, data, refetch, loadMore, hasMore, isLoadingMore } = usePlanningData(
    userInfo.id_ecole,
    userInfo.id_bureau,
    startDateStr,
    endDateStr,
    currentView,
    debouncedSearchQuery,
    undefined // Pas de filtre par moniteur dans l'espace moniteur
  );
  
  // Nous n'utilisons plus le chargement automatique des données supplémentaires
  // car cela crée une boucle infinie de requêtes

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
    // Forcer un refetch des données après changement de date
    refetch();
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
    // Forcer un refetch des données après changement de date
    refetch();
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
    // Forcer un refetch des données après retour à aujourd'hui
    refetch();
  };
  
  // Si la prop render est fournie, on l'appelle avec les données
  if (render) {
    return (
      <div>
        {render({ isLoading, error, data, showSunday })}
        
        {/* Indicateur de chargement pour les données supplémentaires */}
        {isLoadingMore && (
          <div className="flex justify-center my-4">
            <div className="text-gray-500 text-sm italic">Chargement en cours...</div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-sm p-4 w-full">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        {/* Sélecteurs de vue et navigation */}
        <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4 flex-wrap gap-y-2">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => {
                setCurrentView('day');
                // Forcer un refetch des données
                refetch();
              }}
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
              onClick={() => {
                setCurrentView('week');
                // Forcer un refetch des données
                refetch();
              }}
              className={`px-4 py-2 text-sm font-medium ${
                currentView === 'week'
                  ? 'bg-blue-50 text-blue-700 border-t border-b border-blue-300'
                  : 'bg-white text-gray-700 border-t border-b border-gray-300 hover:bg-gray-50'
              }`}
            >
              Semaine
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('month');
                // Forcer un refetch des données
                refetch();
              }}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                currentView === 'month'
                  ? 'bg-blue-50 text-blue-700 border border-blue-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Mois
            </button>
          </div>
          
          <div className="flex items-center space-x-0">
            <button
              onClick={goToPrevious}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-gray-700 min-w-[120px] text-center">
              {formatPeriod()}
            </span>
            <div className="relative">
              <button
                onClick={() => setDatePickerOpen(!datePickerOpen)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <FiCalendar className="w-4 h-4" />
              </button>
              {datePickerOpen && (
                <div className="absolute z-100 mt-1 bg-white shadow-lg rounded-md">
                  <DatePicker
                    selected={currentDate}
                    onChange={(date: Date | null) => {
                      if (date) {
                        setCurrentDate(date);
                        setDatePickerOpen(false);
                        // Forcer un refetch des données après changement de date
                        refetch();
                      }
                    }}
                    inline
                    locale="fr"
                    calendarStartDay={1} // 1 = lundi (0 = dimanche par défaut)
                    dateFormat="dd/MM/yyyy"
                    onClickOutside={() => setDatePickerOpen(false)}
                  />
                </div>
              )}
            </div>
            <button
              onClick={goToNext}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={goToToday}
              className="ml-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100"
            >
              Aujourd'hui
            </button>
          </div>
        </div>
        
        {/* Filtres et recherche */}
        <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4 flex-wrap gap-y-2 z-40 text-black">
          <div className="relative min-w-[200px] lg:min-w-[250px] xl:min-w-[300px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
              placeholder="Rechercher un élève..."
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                
                // Générer des suggestions si l'utilisateur tape quelque chose
                if (value.trim() !== '') {
                  const valueLower = value.toLowerCase();
                  const filteredSuggestions = data?.eleves?.filter(eleve => 
                    (eleve.nom && eleve.nom.toLowerCase().includes(valueLower)) ||
                    (eleve.prenom && eleve.prenom.toLowerCase().includes(valueLower))
                  ) || [];
                  
                  // Trier les suggestions par pertinence (commence par > contient)
                  const sortedSuggestions = filteredSuggestions.sort((a, b) => {
                    const aFullName = `${a.prenom} ${a.nom}`.toLowerCase();
                    const bFullName = `${b.prenom} ${b.nom}`.toLowerCase();
                    
                    // Priorité aux noms qui commencent par la recherche
                    const aStartsWith = aFullName.startsWith(valueLower) ? 0 : 1;
                    const bStartsWith = bFullName.startsWith(valueLower) ? 0 : 1;
                    
                    if (aStartsWith !== bStartsWith) {
                      return aStartsWith - bStartsWith;
                    }
                    
                    // Ensuite, trier par ordre alphabétique
                    return aFullName.localeCompare(bFullName);
                  });
                  
                  // Ne prendre que le premier résultat (le plus pertinent)
                  setSuggestions(sortedSuggestions.length > 0 ? [sortedSuggestions[0]] : []);
                  setShowSuggestions(sortedSuggestions.length > 0);
                } else {
                  setSuggestions([]);
                  setShowSuggestions(false);
                }
              }}
              onFocus={() => {
                if (searchQuery.trim() !== '' && suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                // Délai pour permettre la sélection d'une suggestion avant de fermer
                setTimeout(() => setShowSuggestions(false), 200);
              }}
            />
            
            {/* Liste des suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((eleve) => (
                  <div 
                    key={eleve.id_eleve}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchQuery(`${eleve.prenom} ${eleve.nom}`);
                      setShowSuggestions(false);
                      
                      // Sélectionner l'élève et afficher le modal
                      setSelectedEleve(eleve);
                      setShowModal(true);
                    }}
                  >
                    {eleve.prenom} {eleve.nom}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Le modal a été remplacé par une page séparée */}
          

          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 lg:ml-0"
          >
            <FiSettings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Panneau de paramètres (affiché conditionnellement) */}
      {isExpanded && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Paramètres du planning</h3>
          <div className="flex items-center">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={showSunday}
                onChange={(e) => handleShowSundayChange(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Afficher le dimanche</span>
            </label>
          </div>
        </div>
      )}
      

      
      {/* Modal pour afficher les détails de l'élève */}
      {showModal && selectedEleve && (
        <div className="fixed inset-0 z-50 overflow-auto backdrop-blur-sm bg-transparent flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Détails des leçons de {selectedEleve.prenom} {selectedEleve.nom}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <EleveLeconsSummary id_eleve={selectedEleve.id_eleve} />
            </div>
          </div>
        </div>
      )}
      

    </div>
  );
}
