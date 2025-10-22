'use client';

import React, { useState, useEffect } from 'react';
import { VehicleSelectorProps, Vehicle, LicenseCategory } from './types';
import { useNotificationContext } from '@/components/notification/NotificationContext';

export default function VehicleSelector({
  selectedVehicleId,
  onVehicleChange,
  licenseCategory,
  instructorId,
  date,
  startTime,
  endTime
}: VehicleSelectorProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Charger les véhicules depuis l'API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Récupérer l'ID de l'école et du bureau depuis le localStorage ou d'autres sources
        // Pour l'instant, on utilise des valeurs statiques pour la démonstration
        const id_ecole = localStorage.getItem('id_ecole') || '1';
        const id_bureau = localStorage.getItem('id_bureau') || '1';
        
        // Construire l'URL avec les paramètres de disponibilité
        let url = `/directeur/planning/api/AjoutHoraire/vehicule?id_ecole=${id_ecole}&id_bureau=${id_bureau}`;
        
        // Ajouter les paramètres de date et heures si disponibles
        if (date && startTime && endTime) {
          url += `&date=${encodeURIComponent(date)}&heure_debut=${encodeURIComponent(startTime)}&heure_fin=${encodeURIComponent(endTime)}`;
        }
        
        // Appel à l'API pour récupérer les véhicules
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.vehicules) {
          setVehicles(data.vehicules);
        } else {
          setVehicles([]);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des véhicules:', err);
        setError('Impossible de charger la liste des véhicules.');
        setVehicles([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVehicles();
  }, [date, startTime, endTime]); // Recharger les véhicules quand la date ou les heures changent
  
  // Mettre à jour la liste des véhicules en fonction de la catégorie de permis
  useEffect(() => {
    if (!licenseCategory) {
      // Si aucune catégorie n'est sélectionnée, n'afficher aucun véhicule
      setFilteredVehicles([]);
      return;
    }
    
    // Filtrer les véhicules par catégorie de permis
    const filtered = vehicles.filter(vehicle => 
      vehicle.licenseCategories && 
      vehicle.licenseCategories.some(category => category === licenseCategory)
    );
    
    setFilteredVehicles(filtered);
  }, [vehicles, licenseCategory]);
  
  // Gérer le changement de véhicule
  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vehicleId = parseInt(e.target.value);
    onVehicleChange(vehicleId);
  };
  
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Véhicule
      </label>
      <div className="relative">
        <select
          value={selectedVehicleId || ''}
          onChange={handleVehicleChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 appearance-none"
          disabled={!licenseCategory || filteredVehicles.length === 0 || isLoading}
          required
        >
          <option value="">Sélectionner un véhicule</option>
          {filteredVehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.name} ({vehicle.type})
            </option>
          ))}
        </select>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-8">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {!isLoading && licenseCategory && filteredVehicles.length === 0 && !error && (
        <p className="mt-1 text-sm text-amber-600">
          Aucun véhicule disponible pour cette catégorie de permis.
        </p>
      )}
      
      {selectedVehicleId && (
        <div className="mt-2">
          {vehicles.find(v => v.id === selectedVehicleId)?.name && (
            <div className="flex items-center">
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Disponible
              </span>
              <span className="ml-2 text-sm text-gray-500">
                {vehicles.find(v => v.id === selectedVehicleId)?.type}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
