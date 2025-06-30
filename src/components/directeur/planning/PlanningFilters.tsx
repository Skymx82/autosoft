'use client';

import { useState, useEffect, useRef } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiSettings, FiSearch, FiUser, FiX, FiPlus, FiFilter } from 'react-icons/fi';
import { BiBuildings } from 'react-icons/bi';
import { usePlanningData } from '@/hooks/Directeur/planning/usePlanningData';
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
  selectedMoniteur?: string | null;
  setSelectedMoniteur?: (id: string | null) => void;
  showSundayProp?: boolean; // Nouvelle prop pour contrôler l'affichage du dimanche
  setShowSunday?: (show: boolean) => void; // Fonction pour mettre à jour l'état
  addHoraireModeProp?: boolean; // Prop pour contrôler le mode d'ajout d'horaire
  setAddHoraireMode?: (mode: boolean) => void; // Fonction pour mettre à jour l'état
  render?: (data: { isLoading: boolean; error: string | null; data: any; showSunday: boolean; addHoraireMode?: boolean }) => React.ReactNode;
}

export default function PlanningFilters({
  currentView,
  setCurrentView,
  currentDate,
  setCurrentDate,
  selectedMoniteur,
  setSelectedMoniteur,
  showSundayProp,
  setShowSunday: externalSetShowSunday,
  addHoraireModeProp,
  setAddHoraireMode: externalSetAddHoraireMode,
  render
}: PlanningFiltersProps) {
  // Utiliser la prop si fournie, sinon utiliser l'état local
  const [localAddHoraireMode, setLocalAddHoraireMode] = useState(false);
  const addHoraireMode = addHoraireModeProp !== undefined ? addHoraireModeProp : localAddHoraireMode;
  
  // Fonction pour mettre à jour l'état addHoraireMode
  const handleAddHoraireModeChange = (mode: boolean) => {
    console.log('PlanningFilters - handleAddHoraireModeChange:', mode);
    if (externalSetAddHoraireMode) {
      externalSetAddHoraireMode(mode);
    } else {
      setLocalAddHoraireMode(mode);
    }
  };
  // Enregistrer la locale française pour le DatePicker
  registerLocale('fr', fr);
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  // Utiliser la valeur passée en props ou une valeur par défaut
  const [localSelectedMoniteur, setLocalSelectedMoniteur] = useState<string>(selectedMoniteur || 'all');
  
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
  
  // État pour le modal d'avertissement de bureau
  const [showBureauWarning, setShowBureauWarning] = useState(false);
  
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
  
  // Ajouter un délai avant de déclencher la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms de délai
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Synchroniser la valeur locale avec la prop
  useEffect(() => {
    if (selectedMoniteur !== undefined) {
      setLocalSelectedMoniteur(selectedMoniteur || 'all');
    }
  }, [selectedMoniteur]);

  // Utiliser le hook personnalisé pour récupérer les données du planning avec pagination
  const { isLoading, error, data, refetch, loadMore, hasMore, isLoadingMore } = usePlanningData(
    userInfo.id_ecole,
    userInfo.id_bureau,
    dateRange.startDate,
    dateRange.endDate,
    currentView,
    debouncedSearchQuery,
    localSelectedMoniteur
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
        {render({ isLoading, error, data, showSunday, addHoraireMode })}
        
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
          
          <div className="w-48 lg:w-56 xl:w-64">
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              disabled={isLoading}
              value={localSelectedMoniteur}
              onChange={(e) => {
                const newValue = e.target.value;
                setLocalSelectedMoniteur(newValue);
                // Mettre à jour la prop si elle existe
                if (setSelectedMoniteur) {
                  // Si la valeur est 'all', on passe null, sinon on passe la valeur
                  setSelectedMoniteur(newValue === 'all' ? null : newValue);
                }
                // Forcer un refetch des données après changement de moniteur
                refetch();
              }}
            >
              <option value="all">Tous les moniteurs</option>
              {data?.moniteurs && data.moniteurs.length > 0 ? (
                data.moniteurs.map((moniteur) => (
                  <option key={moniteur.id_moniteur} value={moniteur.id_moniteur}>
                    {moniteur.prenom} {moniteur.nom}
                  </option>
                ))
              ) : (
                <option value="" disabled>Chargement des moniteurs...</option>
              )}
            </select>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 lg:ml-0"
          >
            <FiSettings className="w-5 h-5" />
          </button>
          
          {/* Bouton pour ajouter un horaire */}
          <button
            onClick={() => {
              // Vérifier si un bureau est sélectionné
              const userDataStr = localStorage.getItem('autosoft_user');
              const userData = userDataStr ? JSON.parse(userDataStr) : null;
              const id_bureau = userData?.id_bureau || 0;
              
              if (id_bureau === 0) {
                // Afficher le modal d'avertissement
                setShowBureauWarning(true);
              } else {
                // Activer/désactiver le mode ajout d'horaire
                console.log('PlanningFilters - Bouton + cliqué, ancien état:', addHoraireMode);
                handleAddHoraireModeChange(!addHoraireMode);
                console.log('PlanningFilters - Nouvel état:', !addHoraireMode);
              }
            }}
            className={`p-2 rounded-full text-white ${addHoraireMode ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} transition-colors ml-auto flex items-center`}
            title={addHoraireMode ? 'Désactiver le mode ajout d\'horaire' : 'Activer le mode ajout d\'horaire'}
          >
            <FiPlus className="w-5 h-5" />
            {addHoraireMode && <span className="ml-1 text-xs font-medium hidden sm:inline">Mode ajout actif</span>}
          </button>
        </div>
      </div>

      {/* Panneau de paramètres (affiché conditionnellement) */}
      {isExpanded && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Paramètres du planning</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Heure de début
              </label>
              <select className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                {Array.from({ length: 15 }, (_, i) => i + 6).map((hour) => (
                  <option key={hour} value={hour} selected={hour === 8}>{`${hour}:00`}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Heure de fin
              </label>
              <select className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                {Array.from({ length: 15 }, (_, i) => i + 14).map((hour) => (
                  <option key={hour} value={hour} selected={hour === 20}>{`${hour}:00`}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Durée par défaut
              </label>
              <select className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                <option value="30">30 minutes</option>
                <option value="60" selected>1 heure</option>
                <option value="90">1h30</option>
                <option value="120">2 heures</option>
              </select>
            </div>
            
            <div className="flex items-end">
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
        </div>
      )}
      
      {/* Modal d'avertissement pour sélection de bureau */}
      {showBureauWarning && (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 text-yellow-500">
                <FiFilter className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sélection de bureau requise</h3>
              <p className="text-gray-600 mb-6">
                Veuillez sélectionner un bureau avant d'ajouter des horaires. 
                Pour changer de bureau, cliquez sur l'icône <BiBuildings className="inline h-5 w-5" /> dans la barre de navigation.
              </p>
              <button
                onClick={() => setShowBureauWarning(false)}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Compris
              </button>
            </div>
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
