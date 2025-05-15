'use client';

import { useState } from 'react';
import DirectorLayout from '@/components/directeur/layout/DirectorLayout';
import PlanningFilters from '@/components/directeur/planning/PlanningFilters';

export default function PlanningPage() {
  // États pour gérer les filtres et la vue du planning
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  
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
        
        {/* Contenu principal du planning - sera implémenté dans les prochaines étapes */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="h-[600px] flex items-center justify-center text-gray-500">
            <p>Contenu du planning à implémenter</p>
          </div>
        </div>
      </div>
    </DirectorLayout>
  );
}
