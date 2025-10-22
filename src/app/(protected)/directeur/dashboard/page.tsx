'use client';

import DirectorLayout from '@/components/layout/DirectorLayout';
import StatisticsCards from '@/app/(protected)/directeur/dashboard/components/StatisticsCards';
import RevenueChart from '@/app/(protected)/directeur/dashboard/components/RevenueChart';
import QuickActions from '@/app/(protected)/directeur/dashboard/components/QuickActions';
import ResourceOccupation from '@/app/(protected)/directeur/dashboard/components/ResourceOccupation';
import TodayLessons from '@/app/(protected)/directeur/dashboard/components/TodayLessons';
import ActiveMonitors from '@/app/(protected)/directeur/dashboard/components/ActiveMonitors';
import VehiclesStatus from '@/app/(protected)/directeur/dashboard/components/VehiclesStatus';
import AlertsNotifications from '@/app/(protected)/directeur/dashboard/components/AlertsNotifications';
import ExamSuccessRate from '@/app/(protected)/directeur/dashboard/components/ExamSuccessRate';

export default function DirecteurDashboard() {
  return (
    <DirectorLayout>
      <div className="space-y-6 pt-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* Actions rapides */}
        <QuickActions />
        
        {/* Cartes de statistiques */}
        <StatisticsCards />

        {/* Alertes importantes */}
        <AlertsNotifications />
        
        {/* Graphiques et données principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique d'évolution du chiffre d'affaires */}
          <RevenueChart />
          
          {/* Taux de réussite aux examens */}
          <ExamSuccessRate />
        </div>

        {/* Leçons et activités du jour */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leçons d'aujourd'hui */}
          <TodayLessons />
          
          {/* Moniteurs actifs */}
          <ActiveMonitors />
        </div>

        {/* Ressources et véhicules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* État des véhicules */}
          <VehiclesStatus />
          
          {/* Capacité et occupation */}
          <ResourceOccupation />
        </div>
      </div>
    </DirectorLayout>
  );
}
