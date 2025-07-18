'use client';

export default function ResourceOccupation() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Module en cours de développement</h2>
      </div>
      
      <div className="p-6 text-gray-900">
        <p>Ce module affichera :</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Taux d'occupation des véhicules</li>
          <li>Taux d'occupation des moniteurs</li>
          <li>Créneaux disponibles cette semaine</li>
        </ul>
      </div>
    </div>
  );
}
