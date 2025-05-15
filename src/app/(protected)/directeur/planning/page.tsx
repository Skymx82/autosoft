'use client';

import { useState, useEffect } from 'react';
import DirectorLayout from '@/components/directeur/layout/DirectorLayout';
import PlanningFilters from '@/components/directeur/planning/PlanningFilters';
import PlanningGrid from '@/components/directeur/planning/PlanningGrid';

export default function PlanningPage() {
  // États pour gérer les filtres et la vue du planning
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // États pour les dates de début et de fin
  const [dateRange, setDateRange] = useState<{startDate: Date, endDate: Date}>({startDate: new Date(), endDate: new Date()});
  
  // État pour le moniteur sélectionné
  const [selectedMoniteurId, setSelectedMoniteurId] = useState<number | null>(null);
  
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
  
  return (
    <DirectorLayout>
      <div className="flex flex-col h-screen">
        {/* Barre de filtres fixe en haut - collée au layout */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <PlanningFilters 
            currentView={currentView}
            setCurrentView={setCurrentView}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
        </div>
        
        {/* Contenu principal du planning - prend tout l'espace disponible */}
        <div className="flex-grow overflow-auto">
          {/* Récupérer les données depuis le composant PlanningFilters */}
          <PlanningFilters
            currentView={currentView}
            setCurrentView={setCurrentView}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            render={({ isLoading, error, data }) => {
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
                    selectedMoniteurId={selectedMoniteurId}
                  />
                </div>
              );
            }}
          />
        </div>
      </div>
    </DirectorLayout>
  );
}
