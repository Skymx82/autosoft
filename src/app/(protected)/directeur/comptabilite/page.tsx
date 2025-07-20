'use client';

import React, { useState } from 'react';
import { FiCreditCard } from 'react-icons/fi';
import ComptaFiltre, { ComptaFilters } from './components/ComptaFiltre';
import DirectorLayout from '@/components/layout/DirectorLayout';

export default function ComptabilitePage() {
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [categorie, setCategorie] = useState('all');
  const [modeReglement, setModeReglement] = useState('all');
  
  // État pour les données chargées
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  
  // Fonction pour gérer les changements de filtres
  const handleFilterChange = (filters: ComptaFilters) => {
    console.log('Filtres mis à jour:', filters);
    // Ici, vous pourriez déclencher une requête API pour charger les données filtrées
  };
  
  return (
    <DirectorLayout>
      <div className="flex flex-col h-full relative">
        {/* Composant de filtres */}
        <ComptaFiltre 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateDebut={dateDebut}
          setDateDebut={setDateDebut}
          dateFin={dateFin}
          setDateFin={setDateFin}
          categorie={categorie}
          setCategorie={setCategorie}
          modeReglement={modeReglement}
          setModeReglement={setModeReglement}
          onFilterChange={handleFilterChange}
          render={({ isLoading, error, data }) => {
            // Vous pouvez rendre un contenu personnalisé ici en fonction des données
            return null; // Pour l'instant, on ne rend rien ici
          }}
        />
        
        {/* Contenu principal - à remplacer par les composants spécifiques à chaque onglet */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center mt-4">
          <div className="flex justify-center mb-4">
            <FiCreditCard className="text-blue-500 w-16 h-16" />
          </div>
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            Module en cours de développement
          </h2>
          <p className="text-gray-500">
            Sélectionnez un onglet ci-dessus pour accéder aux différentes fonctionnalités de gestion comptable.
          </p>
        </div>
      </div>
    </DirectorLayout>
  );
}
