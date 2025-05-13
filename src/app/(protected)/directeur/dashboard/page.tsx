'use client';

import DirectorLayout from '@/components/layout/DirectorLayout';

export default function DirecteurDashboard() {
  return (
    <DirectorLayout>
      <div className="space-y-6">
        {/* En-tête de la page */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Bienvenue sur votre espace directeur</p>
        </div>
        
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Élèves</p>
                <p className="text-2xl font-semibold text-gray-800">124</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-green-500 text-xs font-medium">+5.2%</span>
                <span className="text-gray-500 text-xs ml-2">Depuis le mois dernier</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Heures de conduite</p>
                <p className="text-2xl font-semibold text-gray-800">287</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-green-500 text-xs font-medium">+12.3%</span>
                <span className="text-gray-500 text-xs ml-2">Depuis le mois dernier</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Examens réussis</p>
                <p className="text-2xl font-semibold text-gray-800">18</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-red-500 text-xs font-medium">-2.1%</span>
                <span className="text-gray-500 text-xs ml-2">Depuis le mois dernier</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Chiffre d'affaires</p>
                <p className="text-2xl font-semibold text-gray-800">8 540 €</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-green-500 text-xs font-medium">+8.7%</span>
                <span className="text-gray-500 text-xs ml-2">Depuis le mois dernier</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Graphiques et tableaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activité récente */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Activité récente</h2>
            <div className="space-y-4">
              {[
                { type: 'inscription', name: 'Sophie Martin', time: 'Il y a 2 heures' },
                { type: 'examen', name: 'Lucas Dubois', time: 'Il y a 5 heures', result: 'Réussi' },
                { type: 'paiement', name: 'Emma Bernard', time: 'Il y a 1 jour', amount: '650 €' },
                { type: 'leçon', name: 'Thomas Petit', time: 'Il y a 1 jour', duration: '2 heures' },
                { type: 'examen', name: 'Camille Leroy', time: 'Il y a 2 jours', result: 'Échoué' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'inscription' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'examen' ? 'bg-purple-100 text-purple-600' :
                      activity.type === 'paiement' ? 'bg-green-100 text-green-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {activity.type === 'inscription' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />}
                        {activity.type === 'examen' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        {activity.type === 'paiement' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        {activity.type === 'leçon' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3 w-full">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-800">{activity.name}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.type === 'inscription' && 'Nouvelle inscription'}
                      {activity.type === 'examen' && `Examen ${activity.result === 'Réussi' ? 'réussi' : 'échoué'}`}
                      {activity.type === 'paiement' && `Paiement de ${activity.amount}`}
                      {activity.type === 'leçon' && `Leçon de conduite (${activity.duration})`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Moniteurs */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Moniteurs</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heures</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux de réussite</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { name: 'Jean Dupont', hours: 42, successRate: 85, status: 'Disponible' },
                    { name: 'Marie Lambert', hours: 38, successRate: 92, status: 'En congé' },
                    { name: 'Pierre Martin', hours: 45, successRate: 78, status: 'En cours' },
                    { name: 'Sophie Dubois', hours: 36, successRate: 88, status: 'Disponible' },
                  ].map((moniteur, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-800">{moniteur.name}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{moniteur.hours}h</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">{moniteur.successRate}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${moniteur.successRate >= 85 ? 'bg-green-500' : moniteur.successRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                              style={{ width: `${moniteur.successRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
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
