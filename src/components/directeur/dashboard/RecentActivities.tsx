'use client';

import { FiUser, FiCalendar, FiCheckCircle, FiDollarSign } from 'react-icons/fi';

interface Activity {
  id: number;
  type: 'inscription' | 'lecon' | 'examen' | 'paiement';
  description: string;
  date: string;
  icon: React.ReactNode;
  iconBg: string;
}

export default function RecentActivities() {
  const activities: Activity[] = [
    {
      id: 1,
      type: 'inscription',
      description: 'Nouvelle inscription: Sophie Martin',
      date: 'Il y a 30 minutes',
      icon: <FiUser className="h-5 w-5 text-white" />,
      iconBg: 'bg-blue-500',
    },
    {
      id: 2,
      type: 'lecon',
      description: 'Leçon de conduite programmée: Thomas Dubois',
      date: 'Il y a 2 heures',
      icon: <FiCalendar className="h-5 w-5 text-white" />,
      iconBg: 'bg-green-500',
    },
    {
      id: 3,
      type: 'examen',
      description: 'Examen réussi: Julie Lefebvre',
      date: 'Aujourd\'hui à 10:30',
      icon: <FiCheckCircle className="h-5 w-5 text-white" />,
      iconBg: 'bg-purple-500',
    },
    {
      id: 4,
      type: 'paiement',
      description: 'Paiement reçu: Lucas Bernard - 350€',
      date: 'Aujourd\'hui à 09:15',
      icon: <FiDollarSign className="h-5 w-5 text-white" />,
      iconBg: 'bg-yellow-500',
    },
    {
      id: 5,
      type: 'lecon',
      description: 'Leçon de conduite terminée: Emma Petit',
      date: 'Hier à 16:45',
      icon: <FiCalendar className="h-5 w-5 text-white" />,
      iconBg: 'bg-green-500',
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900">Activités récentes</h2>
      <div className="mt-4 bg-white shadow rounded-lg">
        <ul className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <li key={activity.id} className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full ${activity.iconBg} flex items-center justify-center`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.date}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="px-6 py-3 bg-gray-50 rounded-b-lg">
          <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Voir toutes les activités
          </a>
        </div>
      </div>
    </div>
  );
}
