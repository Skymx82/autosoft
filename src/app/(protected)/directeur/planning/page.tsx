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
      startDate: newStartDate,
      endDate: newEndDate
    });
  }, [currentView, currentDate]);
  
  return (
    <DirectorLayout>
      <div className="space-y-6">
        {/* Barre de filtres */}
        <PlanningFilters 
          currentView={currentView}
          setCurrentView={setCurrentView}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />
        
        {/* Contenu principal du planning */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="h-[600px] w-full">
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
                  <PlanningGrid
                    moniteurs={data.moniteurs}
                    leconsByDay={data.leconsByDay}
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    currentView={currentView}
                    selectedMoniteurId={selectedMoniteurId}
                  />
                );
              }}
            />
          </div>
        </div>
      </div>
    </DirectorLayout>
  );
}
