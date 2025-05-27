'use client';

import React, { useState, useEffect } from 'react';
import { VehicleSelectorProps, Vehicle } from './types';

export default function VehicleSelector({
  selectedVehicleId,
  onVehicleChange,
  licenseCategory,
  instructorId
}: VehicleSelectorProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  
  // Simuler le chargement des véhicules depuis une API
  useEffect(() => {
    // Dans une vraie application, cela serait un appel API
    const fetchVehicles = async () => {
      // Données simulées
      const mockVehicles: Vehicle[] = [
        { 
          id: 1, 
          name: 'Renault Clio', 
          type: 'Voiture', 
          licenseCategories: ['B', 'B manuelle'],
          isAvailable: true
        },
        { 
          id: 2, 
          name: 'Peugeot 208', 
          type: 'Voiture', 
          licenseCategories: ['B', 'B manuelle'],
          isAvailable: true
        },
        { 
          id: 3, 
          name: 'Toyota Yaris', 
          type: 'Voiture automatique', 
          licenseCategories: ['B', 'B auto'],
          isAvailable: true
        },
        { 
          id: 4, 
          name: 'Yamaha MT-07', 
          type: 'Moto', 
          licenseCategories: ['A', 'A2'],
          isAvailable: true
        },
        { 
          id: 5, 
          name: 'Honda CB500', 
          type: 'Moto', 
          licenseCategories: ['A1', 'A2'],
          isAvailable: false
        },
        { 
          id: 6, 
          name: 'Scania R450', 
          type: 'Poids lourd', 
          licenseCategories: ['C', 'CE'],
          isAvailable: true
        },
        { 
          id: 7, 
          name: 'Mercedes Sprinter', 
          type: 'Utilitaire', 
          licenseCategories: ['B', 'B manuelle'],
          isAvailable: true
        }
      ];
      
      setVehicles(mockVehicles);
    };
    
    fetchVehicles();
  }, []);
  
  // Filtrer les véhicules en fonction de la catégorie de permis et du moniteur
  useEffect(() => {
    if (!licenseCategory) {
      setFilteredVehicles([]);
      return;
    }
    
    // Filtrer par catégorie de permis et disponibilité
    const filtered = vehicles.filter(vehicle => 
      vehicle.licenseCategories.includes(licenseCategory as any) && 
      vehicle.isAvailable
    );
    
    // Dans une vraie application, on filtrerait également par les véhicules
    // que le moniteur est autorisé à utiliser
    
    setFilteredVehicles(filtered);
  }, [vehicles, licenseCategory, instructorId]);
  
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
          disabled={!licenseCategory || filteredVehicles.length === 0}
          required
        >
          <option value="">Sélectionner un véhicule</option>
          {filteredVehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.name} ({vehicle.type})
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {licenseCategory && filteredVehicles.length === 0 && (
        <p className="mt-1 text-sm text-red-600">
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
