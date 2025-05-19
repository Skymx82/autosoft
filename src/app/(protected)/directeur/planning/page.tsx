'use client';

import { useState, useEffect, useRef } from 'react';
import DirectorLayout from '@/components/directeur/layout/DirectorLayout';
import PlanningFilters from '@/components/directeur/planning/PlanningFilters';
import PlanningGrid from '@/components/directeur/planning/PlanningGrid';
import AjouteHoraire from '@/components/directeur/planning/ModalHoraire';
import { FiPlus } from 'react-icons/fi';

export default function PlanningPage() {
  // États pour gérer les filtres et la vue du planning
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateRange, setDateRange] = useState<{startDate: Date, endDate: Date}>({startDate: new Date(), endDate: new Date()});
  const [selectedMoniteurId, setSelectedMoniteurId] = useState<string | null>(null);
  // État pour gérer l'option "Afficher le dimanche"
  const [showSunday, setShowSunday] = useState(false);
  
  // État pour gérer le modal de création d'horaire
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Calculer les dates de début et de fin en fonction de la vue et de la date actuelle
  useEffect(() => {
    const newStartDate = new Date(currentDate);
    const newEndDate = new Date(currentDate);
    
    if (currentView === 'day') {
      // Pour la vue jour, on prend juste le jour sélectionné
      // Pas besoin de modifier les dates
    } else if (currentView === 'week') {
      // Pour la vue semaine, on prend du lundi au dimanche
      // Créer des nouvelles dates pour éviter les effets de bord
      const dayOfWeek = currentDate.getDay(); // 0 = dimanche, 1 = lundi, ...
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ajustement pour commencer le lundi
      
      // Utiliser une méthode plus fiable pour calculer les dates
      // Créer une nouvelle date pour le début de semaine (lundi)
      newStartDate.setHours(0, 0, 0, 0);
      newStartDate.setDate(currentDate.getDate() - diff);
      
      // Créer une nouvelle date pour la fin de semaine (dimanche)
      newEndDate.setHours(23, 59, 59, 999);
      newEndDate.setFullYear(newStartDate.getFullYear(), newStartDate.getMonth(), newStartDate.getDate() + 6);
    } else if (currentView === 'month') {
      // Pour la vue mois, on prend tout le mois
      newStartDate.setDate(1);
      newEndDate.setMonth(newStartDate.getMonth() + 1);
      newEndDate.setDate(0); // Dernier jour du mois
    }
    
    setDateRange({
      startDate: newStartDate,
      endDate: newEndDate
    });
  }, [currentView, currentDate]);
  
  // Utiliser useRef pour mesurer la hauteur des éléments
  const filterRef = useRef<HTMLDivElement>(null);
  const [planningHeight, setPlanningHeight] = useState<number | null>(null);

  useEffect(() => {
    // Fonction pour calculer la hauteur disponible
    const calculateHeight = () => {
      if (filterRef.current) {
        // Hauteur du filtre
        const filterHeight = filterRef.current.offsetHeight;
        // Hauteur estimée du layout (header)
        const layoutHeight = 64; // Valeur estimée du header
        // Hauteur de la fenêtre
        const windowHeight = window.innerHeight;
        // Calcul de la hauteur disponible
        const availableHeight = windowHeight - filterHeight - layoutHeight - 10; // 10px de marge
        setPlanningHeight(availableHeight);
      }
    };
    
    // Calculer la hauteur initiale après le rendu
    setTimeout(calculateHeight, 0);
    
    // Recalculer la hauteur lors du redimensionnement de la fenêtre
    window.addEventListener('resize', calculateHeight);
    
    // Nettoyer l'écouteur d'événement lors du démontage du composant
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  // Fonction pour gérer la sauvegarde d'un nouvel horaire
  const handleSaveHoraire = (horaire: any) => {
    console.log('Nouvel horaire:', horaire);
    // Ici, vous pourriez appeler une API pour sauvegarder l'horaire
    // puis rafraîchir les données du planning
    alert('Horaire créé avec succès!');
  };
  
  return (
    <DirectorLayout>
      <div className="flex flex-col h-full relative">
        {/* Barre de filtres fixe en haut - collée au layout */}
        <div ref={filterRef} className="bg-white shadow-sm border-b border-gray-200">
          <PlanningFilters 
            currentView={currentView}
            setCurrentView={setCurrentView}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            selectedMoniteur={selectedMoniteurId}
            setSelectedMoniteur={setSelectedMoniteurId}
            showSundayProp={showSunday}
            setShowSunday={setShowSunday}
          />
        </div>
        
        {/* Contenu principal du planning - sans hauteur maximum */}
        <div className="overflow-auto">
          {/* Récupérer les données depuis le composant PlanningFilters */}
          <PlanningFilters
            currentView={currentView}
            setCurrentView={setCurrentView}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            selectedMoniteur={selectedMoniteurId}
            setSelectedMoniteur={setSelectedMoniteurId}
            showSundayProp={showSunday}
            setShowSunday={setShowSunday}
            render={({ isLoading, error, data, showSunday: filterShowSunday }) => {
              if (isLoading) {
                return (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>Chargement du planning...</p>
                  </div>
                );
              }
              
              if (error) {
                return (
                  <div className="h-full flex items-center justify-center text-red-500">
                    <p>Erreur: {error}</p>
                  </div>
                );
              }
              
              if (!data || !data.moniteurs || data.moniteurs.length === 0) {
                return (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>Aucun moniteur trouvé pour cette période</p>
                  </div>
                );
              }
              
              return (
                <div className="h-full w-full">
                  <PlanningGrid
                    moniteurs={data.moniteurs}
                    leconsByDay={data.leconsByDay}
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    currentView={currentView}
                    selectedMoniteurId={selectedMoniteurId ? parseInt(selectedMoniteurId) : null}
                    showSunday={showSunday}
                  />
                </div>
              );
            }}
          />
        </div>
      </div>
      
      {/* Bouton flottant pour ajouter un horaire */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors z-50"
      >
        <FiPlus className="w-6 h-6" />
      </button>

      {/* Modal pour ajouter un horaire */}
      <AjouteHoraire
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={(horaire) => {
          console.log('Horaire créé:', horaire);
          // Ici, vous appelleriez votre API pour sauvegarder l'horaire
          // Exemple: saveHoraire(horaire).then(() => refetchPlanningData());
        }}
      />
    </DirectorLayout>
  );
}
