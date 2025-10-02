'use client';

export default function SecretaireDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord Secrétaire</h1>
      <div className="bg-yellow-100 p-6 rounded-lg border border-yellow-300 shadow-md">
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-yellow-800">Page en développement</h2>
        </div>
        <p className="text-yellow-800 mb-2">Cette page est actuellement en cours de développement et sera bientôt disponible.</p>
        <p className="text-yellow-700">Fonctionnalités à venir :</p>
        <ul className="list-disc ml-6 mt-2 text-yellow-700">
          <li>Gestion des rendez-vous</li>
          <li>Suivi des élèves</li>
          <li>Gestion des documents administratifs</li>
          <li>Tableau de bord des statistiques</li>
        </ul>
      </div>
    </div>
  );
}
