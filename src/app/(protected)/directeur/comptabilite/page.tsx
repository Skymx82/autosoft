'use client';

import React, { useState } from 'react';
import { FiCreditCard } from 'react-icons/fi';
import ComptaFiltre, { ComptaFilters } from './components/ComptaFiltre';
import DirectorLayout from '@/components/layout/DirectorLayout';

// Import des composants d'onglets
import Dashboard from './components/dashboard/Dashboard';
import Depenses from './components/depenses/Depenses';
import Recettes from './components/recettes/Recettes';
import ChiffreAffaires from './components/chiffre-affaires/ChiffreAffaires';
import Factures from './components/factures/Factures';
import Voitures from './components/voitures/Voitures';
import DevisContrats from './components/devis-contrats/DevisContrats';
import Resultats from './components/resultats/Resultats';
import Justificatifs from './components/justificatifs/Justificatifs';
import SuiviPaiements from './components/suivi-paiements/SuiviPaiements';
import TVA from './components/tva/TVA';

export default function ComptabilitePage() {
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [categorie, setCategorie] = useState('all');
  const [modeReglement, setModeReglement] = useState('all');
  
  // État pour l'onglet actif
  const [activeTab, setActiveTab] = useState('dashboard');
  
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
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Contenu principal - affichage du composant correspondant à l'onglet actif */}
        <div className="mt-4">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'depenses' && <Depenses />}
          {activeTab === 'recettes' && <Recettes />}
          {activeTab === 'chiffre-affaires' && <ChiffreAffaires />}
          {activeTab === 'factures' && <Factures />}
          {activeTab === 'voitures' && <Voitures />}
          {activeTab === 'devis-contrats' && <DevisContrats />}
          {activeTab === 'resultats' && <Resultats />}
          {activeTab === 'justificatifs' && <Justificatifs />}
          {activeTab === 'suivi-paiements' && <SuiviPaiements />}
          {activeTab === 'tva' && <TVA />}
        </div>
      </div>
    </DirectorLayout>
  );
}
