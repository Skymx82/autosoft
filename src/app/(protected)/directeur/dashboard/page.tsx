'use client';

import DirectorLayout from '@/components/directeur/layout/DirectorLayout';
import StatisticsCards from '@/components/directeur/dashboard/StatisticsCards';
import RevenueChart from '@/components/directeur/dashboard/RevenueChart';
import QuickActions from '@/components/directeur/dashboard/QuickActions';
import ResourceOccupation from '@/components/directeur/dashboard/ResourceOccupation';

export default function DirecteurDashboard() {
  return (
    <DirectorLayout>
      <div className="space-y-6 pt-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
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
