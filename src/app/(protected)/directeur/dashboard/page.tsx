'use client';

import DirectorLayout from '@/components/directeur/layout/DirectorLayout';
import StatisticsCards from '@/components/directeur/dashboard/StatisticsCards';
import RevenueChart from '@/components/directeur/dashboard/RevenueChart';
import QuickActions from '@/components/directeur/dashboard/QuickActions';
import ResourceOccupation from '@/components/directeur/dashboard/ResourceOccupation';

export default function DirecteurDashboard() {
  return (
    <DirectorLayout>
      <div className="space-y-6">
        {/* En-tête de la page */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Bienvenue sur votre espace directeur</p>
        </div>
        
        {/* Actions rapides */}
        <QuickActions />
        
        {/* Cartes de statistiques */}
        <StatisticsCards />
        
        {/* Activités récentes et Moniteurs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique d'évolution du chiffre d'affaires */}
          <RevenueChart />
          
          {/* Capacité et occupation */}
          <ResourceOccupation />
        </div>
      </div>
    </DirectorLayout>
  );
}
