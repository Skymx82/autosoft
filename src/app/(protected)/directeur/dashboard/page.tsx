'use client';

import DirectorLayout from '@/components/directeur/layout/DirectorLayout';
import StatisticsCards from '@/components/directeur/dashboard/Stats/StatisticsCards';
import RevenueChart from '@/components/directeur/dashboard/RevenueChart';
import QuickActions from '@/components/directeur/dashboard/QuickActions';

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
          
          {/* Moniteurs */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Moniteurs</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heures</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux de réussite</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { name: 'Jean Dupont', hours: 42, successRate: 85, status: 'Disponible' },
                    { name: 'Marie Lambert', hours: 38, successRate: 92, status: 'En congé' },
                    { name: 'Pierre Martin', hours: 45, successRate: 78, status: 'En cours' },
                    { name: 'Sophie Dubois', hours: 36, successRate: 88, status: 'Disponible' },
                  ].map((moniteur, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{moniteur.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{moniteur.hours}h</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">{moniteur.successRate}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${moniteur.successRate >= 85 ? 'bg-green-500' : moniteur.successRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                              style={{ width: `${moniteur.successRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${moniteur.status === 'Disponible' ? 'bg-green-100 text-green-800' : moniteur.status === 'En cours' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {moniteur.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DirectorLayout>
  );
}
