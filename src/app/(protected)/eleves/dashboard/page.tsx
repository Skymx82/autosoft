'use client';

export default function EleveDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord Élève</h1>
      <div className="bg-blue-100 p-6 rounded-lg border border-blue-300 shadow-md">
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h2 className="text-xl font-bold text-blue-800">Bienvenue sur votre espace personnel</h2>
        </div>
        <p className="text-blue-800 mb-4">Suivez votre progression et gérez votre formation depuis cette interface.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
            <h3 className="font-bold text-blue-700 mb-2">Votre progression</h3>
            <p className="text-gray-600">Consultez votre avancement dans la formation et vos résultats.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
            <h3 className="font-bold text-blue-700 mb-2">Vos rendez-vous</h3>
            <p className="text-gray-600">Gérez vos leçons de conduite et examens à venir.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
            <h3 className="font-bold text-blue-700 mb-2">Documents</h3>
            <p className="text-gray-600">Accédez à vos documents administratifs et pédagogiques.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
            <h3 className="font-bold text-blue-700 mb-2">Paiements</h3>
            <p className="text-gray-600">Consultez l'état de vos paiements et factures.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
