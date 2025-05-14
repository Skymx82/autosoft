'use client';

import { FiUsers, FiClock, FiAward, FiDollarSign } from 'react-icons/fi';
import { useDashboardStats } from '@/hooks/useDashboardStats';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, trend, icon }: StatCardProps) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-50 rounded-md p-3">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <span 
            className={`font-medium ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend === 'up' ? '+' : ''}{change}
          </span>{' '}
          <span className="text-gray-500">Depuis le mois dernier</span>
        </div>
      </div>
    </div>
  );
};

export default function StatisticsCards() {
  // Utiliser le hook centralisé pour récupérer toutes les statistiques en une seule requête
  const { isLoading, eleves, conduite, elevesPrets, chiffreAffaires } = useDashboardStats();

  const stats = [
    {
      id: 1,
      title: 'Total Élèves',
      value: isLoading ? '--' : eleves?.totalEleves?.toString() || '--',
      change: eleves?.percentChange !== null ? `${eleves.percentChange}%` : '--',
      trend: (eleves?.percentChange && eleves.percentChange >= 0) ? 'up' as const : 'down' as const,
      icon: <FiUsers className="h-6 w-6 text-blue-600" />,
    },
    {
      id: 2,
      title: 'Heures de conduite',
      value: isLoading ? '--' : conduite?.totalHeures?.toString() || '--',
      change: conduite?.percentChange !== null ? `${conduite.percentChange}%` : '--',
      trend: conduite?.percentChange === 0 ? 'up' as const : // Cas spécial: 0% est considéré comme stable
             (conduite?.percentChange && conduite.percentChange > 0) ? 'up' as const : 'down' as const,
      icon: <FiClock className="h-6 w-6 text-blue-600" />,
    },
    {
      id: 3,
      title: 'Élèves prêts',
      value: isLoading ? '--' : elevesPrets?.total?.toString() || '--',
      change: elevesPrets?.percentChange !== null ? `${elevesPrets.percentChange}%` : '--',
      trend: (elevesPrets?.percentChange && elevesPrets.percentChange >= 0) ? 'up' as const : 'down' as const,
      icon: <FiAward className="h-6 w-6 text-blue-600" />,
    },
    {
      id: 4,
      title: 'Chiffre d\'affaires',
      value: isLoading ? '--' : `${chiffreAffaires?.total?.toLocaleString()} €` || '--',
      change: chiffreAffaires?.percentChange !== null ? `${chiffreAffaires.percentChange}%` : '--',
      trend: (chiffreAffaires?.percentChange && chiffreAffaires.percentChange >= 0) ? 'up' as const : 'down' as const,
      icon: <FiDollarSign className="h-6 w-6 text-blue-600" />,
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900">Statistiques du mois</h2>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
          />
        ))}
      </div>
    </div>
  );
}
