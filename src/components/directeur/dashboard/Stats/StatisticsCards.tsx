'use client';

import { useState, useEffect } from 'react';
import { FiUsers, FiClock, FiAward, FiDollarSign } from 'react-icons/fi';
import { fetchElevesStats, EleveStatsData } from './eleveData';

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
  const [elevesStats, setElevesStats] = useState<EleveStatsData>({
    totalEleves: null,
    percentChange: null,
    isLoading: true
  });

  useEffect(() => {
    const loadElevesStats = async () => {
      const stats = await fetchElevesStats();
      setElevesStats(stats);
    };

    loadElevesStats();
  }, []);

  const stats = [
    {
      id: 1,
      title: 'Total Élèves',
      value: elevesStats.isLoading ? '--' : elevesStats.totalEleves?.toString() || '--',
      change: elevesStats.percentChange ? `${elevesStats.percentChange}%` : '--',
      trend: (elevesStats.percentChange && elevesStats.percentChange >= 0) ? 'up' as const : 'down' as const,
      icon: <FiUsers className="h-6 w-6 text-blue-600" />,
    },
    {
      id: 2,
      title: 'Heures de conduite',
      value: '287',
      change: '12.3%',
      trend: 'up' as const,
      icon: <FiClock className="h-6 w-6 text-blue-600" />,
    },
    {
      id: 3,
      title: 'Examens réussis',
      value: '18',
      change: '2.1%',
      trend: 'down' as const,
      icon: <FiAward className="h-6 w-6 text-blue-600" />,
    },
    {
      id: 4,
      title: 'Chiffre d\'affaires',
      value: '8 540 €',
      change: '8.7%',
      trend: 'up' as const,
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
